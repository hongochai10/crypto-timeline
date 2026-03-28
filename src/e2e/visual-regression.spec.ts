/**
 * Visual regression testing — Playwright screenshot baselines
 *
 * Captures each of the 6 crypto stations at desktop (1280px) and
 * mobile (375px) viewports. Fails CI when pixel diff exceeds 0.5%.
 *
 * Baselines are stored in src/e2e/visual-regression.spec.ts-snapshots/
 * and committed to the repo. Update them with:
 *   npx playwright test src/e2e/visual-regression.spec.ts --update-snapshots
 */
import { test, expect } from "@playwright/test";

const STATIONS = ["caesar", "des", "aes", "rsa", "ecc", "pqc"] as const;

const STATION_NAMES: Record<(typeof STATIONS)[number], string> = {
  caesar: "Caesar Cipher",
  des: "DES",
  aes: "AES",
  rsa: "RSA",
  ecc: "ECC",
  pqc: "Post-Quantum",
};

/** Scroll a station to viewport center so isInView triggers, then wait for animations. */
async function activateStation(
  page: import("@playwright/test").Page,
  stationId: string,
) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const elementCenter = window.scrollY + rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      window.scrollTo({
        top: elementCenter - viewportCenter,
        behavior: "instant",
      });
    }
  }, stationId);
  // Wait for IntersectionObserver (-25% margin) + framer-motion animations
  await page.waitForTimeout(1500);
}

/** Disable CSS animations/transitions for deterministic screenshots. */
async function disableAnimations(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
}

// ── Desktop (1280×800) ──────────────────────────────────────────────────────

test.describe("Visual Regression — Desktop (1280×800)", () => {
  test.use({
    viewport: { width: 1280, height: 800 },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await disableAnimations(page);
  });

  test("hero section", async ({ page }) => {
    await expect(page).toHaveScreenshot("hero-desktop.png", {
      maxDiffPixelRatio: 0.005,
      fullPage: false,
    });
  });

  for (const stationId of STATIONS) {
    test(`station: ${STATION_NAMES[stationId]}`, async ({ page }) => {
      await activateStation(page, stationId);
      // Disable animations again after scroll triggers new ones
      await disableAnimations(page);
      await page.waitForTimeout(300);

      const station = page.locator(`#${stationId}`);
      await expect(station).toBeVisible({ timeout: 10000 });
      await expect(station).toHaveScreenshot(
        `station-${stationId}-desktop.png`,
        {
          maxDiffPixelRatio: 0.005,
          animations: "disabled",
        },
      );
    });
  }
});

// ── Mobile (375×812) ────────────────────────────────────────────────────────

test.describe("Visual Regression — Mobile (375×812)", () => {
  test.use({
    viewport: { width: 375, height: 812 },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await disableAnimations(page);
  });

  test("hero section", async ({ page }) => {
    await expect(page).toHaveScreenshot("hero-mobile.png", {
      maxDiffPixelRatio: 0.005,
      fullPage: false,
    });
  });

  for (const stationId of STATIONS) {
    test(`station: ${STATION_NAMES[stationId]}`, async ({ page }) => {
      await activateStation(page, stationId);
      await disableAnimations(page);
      await page.waitForTimeout(300);

      const station = page.locator(`#${stationId}`);
      await expect(station).toBeVisible({ timeout: 10000 });
      await expect(station).toHaveScreenshot(
        `station-${stationId}-mobile.png`,
        {
          maxDiffPixelRatio: 0.005,
          animations: "disabled",
        },
      );
    });
  }
});
