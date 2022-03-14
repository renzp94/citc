import type WebpackChain from 'webpack-chain'
import type { ResolveJtsLoaderOptions } from '../../../types'
import { requireResolve } from '../../../utils'
import resolveBabel from './babel'
import resolveEsbuild from './esbuild'
import resolveSwc from './swc'

const onlyDevCanUseLoader = ['esbuild', 'swc']
const resolves = {
  babel: resolveBabel,
  esbuild: resolveEsbuild,
  swc: resolveSwc,
}

export default (webpackChain: WebpackChain, opts: ResolveJtsLoaderOptions) => {
  const { typescript, jtsLoader, cssScoped } = opts

  const { loader = 'babel' } = jtsLoader ?? {}

  // 若为只能在开发环境中使用的则使用babel
  const resolve =
    onlyDevCanUseLoader.includes(loader) && process.env.NODE_ENV === 'production'
      ? resolveBabel
      : resolves[loader]

  const rule = resolve(webpackChain, typescript, jtsLoader)

  if (cssScoped) {
    rule.use('jsx-scoped-loader').loader(requireResolve('@renzp/jsx-scoped-loader')).end()
  }
}
