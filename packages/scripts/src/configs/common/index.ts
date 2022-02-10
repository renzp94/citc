import type { Options } from '../../types'
import WebpackChain from 'webpack-chain'
import resolveEntry from './entry'
import resolveResolve from './resolve'
import resolvePlugins from './plugins'
import resolveBabel from './babel'
import resolveCss from './css'
import resolveAssets from './assets'

export default (opts?: Options) => {
  const { typescript, cssModule } = opts ?? {}
  const fileType = typescript ? 'ts' : 'js'
  const webpackChain = new WebpackChain()
  resolveEntry(webpackChain, fileType, opts)
  resolveResolve(webpackChain, fileType)
  resolveBabel(webpackChain, typescript, fileType)
  resolveCss(webpackChain, cssModule)
  resolveAssets(webpackChain)
  resolvePlugins(webpackChain, opts)
  return webpackChain
}
