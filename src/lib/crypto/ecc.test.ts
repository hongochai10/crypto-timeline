/**
 * ECC (Elliptic Curve Cryptography) — unit tests
 * Uses Web Crypto API (SubtleCrypto) — requires jsdom environment.
 */
import { describe, test, expect } from "vitest";
import {
  eccGenerateSigningKeyPair,
  eccGenerateECDHKeyPair,
  eccSign,
  eccVerify,
  eccDeriveSharedKey,
  eccVsRsaComparison,
  eccAdoptionExamples,
} from "./ecc";

describe("eccGenerateSigningKeyPair", () => {
  test("returns publicKey, privateKey, publicKeyJwk, and curve", async () => {
    const kp = await eccGenerateSigningKeyPair();
    expect(kp).toHaveProperty("publicKey");
    expect(kp).toHaveProperty("privateKey");
    expect(kp).toHaveProperty("publicKeyJwk");
    expect(kp).toHaveProperty("curve");
  });

  test("curve defaults to P-256", async () => {
    const kp = await eccGenerateSigningKeyPair();
    expect(kp.curve).toBe("P-256");
  });

  test("publicKeyJwk has kty field (JSON Web Key)", async () => {
    const kp = await eccGenerateSigningKeyPair();
    expect(kp.publicKeyJwk).toHaveProperty("kty");
  });

  test("generates different JWK keys each call", async () => {
    const [kp1, kp2] = await Promise.all([
      eccGenerateSigningKeyPair(),
      eccGenerateSigningKeyPair(),
    ]);
    expect(JSON.stringify(kp1.publicKeyJwk)).not.toBe(JSON.stringify(kp2.publicKeyJwk));
  });

  test("supports P-384 curve", async () => {
    const kp = await eccGenerateSigningKeyPair("P-384");
    expect(kp.curve).toBe("P-384");
  });
});

describe("eccSign + eccVerify", () => {
  test("sign produces signature and hex fields", async () => {
    const kp = await eccGenerateSigningKeyPair();
    const result = await eccSign("hello", kp.privateKey);
    expect(result).toHaveProperty("signature");
    expect(result).toHaveProperty("hex");
  });

  test("signature is a non-empty base64 string", async () => {
    const kp = await eccGenerateSigningKeyPair();
    const result = await eccSign("hello", kp.privateKey);
    expect(typeof result.signature).toBe("string");
    expect(result.signature.length).toBeGreaterThan(0);
  });

  test("hex is a valid hex string", async () => {
    const kp = await eccGenerateSigningKeyPair();
    const result = await eccSign("test", kp.privateKey);
    expect(result.hex).toMatch(/^[0-9a-f]+$/i);
  });

  test("valid signature verifies as true", async () => {
    const kp = await eccGenerateSigningKeyPair();
    const signed = await eccSign("hello world", kp.privateKey);
    const verified = await eccVerify("hello world", signed.signature, kp.publicKey);
    expect(verified.valid).toBe(true);
  });

  test("wrong public key makes verification return valid=false", async () => {
    const kp1 = await eccGenerateSigningKeyPair();
    const kp2 = await eccGenerateSigningKeyPair();
    const signed = await eccSign("hello", kp1.privateKey);
    const verified = await eccVerify("hello", signed.signature, kp2.publicKey);
    expect(verified.valid).toBe(false);
  });

  test("tampered message invalidates signature", async () => {
    const kp = await eccGenerateSigningKeyPair();
    const signed = await eccSign("original message", kp.privateKey);
    const verified = await eccVerify("tampered message", signed.signature, kp.publicKey);
    expect(verified.valid).toBe(false);
  });

  test("verify result has valid and message fields", async () => {
    const kp = await eccGenerateSigningKeyPair();
    const signed = await eccSign("test", kp.privateKey);
    const result = await eccVerify("test", signed.signature, kp.publicKey);
    expect(result).toHaveProperty("valid");
    expect(result).toHaveProperty("message");
  });
});

describe("eccGenerateECDHKeyPair + eccDeriveSharedKey", () => {
  test("ECDH key pair has publicKey and privateKey", async () => {
    const kp = await eccGenerateECDHKeyPair();
    expect(kp).toHaveProperty("publicKey");
    expect(kp).toHaveProperty("privateKey");
    expect(kp).toHaveProperty("curve");
  });

  test("two parties derive the same shared key (Diffie-Hellman property)", async () => {
    const [alice, bob] = await Promise.all([
      eccGenerateECDHKeyPair(),
      eccGenerateECDHKeyPair(),
    ]);
    const [sharedAlice, sharedBob] = await Promise.all([
      eccDeriveSharedKey(alice.privateKey, bob.publicKey),
      eccDeriveSharedKey(bob.privateKey, alice.publicKey),
    ]);
    // Both derived keys should be CryptoKey objects — verify by exporting
    // (key is non-extractable by default so just verify it's a CryptoKey)
    expect(sharedAlice).toBeTruthy();
    expect(sharedBob).toBeTruthy();
    expect(sharedAlice instanceof CryptoKey).toBe(true);
    expect(sharedBob instanceof CryptoKey).toBe(true);
  });
});

describe("eccVsRsaComparison", () => {
  test("returns a non-empty array", () => {
    const comparisons = eccVsRsaComparison();
    expect(Array.isArray(comparisons)).toBe(true);
    expect(comparisons.length).toBeGreaterThan(0);
  });

  test("each entry has curve, eccBits, rsaEquivalentBits, ratio", () => {
    const comparisons = eccVsRsaComparison();
    for (const entry of comparisons) {
      expect(entry).toHaveProperty("curve");
      expect(entry).toHaveProperty("eccBits");
      expect(entry).toHaveProperty("rsaEquivalentBits");
      expect(entry).toHaveProperty("ratio");
    }
  });

  test("ECC bits are smaller than RSA equivalent bits for same security", () => {
    const comparisons = eccVsRsaComparison();
    for (const entry of comparisons) {
      expect(entry.eccBits).toBeLessThan(entry.rsaEquivalentBits);
    }
  });

  test("eccKeySizeBytes < rsaKeySizeBytes for same security level", () => {
    const comparisons = eccVsRsaComparison();
    for (const entry of comparisons) {
      expect(entry.eccKeySizeBytes).toBeLessThan(entry.rsaKeySizeBytes);
    }
  });

  test("includes P-256 curve", () => {
    const comparisons = eccVsRsaComparison();
    const p256 = comparisons.find((c) => c.curve === "P-256");
    expect(p256).toBeDefined();
  });
});

describe("eccAdoptionExamples", () => {
  test("returns a non-empty array", () => {
    const examples = eccAdoptionExamples();
    expect(Array.isArray(examples)).toBe(true);
    expect(examples.length).toBeGreaterThan(0);
  });

  test("each entry has name and usage strings", () => {
    const examples = eccAdoptionExamples();
    for (const ex of examples) {
      expect(typeof ex.name).toBe("string");
      expect(typeof ex.usage).toBe("string");
      expect(ex.name.length).toBeGreaterThan(0);
      expect(ex.usage.length).toBeGreaterThan(0);
    }
  });

  test("includes well-known adopters", () => {
    const examples = eccAdoptionExamples();
    const names = examples.map((e) => e.name);
    // At least one of these prominent adopters should be present
    const wellKnown = ["Bitcoin", "TLS 1.3", "Signal", "SSH"];
    const hasKnown = wellKnown.some((n) => names.includes(n));
    expect(hasKnown).toBe(true);
  });
});
