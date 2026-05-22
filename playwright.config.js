const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:1337',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run start:e2e',
    url: 'http://127.0.0.1:1337',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
