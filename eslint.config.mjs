import js from '@eslint/js';
import globals from 'globals';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const appFiles = ['src/**/*.{ts,tsx}', 'next.config.ts'];
const config = [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'content/**',
      '.next/**',
      'out/**',
    ],
  },
  ...[...nextVitals, ...nextTypescript].map((preset) => ({
    ...preset,
    files: appFiles,
  })),
  {
    files: ['**/*.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: { 'no-unused-vars': ['error', { ignoreRestSiblings: true }] },
  },
];

export default config;
