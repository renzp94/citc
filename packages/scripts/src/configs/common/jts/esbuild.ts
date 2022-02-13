import type WebpackChain from 'webpack-chain'
import type { JtsLoader } from '../../../types'
import { getJtsFileType, requireResolve } from '../../../utils'
import _merge from 'lodash/merge'

export default (webpackChain: WebpackChain, typescript: boolean, { esbuild }: JtsLoader) => {
  const fileType = getJtsFileType(typescript)
  const userOptions = esbuild?.loaderOptions ?? {}

  // 配置esbuild-loader
  webpackChain.module
    .rule('esbuild')
    .test(new RegExp(`\\.(${fileType}|${fileType}x)$`, 'i'))
    .exclude.add(/node_modules/)
    .end()
    .use('esbuild')
    .loader(requireResolve('esbuild-loader'))
    .options(
      _merge(
        {
          loader: `${fileType}x`,
          target: 'es2015',
        },
        userOptions
      )
    )
}
