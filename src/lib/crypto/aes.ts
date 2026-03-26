/**
 * AES-256 — Advanced Encryption Standard (2001)
 * Uses the browser's native Web Crypto API (SubtleCrypto).
 * AES-256-GCM mode: authenticated encryption with associated data.
 *
 * Browser-safe, no Node.js crypto.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AESKey {
  /** The raw CryptoKey object */
  cryptoKey: CryptoKey;
  /** Base64-encoded exported key material for display */
  base64: string;
}

export interface AESEncryptResult {
  /** Base64-encoded ciphertext (includes IV prefix) */
  ciphertext: string;
  /** Base64-encoded IV (12 bytes for GCM) */
  iv: string;
  /** Hex representation of ciphertext for display */
  hex: string;
}

export interface AESDecryptResult {
  plaintext: string;
}

// ─── Key management ──────────────────────────────────────────────────────────

/**
 * Generate a new AES-256 key.
 */
export async function aesGenerateKey(): Promise<AESKey> {
  const cryptoKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exported = await crypto.subtle.exportKey("raw", cryptoKey);
  const base64 = arrayBufferToBase64(exported);
  return { cryptoKey, base64 };
}

/**
 * Derive an AES-256 key from a passphrase using PBKDF2.
 * Returns both the CryptoKey and its base64 representation.
 */
export async function aesKeyFromPassphrase(
  passphrase: string,
  salt?: Uint8Array<ArrayBuffer>
): Promise<{ key: AESKey; salt: string }> {
  const enc = new TextEncoder();
  const passphraseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const actualSalt: Uint8Array<ArrayBuffer> = salt ?? crypto.getRandomValues(new Uint8Array(16));
  const cryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: actualSalt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    passphraseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const exported = await crypto.subtle.exportKey("raw", cryptoKey);
  const base64 = arrayBufferToBase64(exported);
  return {
    key: { cryptoKey, base64 },
    salt: arrayBufferToBase64(actualSalt.buffer as ArrayBuffer),
  };
}

// ─── Encrypt / Decrypt ───────────────────────────────────────────────────────

/**
 * Encrypt plaintext using AES-256-GCM.
 * Returns ciphertext as base64 with the IV prepended (first 12 bytes).
 */
export async function aesEncrypt(
  plaintext: string,
  key: AESKey
): Promise<AESEncryptResult> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key.cryptoKey,
    enc.encode(plaintext)
  );

  const combined = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertextBuffer), iv.length);

  const ciphertext = arrayBufferToBase64(combined.buffer);
  const ivBase64 = arrayBufferToBase64(iv.buffer);
  const hex = Array.from(combined)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { ciphertext, iv: ivBase64, hex };
}

/**
 * Decrypt AES-256-GCM ciphertext (base64 encoded, IV prepended).
 */
export async function aesDecrypt(
  ciphertextBase64: string,
  key: AESKey
): Promise<AESDecryptResult> {
  const combined = base64ToUint8Array(ciphertextBase64);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const plaintextBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key.cryptoKey,
    ciphertext
  );

  const plaintext = new TextDecoder().decode(plaintextBuffer);
  return { plaintext };
}

/**
 * How large is the AES-256 keyspace compared to atoms in the observable universe?
 * Returns an object for display in the "no practical attack" section.
 */
export function aesKeyspaceInfo(): {
  keyBits: number;
  keyspaceSize: string;
  atomsInUniverse: string;
  ratio: string;
} {
  // 2^256 ≈ 1.16 × 10^77
  // Atoms in observable universe ≈ 10^80
  return {
    keyBits: 256,
    keyspaceSize: "2^256 ≈ 1.16 × 10⁷⁷",
    atomsInUniverse: "≈ 10⁸⁰",
    ratio: "AES-256 keyspace is ~1000× smaller than atoms in the universe, yet still computationally infeasible to brute-force.",
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
