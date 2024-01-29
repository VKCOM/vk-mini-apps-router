const path = require('path');

module.exports = {
  root: true,
  extends: ['plugin:@vkontakte/eslint-plugin/typescript', "plugin:import/recommended", 'prettier'],
  overrides: [
    {
      files: '**/*.{ts,tsx}',
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  ],
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    'import/named': 'off',
    'no-shadow': 'off',
    'guard-for-in': 'off',
    'import/no-unresolved': ['error', { ignore: ['^[a-z@]'] }],
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
