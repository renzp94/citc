import type WebpackChain from 'webpack-chain'
import { getJtsFileType, requireResolve } from '../../../utils'

export default (webpackChain: WebpackChain, typescript: boolean) => {
  const fileType = getJtsFileType(typescript)
  const syntax = typescript ? 'typescript' : 'ecmascript'

  // 配置swc-loader
  const swc = webpackChain.module
    .rule('swc')
    .test(new RegExp(`\\.(${fileType}|${fileType}x)$`, 'i'))
    .exclude.add(/node_modules/)
    .end()
    .use('swc')
    .loader(requireResolve('swc-loader'))

  swc.options({
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
  })
}
