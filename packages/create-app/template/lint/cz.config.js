module.exports = {
  types: [
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'fix', name: 'fix: Bug修复' },
    { value: 'docs', name: 'docs: 文档更改' },
    { value: 'style', name: 'style: 不影响代码含义的更改(空白、格式、缺少分号等)' },
    { value: 'refactor', name: 'refactor: 代码重构' },
    { value: 'perf', name: 'perf: 性能优化' },
    { value: 'test', name: 'test: 测试更改' },
    {
      value: 'build',
      name: 'build: 影响构建系统或外部依赖关系的更改(示例范围: gulp、Brocoli、npm)',
    },
    { value: 'ci', name: 'ci: CI配置文件和脚本更改' },
    { value: 'chore', name: 'chore: 其他' },
    { value: 'revert', name: 'revert: 代码回退' },
  ],
  messages: {
    type: '请选择要提交的更改类型: ',
    customScope: '请输入此更改的范围(例如组件或文件名)[可选]: ',
    subject: '请输入此次更改内容的简短描述:\n',
    body: '请输入此次更改内容的详细描述[可选]:\n',
    confirmCommit: '是否提交本次内容?',
  },
  skipQuestions: ['breaking', 'footer'],
  subjectLimit: 100,
}
