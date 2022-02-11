import type { Configuration } from 'webpack'
import { gray, red } from 'kolorist'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { loadConfigFile } from './utils'
import resolveDevConfig from './configs/develop'

export default async (configFile: string | undefined) => {
  console.log(gray(`⌛ 正在启动开发服务...`))
  const webpackChain = await loadConfigFile(configFile)
  // 合并开发环境配置
  await resolveDevConfig(webpackChain)
  const configs: Configuration = webpackChain.toConfig()
  const compiler = Webpack(configs)
  compiler.hooks.failed.tap('citc-scripts start', (msg) => {
    console.log(red(msg.toString()))
    process.exit(1)
  })
  const devServerOptions = { ...(configs.devServer ?? {}) }
  const server = new WebpackDevServer(devServerOptions, compiler)
  server.start()
}
