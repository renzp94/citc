import type WebpackChain from 'webpack-chain'
import { requireResolve } from '../../utils'

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

  // 处理svg可以直接导入为React组件
  webpackChain.module
    .rule('svg')
    .oneOf('svg-icon')
    .test(/\.svg$/)
    .exclude.add(/node_modules/)
    .end()
    .set('issuer', /\.[jt]sx?$/)
    .set('resourceQuery', /react/)
    .use('@svgr/webpack')
    .loader(requireResolve('@svgr/webpack'))
    .end()
    .end()
    .oneOf('svg-img')
    .test(/\.svg$/)
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

  // 处理图片
  webpackChain.module
    .rule('images')
    .test(/\.(png|jpg|jpeg|gif)$/i)
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
