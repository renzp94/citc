import type WebpackChain from 'webpack-chain'
import type { Optimization } from 'webpack-chain'
import type { AnyObject, JtsLoader } from '../../types'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { ESBuildMinifyPlugin } from 'esbuild-loader'
import { yellow } from 'kolorist'
import _merge from 'lodash/merge'

/**
 * babel压缩
 */
const babelMinimizer = (minimizer: Optimization, options: JtsLoader) => {
  let opts: AnyObject = options?.babel?.minimizerOption ?? {}
  opts = _merge(
    {
      terserOptions: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        parse: {
          // We want terser to parse ecma 8 code. However, we don't want it
          // to apply any minification steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
          // Disabled because of an issue with Terser breaking valid code:
          // https://github.com/facebook/create-react-app/issues/5250
          // Pending further investigation:
          // https://github.com/terser-js/terser/issues/120
          inline: 2,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true,
        },
      },
    },
    opts
  )
  minimizer.minimizer('js-minimizer').use(TerserPlugin, [opts])
}
/**
 * esbuild压缩
 */
const esbuildMinimizer = (minimizer: Optimization, options: JtsLoader) => {
  let opts = options?.esbuild?.minimizerOption ?? {}
  opts = _merge({ target: 'es2015', css: true, legalComments: 'none' }, opts)
  minimizer.minimizer('js-esbuild-minimizer').use(ESBuildMinifyPlugin, [opts])
}

export default (webpackChain: WebpackChain, jtsLoader: JtsLoader) => {
  const { loader = 'babel' } = jtsLoader ?? {}

  // css压缩
  const minimizer = webpackChain.optimization
    .minimize(true)
    .minimizer('css-minimizer')
    .use(CssMinimizerWebpackPlugin, [{ test: /\.css/ }])
    .end()

  const minimizers = {
    babel: babelMinimizer,
    esbuild: esbuildMinimizer,
    swc: esbuildMinimizer,
  }

  if (loader === 'swc') {
    console.log(
      yellow(
        '[WARNING]: swc的压缩功能还在建设中，所以当jtsLoader=swc时默认使用esbuild压缩，swc压缩会在适当时机添加'
      )
    )
  }

  minimizers[loader](minimizer, jtsLoader)
}
