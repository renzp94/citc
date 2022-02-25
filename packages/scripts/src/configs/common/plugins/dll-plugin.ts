import { gray, red, yellow } from 'kolorist'
import type WebpackChain from 'webpack-chain'
import webpack from 'webpack'
import path from 'path'
import { fileExists, pathResolve } from '../../../utils'
import fs from 'fs'

const dllPath = path.resolve(`${process.cwd()}/node_modules/.dll`)
const dllManifestPath = `${dllPath}/manifest.json`

/**
 * 判断dll目录是否存在
 * @returns 返回true则存在，否则不存在
 */
export const dllDirExist = () => fileExists(dllPath)
/**
 * 获取Dll中的依赖包的名称和版本号
 * @param packageName 包名
 * @returns 返回依赖包的名称和版本号
 */
const getDllPackageNameVersion = (path: string) => {
  const space = '/node_modules/'
  const packageName = path.split(space).pop().split('/')[0]
  const packagePath = pathResolve(process.cwd(), `.${space}${packageName}/package.json`)
  const { name, version } = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  return version ? { name, version } : undefined
}
/**
 * 获取依赖包的名称和版本号
 * @param packageName 包名
 * @returns 返回依赖包的名称和版本号
 */
const getProjectPackageVersion = (packageName: string) => {
  const path = pathResolve(process.cwd(), 'package.json')
  const { devDependencies, dependencies } = JSON.parse(fs.readFileSync(path, 'utf-8'))
  let version = dependencies[packageName]
  version = version ?? devDependencies[packageName]
  return version ? { name: packageName, version } : undefined
}
/**
 * 检测当前Dll中所有的依赖版本
 * @param vendor 需要构建Dll的依赖
 * @returns 返回true则检测通过，否则检测不通过
 */
export const checkDllVersion = (vendor: Array<string>) => {
  const exist = dllDirExist()
  // 不存在目录说明是首次构建
  if (exist) {
    // 需要构建dll的依赖，过滤掉项目中未安装的依赖
    const buildPackages = vendor.map(getProjectPackageVersion).filter((item) => item)
    const { content } = JSON.parse(fs.readFileSync(dllManifestPath, 'utf-8'))
    // 已经构建dll的依赖
    const dllPackages = Object.keys(content).map(getDllPackageNameVersion)

    // 在dll中存在但版本和当前项目的版本不一致
    const rebuildPackage = buildPackages.find(
      (pkg) =>
        !!dllPackages.find((dll) => pkg.name === dll.name && !pkg.version.includes(dll.version))
    )
    if (rebuildPackage) {
      const { name, version } = rebuildPackage
      console.log(yellow(`[DLL-WARNING]: 检测到${name}安装新的版本:${version}，将重新构建Dll`))

      return !rebuildPackage
    }
    // dll存在但不需要构建的依赖
    const removeDllPackage = dllPackages.find(
      (pkg) => !buildPackages.map(({ name }) => name).includes(pkg.name)
    )
    if (removeDllPackage) {
      const { name } = removeDllPackage
      console.log(yellow(`[DLL-WARNING]: 检测到${name}已经被移除，将重新构建Dll`))
      return !removeDllPackage
    }

    // 新增需要构建dll的依赖
    const addDllPackage = buildPackages.find(
      (dll) => !dllPackages.map(({ name }) => name).includes(dll.name)
    )
    if (addDllPackage) {
      const { name } = addDllPackage
      console.log(yellow(`[DLL-WARNING]: 检测到新增依赖${name}，将重新构建Dll`))
      return !addDllPackage
    }
  }

  return exist
}
/**
 * 构建依赖包的Dll
 * @param vendor 依赖包
 * @returns 返回true为构建成功，否则为构建失败
 */
export const buildDll = (dll: Array<string>) => {
  if (checkDllVersion(dll)) {
    return Promise.resolve(false)
  }
  console.log(gray(`⌛ 构建${dll}依赖包的Dll...`))
  const dllConfig = {
    entry: {
      dll,
    },
    output: {
      path: dllPath,
    },
    plugins: [
      new webpack.DllPlugin({
        name: '[name]_[fullhash]',
        format: true,
        path: `${dllPath}/manifest.json`,
      }),
    ],
  }

  const compiler = webpack(dllConfig)
  return new Promise((resolve) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        let msg
        if (err) {
          msg = `${err.name}: ${err.message}`
        } else {
          const info = stats.toJson()
          msg = info.errors
            .map((error) => {
              return `${red(error.file)}\n${error.message}`
            })
            .join('\n')
        }
        console.log(red(`🚨 Dll构建失败\n${msg}`))
        resolve(false)
      } else {
        console.log(gray(`✨ ${dll}依赖的Dll构建成功`))
        resolve(true)
      }
    })
  })
}
/**
 * 加载DllReferencePlugin
 * @param webpackChain WebpackChain
 */
export const resolveDllReferencePlugin = (webpackChain: WebpackChain) => {
  webpackChain.plugin('dll-reference-plugin').use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require(dllManifestPath),
    },
  ])
}
