import type WebpackChain from 'webpack-chain'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default (webpackChain: WebpackChain, { title, fileType, template }) => {
  webpackChain
    .plugin('html-webpack-plugin')
    .use(HtmlWebpackPlugin, [{ title: title ?? `Citc ${fileType} Demo`, template }])
}
