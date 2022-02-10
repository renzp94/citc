import type WebpackChain from 'webpack-chain'
import { requireResolve } from '../../utils'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default (webpackChain: WebpackChain, cssModule: boolean) => {
  if (cssModule) {
    // 配置cssModule
    const cssModuleChain = webpackChain.module
      .rule('css-module')
      .test(/\.module\.css$/i)
      .exclude.add(/node_modules/)
      .end()

    if (process.env.NODE_ENV === 'development') {
      cssModuleChain.use('style-loader').loader(requireResolve('style-loader'))
    } else {
      cssModuleChain.use('mini-css-extract-loader').loader(MiniCssExtractPlugin.loader)
    }

    cssModuleChain
      .use('css-loader')
      .loader(requireResolve('css-loader'))
      .options({
        modules: {
          auto: true,
          localIdentName: '[local]--[hash:base64:10]',
        },
      })
      .end()
      .use('postcss-loader')
      .loader(requireResolve('postcss-loader'))
      .options({
        postcssOptions: {
          plugins: [requireResolve('postcss-preset-env')],
        },
      })
  }

  // 配置css
  const cssChain = webpackChain.module
    .rule('css')
    .test(/\.css$/i)
    .exclude.add(/\.module\.css$/i)
    .end()

  if (process.env.NODE_ENV === 'development') {
    cssChain.use('style-loader').loader(requireResolve('style-loader'))
  } else {
    cssChain.use('mini-css-extract-loader').loader(MiniCssExtractPlugin.loader)
  }

  cssChain
    .use('css-loader')
    .loader(requireResolve('css-loader'))
    .options({
      modules: false,
    })
    .end()
    .use('postcss-loader')
    .loader(requireResolve('postcss-loader'))
    .options({
      postcssOptions: {
        plugins: [requireResolve('postcss-preset-env')],
      },
    })
}
