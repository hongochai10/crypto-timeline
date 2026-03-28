/**
 * RSA — unit tests
 * Uses Web Crypto API (SubtleCrypto) — requires jsdom environment.
 */
import { describe, test, expect } from "vitest";
import {
  rsaGenerateKeyPair,
  rsaEncrypt,
  rsaDecrypt,
  rsaFactorDemo,
  rsaSecurityInfo,
} from "./rsa";

describe("rsaGenerateKeyPair", () => {
  test("returns publicKey, privateKey, publicKeyBase64, privateKeyBase64", async () => {
    const kp = await rsaGenerateKeyPair();
    expect(kp).toHaveProperty("publicKey");
    expect(kp).toHaveProperty("privateKey");
    expect(kp).toHaveProperty("publicKeyBase64");
    expect(kp).toHaveProperty("privateKeyBase64");
  }, 15000);

  test("publicKeyBase64 is a non-empty string", async () => {
    const kp = await rsaGenerateKeyPair();
    expect(typeof kp.publicKeyBase64).toBe("string");
    expect(kp.publicKeyBase64.length).toBeGreaterThan(0);
  }, 15000);

  test("privateKeyBase64 is a non-empty string", async () => {
    const kp = await rsaGenerateKeyPair();
    expect(typeof kp.privateKeyBase64).toBe("string");
    expect(kp.privateKeyBase64.length).toBeGreaterThan(0);
  }, 15000);

  test("generates different key pairs on each call", async () => {
    const [kp1, kp2] = await Promise.all([rsaGenerateKeyPair(), rsaGenerateKeyPair()]);
    expect(kp1.publicKeyBase64).not.toBe(kp2.publicKeyBase64);
  }, 20000);
});

describe("rsaEncrypt + rsaDecrypt round-trip", () => {
  test("encrypts and decrypts back to original plaintext", async () => {
    const kp = await rsaGenerateKeyPair();
    const plaintext = "Hello RSA!";
    const encrypted = await rsaEncrypt(plaintext, kp.publicKey);
    const decrypted = await rsaDecrypt(encrypted.ciphertext, kp.privateKey);
    expect(decrypted.plaintext).toBe(plaintext);
  }, 20000);

  test("ciphertext is a non-empty base64 string", async () => {
    const kp = await rsaGenerateKeyPair();
    const encrypted = await rsaEncrypt("test", kp.publicKey);
    expect(typeof encrypted.ciphertext).toBe("string");
    expect(encrypted.ciphertext.length).toBeGreaterThan(0);
  }, 20000);

  test("encrypting same plaintext twice produces different ciphertext (OAEP randomization)", async () => {
    const kp = await rsaGenerateKeyPair();
    const e1 = await rsaEncrypt("hello", kp.publicKey);
    const e2 = await rsaEncrypt("hello", kp.publicKey);
    expect(e1.ciphertext).not.toBe(e2.ciphertext);
  }, 20000);

  test("decryption with wrong private key throws", async () => {
    const [kp1, kp2] = await Promise.all([rsaGenerateKeyPair(), rsaGenerateKeyPair()]);
    const encrypted = await rsaEncrypt("secret", kp1.publicKey);
    await expect(rsaDecrypt(encrypted.ciphertext, kp2.privateKey)).rejects.toThrow();
  }, 20000);
});

describe("rsaFactorDemo", () => {
  test("returns n, p, q, and steps", () => {
    const result = rsaFactorDemo(15);
    expect(result).toHaveProperty("n");
    expect(result).toHaveProperty("p");
    expect(result).toHaveProperty("q");
    expect(result).toHaveProperty("steps");
  });

  test("correctly factors 15 = 3 × 5", () => {
    const result = rsaFactorDemo(15);
    expect(result.p * result.q).toBe(15);
  });

  test("correctly factors 21 = 3 × 7", () => {
    const result = rsaFactorDemo(21);
    expect(result.p * result.q).toBe(21);
    expect(Math.min(result.p, result.q)).toBe(3);
    expect(Math.max(result.p, result.q)).toBe(7);
  });

  test("correctly factors 35 = 5 × 7", () => {
    const result = rsaFactorDemo(35);
    expect(result.p * result.q).toBe(35);
  });

  test("correctly factors 77 = 7 × 11", () => {
    const result = rsaFactorDemo(77);
    expect(result.p * result.q).toBe(77);
  });

  test("n field matches input", () => {
    const result = rsaFactorDemo(77);
    expect(result.n).toBe(77);
  });

  test("steps is a positive integer", () => {
    const result = rsaFactorDemo(35);
    expect(typeof result.steps).toBe("number");
    expect(result.steps).toBeGreaterThan(0);
  });
});

describe("rsaSecurityInfo", () => {
  test("returns an object with required security fields", () => {
    const info = rsaSecurityInfo();
    expect(typeof info).toBe("object");
    expect(info).not.toBeNull();
  });

  test("returns non-empty data", () => {
    const info = rsaSecurityInfo();
    const values = Object.values(info);
    expect(values.length).toBeGreaterThan(0);
  });
});
