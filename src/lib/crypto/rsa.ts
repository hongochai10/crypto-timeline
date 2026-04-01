/**
 * RSA (Rivest–Shamir–Adleman) — 1977
 * Uses the browser's native Web Crypto API (SubtleCrypto).
 * RSA-OAEP with SHA-256 for encryption/decryption.
 *
 * Browser-safe, no Node.js crypto.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RSAKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  /** Public key in PEM-like base64 format for display */
  publicKeyBase64: string;
  /** Private key in PEM-like base64 format for display */
  privateKeyBase64: string;
  /** Key size in bits */
  modulusBits: number;
}

export interface RSAEncryptResult {
  /** Base64-encoded ciphertext */
  ciphertext: string;
  /** Hex representation for display */
  hex: string;
}

export interface RSADecryptResult {
  plaintext: string;
}

export interface RSAFactoringDemo {
  /** Small RSA modulus (n = p × q) for visualization */
  n: number;
  p: number;
  q: number;
  /** Steps to factor n by trial division */
  steps: number;
}

// ─── Key Generation ──────────────────────────────────────────────────────────

/**
 * Generate an RSA-OAEP key pair.
 * @param modulusBits Key size: 2048 (fast demo) or 4096 (production)
 */
export async function rsaGenerateKeyPair(
  modulusBits: 2048 | 4096 = 2048
): Promise<RSAKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: modulusBits,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKeyBuffer = await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  const privateKeyBuffer = await crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyBase64: arrayBufferToBase64(publicKeyBuffer),
    privateKeyBase64: arrayBufferToBase64(privateKeyBuffer),
    modulusBits,
  };
}

/**
 * Import a public key from base64-encoded SPKI format.
 */
export async function rsaImportPublicKey(base64: string): Promise<CryptoKey> {
  const buffer = base64ToArrayBuffer(base64);
  return crypto.subtle.importKey(
    "spki",
    buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

/**
 * Import a private key from base64-encoded PKCS8 format.
 */
export async function rsaImportPrivateKey(base64: string): Promise<CryptoKey> {
  const buffer = base64ToArrayBuffer(base64);
  return crypto.subtle.importKey(
    "pkcs8",
    buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );
}

// ─── Encrypt / Decrypt ───────────────────────────────────────────────────────

/**
 * Encrypt a message with an RSA public key.
 * Note: RSA-OAEP can only encrypt small messages (max ~190 bytes for 2048-bit key).
 * For larger messages, use hybrid encryption (RSA + AES).
 */
export async function rsaEncrypt(
  plaintext: string,
  publicKey: CryptoKey
): Promise<RSAEncryptResult> {
  const enc = new TextEncoder();
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    enc.encode(plaintext)
  );

  const ciphertext = arrayBufferToBase64(ciphertextBuffer);
  const hex = Array.from(new Uint8Array(ciphertextBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { ciphertext, hex };
}

/**
 * Decrypt an RSA-OAEP encrypted message with a private key.
 */
export async function rsaDecrypt(
  ciphertextBase64: string,
  privateKey: CryptoKey
): Promise<RSADecryptResult> {
  const ciphertext = base64ToArrayBuffer(ciphertextBase64);
  const plaintextBuffer = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    ciphertext
  );

  const plaintext = new TextDecoder().decode(plaintextBuffer);
  return { plaintext };
}

// ─── Attack Demo ─────────────────────────────────────────────────────────────

/**
 * Demonstrate integer factoring on a small (toy) RSA modulus.
 * Shows why factoring large numbers is computationally hard.
 * @param n A small semi-prime (product of two primes), e.g. 3233 = 61 × 53
 */
export function rsaFactorDemo(n: number): RSAFactoringDemo {
  let steps = 0;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    steps++;
    if (n % i === 0) {
      return { n, p: i, q: n / i, steps };
    }
  }
  // n is prime (shouldn't happen for a valid RSA modulus)
  return { n, p: 1, q: n, steps };
}

/**
 * Return information about RSA key sizes and factoring difficulty.
 */
export function rsaSecurityInfo(): {
  sizes: Array<{ bits: number; status: string; yearsToFactor: string }>;
  publicExponent: number;
} {
  return {
    sizes: [
      { bits: 512,  status: "broken",   yearsToFactor: "< 1 hour (2000s hardware)" },
      { bits: 1024, status: "weak",     yearsToFactor: "< 1 year (modern hardware)" },
      { bits: 2048, status: "safe",     yearsToFactor: "~300 trillion years (classical)" },
      { bits: 4096, status: "strong",   yearsToFactor: "Computationally infeasible (classical)" },
    ],
    publicExponent: 65537,
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

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  // .slice() creates a new Uint8Array with a fresh ArrayBuffer,
  // avoiding Node.js shared buffer pool issues with SubtleCrypto
  return bytes.slice().buffer;
}
