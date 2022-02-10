import WebpackChain from 'webpack-chain'
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'
import address from 'address'
import { cyan } from 'kolorist'
import portfinder from 'portfinder'

export default async (webpackChain: WebpackChain) => {
  webpackChain.devtool('inline-source-map').devServer.set('client', {
    overlay: {
      errors: true,
      warnings: false,
    },
  })
  let port = webpackChain?.devServer?.get('port') ?? 8080
  port = await portfinder.getPortPromise({ port })
  webpackChain?.devServer?.port?.(port)
  const local = address.ip('lo')
  const network = address.ip()
  webpackChain.plugin('friendly-errors').use(FriendlyErrorsWebpackPlugin, [
    {
      compilationSuccessInfo: {
        messages: [
          'App run at: ',
          `- Local:  ${cyan(`http://${local}:${port}`)}`,
          `- Network:  ${cyan(`http://${network}:${port}`)}`,
        ],
        notes: [
          'Note that the development build is not optimized.',
          `To create a production build, run ${cyan('yarn build')}.`,
        ],
      },
      clearConsole: true,
      additionalFormatters: [],
      additionalTransformers: [],
    },
  ])
}
