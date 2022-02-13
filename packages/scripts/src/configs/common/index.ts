import type { Options } from '../../types'
import WebpackChain from 'webpack-chain'
import resolveEntry from './entry'
import resolveResolve from './resolve'
import resolvePlugins from './plugins'
import resolveJts from './jts'
import resolveCss from './css'
import resolveAssets from './assets'
import resolveMinimizer from './minimizer'

export default (opts?: Options) => {
  const { typescript, cssModule, jtsLoader = 'babel' } = opts ?? {}
  const webpackChain = new WebpackChain()
  resolveEntry(webpackChain, opts)
  resolveResolve(webpackChain, typescript)
  resolveJts(webpackChain, { typescript, jtsLoader })
  resolveCss(webpackChain, cssModule)
  resolveAssets(webpackChain)
  resolvePlugins(webpackChain, opts)
  if (process.env.NODE_ENV === 'production') {
    resolveMinimizer(webpackChain, jtsLoader)
  }
  return webpackChain
}
