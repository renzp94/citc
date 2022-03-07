import type WebpackChain from 'webpack-chain'
import type { Options } from 'html-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { fileExists, pathResolve } from '../../../utils'

export default (
  webpackChain: WebpackChain,
  { fileType, html }: { fileType: string; html: Options }
) => {
  const { title, template = 'index.html' } = html ?? {}
  let defaultFavicon: false | string = 'favicon.ico'
  const defaultFaviconExist = fileExists(pathResolve(process.cwd(), defaultFavicon))
  defaultFavicon = defaultFaviconExist ? 'favicon.ico' : false

  webpackChain.plugin('html-webpack-plugin').use(HtmlWebpackPlugin, [
    {
      title: title ?? `Citc ${fileType} Demo`,
      template,
      favicon: html?.favicon ?? defaultFavicon,
      ...html,
    },
  ])
}
