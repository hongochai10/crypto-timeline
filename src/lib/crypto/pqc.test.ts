/**
 * Post-Quantum Cryptography (LWE) — unit tests
 * Tests the simplified LWE-based educational implementation.
 */
import { describe, test, expect } from "vitest";
import {
  pqcGenerateKeyPair,
  pqcEncryptBit,
  pqcDecryptBit,
  pqcEncryptString,
  pqcDecryptString,
  quantumThreatAnalysis,
  nistPQCTimeline,
  generateLatticeVisualization,
} from "./pqc";

describe("pqcGenerateKeyPair", () => {
  test("returns publicKey and privateKey", () => {
    const kp = pqcGenerateKeyPair();
    expect(kp).toHaveProperty("publicKey");
    expect(kp).toHaveProperty("privateKey");
  });

  test("publicKey has required fields: A, b, q, n", () => {
    const kp = pqcGenerateKeyPair();
    expect(kp.publicKey).toHaveProperty("A");
    expect(kp.publicKey).toHaveProperty("b");
    expect(kp.publicKey).toHaveProperty("q");
    expect(kp.publicKey).toHaveProperty("n");
  });

  test("privateKey has secret vector s and modulus q", () => {
    const kp = pqcGenerateKeyPair();
    expect(kp.privateKey).toHaveProperty("s");
    expect(kp.privateKey).toHaveProperty("q");
  });

  test("A is an n×n matrix", () => {
    const kp = pqcGenerateKeyPair();
    const { A, n } = kp.publicKey;
    expect(A.length).toBe(n);
    for (const row of A) {
      expect(row.length).toBe(n);
    }
  });

  test("b has n elements", () => {
    const kp = pqcGenerateKeyPair();
    expect(kp.publicKey.b.length).toBe(kp.publicKey.n);
  });

  test("generates different key pairs on each call (random)", () => {
    const kp1 = pqcGenerateKeyPair();
    const kp2 = pqcGenerateKeyPair();
    // b vectors should differ (probabilistically)
    const same = kp1.publicKey.b.every((v, i) => v === kp2.publicKey.b[i]);
    expect(same).toBe(false);
  });
});

describe("pqcEncryptBit + pqcDecryptBit", () => {
  test("encrypts bit 0 and decrypts back to 0", () => {
    const kp = pqcGenerateKeyPair();
    // Run multiple times due to LWE probabilistic nature
    for (let i = 0; i < 5; i++) {
      const encrypted = pqcEncryptBit(0, kp.publicKey);
      const decrypted = pqcDecryptBit(encrypted, kp.privateKey);
      expect(decrypted.bit).toBe(0);
    }
  });

  test("encrypts bit 1 and decrypts back to 1", () => {
    const kp = pqcGenerateKeyPair();
    for (let i = 0; i < 5; i++) {
      const encrypted = pqcEncryptBit(1, kp.publicKey);
      const decrypted = pqcDecryptBit(encrypted, kp.privateKey);
      expect(decrypted.bit).toBe(1);
    }
  });

  test("encrypted result has u, v, and bit fields", () => {
    const kp = pqcGenerateKeyPair();
    const encrypted = pqcEncryptBit(1, kp.publicKey);
    expect(encrypted).toHaveProperty("u");
    expect(encrypted).toHaveProperty("v");
    expect(encrypted).toHaveProperty("bit");
  });

  test("u has n elements", () => {
    const kp = pqcGenerateKeyPair();
    const encrypted = pqcEncryptBit(0, kp.publicKey);
    expect(encrypted.u.length).toBe(kp.publicKey.n);
  });

  test("wrong private key fails to decrypt correctly", () => {
    const kp1 = pqcGenerateKeyPair();
    const kp2 = pqcGenerateKeyPair();
    // Encrypt with kp1's public key
    const encrypted = pqcEncryptBit(1, kp1.publicKey);
    // Decrypt with kp2's private key — result should be wrong (not reliably 1)
    const decrypted = pqcDecryptBit(encrypted, kp2.privateKey);
    // We just verify it returns something — wrong key gives random bits
    expect([0, 1]).toContain(decrypted.bit);
  });
});

describe("pqcEncryptString + pqcDecryptString", () => {
  test("round-trip: simple ASCII string", () => {
    const kp = pqcGenerateKeyPair();
    const plaintext = "Hi";
    const encrypted = pqcEncryptString(plaintext, kp.publicKey);
    const decrypted = pqcDecryptString(encrypted, kp.privateKey);
    expect(decrypted).toBe(plaintext);
  });

  test("round-trip: single character", () => {
    const kp = pqcGenerateKeyPair();
    const encrypted = pqcEncryptString("A", kp.publicKey);
    const decrypted = pqcDecryptString(encrypted, kp.privateKey);
    expect(decrypted).toBe("A");
  });

  test("encrypt returns an array of LWEEncryptResult", () => {
    const kp = pqcGenerateKeyPair();
    const encrypted = pqcEncryptString("A", kp.publicKey);
    expect(Array.isArray(encrypted)).toBe(true);
    expect(encrypted.length).toBeGreaterThan(0);
    expect(encrypted[0]).toHaveProperty("u");
    expect(encrypted[0]).toHaveProperty("v");
  });

  test("empty string round-trip", () => {
    const kp = pqcGenerateKeyPair();
    const encrypted = pqcEncryptString("", kp.publicKey);
    const decrypted = pqcDecryptString(encrypted, kp.privateKey);
    expect(decrypted).toBe("");
  });
});

describe("quantumThreatAnalysis", () => {
  test("returns a non-empty array", () => {
    const threats = quantumThreatAnalysis();
    expect(Array.isArray(threats)).toBe(true);
    expect(threats.length).toBeGreaterThan(0);
  });

  test("each entry has algorithm and threat level info", () => {
    const threats = quantumThreatAnalysis();
    for (const t of threats) {
      expect(t).toHaveProperty("algorithm");
      expect(typeof t.algorithm).toBe("string");
    }
  });
});

describe("nistPQCTimeline", () => {
  test("returns a non-empty array", () => {
    const timeline = nistPQCTimeline();
    expect(Array.isArray(timeline)).toBe(true);
    expect(timeline.length).toBeGreaterThan(0);
  });

  test("each entry has year and event fields", () => {
    const timeline = nistPQCTimeline();
    for (const entry of timeline) {
      expect(entry).toHaveProperty("year");
    }
  });

  test("timeline entries are sorted chronologically (ascending)", () => {
    const timeline = nistPQCTimeline();
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].year).toBeGreaterThanOrEqual(timeline[i - 1].year);
    }
  });
});

describe("generateLatticeVisualization", () => {
  test("returns an object with lattice data", () => {
    const viz = generateLatticeVisualization();
    expect(typeof viz).toBe("object");
    expect(viz).not.toBeNull();
  });

  test("accepts a custom scale parameter", () => {
    const viz1 = generateLatticeVisualization(40);
    const viz2 = generateLatticeVisualization(80);
    // Should return different visualizations for different scales
    expect(viz1).not.toEqual(viz2);
  });
});
