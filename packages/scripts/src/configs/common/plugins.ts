import type { Options } from '../../types'
import type WebpackChain from 'webpack-chain'
import path from 'path'
import webpack from 'webpack'
import EslintWebpackPlugin from 'eslint-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Webpackbar from 'webpackbar'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import BuildInfoWebpackPlugin from '@renzp/build-info-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { pathResolve, requireResolve, resolveClientEnv } from '../../utils'

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

  webpackChain.plugin('define').use(webpack.DefinePlugin, [resolveClientEnv()])

  webpackChain
    .plugin('html-webpack-plugin')
    .use(HtmlWebpackPlugin, [{ title: title ?? `Citc ${fileType} Demo`, template }])

  webpackChain
    .plugin('mini-css-extract-plugin')
    .use(MiniCssExtractPlugin, [{ filename: 'assets/css/[name][contenthash].css' }])

  if (windiCss) {
    webpackChain.plugin('windiCss').use(WindiCSSWebpackPlugin)
  }

  webpackChain
    .plugin('webpackbar')
    .use(Webpackbar, [{ name: process.env.NODE_ENV === 'production' ? 'Build' : 'Development' }])

  const cwd = process.cwd()

  webpackChain.plugin('eslint').use(EslintWebpackPlugin, [
    {
      extensions: typescript ? ['.ts', '.tsx', '.js', '.jsx'] : ['.js', '.jsx'],
      context: cwd,
      eslintPath: path.dirname(
        requireResolve('eslint/package.json', { paths: [process.cwd()] }) ||
          requireResolve('eslint/package.json', { paths: [__dirname] })
      ),
      fix: true,
    },
  ])

  if (typescript) {
    webpackChain.plugin('ts-check').use(ForkTsCheckerWebpackPlugin, [
      {
        eslint: {
          files: `./src/**/*.{${typescript ? 'ts,tsx,js,jsx' : 'js,jsx'}}`,
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

  webpackChain.plugin('copy-webpack-plugin').use(CopyWebpackPlugin, [
    {
      patterns: [
        {
          from: pathResolve(process.cwd(), staticDir),
          to: webpackChain.output.get('path'),
          noErrorOnMissing: true,
        },
      ],
    },
  ])

  if (webpackBuildInfo) {
    webpackChain.plugin('build-info-webpack-plugin').use(BuildInfoWebpackPlugin)
  }
  // 包大小分析
  if (process.env.SIZE_ANALYZER === 'open') {
    webpackChain.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
  }
  // 打包时间分析
  if (process.env.BUILD_TIME_ANALYZER === 'open') {
    webpackChain.plugin('speed-measure-webpack-plugin').use(SpeedMeasurePlugin)
  }
}
