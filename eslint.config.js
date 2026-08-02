// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    // Build output, caches and dependencies are not source.
    ignores: ['dist/**', '.angular/**', 'node_modules/**', 'logs/**', 'upcoming/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Components use the `app` prefix; the auth directives use the project's
      // own `ks` (kojo-stack) prefix. Both are established conventions here.
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['app', 'ks'], style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      // ModelDashboardBase is a base class rather than a real component. Downgraded
      // until it is converted to an abstract generic class (see plan.md G12).
      '@angular-eslint/component-class-suffix': 'warn',
      // The codebase predates this rule; treat as a warning so lint stays useful
      // as a gate without failing the build on pre-existing code.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Accessibility findings are real but numerous in the existing templates;
      // surfaced as warnings so they can be worked through incrementally.
      '@angular-eslint/template/click-events-have-key-events': 'warn',
      '@angular-eslint/template/interactive-supports-focus': 'warn',
      '@angular-eslint/template/label-has-associated-control': 'warn',
      // Autofocus on the login form's username field is a deliberate UX choice.
      '@angular-eslint/template/no-autofocus': 'warn',
    },
  }
);
