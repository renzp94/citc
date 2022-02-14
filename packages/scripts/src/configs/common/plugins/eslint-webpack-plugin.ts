import type WebpackChain from 'webpack-chain'
import path from 'path'
import EslintWebpackPlugin from 'eslint-webpack-plugin'
import { pathResolve, requireResolve } from '../../../utils'

export default (webpackChain: WebpackChain, { cwd, extensions }) => {
  webpackChain.plugin('eslint').use(EslintWebpackPlugin, [
    {
      extensions,
      context: cwd,
      eslintPath: path.dirname(
        requireResolve('eslint/package.json', { paths: [process.cwd()] }) ||
          requireResolve('eslint/package.json', { paths: [__dirname] })
      ),
      fix: true,
      cache: true,
      cacheLocation: pathResolve(process.cwd(), 'node_modules/.cache/.eslintcache'),
    },
  ])
}
