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
          name: 'vendors',
          chunks: 'all',
        },
      },
    })
}
