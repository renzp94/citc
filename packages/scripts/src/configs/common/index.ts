import type { Options } from '../../types'
import WebpackChain from 'webpack-chain'
import resolveEntry from './entry'
import resolveResolve from './resolve'
import resolvePlugins from './plugins'
import resolveJts from './jts'
import resolveCss from './css'
import resolveAssets from './assets'
import resolveMinimizer from './minimizer'
import { fileExists, pathResolve } from '../../utils'

export default (opts?: Options) => {
  const { typescript, jtsLoader, cssScoped } = opts ?? {}
  opts.atomCss = fileExists(pathResolve(process.cwd(), 'windi.config.js')) ? 'windicss' : undefined
  if (!opts.atomCss) {
    opts.atomCss = fileExists(pathResolve(process.cwd(), 'tailwind.config.js'))
      ? 'tailwindcss'
      : undefined
  }

  const webpackChain = new WebpackChain()
  resolveEntry(webpackChain, opts)
  resolveResolve(webpackChain, typescript)
  resolveJts(webpackChain, { typescript, jtsLoader, cssScoped })
  resolveCss(webpackChain, opts)
  resolveAssets(webpackChain)
  resolvePlugins(webpackChain, opts)
  if (process.env.NODE_ENV === 'production') {
    resolveMinimizer(webpackChain, jtsLoader)
  }
  return webpackChain
}
