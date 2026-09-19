import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig, globalIgnores } from 'eslint/config'

// `eslint-config-next`'s own package can't be installed here: it peer-depends
// on eslint ^7-^9, and this project is on eslint ^10. Its underlying plugin,
// `@next/eslint-plugin-next`, has no such constraint, so its flat "core web
// vitals" rule set is wired directly instead (same rules, no broken install).
export default defineConfig([
  globalIgnores(['dist', '.next', 'node_modules', 'next-env.d.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.flatConfig.coreWebVitals.rules,
      'react-hooks/set-state-in-effect': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'preserve-caught-error': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    // NEXTJS-STRUCTURE-CONVENTIONS.md §8: client arithmetic on a money-named
    // value is forbidden — the API must return any total/derived amount a
    // page needs. Mirrors implementation-plan/web/18-money-math-lint-guardrail.md's
    // rule, adapted to admin's real money field names (mrr, arr, churnRate,
    // conversionRate, totalExpenseVolume, etc.).
    //
    // Pagination.tsx is excluded: its `total`/`limit` are generic pagination
    // item-counts (used by every list feature), never a money amount, same
    // reasoning as web/eslint.config.js's usePaginatedList.ts exclusion.
    files: ['src/features/**/*.{ts,tsx}', 'src/shared/**/*.{ts,tsx}'],
    ignores: ['src/shared/components/Pagination.tsx', 'src/**/__tests__/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "BinaryExpression[operator=/^[+\\-*/]$/] > :matches(Identifier[name=/^(?!.*(?:Pages|Count|Items|Length|Index|Steps|Percent|Percentage|Progress|People|Users|Members|Days|Months|Years|Weeks|Records|Rows|Entries)$).*(?:amount|balance|price|cost|remaining|spent|earned|contribution|principal|salary|networth|payout|fee|total|value|mrr|arr|revenue|churn|conversion).*$/i], MemberExpression[property.name=/^(?!.*(?:Pages|Count|Items|Length|Index|Steps|Percent|Percentage|Progress|People|Users|Members|Days|Months|Years|Weeks|Records|Rows|Entries)$).*(?:amount|balance|price|cost|remaining|spent|earned|contribution|principal|salary|networth|payout|fee|total|value|mrr|arr|revenue|churn|conversion).*$/i])",
          message:
            'Client-side arithmetic on a money-named value is forbidden — the API must return the computed total/derived amount instead of the page deriving it. See NEXTJS-STRUCTURE-CONVENTIONS.md §8.',
        },
        {
          selector:
            "AssignmentExpression[operator=/^[+\\-*/]=$/] > :matches(Identifier[name=/^(?!.*(?:Pages|Count|Items|Length|Index|Steps|Percent|Percentage|Progress|People|Users|Members|Days|Months|Years|Weeks|Records|Rows|Entries)$).*(?:amount|balance|price|cost|remaining|spent|earned|contribution|principal|salary|networth|payout|fee|total|value|mrr|arr|revenue|churn|conversion).*$/i], MemberExpression[property.name=/^(?!.*(?:Pages|Count|Items|Length|Index|Steps|Percent|Percentage|Progress|People|Users|Members|Days|Months|Years|Weeks|Records|Rows|Entries)$).*(?:amount|balance|price|cost|remaining|spent|earned|contribution|principal|salary|networth|payout|fee|total|value|mrr|arr|revenue|churn|conversion).*$/i])",
          message:
            'Client-side arithmetic on a money-named value is forbidden — the API must return the computed total/derived amount instead of the page deriving it. See NEXTJS-STRUCTURE-CONVENTIONS.md §8.',
        },
      ],
    },
  },
])
