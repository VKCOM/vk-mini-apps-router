const path = require('path');

module.exports = {
  root: true,
  extends: ['@vkontakte/eslint-config/typescript', 'prettier'],
  overrides: [
    {
      files: '**/*.{ts,tsx}',
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  ],
  rules: {
    'no-shadow': 'off',
    'guard-for-in': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
  },
};
