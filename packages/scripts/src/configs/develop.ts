import WebpackChain from 'webpack-chain'
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'

export default async (webpackChain: WebpackChain) => {
  webpackChain.devtool('cheap-module-source-map').devServer.set('client', {
    overlay: {
      errors: true,
      warnings: false,
    },
  })
  webpackChain.stats('errors-only').set('infrastructureLogging', {
    ...(webpackChain.get('infrastructureLogging') ?? {}),
    level: 'none',
  })
  webpackChain.plugin('friendly-errors').use(FriendlyErrorsWebpackPlugin, [
    {
      clearConsole: true,
      additionalFormatters: [],
      additionalTransformers: [],
    },
  ])
}
