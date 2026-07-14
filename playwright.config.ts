import { defineConfig } from "@playwright/test";

/**
 * Playwright config for dj-cremosa.
 *
 * The dev server is started automatically by Playwright before the test
 * run. We use `npm run build` + `npx serve out` for the smoke test
 * (production-like behaviour) and fall back to `npm run dev` when the
 * build output isn't available.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    // We assume the user already has `npm run dev` running. If not,
    // Playwright will start one. The reuseExistingServer flag avoids
    // fighting with a dev server the developer is running.
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
