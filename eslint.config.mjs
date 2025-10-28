import js from '@eslint/js';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules', 'coverage', 'dist'],
  },
  js.configs.recommended,
  pluginPrettierRecommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-console': 'off',
      'no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
