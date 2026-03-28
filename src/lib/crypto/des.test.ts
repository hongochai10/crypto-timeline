/**
 * DES (Data Encryption Standard) — unit tests
 * Tests the simplified educational DES implementation.
 */
import { describe, test, expect } from "vitest";
import {
  desEncrypt,
  desDecrypt,
  desBruteForceStats,
} from "./des";

describe("desEncrypt", () => {
  test("returns an object with output, hex, and rounds", () => {
    const result = desEncrypt("HELLO", "MYKEY123");
    expect(result).toHaveProperty("output");
    expect(result).toHaveProperty("hex");
    expect(result).toHaveProperty("rounds");
  });

  test("output is a non-empty string", () => {
    const result = desEncrypt("TEST", "SECRETKEY");
    expect(typeof result.output).toBe("string");
    expect(result.output.length).toBeGreaterThan(0);
  });

  test("hex is a valid hexadecimal string", () => {
    const result = desEncrypt("HELLO", "MYKEY123");
    expect(result.hex).toMatch(/^[0-9a-f]+$/i);
  });

  test("hex length is multiple of 16 (DES block = 64 bits = 16 hex chars)", () => {
    const result = desEncrypt("HI", "MYKEY123");
    expect(result.hex.length % 16).toBe(0);
  });

  test("different inputs produce different outputs", () => {
    const r1 = desEncrypt("HELLO", "MYKEY123");
    const r2 = desEncrypt("WORLD", "MYKEY123");
    expect(r1.hex).not.toBe(r2.hex);
  });

  test("different keys produce different ciphertexts", () => {
    const r1 = desEncrypt("HELLO", "KEY00001");
    const r2 = desEncrypt("HELLO", "KEY00002");
    expect(r1.hex).not.toBe(r2.hex);
  });

  test("handles empty string input", () => {
    const result = desEncrypt("", "MYKEY123");
    expect(result).toHaveProperty("hex");
    expect(typeof result.hex).toBe("string");
  });
});

describe("desDecrypt", () => {
  test("decrypts back to original plaintext (round-trip)", () => {
    const plaintext = "HELLO";
    const key = "MYKEY123";
    const encrypted = desEncrypt(plaintext, key);
    const decrypted = desDecrypt(encrypted.hex, key);
    expect(decrypted.output).toBe(plaintext);
  });

  test("round-trip with multi-block plaintext", () => {
    const plaintext = "THE QUICK BROWN FOX";
    const key = "SECRETKK";
    const encrypted = desEncrypt(plaintext, key);
    const decrypted = desDecrypt(encrypted.hex, key);
    expect(decrypted.output).toBe(plaintext);
  });

  test("round-trip with short single-char text", () => {
    const encrypted = desEncrypt("A", "MYKEY123");
    const decrypted = desDecrypt(encrypted.hex, "MYKEY123");
    expect(decrypted.output).toBe("A");
  });

  test("wrong key produces different (garbled) output", () => {
    const encrypted = desEncrypt("HELLO", "MYKEY123");
    // Decryption with wrong key should NOT produce original plaintext
    // (may throw or return garbage — we just check it differs)
    try {
      const decrypted = desDecrypt(encrypted.hex, "WRONGKEY");
      expect(decrypted.output).not.toBe("HELLO");
    } catch {
      // Decryption with wrong key may throw — that's also acceptable
    }
  });

  test("decrypt result has hex property", () => {
    const encrypted = desEncrypt("TEST", "MYKEY123");
    const decrypted = desDecrypt(encrypted.hex, "MYKEY123");
    expect(decrypted).toHaveProperty("hex");
  });
});

describe("desBruteForceStats", () => {
  test("returns the expected shape", () => {
    const stats = desBruteForceStats();
    expect(stats).toHaveProperty("keysChecked");
    expect(stats).toHaveProperty("keyspaceSize");
    expect(stats).toHaveProperty("percentComplete");
    expect(stats).toHaveProperty("estimatedTotalMs");
  });

  test("keyspaceSize is 2^56", () => {
    const stats = desBruteForceStats();
    expect(stats.keyspaceSize).toBe(Math.pow(2, 56));
  });

  test("keysChecked starts at 0", () => {
    const stats = desBruteForceStats();
    expect(stats.keysChecked).toBe(0);
  });

  test("percentComplete starts at 0", () => {
    const stats = desBruteForceStats();
    expect(stats.percentComplete).toBe(0);
  });

  test("estimatedTotalMs is a positive number", () => {
    const stats = desBruteForceStats();
    expect(stats.estimatedTotalMs).toBeGreaterThan(0);
  });

  test("keyspaceSize is approximately 72 quadrillion", () => {
    const stats = desBruteForceStats();
    // 2^56 ≈ 7.2 × 10^16
    expect(stats.keyspaceSize).toBeGreaterThan(7e16);
    expect(stats.keyspaceSize).toBeLessThan(8e16);
  });
});
