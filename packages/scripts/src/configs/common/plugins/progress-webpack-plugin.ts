import type WebpackChain from 'webpack-chain'
import ProgressWebpackPlugin from 'progress-webpack-plugin'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('progress-webpack-plugin').use(ProgressWebpackPlugin)
}
