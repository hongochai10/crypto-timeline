/**
 * Visual regression testing — Playwright screenshot baselines
 *
 * Captures each of the 6 crypto stations at desktop (1280px), tablet (768px),
 * and mobile (375px) viewports. Also captures demo and attack panels in their
 * active states. Fails CI when pixel diff exceeds 0.5%.
 *
 * Baselines are stored in src/e2e/visual-regression.spec.ts-snapshots/
 * and committed to the repo. Update them with:
 *   npx playwright test src/e2e/visual-regression.spec.ts --update-snapshots
 *
 * To update baselines for a specific browser:
 *   npx playwright test src/e2e/visual-regression.spec.ts --update-snapshots --project=chromium
 *
 * On CI, use the "Update Visual Regression Baselines" workflow (Actions tab)
 * to regenerate baselines on ubuntu-latest (rendering differs per OS).
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

const SCREENSHOT_OPTS = {
  maxDiffPixelRatio: 0.005,
  animations: "disabled" as const,
  timeout: 10000,
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
  // Mobile emulation needs extra settle time for layout + paint
  await page.waitForTimeout(2500);
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

/** Activate station and disable animations in one step. */
async function prepareStation(
  page: import("@playwright/test").Page,
  stationId: string,
) {
  await activateStation(page, stationId);
  await disableAnimations(page);
  await page.waitForTimeout(300);
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
      await prepareStation(page, stationId);

      const station = page.locator(`#${stationId}`);
      await expect(station).toBeVisible({ timeout: 10000 });
      await expect(station).toHaveScreenshot(
        `station-${stationId}-desktop.png`,
        SCREENSHOT_OPTS,
      );
    });
  }
});

// ── Tablet (768×1024) ───────────────────────────────────────────────────────

test.describe("Visual Regression — Tablet (768×1024)", () => {
  test.use({
    viewport: { width: 768, height: 1024 },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await disableAnimations(page);
  });

  test("hero section", async ({ page }) => {
    await expect(page).toHaveScreenshot("hero-tablet.png", {
      maxDiffPixelRatio: 0.005,
      fullPage: false,
    });
  });

  for (const stationId of STATIONS) {
    test(`station: ${STATION_NAMES[stationId]}`, async ({ page }) => {
      await prepareStation(page, stationId);

      const station = page.locator(`#${stationId}`);
      await expect(station).toBeVisible({ timeout: 10000 });
      await expect(station).toHaveScreenshot(
        `station-${stationId}-tablet.png`,
        SCREENSHOT_OPTS,
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
      await prepareStation(page, stationId);

      const station = page.locator(`#${stationId}`);
      await expect(station).toBeVisible({ timeout: 10000 });
      await expect(station).toHaveScreenshot(
        `station-${stationId}-mobile.png`,
        SCREENSHOT_OPTS,
      );
    });
  }
});

// ── Demo Panels (Desktop — active state) ────────────────────────────────────

test.describe("Visual Regression — Demo Panels (1280×800)", () => {
  test.use({
    viewport: { width: 1280, height: 800 },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await disableAnimations(page);
  });

  test("Caesar demo — encrypt mode", async ({ page }) => {
    await prepareStation(page, "caesar");
    await page.locator('[data-testid="caesar-encrypt-btn"]').click();
    await page.locator('[data-testid="caesar-input"]').fill("HELLO WORLD");
    await page.waitForTimeout(300);
    await disableAnimations(page);

    const demo = page.locator(".demo-container").first();
    await expect(demo).toHaveScreenshot("demo-caesar-encrypt.png", SCREENSHOT_OPTS);
  });

  test("DES demo — encrypt mode", async ({ page }) => {
    await prepareStation(page, "des");
    await page.locator('[data-testid="des-encrypt-btn"]').click();
    await page.locator('[data-testid="des-input"]').fill("TestData");
    await page.locator('[data-testid="des-key"]').fill("SecrtKey");
    await page.locator('[data-testid="des-run-btn"]').click();
    await page.locator('[data-testid="des-output"]').waitFor({ state: "visible", timeout: 10000 });
    await disableAnimations(page);

    const demo = page.locator("#des .demo-container").first();
    await expect(demo).toHaveScreenshot("demo-des-encrypt.png", SCREENSHOT_OPTS);
  });

  test("AES demo — encrypt mode", async ({ page }) => {
    await prepareStation(page, "aes");
    await page.locator('[data-testid="aes-encrypt-btn"]').click();
    await page.locator('[data-testid="aes-passphrase"]').fill("mypassword");
    await page.locator('[data-testid="aes-plaintext"]').fill("Secret message");
    await page.locator('[data-testid="aes-encrypt-run-btn"]').click();
    await page.locator('[data-testid="aes-ciphertext"]').waitFor({ state: "visible", timeout: 10000 });
    await disableAnimations(page);

    const demo = page.locator("#aes .demo-container").first();
    await expect(demo).toHaveScreenshot("demo-aes-encrypt.png", {
      ...SCREENSHOT_OPTS,
      mask: [page.locator('[data-testid="aes-ciphertext"]')],
    });
  });

  test("RSA demo — key generation + encrypt", async ({ page }) => {
    await prepareStation(page, "rsa");
    await page.locator('[data-testid="rsa-generate-btn"]').click();
    await expect(page.locator("text=✓ Ready").first()).toBeVisible({ timeout: 30000 });
    await page.locator('[data-testid="rsa-message"]').fill("Hello RSA!");
    await page.locator('[data-testid="rsa-encrypt-btn"]').click();
    await page.locator('[data-testid="rsa-ciphertext"]').waitFor({ state: "visible", timeout: 10000 });
    await disableAnimations(page);

    const demo = page.locator("#rsa .demo-container").first();
    await expect(demo).toHaveScreenshot("demo-rsa-encrypt.png", {
      ...SCREENSHOT_OPTS,
      mask: [page.locator('[data-testid="rsa-ciphertext"]')],
    });
  });

  test("ECC demo — sign + verify", async ({ page }) => {
    await prepareStation(page, "ecc");
    await page.locator('[data-testid="ecc-generate-btn"]').click();
    await expect(page.locator("text=✓ Ready").first()).toBeVisible({ timeout: 30000 });
    await page.locator('[data-testid="ecc-message"]').fill("Sign this");
    await page.locator('[data-testid="ecc-sign-btn"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-testid="ecc-verify-btn"]').click();
    await page.locator('[data-testid="ecc-verify-result"]').waitFor({ state: "visible", timeout: 10000 });
    await disableAnimations(page);

    const demo = page.locator("#ecc .demo-container").first();
    await expect(demo).toHaveScreenshot("demo-ecc-signverify.png", {
      ...SCREENSHOT_OPTS,
      mask: [page.locator('[data-testid="ecc-verify-result"]')],
    });
  });

  test("PQC demo — encrypt + decrypt", async ({ page }) => {
    await prepareStation(page, "pqc");
    await page.locator('[data-testid="pqc-generate-btn"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-testid="pqc-bit-1-btn"]').click();
    await page.locator('[data-testid="pqc-encrypt-btn"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-testid="pqc-decrypt-btn"]').click();
    await page.locator('[data-testid="pqc-decrypt-result"]').waitFor({ state: "visible", timeout: 10000 });
    await disableAnimations(page);

    const demo = page.locator("#pqc .demo-container").first();
    await expect(demo).toHaveScreenshot("demo-pqc-encrypt.png", {
      ...SCREENSHOT_OPTS,
      mask: [page.locator('[data-testid="pqc-decrypt-result"]')],
    });
  });
});

// ── Attack Panels (Desktop — active state) ──────────────────────────────────

test.describe("Visual Regression — Attack Panels (1280×800)", () => {
  test.use({
    viewport: { width: 1280, height: 800 },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await disableAnimations(page);
  });

  for (const stationId of STATIONS) {
    test(`attack panel: ${STATION_NAMES[stationId]}`, async ({ page }) => {
      await prepareStation(page, stationId);

      // Attack panels are the second .demo-container in the station grid
      const attackPanel = page.locator(`#${stationId} .demo-container`).nth(1);
      const isVisible = await attackPanel.isVisible().catch(() => false);

      if (isVisible) {
        await expect(attackPanel).toHaveScreenshot(
          `attack-${stationId}-desktop.png`,
          SCREENSHOT_OPTS,
        );
      }
    });
  }
});
