import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    commonjs(),
    vue(),
    typescript({
      typescript: require('typescript'),
      defaultLang: { script: 'ts' },
      clean: true
    })
  ]
}
