import type WebpackChain from 'webpack-chain'
import { requireResolve } from '../../utils'
import path from 'path'

export default (webpackChain: WebpackChain, typescript: boolean, fileType = 'js') => {
  const presets = [
    requireResolve('@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3,
    }),
    requireResolve('@babel/preset-react'),
  ]
  if (typescript) {
    presets.push(requireResolve('@babel/preset-typescript'))
  }

  const absoluteRuntime = path.dirname(requireResolve('@babel/runtime/package.json'))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require('@babel/runtime/package.json').version
  const transformRuntime = [
    requireResolve('@babel/plugin-transform-runtime'),
    {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: true,
      absoluteRuntime,
      version,
    },
  ]

  // 配置babel
  webpackChain.module
    .rule('babel')
    .test(new RegExp(`\\.(${fileType}|${fileType}x)$`, 'i'))
    .exclude.add(/node_modules/)
    .end()
    .use('babel')
    .loader(requireResolve('babel-loader'))
    .options({
      cacheDirectory: true,
      presets,
      plugins: [
        transformRuntime,
        requireResolve('@babel/plugin-proposal-class-properties'),
        requireResolve('@babel/plugin-proposal-object-rest-spread'),
        requireResolve('@babel/plugin-syntax-dynamic-import'),
        requireResolve('babel-plugin-transform-react-remove-prop-types'),
      ],
    })
}
