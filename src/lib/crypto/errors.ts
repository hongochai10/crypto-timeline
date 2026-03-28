/**
 * Crypto error handling utilities.
 * Provides human-readable error messages and Web Crypto API detection.
 */

/**
 * Check if the Web Crypto API is available in this browser.
 */
export function isWebCryptoAvailable(): boolean {
  return (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.subtle !== "undefined"
  );
}

/**
 * Map a caught crypto error to a human-readable message.
 */
export function getCryptoErrorMessage(error: unknown, operation: CryptoOperation): string {
  if (!isWebCryptoAvailable()) {
    return "Your browser doesn't support the Web Crypto API. Please use a modern browser (Chrome 37+, Firefox 34+, Safari 11+, Edge 12+).";
  }

  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // DOMException from SubtleCrypto
  if (error instanceof DOMException) {
    if (error.name === "OperationError") {
      return OPERATION_ERROR_MESSAGES[operation] ?? "The cryptographic operation failed. Check your inputs and try again.";
    }
    if (error.name === "DataError") {
      return "Invalid data format. The key or input data is malformed.";
    }
    if (error.name === "InvalidAccessError") {
      return "This key cannot be used for this operation. It may have been generated for a different algorithm.";
    }
    if (error.name === "NotSupportedError") {
      return "This cryptographic algorithm is not supported by your browser.";
    }
  }

  // Data size issues
  if (msg.includes("too large") || msg.includes("data too long") || msg.includes("too much data")) {
    return DATA_SIZE_MESSAGES[operation] ?? "The input data is too large for this operation.";
  }

  // Encoding issues
  if (msg.includes("atob") || msg.includes("base64") || msg.includes("decode")) {
    return "Invalid encoded data. The ciphertext or key data appears to be corrupted.";
  }

  return `${OPERATION_LABELS[operation]} failed. Please check your inputs and try again.`;
}

type CryptoOperation =
  | "aes-encrypt"
  | "aes-decrypt"
  | "aes-keygen"
  | "rsa-encrypt"
  | "rsa-decrypt"
  | "rsa-keygen"
  | "ecc-sign"
  | "ecc-verify"
  | "ecc-keygen"
  | "pqc-encapsulate"
  | "pqc-keygen";

export type { CryptoOperation };

const OPERATION_LABELS: Record<CryptoOperation, string> = {
  "aes-encrypt": "AES encryption",
  "aes-decrypt": "AES decryption",
  "aes-keygen": "AES key generation",
  "rsa-encrypt": "RSA encryption",
  "rsa-decrypt": "RSA decryption",
  "rsa-keygen": "RSA key generation",
  "ecc-sign": "ECC signing",
  "ecc-verify": "ECC verification",
  "ecc-keygen": "ECC key generation",
  "pqc-encapsulate": "PQC encapsulation",
  "pqc-keygen": "PQC key generation",
};

const OPERATION_ERROR_MESSAGES: Partial<Record<CryptoOperation, string>> = {
  "aes-decrypt": "Decryption failed — the key may be wrong or the ciphertext was tampered with.",
  "aes-encrypt": "Encryption failed. Please check that the key is valid.",
  "rsa-encrypt": "RSA encryption failed — the message may be too long for this key size. RSA-2048 supports up to ~190 bytes.",
  "rsa-decrypt": "RSA decryption failed — the private key doesn't match or the ciphertext is corrupted.",
  "ecc-sign": "Signing failed. The private key may be invalid.",
  "ecc-verify": "Signature verification encountered an error.",
};

const DATA_SIZE_MESSAGES: Partial<Record<CryptoOperation, string>> = {
  "rsa-encrypt": "Message too long for RSA encryption. RSA-2048 can encrypt at most ~190 bytes. Try a shorter message.",
  "aes-encrypt": "The input is extremely large. Try a smaller message.",
};
