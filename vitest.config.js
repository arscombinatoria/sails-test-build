const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [['test/dashboard.view.test.js', 'jsdom']],
    coverage: {
      provider: 'v8',
      reporter: ['json-summary'],
    },
  },
});
