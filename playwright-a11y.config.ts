import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/a11y",
  timeout: 30_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:3333",
    channel: "chrome",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "pnpm dev",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://localhost:3333"
  }
});
