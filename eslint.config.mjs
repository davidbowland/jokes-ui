// Fleet ESLint flat config — UI (Next.js / React TypeScript) flavor.
// ESLint 9 + typescript-eslint 8 + eslint-plugin-react. Translated from this
// repo's former .eslintrc.json preserving original intent.
//
// The old .eslintignore also listed `deploy/`, `infrastructure/`, `static/`,
// and `.cache/` -- vestigial Gatsby-era entries with no matching directory
// anywhere in this repo (grep-confirmed). Dropped rather than carried
// forward. See jokes-report.md kit feedback.
//
// IMPORTANT (kit gap, see jokes-report.md): eslint 9 flat config does NOT
// implicitly skip dotfiles/dot-directories the way eslintrc did. `.next/`
// (Next.js build cache) MUST be listed explicitly or `eslint .` floods with
// thousands of errors from generated/minified framework code the moment a
// local `next build`/`next dev` has run.
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jest from 'eslint-plugin-jest'
import react from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // 1) Build artifacts and generated files never linted.
  {
    ignores: [
      '**/__mocks__/',
      '**/__snapshots__/',
      '.next/',
      '.swc/',
      'coverage/',
      'node_modules/',
      'out/',
      'public/',
      'next-env.d.ts',
      '**/*.min.*',
      'jest.*.*',
    ],
  },

  // 2) Base recommended sets.
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,

  // 3) Language options + fleet rule intent (from the former .eslintrc.json).
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        exports: 'writable',
        module: 'readonly',
        require: 'readonly',
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '_' }],
      'no-negated-condition': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-curly-brace-presence': ['error', { children: 'never', propElementValues: 'always', props: 'never' }],
      'react/jsx-sort-props': 'error',
      'sort-vars': 'error',
    },
  },

  // 4) Node scripts / config files may use CommonJS require().
  {
    files: ['scripts/**/*.js', '*.config.js', 'next.config.js'],
    languageOptions: { globals: { ...globals.node } },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },

  // 5) Jest rules scoped to test / mock / test-support files only.
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*TestUtils.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
      '**/__mocks__/**/*.{ts,tsx}',
    ],
    ...jest.configs['flat/recommended'],
    settings: { jest: { version: 29 } },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/no-mocks-import': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // 6) Prettier LAST — disables all formatting rules that would fight prettier.
  prettier,
)
