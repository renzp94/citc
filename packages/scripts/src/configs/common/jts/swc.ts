import type WebpackChain from 'webpack-chain'
import type { JtsLoader } from '../../../types'
import { getJtsFileType, requireResolve } from '../../../utils'
import _merge from 'lodash/merge'

export default (webpackChain: WebpackChain, typescript: boolean, jtsLoader: JtsLoader) => {
  const fileType = getJtsFileType(typescript)
  const syntax = typescript ? 'typescript' : 'ecmascript'

  // 配置swc-loader
  const rule = webpackChain.module
    .rule('swc')
    .test(new RegExp(`\\.(${fileType}|${fileType}x)$`, 'i'))
    .exclude.add(/node_modules/)
    .end()
    .use('swc')
    .loader(requireResolve('swc-loader'))
    .options(
      _merge(
        {
          jsc: {
            parser: {
              syntax,
              dynamicImport: true,
              [`${fileType}x`]: true,
            },
            loose: true,
            target: 'es2015',
            externalHelpers: true,
            transform: {
              react: {
                runtime: 'automatic',
                development: process.env.NODE_ENV === 'development',
                useBuiltins: true,
              },
            },
          },
        },
        jtsLoader?.swc ?? {}
      )
    )
    .end()

  return rule
}
