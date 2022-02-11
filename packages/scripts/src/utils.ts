import path from 'path'
import fs from 'fs'
import { gray, red } from 'kolorist'
import resolveCommonConfig from './configs/common'
import WebpackChain from 'webpack-chain'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

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
