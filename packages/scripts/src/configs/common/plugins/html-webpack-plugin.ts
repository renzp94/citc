import type WebpackChain from 'webpack-chain'
import type { Options } from 'html-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default (
  webpackChain: WebpackChain,
  { fileType, html }: { fileType: string; html: Options }
) => {
  const { title, template = 'index.html', favicon = 'favicon.ico' } = html ?? {}
  webpackChain
    .plugin('html-webpack-plugin')
    .use(HtmlWebpackPlugin, [
      { title: title ?? `Citc ${fileType} Demo`, template, favicon, ...html },
    ])
}
