module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:perfectionist/recommended-natural'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue', 'perfectionist'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': ['warn', { args: 'after-used', ignoreRestSiblings: false, vars: 'local' }],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
}
