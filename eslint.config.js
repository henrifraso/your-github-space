import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Ignorar build e arquivos gerados
  { ignores: ['dist/**', 'dist-electron/**', 'dist-installer/**', 'node_modules/**'] },

  // Base JS recomendado
  js.configs.recommended,

  // TypeScript recomendado
  ...tseslint.configs.recommended,

  // Plugins React
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Ajustes de regras para o projeto
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    rules: {
      // --- WARNINGS: violações antigas frequentes, limpar aos poucos ---
      '@typescript-eslint/no-explicit-any':        'warn',
      '@typescript-eslint/no-unused-vars':          ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions':  'warn',
      '@typescript-eslint/no-empty-object-type':   'warn',
      '@typescript-eslint/ban-ts-comment':         'warn',
      'no-unused-vars':                             'off', // substituído pela versão TS acima
      'no-useless-escape':                         'warn',
      'no-empty':                                  'warn',
      'react-hooks/exhaustive-deps':               'warn',

      // --- ERRORS: bugs reais, não negociar ---
      'react-hooks/rules-of-hooks':                'error',
      // no-undef desabilitado: TypeScript já garante isso com mais precisão
      'no-undef':                                  'off',
    },
  },

  // Desabilitar regras que conflitam com Prettier (deve vir por último)
  prettier,
);
