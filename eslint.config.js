import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    'dist',
    'dist-ssr',
    'coverage',
    'playwright-report',
    'test-results',
    'supabase/.temp',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.strict, tseslint.configs.stylistic],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite()],
  },
  {
    files: ['src/components/ui/**/*.tsx', 'src/**/*.test.{ts,tsx}', 'src/test/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    // `vi.mock(path, (importOriginal) => importOriginal<typeof import(path)>())` é o padrão do Vitest.
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', disallowTypeAnnotations: false },
      ],
    },
  },
  {
    files: ['scripts/**/*.ts', 'build/**/*.ts', '*.config.{ts,js}', 'tests/e2e/**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
  {
    files: ['supabase/functions/**/*.ts'],
    languageOptions: { globals: { Deno: 'readonly' } },
    rules: { 'no-console': 'off' },
  },
  prettier,
])
