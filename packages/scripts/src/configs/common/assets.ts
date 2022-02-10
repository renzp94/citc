import type WebpackChain from 'webpack-chain'

export default (webpackChain: WebpackChain) => {
  // 处理字体文件
  webpackChain.module
    .rule('fonts')
    .test(/\.(woff|woff2|eot|ttf|otf)$/i)
    .exclude.add(/node_modules/)
    .end()
    .set('type', 'asset/resource')
    .set('generator', {
      filename: 'assets/fonts/[name][ext]',
    })

  // 处理图片
  webpackChain.module
    .rule('images')
    .test(/\.(png|svg|jpg|jpeg|gif)$/i)
    .exclude.add(/node_modules/)
    .end()
    .set('type', 'asset/resource')
    .parser({
      dataUrlCondition: {
        maxSize: 80 * 1024,
      },
    })
    .set('generator', {
      filename: 'assets/images/[name].[hash:6][ext]',
    })
}
