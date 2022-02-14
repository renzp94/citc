import type WebpackChain from 'webpack-chain'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export default (webpackChain: WebpackChain, staticDir: string) => {
  webpackChain.plugin('copy-webpack-plugin').use(CopyWebpackPlugin, [
    {
      patterns: [
        {
          from: staticDir,
          to: webpackChain.output.get('path'),
          noErrorOnMissing: true,
        },
      ],
    },
  ])
}
