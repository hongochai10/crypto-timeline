import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isWebCryptoAvailable, getCryptoErrorMessage } from "./errors";
import type { CryptoOperation } from "./errors";

describe("isWebCryptoAvailable", () => {
  it("returns true when crypto.subtle is available", () => {
    expect(isWebCryptoAvailable()).toBe(true);
  });

  it("returns false when crypto is undefined", () => {
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
    expect(isWebCryptoAvailable()).toBe(false);
    Object.defineProperty(globalThis, "crypto", { value: original, configurable: true });
  });

  it("returns false when crypto.subtle is undefined", () => {
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", {
      value: { subtle: undefined },
      configurable: true,
    });
    expect(isWebCryptoAvailable()).toBe(false);
    Object.defineProperty(globalThis, "crypto", { value: original, configurable: true });
  });
});

describe("getCryptoErrorMessage", () => {
  describe("when Web Crypto API is unavailable", () => {
    let originalCrypto: Crypto;

    beforeEach(() => {
      originalCrypto = globalThis.crypto;
      Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
    });

    afterEach(() => {
      Object.defineProperty(globalThis, "crypto", { value: originalCrypto, configurable: true });
    });

    it("returns browser support message", () => {
      const result = getCryptoErrorMessage(new Error("fail"), "aes-encrypt");
      expect(result).toContain("Web Crypto API");
      expect(result).toContain("modern browser");
    });
  });

  describe("DOMException errors", () => {
    it("handles OperationError with known operation message", () => {
      const err = new DOMException("op failed", "OperationError");
      const result = getCryptoErrorMessage(err, "aes-decrypt");
      expect(result).toContain("key may be wrong");
    });

    it("handles OperationError with fallback message for unmapped operation", () => {
      const err = new DOMException("op failed", "OperationError");
      const result = getCryptoErrorMessage(err, "pqc-keygen");
      expect(result).toContain("cryptographic operation failed");
    });

    it("handles DataError", () => {
      const err = new DOMException("bad data", "DataError");
      const result = getCryptoErrorMessage(err, "rsa-encrypt");
      expect(result).toContain("Invalid data format");
    });

    it("handles InvalidAccessError", () => {
      const err = new DOMException("access", "InvalidAccessError");
      const result = getCryptoErrorMessage(err, "ecc-sign");
      expect(result).toContain("cannot be used for this operation");
    });

    it("handles NotSupportedError", () => {
      const err = new DOMException("not supported", "NotSupportedError");
      const result = getCryptoErrorMessage(err, "aes-encrypt");
      expect(result).toContain("not supported by your browser");
    });

    it("handles OperationError for aes-encrypt", () => {
      const err = new DOMException("op failed", "OperationError");
      const result = getCryptoErrorMessage(err, "aes-encrypt");
      expect(result).toContain("key is valid");
    });

    it("handles OperationError for rsa-encrypt", () => {
      const err = new DOMException("op failed", "OperationError");
      const result = getCryptoErrorMessage(err, "rsa-encrypt");
      expect(result).toContain("too long");
    });

    it("handles OperationError for rsa-decrypt", () => {
      const err = new DOMException("op failed", "OperationError");
      const result = getCryptoErrorMessage(err, "rsa-decrypt");
      expect(result).toContain("private key");
    });

    it("handles OperationError for ecc-sign", () => {
      const err = new DOMException("op failed", "OperationError");
      const result = getCryptoErrorMessage(err, "ecc-sign");
      expect(result).toContain("Signing failed");
    });

    it("handles OperationError for ecc-verify", () => {
      const err = new DOMException("op failed", "OperationError");
      const result = getCryptoErrorMessage(err, "ecc-verify");
      expect(result).toContain("verification");
    });
  });

  describe("data size errors", () => {
    it("handles 'too large' message with known operation", () => {
      const err = new Error("data too large");
      const result = getCryptoErrorMessage(err, "rsa-encrypt");
      expect(result).toContain("too long for RSA");
    });

    it("handles 'data too long' message with known operation", () => {
      const err = new Error("data too long for key");
      const result = getCryptoErrorMessage(err, "aes-encrypt");
      expect(result).toContain("extremely large");
    });

    it("handles 'too much data' message with fallback", () => {
      const err = new Error("too much data");
      const result = getCryptoErrorMessage(err, "ecc-sign");
      expect(result).toContain("too large for this operation");
    });
  });

  describe("encoding errors", () => {
    it("handles atob error", () => {
      const err = new Error("atob failed");
      const result = getCryptoErrorMessage(err, "aes-decrypt");
      expect(result).toContain("Invalid encoded data");
    });

    it("handles base64 error", () => {
      const err = new Error("invalid base64 string");
      const result = getCryptoErrorMessage(err, "rsa-decrypt");
      expect(result).toContain("corrupted");
    });

    it("handles decode error", () => {
      const err = new Error("could not decode input");
      const result = getCryptoErrorMessage(err, "aes-encrypt");
      expect(result).toContain("Invalid encoded data");
    });
  });

  describe("generic fallback", () => {
    it("returns operation-specific fallback for unknown errors", () => {
      const err = new Error("something unexpected");
      const result = getCryptoErrorMessage(err, "aes-encrypt");
      expect(result).toContain("AES encryption");
      expect(result).toContain("failed");
    });

    it("handles non-Error values", () => {
      const result = getCryptoErrorMessage("string error", "rsa-keygen");
      expect(result).toContain("RSA key generation");
      expect(result).toContain("failed");
    });

    it("returns fallback for each operation label", () => {
      const operations: CryptoOperation[] = [
        "aes-encrypt", "aes-decrypt", "aes-keygen",
        "rsa-encrypt", "rsa-decrypt", "rsa-keygen",
        "ecc-sign", "ecc-verify", "ecc-keygen",
        "pqc-encapsulate", "pqc-keygen",
      ];
      for (const op of operations) {
        const result = getCryptoErrorMessage(new Error("unknown"), op);
        expect(result).toContain("failed");
      }
    });
  });
});
