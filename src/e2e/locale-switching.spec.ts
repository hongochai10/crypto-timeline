/**
 * E2E test suite — Locale switching (EN ↔ VI)
 *
 * Verifies that locale navigation works without transient error pages.
 */
import { test, expect } from "@playwright/test";

test.describe("Locale switching", () => {
  test("EN page loads correctly from direct navigation", async ({ page }) => {
    const response = await page.goto("/en");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Crypto Timeline/i);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("VI page loads correctly from direct navigation", async ({ page }) => {
    const response = await page.goto("/vi");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Crypto Timeline/i);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("switches from EN to VI without error page", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Click the VI button in the language switcher
    const viButton = page.locator('button[aria-pressed="false"]', {
      hasText: "vi",
    });
    await viButton.click();

    // Wait for locale to change — page should transition smoothly
    await expect(page.locator("html")).toHaveAttribute("lang", "vi", {
      timeout: 10000,
    });

    // Verify no error boundary is visible
    await expect(
      page.locator("text=Something went wrong")
    ).not.toBeVisible();

    // Verify the timeline is still rendered
    await expect(page.locator('[data-testid="timeline"]')).toBeVisible();
  });

  test("switches from VI to EN without error page", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");

    // Click the EN button in the language switcher
    const enButton = page.locator('button[aria-pressed="false"]', {
      hasText: "en",
    });
    await enButton.click();

    // Wait for locale to change
    await expect(page.locator("html")).toHaveAttribute("lang", "en", {
      timeout: 10000,
    });

    // Verify no error boundary is visible
    await expect(
      page.locator("text=Something went wrong")
    ).not.toBeVisible();

    // Verify the timeline is still rendered
    await expect(page.locator('[data-testid="timeline"]')).toBeVisible();
  });

  test("rapid locale switching does not break the page", async ({ page }) => {
    await page.goto("/en");

    // Switch back and forth quickly
    for (let i = 0; i < 3; i++) {
      const switchButton = page.locator('button[aria-pressed="false"]').first();
      await switchButton.click();
      // Brief wait between clicks to allow transition to start
      await page.waitForTimeout(300);
    }

    // After rapid switching, page should still be functional
    await expect(
      page.locator("text=Something went wrong")
    ).not.toBeVisible();
    await expect(page.locator('[data-testid="timeline"]')).toBeVisible({
      timeout: 10000,
    });
  });

  test("language switcher shows correct active state", async ({ page }) => {
    await page.goto("/en");

    // EN button should be active
    const enButton = page.locator('button', { hasText: "en" });
    await expect(enButton).toHaveAttribute("aria-pressed", "true");

    // VI button should be inactive
    const viButton = page.locator('button', { hasText: "vi" });
    await expect(viButton).toHaveAttribute("aria-pressed", "false");
  });

  test("root URL redirects to default locale", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    // Should end up at /en (default locale)
    await expect(page).toHaveURL(/\/en/);
  });
});
