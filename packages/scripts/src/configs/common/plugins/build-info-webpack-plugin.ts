import type WebpackChain from 'webpack-chain'
import BuildInfoWebpackPlugin from '@renzp/build-info-webpack-plugin'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('build-info-webpack-plugin').use(BuildInfoWebpackPlugin)
}
