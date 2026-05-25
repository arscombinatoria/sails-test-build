const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    include: ["test/**/*.test.js"],
    exclude: ["e2e/**", "node_modules/**"],
    environment: "node",
    environmentMatchGlobs: [["test/dashboard.view.test.js", "jsdom"]],
    coverage: {
      provider: "v8",
      reporter: ["json-summary"],
    },
  },
});
