import type { Configuration } from 'webpack'
import type WebpackChain from 'webpack-chain'
import { gray, red } from 'kolorist'
import Webpack from 'webpack'
import fs from 'fs'
import resolveProdConfig from './configs/production'
import { createEnvironmentHash, pathResolve } from './utils'

export default (webpackChain: WebpackChain) => {
  console.log(gray(`⌛ 启动打包构建...`))
  // 合并打包配置
  resolveProdConfig(webpackChain)
  const raw = Object.keys(process.env).reduce((env) => env)

  webpackChain.cache({
    type: 'filesystem',
    name: `${process.env.NODE_ENV}-cache`,
    version: createEnvironmentHash(raw),
    cacheDirectory: pathResolve(process.cwd(), 'node_modules/.cache'),
    store: 'pack',
    buildDependencies: {
      config: [__filename],
      tsconfig: [
        pathResolve(process.cwd(), 'tsconfig.json'),
        pathResolve(process.cwd(), 'jsconfig.json'),
      ].filter((f) => fs.existsSync(f)),
    },
  })
  const configs: Configuration = webpackChain.toConfig()
  const compiler = Webpack(configs)

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
      console.log(red(`🚨 打包构建失败\n${msg}`))
      return false
    }

    console.log(
      stats.toString({
        chunks: false, // 使构建过程更静默无输出
        colors: true, // 在控制台展示颜色
      })
    )

    compiler.close((err) => {
      if (err) {
        console.log(err)
      }
    })
  })
}
