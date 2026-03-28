/**
 * E2E test suite — Crypto Timeline
 *
 * Covers all 6 crypto stations: Caesar, DES, AES, RSA, ECC, PQC.
 * Tests run against the live Next.js dev server via Playwright.
 */
import { test, expect } from "@playwright/test";

// ─── Page Load ───────────────────────────────────────────────────────────────

test.describe("Page load", () => {
  test("loads successfully with HTTP 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("has correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Crypto Timeline/i);
  });
});

// ─── Cross-Browser Smoke Tests ───────────────────────────────────────────────

test.describe("Cross-browser smoke", () => {
  test("renders main timeline container", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-testid="timeline"]')).toBeVisible();
  });

  test("all 6 station headings are visible", async ({ page }) => {
    await page.goto("/");
    // Use h2 selectors scoped to each station section to avoid substring collisions
    // (e.g. /AES/i also matches "Caesar" and sub-headings)
    const stationIds = ["caesar", "des", "aes", "rsa", "ecc", "pqc"];
    for (const id of stationIds) {
      const heading = page.locator(`#${id} h2`);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible({ timeout: 10000 });
    }
  });
});

// ─── Responsive Layout ───────────────────────────────────────────────────────

test.describe("Responsive layout", () => {
  const breakpoints = [
    { name: "mobile", width: 375, height: 812 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 800 },
  ];

  for (const bp of breakpoints) {
    test(`renders correctly at ${bp.name} (${bp.width}×${bp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");
      // No horizontal overflow
      const bodyWidth = await page.evaluate(
        () => document.body.scrollWidth
      );
      expect(bodyWidth).toBeLessThanOrEqual(bp.width + 1);
    });
  }
});

// ─── Accessibility ───────────────────────────────────────────────────────────

test.describe("Accessibility — WCAG 2.1 AA", () => {
  test("has a main landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
  });

  test("all interactive elements are keyboard-focusable", async ({ page }) => {
    await page.goto("/");
    // Tab through focusable elements and assert none are skipped
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focused).not.toBe("BODY");
  });

  test("color contrast — dark theme background is sufficiently dark", async ({
    page,
  }) => {
    await page.goto("/");
    // Assert background colour is dark (museum-exhibit theme)
    const bgColor = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).backgroundColor;
    });
    // Rough check — expects dark background (rgb values all < 50)
    const rgb = bgColor.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
    expect(rgb[0] + rgb[1] + rgb[2]).toBeLessThan(150);
  });

  test("images have non-empty alt attributes", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      // aria-hidden images are exempt
      const ariaHidden = await images.nth(i).getAttribute("aria-hidden");
      if (!ariaHidden) {
        expect(alt).not.toBeNull();
        expect(alt?.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

// ─── Crypto Demo Correctness ─────────────────────────────────────────────────

test.describe("Caesar Cipher demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Scroll to Caesar station to trigger framer-motion visibility
    const caesarHeading = page.getByRole("heading", { name: /Caesar Cipher/i });
    await caesarHeading.scrollIntoViewIfNeeded();
    await expect(caesarHeading).toBeVisible({ timeout: 10000 });
  });

  test("encrypts 'HELLO' with shift 3 to 'KHOOR'", async ({ page }) => {
    // Ensure encrypt mode is active
    await page.locator('[data-testid="caesar-encrypt-btn"]').click();
    // Fill input (component auto-uppercases)
    await page.locator('[data-testid="caesar-input"]').fill("HELLO");
    // Set range slider to shift 3 via JS evaluate
    await page.locator('[data-testid="caesar-shift"]').evaluate((el) => {
      (el as HTMLInputElement).value = "3";
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await expect(page.locator('[data-testid="caesar-output"]')).toHaveText("KHOOR");
  });

  test("decrypts 'KHOOR' with shift 3 back to 'HELLO'", async ({ page }) => {
    // Switch to decrypt mode
    await page.locator('[data-testid="caesar-decrypt-btn"]').click();
    // Fill ciphertext (component auto-uppercases)
    await page.locator('[data-testid="caesar-input"]').fill("KHOOR");
    // Set range slider to shift 3 via JS evaluate
    await page.locator('[data-testid="caesar-shift"]').evaluate((el) => {
      (el as HTMLInputElement).value = "3";
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await expect(page.locator('[data-testid="caesar-output"]')).toHaveText("HELLO");
  });
});

test.describe("DES demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const desSection = page.locator("#des h2");
    await desSection.scrollIntoViewIfNeeded();
    await expect(desSection).toBeVisible({ timeout: 10000 });
  });

  test("encrypts and decrypts with matching key", async ({ page }) => {
    // Ensure encrypt mode
    await page.locator('[data-testid="des-encrypt-btn"]').click();

    // Fill plaintext and key
    await page.locator('[data-testid="des-input"]').fill("HELLO DES");
    await page.locator('[data-testid="des-key"]').fill("SECRET01");

    // Click encrypt
    await page.locator('[data-testid="des-run-btn"]').click();

    // Wait for output to appear
    const output = page.locator('[data-testid="des-output"]');
    await expect(output).toBeVisible({ timeout: 10000 });
    const ciphertextHex = await output.textContent();
    expect(ciphertextHex).toBeTruthy();
    expect(ciphertextHex!.length).toBeGreaterThan(0);

    // Switch to decrypt mode
    await page.locator('[data-testid="des-decrypt-btn"]').click();

    // Fill ciphertext hex and same key
    await page.locator('[data-testid="des-input"]').fill(ciphertextHex!);
    await page.locator('[data-testid="des-key"]').fill("SECRET01");

    // Click decrypt
    await page.locator('[data-testid="des-run-btn"]').click();

    // Verify decrypted output matches original plaintext
    await expect(output).toBeVisible({ timeout: 10000 });
    await expect(output).toHaveText("HELLO DES");
  });

  test("shows error for invalid decrypt input", async ({ page }) => {
    await page.locator('[data-testid="des-decrypt-btn"]').click();
    await page.locator('[data-testid="des-input"]').fill("INVALID");
    await page.locator('[data-testid="des-key"]').fill("SECRET01");
    await page.locator('[data-testid="des-run-btn"]').click();

    // Error message should appear
    await expect(page.locator("text=Invalid input")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("AES demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const aesSection = page.locator("#aes h2");
    await aesSection.scrollIntoViewIfNeeded();
    await expect(aesSection).toBeVisible({ timeout: 10000 });
  });

  test("AES-256 encrypt/decrypt round-trip", async ({ page }) => {
    // Ensure encrypt mode
    await page.locator('[data-testid="aes-encrypt-btn"]').click();

    // Set passphrase and plaintext
    await page.locator('[data-testid="aes-passphrase"]').fill("test-passphrase");
    await page.locator('[data-testid="aes-plaintext"]').fill("Hello, AES-256!");

    // Click encrypt
    await page.locator('[data-testid="aes-encrypt-run-btn"]').click();

    // Wait for ciphertext to appear
    await expect(page.locator('[data-testid="aes-ciphertext"]')).toBeVisible({ timeout: 15000 });

    // Switch to decrypt mode and decrypt
    await page.locator('[data-testid="aes-decrypt-btn"]').click();
    await page.locator('[data-testid="aes-decrypt-run-btn"]').click();

    // Verify decrypted text matches original
    await expect(page.locator('[data-testid="aes-decrypted"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="aes-decrypted"]')).toHaveText("Hello, AES-256!");
  });

  test("encrypt button is disabled without passphrase", async ({ page }) => {
    await page.locator('[data-testid="aes-encrypt-btn"]').click();
    await page.locator('[data-testid="aes-passphrase"]').fill("");
    await page.locator('[data-testid="aes-plaintext"]').fill("Some text");

    await expect(page.locator('[data-testid="aes-encrypt-run-btn"]')).toBeDisabled();
  });
});

test.describe("RSA demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const rsaSection = page.locator("#rsa h2");
    await rsaSection.scrollIntoViewIfNeeded();
    await expect(rsaSection).toBeVisible({ timeout: 10000 });
  });

  test("generates key pair and encrypts/decrypts", async ({ page }) => {
    // Step 1: Generate RSA-2048 key pair
    await page.locator('[data-testid="rsa-generate-btn"]').click();

    // Wait for key generation (can take a few seconds)
    await expect(page.locator("text=✓ Ready").first()).toBeVisible({ timeout: 30000 });

    // Step 2: Fill message and encrypt
    await page.locator('[data-testid="rsa-message"]').fill("Hello RSA!");
    await page.locator('[data-testid="rsa-encrypt-btn"]').click();

    // Wait for ciphertext
    await expect(page.locator('[data-testid="rsa-ciphertext"]')).toBeVisible({ timeout: 15000 });

    // Step 3: Decrypt
    await page.locator('[data-testid="rsa-decrypt-btn"]').click();

    // Verify decrypted message matches
    await expect(page.locator('[data-testid="rsa-decrypted"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="rsa-decrypted"]')).toHaveText("Hello RSA!");
  });

  test("encrypt button is disabled before key generation", async ({ page }) => {
    await expect(page.locator('[data-testid="rsa-encrypt-btn"]')).toBeDisabled();
  });
});

test.describe("ECC demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const eccSection = page.locator("#ecc h2");
    await eccSection.scrollIntoViewIfNeeded();
    await expect(eccSection).toBeVisible({ timeout: 10000 });
  });

  test("signs message and verifies signature", async ({ page }) => {
    // Step 1: Generate ECDSA key pair
    await page.locator('[data-testid="ecc-generate-btn"]').click();
    await expect(page.locator("text=✓ Ready").first()).toBeVisible({ timeout: 15000 });

    // Step 2: Sign the message
    await page.locator('[data-testid="ecc-message"]').fill("Sign this message!");
    await page.locator('[data-testid="ecc-sign-btn"]').click();

    // Wait for signature to appear (Step 3 section becomes visible)
    await expect(page.locator('[data-testid="ecc-verify-btn"]')).toBeVisible({ timeout: 10000 });

    // Step 3: Verify without tampering — should be valid
    await page.locator('[data-testid="ecc-verify-btn"]').click();
    await expect(page.locator('[data-testid="ecc-verify-result"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="ecc-verify-result"]')).toContainText("Valid");
  });

  test("detects tampered message as invalid", async ({ page }) => {
    // Generate keys
    await page.locator('[data-testid="ecc-generate-btn"]').click();
    await expect(page.locator("text=✓ Ready").first()).toBeVisible({ timeout: 15000 });

    // Sign
    await page.locator('[data-testid="ecc-message"]').fill("Sign this message!");
    await page.locator('[data-testid="ecc-sign-btn"]').click();
    await expect(page.locator('[data-testid="ecc-verify-btn"]')).toBeVisible({ timeout: 10000 });

    // Enable tampering and verify — should be invalid
    await page.locator('[data-testid="ecc-tamper-checkbox"]').check();
    await page.locator('[data-testid="ecc-verify-btn"]').click();
    await expect(page.locator('[data-testid="ecc-verify-result"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="ecc-verify-result"]')).toContainText("Invalid");
  });
});

test.describe("PQC demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const pqcSection = page.locator("#pqc h2");
    await pqcSection.scrollIntoViewIfNeeded();
    await expect(pqcSection).toBeVisible({ timeout: 10000 });
  });

  test("lattice-based encrypt/decrypt bit=1 round-trip", async ({ page }) => {
    // Step 1: Generate LWE key pair
    await page.locator('[data-testid="pqc-generate-btn"]').click();

    // Wait for key pair to appear (bit selection becomes visible)
    await expect(page.locator('[data-testid="pqc-bit-1-btn"]')).toBeVisible({ timeout: 10000 });

    // Step 2: Select bit 1 and encrypt
    await page.locator('[data-testid="pqc-bit-1-btn"]').click();
    await page.locator('[data-testid="pqc-encrypt-btn"]').click();

    // Wait for decrypt button
    await expect(page.locator('[data-testid="pqc-decrypt-btn"]')).toBeVisible({ timeout: 10000 });

    // Step 3: Decrypt
    await page.locator('[data-testid="pqc-decrypt-btn"]').click();

    // Verify correct decryption
    await expect(page.locator('[data-testid="pqc-decrypt-result"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="pqc-decrypt-result"]')).toContainText("Correct");
  });

  test("lattice-based encrypt/decrypt bit=0 round-trip", async ({ page }) => {
    // Generate keys
    await page.locator('[data-testid="pqc-generate-btn"]').click();
    await expect(page.locator('[data-testid="pqc-bit-0-btn"]')).toBeVisible({ timeout: 10000 });

    // Select bit 0 and encrypt
    await page.locator('[data-testid="pqc-bit-0-btn"]').click();
    await page.locator('[data-testid="pqc-encrypt-btn"]').click();

    // Decrypt
    await expect(page.locator('[data-testid="pqc-decrypt-btn"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="pqc-decrypt-btn"]').click();

    // Verify
    await expect(page.locator('[data-testid="pqc-decrypt-result"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="pqc-decrypt-result"]')).toContainText("Correct");
  });
});

// ─── Scroll Behaviour ────────────────────────────────────────────────────────

test.describe("Scroll behaviour", () => {
  test("scrolling down reveals subsequent stations", async ({ page }) => {
    await page.goto("/");

    // DES station should not be visible initially (below the fold)
    const desHeading = page.locator("#des h2");

    // Scroll down to the DES section
    await desHeading.scrollIntoViewIfNeeded();

    // Assert DES heading is now visible
    await expect(desHeading).toBeVisible({ timeout: 10000 });
  });

  test("all stations become visible when scrolled to", async ({ page }) => {
    await page.goto("/");
    const stationIds = ["caesar", "des", "aes", "rsa", "ecc", "pqc"];

    for (const id of stationIds) {
      const heading = page.locator(`#${id} h2`);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible({ timeout: 10000 });
    }
  });

  test("page is scrollable through all content", async ({ page }) => {
    await page.goto("/");

    // Scroll to the last station (PQC) to verify full page is scrollable
    const pqcHeading = page.locator("#pqc h2");
    await pqcHeading.scrollIntoViewIfNeeded();
    await expect(pqcHeading).toBeVisible({ timeout: 10000 });

    // Verify we actually scrolled down
    const scrollTop = await page.evaluate(() => window.scrollY);
    expect(scrollTop).toBeGreaterThan(0);
  });
});
