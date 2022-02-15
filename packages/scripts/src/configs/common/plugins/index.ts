import type { Options } from '../../../types'
import type WebpackChain from 'webpack-chain'
import { pathResolve } from '../../../utils'
import resolveDefinePlugin from './define-plugin'
import resolveHtmlWebpackPlugin from './html-webpack-plugin'
import resolveMiniCssExtractPlugin from './mini-css-extract-plugin'
import resolveWindicssWebpackPlugin from './windicss-webpack-plugin'
import resolveProgressWebpackPlugin from './progress-webpack-plugin'
import resolveEslintWebpackPlugin from './eslint-webpack-plugin'
import resolveForkTsCheckerWebpackPlugin from './fork-ts-checker-webpack-plugin'
import resolveCopyWebpackPlugin from './copy-webpack-plugin'
import resolveBuildInfoWebpackPlugin from './build-info-webpack-plugin'
import resolveWebpackBundleAnalyzer from './webpack-bundle-analyzer'
import resolveSpeedMeasureWebpackPlugin from './speed-measure-webpack-plugin'

export default (webpackChain: WebpackChain, opts: Options) => {
  const {
    title,
    typescript,
    windiCss,
    staticDir = 'static',
    template = 'index.html',
    webpackBuildInfo,
  } = opts ?? {}
  const fileType = typescript ? 'ts' : 'js'
  const cwd = process.cwd()
  const extensions = typescript ? ['.ts', '.tsx', '.js', '.jsx'] : ['.js', '.jsx']

  resolveDefinePlugin(webpackChain)
  resolveHtmlWebpackPlugin(webpackChain, { title, fileType, template })
  resolveMiniCssExtractPlugin(webpackChain)
  resolveProgressWebpackPlugin(webpackChain)
  resolveEslintWebpackPlugin(webpackChain, { cwd, extensions })
  resolveCopyWebpackPlugin(webpackChain, pathResolve(cwd, staticDir))
  if (windiCss) {
    resolveWindicssWebpackPlugin(webpackChain)
  }
  if (typescript) {
    resolveForkTsCheckerWebpackPlugin(webpackChain, extensions.toString().replace(/\./g, ''))
  }
  if (webpackBuildInfo) {
    resolveBuildInfoWebpackPlugin(webpackChain, webpackBuildInfo)
  }
  // 包大小分析
  if (process.env.SIZE_ANALYZER === 'open') {
    resolveWebpackBundleAnalyzer(webpackChain)
  }
  // 打包时间分析
  if (process.env.BUILD_TIME_ANALYZER === 'open') {
    resolveSpeedMeasureWebpackPlugin(webpackChain)
  }
}
