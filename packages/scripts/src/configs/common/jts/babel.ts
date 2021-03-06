import type WebpackChain from 'webpack-chain'
import type { JtsLoader } from '../../../types'
import { getJtsFileType, requireResolve } from '../../../utils'
import path from 'path'
import _merge from 'lodash/merge'

export default (webpackChain: WebpackChain, typescript: boolean, jtsLoader: JtsLoader) => {
  const fileType = getJtsFileType(typescript)

  const userLoaderOptions = jtsLoader?.babel?.loaderOptions ?? {}
  const userPresetEnvOptions = jtsLoader?.babel?.presetEnv ?? {}
  const presets = [
    [
      requireResolve('@babel/preset-env'),
      _merge(
        {
          useBuiltIns: 'entry',
          corejs: 3,
          exclude: ['transform-typeof-symbol'],
        },
        userPresetEnvOptions
      ),
    ],
    requireResolve('@babel/preset-react'),
  ]
  if (typescript) {
    presets.push(requireResolve('@babel/preset-typescript'))
  }

  const absoluteRuntime = path.dirname(requireResolve('@babel/runtime/package.json'))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require('@babel/runtime/package.json').version
  const transformRuntimeOptions = jtsLoader?.babel?.transformRuntime ?? {}
  const transformRuntime = [
    requireResolve('@babel/plugin-transform-runtime'),
    _merge(
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
        absoluteRuntime,
        version,
      },
      transformRuntimeOptions
    ),
  ]

  const babelOptions = _merge(
    {
      cacheDirectory: true,
      presets,
      plugins: [
        transformRuntime,
        [requireResolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        requireResolve('@babel/plugin-proposal-class-properties'),
        requireResolve('@babel/plugin-proposal-object-rest-spread'),
        requireResolve('@babel/plugin-syntax-dynamic-import'),
        requireResolve('babel-plugin-transform-react-remove-prop-types'),
        requireResolve('@babel/plugin-proposal-private-methods'),
        requireResolve('@babel/plugin-proposal-private-property-in-object'),
      ],
    },
    userLoaderOptions
  )

  // ??????babel
  const rule = webpackChain.module
    .rule('babel')
    .test(new RegExp(`\\.(${fileType}|${fileType}x)$`, 'i'))
    .exclude.add(/node_modules/)
    .end()
    .use('thread-loader')
    .loader(requireResolve('thread-loader'))
    .end()
    .use('babel')
    .loader(requireResolve('babel-loader'))
    .options(babelOptions)
    .end()

  return rule
}
