import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration for Crypto Timeline.
 * Targets WCAG 2.1 AA, cross-browser, and responsive breakpoints.
 */
export default defineConfig({
  testDir: "./src/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* Visual regression snapshot settings */
  snapshotPathTemplate:
    "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}",
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.005,
      animations: "disabled",
    },
  },

  projects: [
    // ── Desktop browsers ────────────────────────────────────────────────────
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // ── Mobile viewports ────────────────────────────────────────────────────
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      expect: {
        toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
      },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },
    // ── Tablet ──────────────────────────────────────────────────────────────
    {
      name: "tablet",
      use: { ...devices["iPad (gen 7)"] },
    },
  ],

  // In CI with a pre-built artifact, use `next start` (faster).
  // Locally or without a build, fall back to `next dev`.
  webServer: {
    command: process.env.CI_USE_BUILD ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
