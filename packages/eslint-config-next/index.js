module.exports = {
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'turbo',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@next/next/no-html-link-for-pages': 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
    },
    {
      // Adapt to your needs (e.g. some might want to only override "next.config.js")
      files: ['*.js', '*.mjs'],
      // This is the default parser of ESLint
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
  ],
}
