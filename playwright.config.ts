import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    browserName: 'firefox',
    headless: true,
  },
  testMatch: 'tests/e2e/**/*.spec.ts',
};

export default config;
