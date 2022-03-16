export default () => {
  console.log('使用说明：\n@renzp/create-app <command> [options]\n')
  console.log('Options: ')
  console.log('  -V, --version\t\t显示当前版本号')
  console.log('  -h, --help\t\t显示当前使用说明\n')
  console.log('命令: ')
  console.log('  create <app-name> [options]')
  console.log('    Options: ')
  console.log('      --ts\t\t是否使用typescript')
  console.log('      --eslint\t\t是否使用eslint')
  console.log('      --stylelint\t是否使用stylelint')
  console.log('      --cssModule\t是否使用css module')
  console.log('      --cssScoped\t是否使用css scoped')
  console.log('      --less\t\t是否使用less')
  console.log('      --sass\t\t是否使用sass')
  console.log('      --jtsLoader\t指定jsx/tsx文件处理：babel(默认)/esbuild/swc')
  console.log('      --atomCss\t\t指定css原子化框架：windicss/tailwindcss')
  console.log('      --commitlint\t是否使用commitlint')
}
