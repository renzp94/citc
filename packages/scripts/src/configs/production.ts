import WebpackChain from 'webpack-chain'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

export default (webpackChain: WebpackChain) => {
  // 抽离公共部分
  webpackChain.optimization
    .splitChunks({
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    })
    .minimize(true)
    .minimizer('css-minimizer')
    .use(CssMinimizerWebpackPlugin, [{ test: /\.css/ }])
    .end()
    .minimizer('js-minimizer')
    .use(TerserPlugin, [
      {
        test: /\.js/,
      },
    ])
}
