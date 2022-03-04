import fs from 'fs'
import path from 'path'
import { PromptsResult } from './types'
import { appendFileContent, deepMerge, run, sortDependencies } from './utils'

const templateRoot = path.resolve(__dirname, '../template')

/**
 * 在目标目录下生成package.json文件
 * @param {string} projectName 项目名
 */
export const renderPackage = ({
  packageName,
  eslint,
  stylelint,
  typescript,
  jtsLoader,
  commitlint,
}: PromptsResult) => {
  const isLint = eslint || stylelint || commitlint
  const commitScripts = {
    cz: 'git-cz',
  }
  const commitlintPackage = {
    '@commitlint/cli': '^16.2.1',
    '@commitlint/config-conventional': '^16.2.1',
    'commitlint-config-cz': '^0.13.3',
    'cz-customizable': '^6.3.0',
    commitizen: '^4.2.4',
  }
  const commitizenConfig = {
    config: {
      commitizen: {
        path: 'node_modules/cz-customizable',
      },
      'cz-customizable': {
        config: 'cz.config.js',
      },
    },
  }

  const tsPackage = {
    '@typescript-eslint/eslint-plugin': '^5.8.0',
    '@typescript-eslint/parser': '^5.8.0',
  }
  const eslintPackage = {
    ...(typescript ? tsPackage : {}),
    eslint: '^8.5.0',
    'eslint-config-prettier': '^8.3.0',
    'eslint-plugin-jsx-a11y': '^6.5.1',
    'eslint-plugin-prettier': '^4.0.0',
    'eslint-plugin-react': '^7.28.0',
    'eslint-plugin-react-hooks': '^4.3.0',
    prettier: '^2.5.1',
  }
  const huskyPackage = {
    husky: '^7.0.4',
    'lint-staged': '^12.1.3',
  }
  const stylelintPackage = {
    stylelint: '^14.2.0',
    'stylelint-config-property-sort-order-smacss': '^8.0.0',
    'stylelint-config-standard': '^24.0.0',
    'stylelint-order': '^5.0.0',
  }
  const swcPackage = {
    '@swc/helpers': '^0.3.3',
  }

  const pkg = {
    name: packageName,
    version: '0.0.1',
    scripts: {
      dev: 'citc-scripts start',
      build: 'citc-scripts build',
      ...(commitlint ? commitScripts : {}),
    },
    devDependencies: {
      ...(commitlint ? commitlintPackage : {}),
      ...(jtsLoader === 'swc' ? swcPackage : {}),
      ...(eslint ? eslintPackage : {}),
      ...(isLint ? huskyPackage : {}),
      ...(stylelint ? stylelintPackage : {}),
    },
    ...(commitlint ? commitizenConfig : {}),
  }
  fs.writeFileSync(path.resolve(process.env.ROOT, 'package.json'), JSON.stringify(pkg, null, 2))
}
/**
 * 在目标目录下生成README.md
 * @param {string} projectName 项目名
 */
export const renderReadme = ({ projectName, eslint, stylelint, atomCss }: PromptsResult) => {
  let pluginInfo = '\n'
  if (eslint || stylelint || atomCss) {
    const eslintPlugin = '- `ESLint`\n' + '- `Prettier - Code formatter`\n'
    const stylelintPlugin = '- `Stylelint`\n'
    const windiCssPlugin = '- `WindiCSS IntelliSense`\n'
    const tailwindCssPlugin = '- `Tailwind CSS IntelliSense`\n'
    const atomCssPlugin = atomCss === 'windicss' ? windiCssPlugin : tailwindCssPlugin

    const vscodeSettingTitle =
      '## 配置 Vscode\n\n' + '在`Vscode`配置文件`settings.json`中添加如下配置\n\n'

    const eslintSettings =
      '### 配置 Eslint+Prettier\n\n' +
      '```json\n' +
      '"editor.formatOnSave": true,\n' +
      '"editor.fontLigatures": true,\n' +
      '"svelte.enable-ts-plugin": true,\n' +
      '"explorer.confirmDelete": false,\n' +
      '"prettier.jsxSingleQuote": true,\n' +
      '"prettier.requireConfig": true,\n' +
      '"prettier.semi": false,\n' +
      '"prettier.singleQuote": true,\n' +
      '"prettier.arrowParens": "avoid",\n' +
      '"editor.codeActionsOnSave": {\n' +
      '    "source.fixAll": true\n' +
      '}\n' +
      '```\n\n'

    const atomCssSettings =
      `### 配置 ${atomCss}\n\n` +
      '```json\n' +
      '"editor.quickSuggestions": {\n' +
      '  "strings": true\n' +
      '}\n' +
      '```\n'

    pluginInfo +=
      '## Vscode 插件\n\n' +
      (eslint ? eslintPlugin : '') +
      (stylelint ? stylelintPlugin : '') +
      (atomCss ? atomCssPlugin : '') +
      '\n' +
      vscodeSettingTitle +
      (eslint ? eslintSettings : '') +
      (atomCss ? atomCssSettings : '') +
      '\n'
  }
  const info =
    `# ${projectName}\n\n` +
    '> @renzp/create-app创建的React项目\n\n' +
    '## 开发\n\n' +
    '```bash\n' +
    'npm run dev\n' +
    '```\n' +
    '## 打包\n\n' +
    '```bash\n' +
    'npm run build\n' +
    '```\n' +
    pluginInfo

  fs.writeFileSync(path.resolve(process.env.ROOT, 'README.md'), info)
}
/**
 * 在目标目录下生成模板文件
 * @param {string} templateName 模板名
 * @param {string} dest 目标目录
 * @param {boolean} typescript 是否使用ts
 * @param {boolean} windiCss 是否使用windiCss
 */
export const render = (templateName: string, typescript?: boolean) => {
  const templateDir = path.resolve(templateRoot, templateName)
  renderTemplate(templateDir, process.env.ROOT, typescript)
}
/**
 * 将源目录下的文件复制到指定目录目录下
 * 如果是package.json文件则合并内容
 * @param {string}  src 源目录
 * @param {string}  dest 目标目录
 * @param {boolean} typescript 是否使用ts
 * @param {boolean} windiCss 是否使用windiCss
 */
export const renderTemplate = (src: string, dest: string, typescript?: boolean) => {
  const stats = fs.statSync(src)

  if (stats.isDirectory()) {
    // 如果是目录则递归复制
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
      renderTemplate(path.resolve(src, file), path.resolve(dest, file), typescript)
    }
    return
  }

  const filename = path.basename(src)

  if (filename === 'package.json' && fs.existsSync(dest)) {
    // 合并并覆盖
    const existing = JSON.parse(fs.readFileSync(dest) as unknown as string)
    const newPackage = JSON.parse(fs.readFileSync(src) as unknown as string)
    const pkg = sortDependencies(deepMerge(existing, newPackage))
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n')
    return
  }

  // ts项目替换文件后缀
  if (typescript && filename.endsWith('.jsx')) {
    dest = path.resolve(path.dirname(dest), filename.replace('.jsx', '.tsx'))
  }

  fs.copyFileSync(src, dest)
}
/**
 * 渲染citc.config文件
 * @param {PromptsResult} result
 */
export const renderCitcConfig = (result: PromptsResult) => {
  const { typescript = false, cssModule = false, jtsLoader, cssPreprocessor } = result
  let jtsConfig = ''
  if (jtsLoader && jtsLoader !== 'babel') {
    jtsConfig = `  jtsLoader: {\n    loader: '${jtsLoader}',\n  },\n`
  }

  let cssPreprocessorConfig = ''
  if (cssPreprocessor) {
    cssPreprocessorConfig += `  ${cssPreprocessor}: true,\n`
  }

  fs.writeFileSync(
    path.resolve(process.env.ROOT, 'citc.config.js'),
    `/** @type {import('@renzp/scripts').Options} */\n` +
      'module.exports = {\n' +
      `  typescript: ${typescript},\n` +
      `  cssModule: ${cssModule},\n` +
      cssPreprocessorConfig +
      jtsConfig +
      '}\n'
  )
}
/**
 * 渲染.husky和.lintstagedrc文件
 * @param {boolean} typescript 是否使用ts
 * @param {boolean} eslint 是否使用eslint
 * @param {boolean} stylelint 是否使用stylelint
 */
export const renderHuskyAndLintstagedrc = (result: PromptsResult) => {
  const { eslint, stylelint, commitlint } = result
  const huskySrc = path.resolve(templateRoot, '.husky')
  const huskyRoot = path.resolve(process.env.ROOT, '.husky')
  // 创建目录.husky
  fs.mkdirSync(`${huskyRoot}/_`, { recursive: true })
  fs.copyFileSync(`${huskySrc}/_/husky.sh`, `${huskyRoot}/_/husky.sh`)
  if (eslint || stylelint) {
    renderLintstagedrc(result)
    fs.copyFileSync(`${huskySrc}/pre-commit`, `${huskyRoot}/pre-commit`)
  }
  if (commitlint) {
    fs.copyFileSync(`${huskySrc}/commit-msg`, `${huskyRoot}/commit-msg`)
  }
}
/**
 * 从模板中渲染文件到项目指定路径
 * @param fileName 要渲染的文件名
 * @param templateDir 模版路径
 */
export const copyTemplateFile = (fileName: string, src: string, dest = '') => {
  const dir = path.resolve(templateRoot, `${src}/${fileName}`)
  dest = path.resolve(process.env.ROOT, dest)
  try {
    fs.accessSync(dest)
  } catch {
    fs.mkdirSync(dest)
  }
  fs.copyFileSync(dir, path.resolve(dest, fileName), fs.constants.COPYFILE_FICLONE)
}
/**
 * 渲染.gitignore文件
 */
export const renderGitignore = () => {
  fs.writeFileSync(
    path.resolve(process.env.ROOT, '.gitignore'),
    'node_modules\n*.log\n.vscode\ndist\n'
  )
}
/**
 * 渲染css原子化框架内容
 * @param atomCss css原子化框架
 * @param typescript 是否为ts
 * @param stylelint 是否使用stylelint
 */
export const renderAtomCss = (result: PromptsResult) => {
  const { typescript, atomCss, stylelint } = result
  if (atomCss) {
    const fileType = typescript ? 'tsx' : 'jsx'
    // 如果使用css原子化框剪，则追加样式导入代码
    atomCss === 'tailwindcss' &&
      fs.writeFileSync(
        path.resolve(process.env.ROOT, 'src/main.css'),
        (stylelint ? `/* stylelint-disable at-rule-no-unknown */\n` : '') +
          '@tailwind base;\n' +
          '@tailwind components;\n' +
          '@tailwind utilities;\n'
      )

    appendFileContent(
      path.resolve(process.env.ROOT, `src/main.${fileType}`),
      atomCss === 'windicss' ? `import 'windi.css'` : `import './main.css'`,
      2
    )
    renderAtomCssConfigFile(atomCss, typescript)
  }
}
/**
 * 渲染css原子化框架配置文件
 * @param atomCss css原子化框架
 * @param fileType 文件类型
 */
export const renderAtomCssConfigFile = (atomCss: string, typescript: boolean) => {
  const fileName = `${atomCss.replace('css', '')}.config.js`
  const fileType = typescript ? 'tsx' : ' jsx'
  const content =
    atomCss === 'windicss'
      ? 'export default {\n' +
        '  extract: {\n' +
        `    include: ['**/*.${fileType}'],\n` +
        `    exclude: ['node_modules', '.git', 'dist'],\n` +
        '  },\n' +
        '}\n'
      : 'module.exports = {\n' + `  content: ['./src/**/*.${fileType}'],\n` + '}\n'
  fs.writeFileSync(path.resolve(process.env.ROOT, fileName), content)
}
/**
 * 渲染.lintstagedrc
 */
export const renderLintstagedrc = (result: PromptsResult) => {
  const { typescript, eslint, stylelint, cssPreprocessor } = result
  const fileType = typescript ? 'ts' : 'js'
  let cssPrefix = 'css'
  if (cssPreprocessor) {
    cssPrefix = cssPreprocessor === 'less' ? cssPreprocessor : '{scss,sass}'
  }
  fs.writeFileSync(
    path.resolve(process.env.ROOT, `.lintstagedrc.js`),
    'module.exports = {\n' +
      (eslint
        ? `  'src/**/*.{${fileType},${fileType}x,json,html}': ['eslint --fix', 'prettier --write'],\n`
        : '') +
      (stylelint ? `  'src/**/*.${cssPrefix}': ['stylelint --fix']\n` : '') +
      '}\n'
  )
}
/**
 * 渲染lint
 * @param result PromptsResult
 */
export const renderLint = (result: PromptsResult) => {
  const { typescript, eslint, stylelint, commitlint } = result
  if (eslint || stylelint || commitlint) {
    renderHuskyAndLintstagedrc(result)
    if (eslint) {
      copyTemplateFile('.eslintrc.js', `lint/${typescript ? 'ts' : 'js'}`)
      copyTemplateFile('.prettierrc', `lint`)
    }
    if (stylelint) {
      copyTemplateFile('.stylelintrc', 'lint')
    }
    if (commitlint) {
      copyTemplateFile('commitlint.config.js', `lint`)
      copyTemplateFile('cz.config.js', `lint`)
    }
  }
}
/**
 * 渲染git
 */
export const renderGitRepo = async () => {
  await run('git init')
  renderGitignore()
  await run('git add .')
  await run('git commit -m init')
  appendFileContent(path.resolve(process.env.ROOT, `.git/config`), '    hooksPath = .husky', 7)
}
