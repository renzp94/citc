import type { Configuration } from 'webpack'
import type WebpackChain from 'webpack-chain'
import { gray, red } from 'kolorist'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import resolveDevConfig from './configs/develop'
import { cyan } from 'kolorist'
import { getNetwork } from './utils'

export default async (webpackChain: WebpackChain) => {
  console.log(gray(`⌛ 正在启动开发服务...`))
  // 合并开发环境配置
  await resolveDevConfig(webpackChain)
  const configs: Configuration = webpackChain.toConfig()
  const compiler = Webpack(configs)
  compiler.hooks.failed.tap('citc-scripts start', (msg) => {
    console.log(red(msg.toString()))
    process.exit(1)
  })
  const { network, local, port } = await getNetwork(webpackChain?.devServer?.get('port'))
  webpackChain?.devServer?.port?.(port)
  compiler.hooks.done.tap('citc-scripts start', (stats) => {
    if (stats.hasErrors()) {
      return false
    }

    console.log(
      'App run at: \n',
      `- Local:    ${cyan(`http://${local}:${port}`)}\n`,
      `- Network:  ${cyan(`http://${network}:${port}`)}\n\n`,
      'Note that the development build is not optimized.\n',
      `To create a production build, run ${cyan('yarn build')}.\n`
    )
  })

  const devServerOptions = { ...(configs.devServer ?? {}) }
  const server = new WebpackDevServer(devServerOptions, compiler)
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach((signal) => process.on(signal, () => server.stopCallback(() => process.exit(0))))
  server.start()
}
