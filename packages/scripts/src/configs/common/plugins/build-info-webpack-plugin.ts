import type WebpackChain from 'webpack-chain'
import type { Options } from '@renzp/build-info-webpack-plugin'
import BuildInfoWebpackPlugin from '@renzp/build-info-webpack-plugin'

export default (webpackChain: WebpackChain, options: boolean | Options) => {
  const opts = typeof options === 'boolean' ? [] : [options]
  webpackChain.plugin('build-info-webpack-plugin').use(BuildInfoWebpackPlugin, opts)
}
