import type WebpackChain from 'webpack-chain'
import { requireResolve } from '../../utils'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { AnyObject, AtomCss, CssModuleOptions, Options } from '../../types'

/**
 * 应用公共css loader
 * @param rule rule实例
 * @param atomCss 原子化Css框架
 * @param cssModule 是否为css module
 * @returns 返回rule实例
 */
const applyCommonLoader = (
  rule: WebpackChain.Rule<WebpackChain.Rule<WebpackChain.Module>>,
  atomCss: AtomCss,
  cssModule?: boolean | CssModuleOptions
) => {
  if (process.env.NODE_ENV === 'development') {
    rule.use('style-loader').loader(requireResolve('style-loader'))
  } else {
    rule.use('mini-css-extract-loader').loader(MiniCssExtractPlugin.loader)
  }

  const postcssPlugins: Array<unknown> = [
    requireResolve('postcss-flexbugs-fixes'),
    [
      requireResolve('postcss-preset-env'),
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      },
    ],
  ]

  if (!atomCss) {
    postcssPlugins.push(requireResolve('postcss-normalize'))
  }

  if (atomCss === 'tailwindcss') {
    postcssPlugins.unshift('tailwindcss')
  }

  rule
    .use('css-loader')
    .loader(requireResolve('css-loader'))
    .options(
      cssModule
        ? {
            modules: {
              auto: true,
              localIdentName: '[local]--[hash:base64:10]',
              exportLocalsConvention: 'camelCaseOnly',
              ...(typeof cssModule === 'boolean' ? {} : cssModule),
            },
          }
        : {
            modules: false,
          }
    )
    .end()
    .use('postcss-loader')
    .loader(requireResolve('postcss-loader'))
    .options({
      postcssOptions: {
        ident: 'postcss',
        config: false,
        plugins: postcssPlugins,
      },
    })
    .end()

  return rule
}
/**
 * 应用预处理的loader
 * @param rule rule实例
 * @param loader 预处理的loader
 * @param options loader参数
 */
const applyPreCssLoader = (
  rule: WebpackChain.Rule<WebpackChain.Rule<WebpackChain.Module>>,
  loader: string,
  options?: boolean | AnyObject
) => {
  if (loader) {
    rule
      .use(loader)
      .loader(requireResolve(loader))
      .options(typeof options === 'boolean' ? undefined : options)
  }
}
/**
 * 创建css规则
 * @param baseRule rule实例
 * @param lang css语言
 * @param cssModule 是否为css module
 * @param options loader的配置
 */
export const createCssRule = (
  baseRule: WebpackChain.Rule<WebpackChain.Module>,
  lang: string,
  cssModule: boolean | CssModuleOptions,
  atomCss: AtomCss,
  options?: boolean | AnyObject
) => {
  const regexps = {
    css: [/\.css$/, /\.module\.css$/],
    less: [/\.less$/, /\.module\.less$/],
    sass: [/\.(scss|sass)$/, /\.module\.(scss|sass)$/],
  }
  const loaders = {
    less: 'less-loader',
    sass: 'sass-loader',
  }
  const [cssTest, cssModuleTest] = regexps[lang]
  const loader = loaders[lang]
  const rule = baseRule.oneOf(lang).test(cssTest).exclude.add(cssModuleTest).end()
  applyCommonLoader(rule, atomCss)
  applyPreCssLoader(rule, loader, options)

  if (cssModule) {
    const moduleRule = baseRule.oneOf(`${lang}-module`).test(cssModuleTest)
    applyCommonLoader(moduleRule, atomCss, cssModule)
    applyPreCssLoader(moduleRule, loader, options)
  }
}

export default (webpackChain: WebpackChain, opts: Options) => {
  const { cssModule, less, sass, atomCss } = opts ?? {}
  const baseRule = webpackChain.module.rule('css')
  createCssRule(baseRule, 'css', cssModule, atomCss)
  if (less) {
    createCssRule(baseRule, 'less', cssModule, atomCss, less)
  }
  if (sass) {
    createCssRule(baseRule, 'sass', cssModule, atomCss, sass)
  }
}
