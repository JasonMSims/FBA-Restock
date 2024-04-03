/** @type {import("prettier").Config} */
const config = {
  arrowParens: 'always',
  attributeSort: 'asc',
  bracketSpacing: true,
  endOfLine: 'auto',
  pluginSearchDirs: false,
  plugins: [
    // '@ianvs/prettier-plugin-sort-imports',
    // 'prettier-plugin-organize-attributes',
    'prettier-plugin-tailwindcss',
  ],
  printWidth: 150,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  // importOrder: ['^@', '^[a-zA-Z0-9-]+', '^[./]'],
  tailwindConfig: './tailwind.config.cjs',

  trailingComma: 'es5',

  useTabs: false,
}

export default config
