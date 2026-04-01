/**
 * ECC (Elliptic Curve Cryptography) — 1985
 * Uses the browser's native Web Crypto API (SubtleCrypto).
 *
 * - ECDSA (P-256) for digital signatures
 * - ECDH (P-256) for key agreement / Diffie-Hellman demo
 *
 * Browser-safe, no Node.js crypto.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ECCKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  /** Public key in uncompressed JWK format for display */
  publicKeyJwk: JsonWebKey;
  /** Named curve */
  curve: "P-256" | "P-384" | "P-521";
}

export interface ECCSignResult {
  /** Base64-encoded DER signature */
  signature: string;
  /** Hex representation for display */
  hex: string;
}

export interface ECCVerifyResult {
  valid: boolean;
  message: string;
}

export interface ECCKeySizeComparison {
  curve: string;
  eccBits: number;
  rsaEquivalentBits: number;
  eccKeySizeBytes: number;
  rsaKeySizeBytes: number;
  ratio: string;
}

// ─── Key Generation ──────────────────────────────────────────────────────────

/**
 * Generate an ECDSA key pair for signing/verification.
 */
export async function eccGenerateSigningKeyPair(
  curve: "P-256" | "P-384" | "P-521" = "P-256"
): Promise<ECCKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: curve },
    true,
    ["sign", "verify"]
  );

  const publicKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyJwk,
    curve,
  };
}

/**
 * Generate an ECDH key pair for key agreement.
 */
export async function eccGenerateECDHKeyPair(
  curve: "P-256" | "P-384" | "P-521" = "P-256"
): Promise<ECCKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: curve },
    true,
    ["deriveKey", "deriveBits"]
  );

  const publicKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyJwk,
    curve,
  };
}

// ─── Sign / Verify ───────────────────────────────────────────────────────────

/**
 * Sign a message using ECDSA with SHA-256.
 */
export async function eccSign(
  message: string,
  privateKey: CryptoKey
): Promise<ECCSignResult> {
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    privateKey,
    enc.encode(message)
  );

  const signature = arrayBufferToBase64(signatureBuffer);
  const hex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { signature, hex };
}

/**
 * Verify an ECDSA signature.
 */
export async function eccVerify(
  message: string,
  signatureBase64: string,
  publicKey: CryptoKey
): Promise<ECCVerifyResult> {
  const enc = new TextEncoder();
  const signatureBuffer = base64ToArrayBuffer(signatureBase64);

  const valid = await crypto.subtle.verify(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    publicKey,
    signatureBuffer,
    enc.encode(message)
  );

  return {
    valid,
    message: valid
      ? "Signature is valid — message integrity confirmed."
      : "Signature is INVALID — message may have been tampered with.",
  };
}

// ─── ECDH Key Agreement ───────────────────────────────────────────────────────

/**
 * Derive a shared AES-256 key between two parties using ECDH.
 * Alice uses her private key + Bob's public key → shared secret.
 * Bob uses his private key + Alice's public key → same shared secret.
 */
export async function eccDeriveSharedKey(
  myPrivateKey: CryptoKey,
  theirPublicKey: CryptoKey
): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: "ECDH", public: theirPublicKey },
    myPrivateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// ─── Security Comparison ─────────────────────────────────────────────────────

/**
 * Returns a comparison table of ECC vs RSA key sizes for equivalent security.
 * ECC requires far smaller keys for the same security level.
 */
export function eccVsRsaComparison(): ECCKeySizeComparison[] {
  return [
    {
      curve: "P-192",
      eccBits: 192,
      rsaEquivalentBits: 1536,
      eccKeySizeBytes: 24,
      rsaKeySizeBytes: 192,
      ratio: "8× smaller",
    },
    {
      curve: "P-256",
      eccBits: 256,
      rsaEquivalentBits: 3072,
      eccKeySizeBytes: 32,
      rsaKeySizeBytes: 384,
      ratio: "12× smaller",
    },
    {
      curve: "P-384",
      eccBits: 384,
      rsaEquivalentBits: 7680,
      eccKeySizeBytes: 48,
      rsaKeySizeBytes: 960,
      ratio: "20× smaller",
    },
    {
      curve: "P-521",
      eccBits: 521,
      rsaEquivalentBits: 15360,
      eccKeySizeBytes: 66,
      rsaKeySizeBytes: 1920,
      ratio: "29× smaller",
    },
  ];
}

/**
 * Returns real-world ECC adoption examples.
 */
export function eccAdoptionExamples(): Array<{ name: string; usage: string }> {
  return [
    { name: "Bitcoin", usage: "secp256k1 for wallet signing (ECDSA)" },
    { name: "TLS 1.3", usage: "P-256/P-384 for key exchange (ECDHE)" },
    { name: "Signal", usage: "Curve25519 for end-to-end encryption" },
    { name: "iMessage", usage: "P-256 for secure key exchange" },
    { name: "SSH", usage: "Ed25519 for authentication" },
    { name: "HTTPS (modern)", usage: "X25519 for forward secrecy" },
  ];
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

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
