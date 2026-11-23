import { defineConfig, devices } from '@playwright/test'
import { env } from './src/config/env'

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ...(process.env.CI ? [['github'] as const] : []),
  ],
  use: {
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testDir: 'tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: env.UI_BASE_URL },
    },
    {
      name: 'firefox',
      testDir: 'tests/ui',
      use: { ...devices['Desktop Firefox'], baseURL: env.UI_BASE_URL },
    },
    {
      name: 'webkit',
      testDir: 'tests/ui',
      use: { ...devices['Desktop Safari'], baseURL: env.UI_BASE_URL },
    },
    {
      name: 'api',
      testDir: 'tests/api',
      use: { baseURL: env.API_BASE_URL },
    },
  ],
})
