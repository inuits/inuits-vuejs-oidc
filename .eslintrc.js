module.exports = {
  plugins: ["@typescript-eslint/eslint-plugin"],
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-multiple-empty-lines': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ['error', 2],
    'handle-callback-err': 'off',
    "vue/comment-directive": 0
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
