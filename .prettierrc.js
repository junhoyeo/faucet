module.exports = {
  singleQuote: true,
  jsxBracketSameLine: false,
  trailingComma: 'all',
  bracketSpacing: true,
  semi: true,
  printWidth: 110,

  // @ianvs/prettier-plugin-sort-imports
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '@/(assets|components|hooks|pages|jotai|styles|utils)/(.*)$',
    '@/(.*)$',
    '^[./](.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [require('@ianvs/prettier-plugin-sort-imports')],
};
