import type WebpackChain from 'webpack-chain'
import { getJtsFileType, requireResolve } from '../../../utils'

export default (webpackChain: WebpackChain, typescript: boolean) => {
  const fileType = getJtsFileType(typescript)

  // 配置esbuild-loader
  webpackChain.module
    .rule('esbuild')
    .test(new RegExp(`\\.(${fileType}|${fileType}x)$`, 'i'))
    .exclude.add(/node_modules/)
    .end()
    .use('esbuild')
    .loader(requireResolve('esbuild-loader'))
    .options({
      loader: `${fileType}x`,
      target: 'es2015',
    })
}
