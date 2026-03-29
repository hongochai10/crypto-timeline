/**
 * E2E tests for keyboard navigation between timeline stations.
 *
 * Verifies Arrow key traversal, Home/End, Escape, focus indicators,
 * and screen reader live region announcements.
 */
import { test, expect } from "@playwright/test";

const STATIONS = ["caesar", "des", "aes", "rsa", "ecc", "pqc"] as const;

/** Scroll past the hero so keyboard navigation is active within the timeline. */
async function scrollPastHero(page: import("@playwright/test").Page) {
  const timelineStart = page.locator("#timeline-start");
  await timelineStart.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
}

test.describe("Keyboard navigation — timeline stations", () => {
  test.use({ reducedMotion: "reduce" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await scrollPastHero(page);
  });

  test("ArrowDown navigates to next station", async ({ page }) => {
    // Focus the first station
    await page.locator(`#${STATIONS[0]}`).focus();
    await page.waitForTimeout(300);

    // Press ArrowDown to move to DES
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(800);

    const desStation = page.locator(`#${STATIONS[1]}`);
    await expect(desStation).toBeFocused();
  });

  test("ArrowUp navigates to previous station", async ({ page }) => {
    // Start at DES by pressing ArrowDown from Caesar
    await page.locator(`#${STATIONS[0]}`).focus();
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(800);

    // Press ArrowUp to go back to Caesar
    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(800);

    const caesarStation = page.locator(`#${STATIONS[0]}`);
    await expect(caesarStation).toBeFocused();
  });

  test("Home key jumps to first station", async ({ page }) => {
    // Navigate to a middle station first
    await page.locator(`#${STATIONS[0]}`).focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(800);

    // Press Home to jump to first station
    await page.keyboard.press("Home");
    await page.waitForTimeout(800);

    const caesarStation = page.locator(`#${STATIONS[0]}`);
    await expect(caesarStation).toBeFocused();
  });

  test("End key jumps to last station", async ({ page }) => {
    await page.locator(`#${STATIONS[0]}`).focus();
    await page.waitForTimeout(300);

    // Press End to jump to PQC
    await page.keyboard.press("End");
    await page.waitForTimeout(800);

    const pqcStation = page.locator(`#${STATIONS[5]}`);
    await expect(pqcStation).toBeFocused();
  });

  test("Escape blurs the focused station", async ({ page }) => {
    await page.locator(`#${STATIONS[0]}`).focus();
    await page.waitForTimeout(300);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // No station should be focused
    const activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeTag).toBe("BODY");
  });

  test("ArrowDown does not go past last station", async ({ page }) => {
    await page.locator(`#${STATIONS[0]}`).focus();

    // Press End to reach last, then try ArrowDown
    await page.keyboard.press("End");
    await page.waitForTimeout(800);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(800);

    // Should still be on PQC
    const pqcStation = page.locator(`#${STATIONS[5]}`);
    await expect(pqcStation).toBeFocused();
  });

  test("ArrowUp does not go before first station", async ({ page }) => {
    await page.locator(`#${STATIONS[0]}`).focus();
    await page.waitForTimeout(300);

    // Already at first station, try ArrowUp
    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(800);

    const caesarStation = page.locator(`#${STATIONS[0]}`);
    await expect(caesarStation).toBeFocused();
  });

  test("station sections have tabIndex for focusability", async ({ page }) => {
    for (const stationId of STATIONS) {
      const station = page.locator(`#${stationId}`);
      const tabIndex = await station.getAttribute("tabindex");
      expect(tabIndex).toBe("-1");
    }
  });

  test("live region exists for screen reader announcements", async ({ page }) => {
    const liveRegion = page.locator("[aria-live='polite'][role='status']").first();
    await expect(liveRegion).toBeAttached();
  });

  test("stations have aria-roledescription", async ({ page }) => {
    for (const stationId of STATIONS) {
      const station = page.locator(`#${stationId}`);
      const roleDesc = await station.getAttribute("aria-roledescription");
      expect(roleDesc).toBeTruthy();
    }
  });

  test("full traversal: navigate all 6 stations with ArrowDown", async ({ page }) => {
    await page.locator(`#${STATIONS[0]}`).focus();
    await page.waitForTimeout(300);

    for (let i = 1; i < STATIONS.length; i++) {
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(1000);

      const station = page.locator(`#${STATIONS[i]}`);
      await expect(station).toBeFocused();
    }
  });
});
