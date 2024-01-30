module.exports = {
  env: {
    es2024: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.cjs', 'dist/'],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'import/extensions': ['error', 'always'],
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: { multiline: true },
      },
    ],
    'import/no-cycle': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'max-len': [
      'error',
      {
        code: 120,
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
