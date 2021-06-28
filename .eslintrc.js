module.exports = {
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint-config-scza',
    'eslint:recommended',
    'prettier',
    'plugin:security/recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: ['@typescript-eslint', 'prettier', 'security'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'prettier/prettier': 'warn',
    'security/detect-object-injection': 'off',
  },
  ignorePatterns: ['node_modules', 'dist'],
};
