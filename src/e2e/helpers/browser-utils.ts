/**
 * Cross-browser test utilities for Playwright E2E tests.
 *
 * Encapsulates browser-specific quirks so individual test files
 * can stay browser-agnostic.
 */
import type { Page, BrowserContext } from "@playwright/test";

/** Detected browser engine for the current Playwright project. */
export type BrowserEngine = "chromium" | "firefox" | "webkit";

/** Derive the browser engine from Playwright's browserName. */
export function getBrowserEngine(
  page: Page | BrowserContext,
): BrowserEngine {
  const ctx = "context" in page ? page.context() : page;
  const name = ctx.browser()?.browserType().name() ?? "chromium";
  if (name === "firefox") return "firefox";
  if (name === "webkit") return "webkit";
  return "chromium";
}

/**
 * Whether the current browser supports the Service Worker API.
 *
 * Firefox and Chromium support service workers in Playwright.
 * WebKit (Safari) has limited SW support in automation contexts —
 * `navigator.serviceWorker` may be undefined in headless mode.
 */
export function supportsServiceWorker(page: Page): boolean {
  const engine = getBrowserEngine(page);
  // WebKit in Playwright headless does not expose SW registration reliably
  return engine !== "webkit";
}

/**
 * Whether the current browser supports the Navigation Preload API.
 *
 * Only Chromium-based browsers support `navigationPreload`.
 * Firefox and WebKit do not.
 */
export function supportsNavigationPreload(page: Page): boolean {
  return getBrowserEngine(page) === "chromium";
}

/**
 * Wait for a service worker to be registered and activated.
 * Skips gracefully on browsers that don't support SW.
 *
 * Returns `true` if a SW was successfully activated, `false` otherwise.
 */
export async function waitForServiceWorker(
  page: Page,
  { timeout = 15_000 }: { timeout?: number } = {},
): Promise<boolean> {
  if (!supportsServiceWorker(page)) return false;

  try {
    return await page.evaluate(
      (ms) =>
        new Promise<boolean>((resolve) => {
          if (!("serviceWorker" in navigator)) {
            resolve(false);
            return;
          }
          const timer = setTimeout(() => resolve(false), ms);
          navigator.serviceWorker.ready.then(() => {
            clearTimeout(timer);
            resolve(true);
          });
        }),
      timeout,
    );
  } catch {
    return false;
  }
}
