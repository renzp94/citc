import { defineConfig } from 'tsup'

export default defineConfig({
  //   打包格式
  format: ['cjs'],
  // 代码拆分
  splitting: false,
  //   打包前清空
  clean: true,
  sourcemap: true,
  dts: {
    entry: { index: 'src/types.ts' },
  },
})
