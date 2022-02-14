import WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  // 抽离公共部分
  webpackChain
    // 抛出错误之后停止打包
    .bail(true)
    .optimization.splitChunks({
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-vendors',
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    })
}
