import type WebpackChain from 'webpack-chain'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

export default (webpackChain: WebpackChain, filesPrefix: string) => {
  webpackChain.plugin('fork-ts-checker-webpack-plugin').use(ForkTsCheckerWebpackPlugin, [
    {
      eslint: {
        files: `./src/**/*.{${filesPrefix}}`,
      },
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
    },
  ])
}
