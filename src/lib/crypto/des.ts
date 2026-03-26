/**
 * DES (Data Encryption Standard) — 1977
 * Simplified educational implementation for demo purposes.
 * NOT cryptographically secure — for visualization only.
 *
 * Real DES operates on 64-bit blocks with a 56-bit key using 16 Feistel rounds.
 * This implementation mirrors the structure faithfully for educational value.
 *
 * Browser-safe, no Node.js crypto.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DESResult {
  output: string;
  /** Hex-encoded ciphertext/plaintext */
  hex: string;
  rounds: DESRound[];
}

export interface DESRound {
  round: number;
  left: string;
  right: string;
  subkey: string;
}

export interface DESBruteForceProgress {
  keysChecked: number;
  keyspaceSize: number;
  percentComplete: number;
  /** Estimated time to crack (ms) at current rate */
  estimatedTotalMs: number;
}

// ─── DES Tables ──────────────────────────────────────────────────────────────

/** Initial Permutation (IP) */
const IP = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17,  9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7,
];

/** Final Permutation (IP^-1) */
const IP_INV = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41,  9, 49, 17, 57, 25,
];

/** Expansion permutation E */
const E = [
  32,  1,  2,  3,  4,  5,
   4,  5,  6,  7,  8,  9,
   8,  9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32,  1,
];

/** Permutation P */
const P = [
  16,  7, 20, 21,
  29, 12, 28, 17,
   1, 15, 23, 26,
   5, 18, 31, 10,
   2,  8, 24, 14,
  32, 27,  3,  9,
  19, 13, 30,  6,
  22, 11,  4, 25,
];

/** PC-1 permutation for key schedule */
const PC1 = [
  57, 49, 41, 33, 25, 17,  9,
   1, 58, 50, 42, 34, 26, 18,
  10,  2, 59, 51, 43, 35, 27,
  19, 11,  3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
   7, 62, 54, 46, 38, 30, 22,
  14,  6, 61, 53, 45, 37, 29,
  21, 13,  5, 28, 20, 12,  4,
];

/** PC-2 permutation for key schedule */
const PC2 = [
  14, 17, 11, 24,  1,  5,
   3, 28, 15,  6, 21, 10,
  23, 19, 12,  4, 26,  8,
  16,  7, 27, 20, 13,  2,
  41, 52, 31, 37, 47, 55,
  30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53,
  46, 42, 50, 36, 29, 32,
];

/** Left rotation schedule */
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

/** S-Boxes (8 total) */
const S_BOXES: number[][][] = [
  [
    [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],
    [0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],
    [4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],
    [15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
  ],
  [
    [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],
    [3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],
    [0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],
    [13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
  ],
  [
    [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],
    [13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],
    [13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],
    [1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
  ],
  [
    [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],
    [13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],
    [10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],
    [3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
  ],
  [
    [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],
    [14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],
    [4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],
    [11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
  ],
  [
    [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],
    [10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],
    [9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],
    [4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
  ],
  [
    [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],
    [13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],
    [1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],
    [6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
  ],
  [
    [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],
    [1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],
    [7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],
    [2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11],
  ],
];

// ─── Core DES ────────────────────────────────────────────────────────────────

type Bits = number[];

function permute(input: Bits, table: number[]): Bits {
  return table.map((pos) => input[pos - 1]);
}

function xor(a: Bits, b: Bits): Bits {
  return a.map((bit, i) => bit ^ b[i]);
}

function leftRotate(bits: Bits, n: number): Bits {
  return [...bits.slice(n), ...bits.slice(0, n)];
}

function bytesToBits(bytes: Uint8Array): Bits {
  const bits: Bits = [];
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }
  return bits;
}

function bitsToBytes(bits: Bits): Uint8Array {
  const bytes = new Uint8Array(bits.length / 8);
  for (let i = 0; i < bytes.length; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i * 8 + j];
    }
    bytes[i] = byte;
  }
  return bytes;
}

function generateSubkeys(keyBits: Bits): Bits[] {
  const permuted = permute(keyBits, PC1);
  let C = permuted.slice(0, 28);
  let D = permuted.slice(28, 56);
  const subkeys: Bits[] = [];
  for (let i = 0; i < 16; i++) {
    C = leftRotate(C, SHIFTS[i]);
    D = leftRotate(D, SHIFTS[i]);
    subkeys.push(permute([...C, ...D], PC2));
  }
  return subkeys;
}

function sBoxSubstitute(bits: Bits): Bits {
  const output: Bits = [];
  for (let i = 0; i < 8; i++) {
    const chunk = bits.slice(i * 6, i * 6 + 6);
    const row = (chunk[0] << 1) | chunk[5];
    const col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4];
    const val = S_BOXES[i][row][col];
    for (let b = 3; b >= 0; b--) {
      output.push((val >> b) & 1);
    }
  }
  return output;
}

function feistel(right: Bits, subkey: Bits): Bits {
  const expanded = permute(right, E);
  const xored = xor(expanded, subkey);
  const substituted = sBoxSubstitute(xored);
  return permute(substituted, P);
}

function desBlock(block: Bits, subkeys: Bits[]): Bits {
  const permuted = permute(block, IP);
  let L = permuted.slice(0, 32);
  let R = permuted.slice(32, 64);
  for (let i = 0; i < 16; i++) {
    const newR = xor(L, feistel(R, subkeys[i]));
    L = R;
    R = newR;
  }
  return permute([...R, ...L], IP_INV);
}

function padPKCS7(data: Uint8Array, blockSize: number): Uint8Array {
  const padLen = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded.fill(padLen, data.length);
  return padded;
}

function unpadPKCS7(data: Uint8Array): Uint8Array {
  const padLen = data[data.length - 1];
  return data.slice(0, data.length - padLen);
}

function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Prepare an 8-byte key from a string (truncate or pad with zeros).
 */
function prepareKey(keyStr: string): Uint8Array {
  const keyBytes = stringToBytes(keyStr).slice(0, 8);
  const key = new Uint8Array(8);
  key.set(keyBytes);
  return key;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Encrypt plaintext using simplified DES (ECB mode, PKCS7 padding).
 * keyStr is truncated/padded to 8 bytes.
 */
export function desEncrypt(plaintext: string, keyStr: string): DESResult {
  const keyBytes = prepareKey(keyStr);
  const keyBits = bytesToBits(keyBytes);
  const subkeys = generateSubkeys(keyBits);
  const rounds: DESRound[] = [];

  const plainBytes = padPKCS7(stringToBytes(plaintext), 8);
  const outputBytes = new Uint8Array(plainBytes.length);

  for (let i = 0; i < plainBytes.length; i += 8) {
    const blockBits = bytesToBits(plainBytes.slice(i, i + 8));
    const permuted = permute(blockBits, IP);
    let L = permuted.slice(0, 32);
    let R = permuted.slice(32, 64);

    for (let r = 0; r < 16; r++) {
      const newR = xor(L, feistel(R, subkeys[r]));
      if (i === 0) {
        rounds.push({
          round: r + 1,
          left: bitsToBytes(L).reduce((h, b) => h + b.toString(16).padStart(2, "0"), ""),
          right: bitsToBytes(R).reduce((h, b) => h + b.toString(16).padStart(2, "0"), ""),
          subkey: bitsToBytes(subkeys[r].slice(0, 48)).reduce((h, b) => h + b.toString(16).padStart(2, "0"), ""),
        });
      }
      L = R;
      R = newR;
    }

    const cipherBits = permute([...R, ...L], IP_INV);
    outputBytes.set(bitsToBytes(cipherBits), i);
  }

  const hex = bytesToHex(outputBytes);
  return { output: hex, hex, rounds };
}

/**
 * Decrypt DES-encrypted hex string.
 */
export function desDecrypt(ciphertextHex: string, keyStr: string): DESResult {
  const keyBytes = prepareKey(keyStr);
  const keyBits = bytesToBits(keyBytes);
  const subkeys = generateSubkeys(keyBits).reverse();

  const cipherBytes = hexToBytes(ciphertextHex);
  const outputBytes = new Uint8Array(cipherBytes.length);

  for (let i = 0; i < cipherBytes.length; i += 8) {
    const blockBits = bytesToBits(cipherBytes.slice(i, i + 8));
    const decrypted = desBlock(blockBits, subkeys);
    outputBytes.set(bitsToBytes(decrypted), i);
  }

  const unpadded = unpadPKCS7(outputBytes);
  const output = bytesToString(unpadded);
  return { output, hex: ciphertextHex, rounds: [] };
}

/**
 * Returns brute-force attack statistics showing how many keys exist
 * and how fast modern hardware could search them (for demo visualization).
 */
export function desBruteForceStats(): DESBruteForceProgress {
  // DES has 2^56 ≈ 72 quadrillion possible keys
  const keyspaceSize = Math.pow(2, 56);
  // EFF Deep Crack (1998) cracked DES in ~22 hours
  // Modern FPGA clusters can do ~1 billion keys/sec per chip
  const keysPerSecond = 1_000_000_000;
  const estimatedTotalMs = (keyspaceSize / keysPerSecond) * 1000;

  return {
    keysChecked: 0,
    keyspaceSize,
    percentComplete: 0,
    estimatedTotalMs,
  };
}
