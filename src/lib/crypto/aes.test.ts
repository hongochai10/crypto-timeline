/**
 * AES-256 — unit tests
 * Uses the Web Crypto API (SubtleCrypto) — requires jsdom environment.
 */
import { describe, test, expect } from "vitest";
import {
  aesGenerateKey,
  aesKeyFromPassphrase,
  aesEncrypt,
  aesDecrypt,
  aesKeyspaceInfo,
} from "./aes";

describe("aesGenerateKey", () => {
  test("returns a key with cryptoKey and base64 fields", async () => {
    const key = await aesGenerateKey();
    expect(key).toHaveProperty("cryptoKey");
    expect(key).toHaveProperty("base64");
  });

  test("base64 is a non-empty string", async () => {
    const key = await aesGenerateKey();
    expect(typeof key.base64).toBe("string");
    expect(key.base64.length).toBeGreaterThan(0);
  });

  test("generates different keys each call", async () => {
    const k1 = await aesGenerateKey();
    const k2 = await aesGenerateKey();
    expect(k1.base64).not.toBe(k2.base64);
  });

  test("base64 decodes to 32 bytes (256-bit key)", async () => {
    const key = await aesGenerateKey();
    const decoded = atob(key.base64);
    expect(decoded.length).toBe(32);
  });
});

describe("aesKeyFromPassphrase", () => {
  test("returns a key and salt", async () => {
    const result = await aesKeyFromPassphrase("mypassphrase");
    expect(result).toHaveProperty("key");
    expect(result).toHaveProperty("salt");
    expect(result.key).toHaveProperty("cryptoKey");
    expect(result.key).toHaveProperty("base64");
  });

  test("salt is a non-empty base64 string", async () => {
    const result = await aesKeyFromPassphrase("test");
    expect(typeof result.salt).toBe("string");
    expect(result.salt.length).toBeGreaterThan(0);
  });

  test("same passphrase + same salt produces same key", async () => {
    const first = await aesKeyFromPassphrase("password");
    // Decode salt to reuse it
    const saltBinary = atob(first.salt);
    const saltBytes = new Uint8Array(saltBinary.length);
    for (let i = 0; i < saltBinary.length; i++) {
      saltBytes[i] = saltBinary.charCodeAt(i);
    }
    const second = await aesKeyFromPassphrase("password", saltBytes as Uint8Array<ArrayBuffer>);
    expect(first.key.base64).toBe(second.key.base64);
  });

  test("different passphrases produce different keys", async () => {
    const r1 = await aesKeyFromPassphrase("password1");
    const r2 = await aesKeyFromPassphrase("password2");
    expect(r1.key.base64).not.toBe(r2.key.base64);
  });
});

describe("aesEncrypt", () => {
  test("returns ciphertext, iv, and hex", async () => {
    const key = await aesGenerateKey();
    const result = await aesEncrypt("hello world", key);
    expect(result).toHaveProperty("ciphertext");
    expect(result).toHaveProperty("iv");
    expect(result).toHaveProperty("hex");
  });

  test("ciphertext is a non-empty base64 string", async () => {
    const key = await aesGenerateKey();
    const result = await aesEncrypt("hello", key);
    expect(typeof result.ciphertext).toBe("string");
    expect(result.ciphertext.length).toBeGreaterThan(0);
  });

  test("iv is a non-empty base64 string", async () => {
    const key = await aesGenerateKey();
    const result = await aesEncrypt("hello", key);
    expect(typeof result.iv).toBe("string");
    expect(result.iv.length).toBeGreaterThan(0);
  });

  test("hex is a valid hex string", async () => {
    const key = await aesGenerateKey();
    const result = await aesEncrypt("hello", key);
    expect(result.hex).toMatch(/^[0-9a-f]+$/i);
  });

  test("encrypting same plaintext twice produces different ciphertexts (random IV)", async () => {
    const key = await aesGenerateKey();
    const r1 = await aesEncrypt("hello", key);
    const r2 = await aesEncrypt("hello", key);
    expect(r1.ciphertext).not.toBe(r2.ciphertext);
  });
});

describe("aesDecrypt", () => {
  test("decrypts back to original plaintext (round-trip)", async () => {
    const key = await aesGenerateKey();
    const encrypted = await aesEncrypt("hello world", key);
    const decrypted = await aesDecrypt(encrypted.ciphertext, key);
    expect(decrypted.plaintext).toBe("hello world");
  });

  test("round-trip with empty string", async () => {
    const key = await aesGenerateKey();
    const encrypted = await aesEncrypt("", key);
    const decrypted = await aesDecrypt(encrypted.ciphertext, key);
    expect(decrypted.plaintext).toBe("");
  });

  test("round-trip with unicode text", async () => {
    const key = await aesGenerateKey();
    const plaintext = "Crypto: AES-256 🔐";
    const encrypted = await aesEncrypt(plaintext, key);
    const decrypted = await aesDecrypt(encrypted.ciphertext, key);
    expect(decrypted.plaintext).toBe(plaintext);
  });

  test("decryption with wrong key throws an error", async () => {
    const key1 = await aesGenerateKey();
    const key2 = await aesGenerateKey();
    const encrypted = await aesEncrypt("secret message", key1);
    await expect(aesDecrypt(encrypted.ciphertext, key2)).rejects.toThrow();
  });

  test("passphrase-derived key round-trip", async () => {
    const { key } = await aesKeyFromPassphrase("mypassphrase");
    const plaintext = "Hello from AES with passphrase!";
    const encrypted = await aesEncrypt(plaintext, key);
    const decrypted = await aesDecrypt(encrypted.ciphertext, key);
    expect(decrypted.plaintext).toBe(plaintext);
  });
});

describe("aesKeyspaceInfo", () => {
  test("returns the expected fields", () => {
    const info = aesKeyspaceInfo();
    expect(info).toHaveProperty("keyBits");
    expect(info).toHaveProperty("keyspaceSize");
    expect(info).toHaveProperty("atomsInUniverse");
    expect(info).toHaveProperty("ratio");
  });

  test("keyBits is 256", () => {
    const info = aesKeyspaceInfo();
    expect(info.keyBits).toBe(256);
  });

  test("keyspaceSize mentions 2^256", () => {
    const info = aesKeyspaceInfo();
    expect(info.keyspaceSize).toContain("2^256");
  });

  test("all fields are non-empty strings (except keyBits)", () => {
    const info = aesKeyspaceInfo();
    expect(info.keyspaceSize.length).toBeGreaterThan(0);
    expect(info.atomsInUniverse.length).toBeGreaterThan(0);
    expect(info.ratio.length).toBeGreaterThan(0);
  });
});
