import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-function': 'warn',

      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // handled by @typescript-eslint/no-unused-vars
      
      // Prettier integration
      'prettier/prettier': 'error',
      
      // Best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.js',
      '**/*.d.ts',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
    ],
  },
];
