import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'

export default defineConfig(
  { ignores: ['node_modules', 'test-results', 'playwright-report', 'blob-report', '.cache'] },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  { files: ['tests/**/*.ts'], ...playwright.configs['flat/recommended'] },
  { files: ['**/*.mjs'], ...tseslint.configs.disableTypeChecked },
)
