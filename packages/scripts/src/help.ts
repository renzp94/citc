export default () => {
  console.log('使用说明：\ncitc-scripts <command> [options]\n')
  console.log('Options: ')
  console.log('  -V, --version\t\t显示当前版本号')
  console.log('  -h, --help\t\t显示当前使用说明\n')
  console.log('Command: ')
  console.log('  start\t启动开发环境')
  console.log('  build\t启动打包构建')
  console.log('    Options: ')
  console.log('      --build-size-analyzer\t\t是否开启构建包大小分析')
  console.log('      --build-time-analyzer\t\t是否开启构建时间分析')
  console.log('      --dll\t指定预构建依赖包(多个依赖包,隔开)\n')
  console.log('Config file: ')
  console.log('  entry\t打包入口配置 [string | Array<string> | {[key:string]:unknown}]')
  console.log('  output\t打包输出配置 [string]')
  console.log('  publicDir\t静态文件目录配置 [string]')
  console.log(
    '  html\thtml配置，template默认为index.html,favicon默认为favicon.ico，其他参数详情参考：html-webpack-plugin'
  )
  console.log('  typescript\t是否使用typescript [boolean]')
  console.log('  cssModule\t是否使用css module [boolean]')
  console.log('  webpackChain\twebpackChain修改配置 [(webpackChain) => void]')
  console.log(
    '  webpackBuildInfo\t是否使用打包信息展示 [boolean | 自定义配置参考@renzp/build-info-webpack-plugin]'
  )
  console.log('  jtsLoader\t指定jsx/tsx文件loader [babel | esbuild | swc]')
  console.log('  less\t是否使用less [boolean]')
  console.log('  sass\t是否使用sass [boolean]')
  console.log('  dll\t配置预构建依赖包 [string | Array<string>]')
  console.log('  cssScoped\t是否使用css scoped [boolean]')
}
