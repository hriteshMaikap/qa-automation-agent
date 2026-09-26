import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4010',
    headless: true,
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
});