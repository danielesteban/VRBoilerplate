const path = require('path');
module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'import',
  ],
  globals: {
    __BASENAME__: '',
    __PRODUCTION__: false,
    __TITLE__: '',
    __VERSION__: '',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', path.resolve(__dirname, 'src')],
        ],
      },
    },
  },
  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'function-paren-newline': ['error', 'consistent'],
    'no-bitwise': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
  },
};
