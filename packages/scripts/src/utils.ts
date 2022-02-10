import path from 'path'
import fs from 'fs'
import { blue, gray, green, red, white } from 'kolorist'
import resolveCommonConfig from './configs/common'
import WebpackChain from 'webpack-chain'
import { stdout } from 'single-line-log'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import ChildProcess from 'child_process'

/**
 * 判断文件是否存在
 * @param file 文件路径
 * @returns Promise<boolean>
 */
export const fileExists = (file: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (err) => resolve(!err))
  })
}
/**
 * 获取配置文件全路径
 * @param file 配置文件，未指定则使用默认配置文件路径./citc.config.js
 * @returns 找到则返回全路径，否则返回undefined
 */
export const getConfigFilePath = async (file: string | string[]): Promise<string | undefined> => {
  let filePath
  let isExists = false
  if (!file) {
    file = ['./citc.config.js', './citc.config.ts']
  }

  if (typeof file === 'string') {
    filePath = path.resolve(process.cwd(), file)
    isExists = await fileExists(filePath)
  } else {
    for await (const fileItem of file) {
      filePath = path.resolve(process.cwd(), fileItem)
      isExists = await fileExists(filePath)
      if (isExists) {
        break
      }
    }
  }

  return isExists ? filePath : undefined
}
/**
 * 加载模块
 * @param module 模块
 * @returns 返回加载的模块
 */
export const requireResolve = (module: string, opts?: unknown) => require.resolve(module, opts)
/**
 * 将相对路径转为绝对路径
 * @param dir 相对路径
 * @returns 返回绝对路径
 */
export const pathResolve = (root = __dirname, dir: string) => path.resolve(root, dir)
/**
 * 从配置文件中获取配置信息
 * @param configFilPath 配置文件的相对路径
 * @returns 若配置文件存在则返回WebpackChain，否则返回
 */
export const loadConfigFile = async (configFilPath: string | undefined) => {
  let webpackChain: WebpackChain
  console.log(gray(`⌛ 读取配置文件...`))
  const filePath = await getConfigFilePath(configFilPath)
  // 配置了配置文件地址，但未找到提示并退出
  if (configFilPath && !filePath) {
    console.log(red(`🚨 未找到配置文件：${configFilPath}`))
    process.exit(1)
  }

  if (filePath) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const userConfigs = require(filePath)
    if (typeof userConfigs === 'object') {
      const { webpackChain: resolveUserWebpackConfig } = userConfigs
      webpackChain = resolveCommonConfig(userConfigs)
      resolveUserWebpackConfig?.(webpackChain)
      // 如果是一个函数则默认为webpackChain配置
    } else if (typeof userConfigs === 'function') {
      webpackChain = resolveCommonConfig()
      userConfigs(webpackChain)
    } else {
      console.log(red('🚨 配置文件配置有误，请导出一个函数或对象'))
      process.exit(1)
    }

    // webpackChain = getUserConfigs(baseWebpackChain)
    console.log(gray(`✨ 读取配置文件成功`))
  } else {
    const baseWebpackChain = resolveCommonConfig()
    webpackChain = baseWebpackChain
    console.log(gray('未找到配置文件，使用默认配置'))
  }

  return webpackChain
}
/**
 * 进度条
 * @param total 总量
 * @param showTime 是否展示时间
 * @returns 返回包含功能的对象
 */
export const useProcess = (total = 100, showTime = true) => {
  let timer
  let count = 0
  const barLen = total > 50 ? 50 : total
  let time = 0
  let timeBlock = showTime ? ` ${(time / 1000).toFixed(2)}s` : ''
  const start = () => {
    timer = setInterval(() => {
      time += 100
      if (count < barLen - barLen / 10) {
        timeBlock = showTime ? ` ${(time / 1000).toFixed(2)}s` : ''
        count += barLen / 100
        stdout(`⌛ ${blue('█'.repeat(count))}${white('░'.repeat(barLen - count))}${timeBlock}`)
      }
    }, 100)
  }
  const error = () => {
    if (timer) {
      clearInterval(timer)
      stdout(`🚨 ${red('█'.repeat(barLen))} Error${timeBlock}\n`)
    }
  }

  const done = () => {
    if (timer) {
      clearInterval(timer)
      stdout(`✨ ${green('█'.repeat(barLen))} Done${timeBlock}\n`)
    }
  }
  return {
    start,
    error,
    done,
  }
}
/**
 * 加载环境变量文件
 * @param {string} mode 开发模式
 */
export const loadEnv = (mode?: string) => {
  const basePath = path.resolve(process.cwd(), `.env${mode ? `.${mode}` : ``}`)
  const localPath = `${basePath}.local`
  const load = (envPath: string) => {
    try {
      const env = dotenv.config({ path: envPath })
      dotenvExpand(env)
    } catch (err) {
      // only ignore error if file is not found
      if (err.toString().indexOf('ENOENT') < 0) {
        console.log(err)
      }
    }
  }
  load(localPath)
  load(basePath)
}

/**
 * 将环境变量加载到客户端
 * @returns 返回CITC_APP_开头的环境变量
 */
export const resolveClientEnv = () => {
  const env = {}
  Object.keys(process.env).forEach((key) => {
    if (/^CITC_APP_/.test(key) || key === 'NODE_ENV') {
      env[key] = process.env[key]
    }
  })

  for (const key in env) {
    env[key] = JSON.stringify(env[key])
  }

  return {
    'process.env': env,
  }
}
/**
 * 获取仓库当前所在分支名
 * @param cwd 目录
 * @returns 返回仓库当前所在分支名
 */
export const getBranchName = (cwd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    ChildProcess.exec('git branch', { cwd }, (err, stdout) =>
      err ? reject(err) : resolve(stdout.replace('*', '').replace('\n', '').replace('\n\r', ''))
    )
  })
}
/**
 * 获取仓库当前分支最后一次提交的Commit Hash后8位
 * @param cwd 目录
 * @returns 返回Commit Hash后8位
 */
export const getLastCommitHash8 = (cwd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    ChildProcess.exec('git log -1 --format=%H', { cwd }, (err, stdout) =>
      err ? reject(err) : resolve(stdout.replace(/\s+$/, '').slice(-8))
    )
  })
}
