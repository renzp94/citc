import type WebpackChain from 'webpack-chain'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'

export default (webpackChain: WebpackChain) => {
  webpackChain.plugin('windicss-webpack-plugin').use(WindiCSSWebpackPlugin)
}
