import type WebpackChain from 'webpack-chain'
import type { JtsLoaderOptions } from '../../../types'
import resolveBabel from './babel'
import resolveEsbuild from './esbuild'
import resolveSwc from './swc'

const onlyDevCanUseLoader = ['esbuild', 'swc']
const resolves = {
  babel: resolveBabel,
  esbuild: resolveEsbuild,
  swc: resolveSwc,
}

export default (webpackChain: WebpackChain, opts: JtsLoaderOptions) => {
  const { typescript, jtsLoader } = opts

  // 若为只能在开发环境中使用的则使用babel
  const resolve =
    onlyDevCanUseLoader.includes(jtsLoader) && process.env.NODE_ENV === 'production'
      ? resolveBabel
      : resolves[jtsLoader]

  resolve(webpackChain, typescript)
}
