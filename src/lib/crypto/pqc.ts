/**
 * Post-Quantum Cryptography (PQC) — 2024+
 * Educational demonstration of lattice-based cryptography concepts.
 *
 * This is a SIMPLIFIED EDUCATIONAL DEMO of Learning With Errors (LWE),
 * inspired by CRYSTALS-Kyber (now ML-KEM, NIST FIPS 203).
 *
 * NOT cryptographically secure — for visualization and education only.
 * Do NOT use in production.
 *
 * Browser-safe, no Node.js crypto.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LWEPublicKey {
  /** Matrix A (n×n) */
  A: number[][];
  /** Vector b = A·s + e (mod q) */
  b: number[];
  /** Modulus q */
  q: number;
  /** Dimension n */
  n: number;
}

export interface LWEPrivateKey {
  /** Secret vector s */
  s: number[];
  /** Modulus q */
  q: number;
}

export interface LWEKeyPair {
  publicKey: LWEPublicKey;
  privateKey: LWEPrivateKey;
}

export interface LWEEncryptResult {
  /** Ciphertext component u = A^T · r + e1 (mod q) */
  u: number[];
  /** Ciphertext component v = b^T · r + e2 + floor(q/2)·m (mod q) */
  v: number;
  /** Original bit (0 or 1) */
  bit: number;
}

export interface LWEDecryptResult {
  bit: number;
  rawValue: number;
  threshold: number;
}

export interface QuantumThreatInfo {
  algorithm: string;
  classicalSecurity: string;
  quantumSecurity: string;
  broken: boolean;
  shorsApplicable: boolean;
}

export interface LatticeVisualization {
  /** 2D lattice basis vectors for visualization */
  basis: [[number, number], [number, number]];
  /** Sample lattice points */
  points: Array<[number, number]>;
  /** A "noisy" point near but not on the lattice */
  noisyPoint: [number, number];
}

// ─── Parameters ──────────────────────────────────────────────────────────────

/** Toy LWE parameters — educational only */
const DEFAULT_N = 8;    // dimension
const DEFAULT_Q = 97;   // small prime modulus
const DEFAULT_B = 3;    // error bound (errors ∈ [-B, B])

// ─── Key Generation ──────────────────────────────────────────────────────────

/**
 * Generate an LWE key pair with toy parameters.
 * Inspired by the structure of CRYSTALS-Kyber but greatly simplified.
 */
export function pqcGenerateKeyPair(
  n = DEFAULT_N,
  q = DEFAULT_Q,
  errorBound = DEFAULT_B
): LWEKeyPair {
  // Generate random matrix A (n×n) mod q
  const A = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => randomInt(0, q - 1))
  );

  // Generate secret vector s (small coefficients)
  const s = Array.from({ length: n }, () => randomInt(0, 1));

  // Generate error vector e (small errors)
  const e = Array.from({ length: n }, () => randomSmallInt(errorBound));

  // Compute b = A·s + e (mod q)
  const b = matVecMul(A, s, q).map((val, i) => mod(val + e[i], q));

  return {
    publicKey: { A, b, q, n },
    privateKey: { s, q },
  };
}

// ─── Encrypt / Decrypt ───────────────────────────────────────────────────────

/**
 * Encrypt a single bit (0 or 1) using LWE.
 */
export function pqcEncryptBit(bit: 0 | 1, pk: LWEPublicKey): LWEEncryptResult {
  const { A, b, q, n } = pk;

  // Random binary vector r
  const r = Array.from({ length: n }, () => randomInt(0, 1));

  // Small errors
  const e1 = Array.from({ length: n }, () => randomSmallInt(DEFAULT_B));
  const e2 = randomSmallInt(DEFAULT_B);

  // u = A^T · r + e1 (mod q)
  const AT = transpose(A);
  const u = matVecMul(AT, r, q).map((val, i) => mod(val + e1[i], q));

  // v = b·r + e2 + floor(q/2)·bit (mod q)
  const bDotR = b.reduce((acc, bi, i) => acc + bi * r[i], 0);
  const v = mod(bDotR + e2 + Math.floor(q / 2) * bit, q);

  return { u, v, bit };
}

/**
 * Decrypt an LWE ciphertext to recover the original bit.
 */
export function pqcDecryptBit(
  ciphertext: LWEEncryptResult,
  sk: LWEPrivateKey
): LWEDecryptResult {
  const { u, v } = ciphertext;
  const { s, q } = sk;

  // Compute s·u (mod q)
  const sDotU = s.reduce((acc, si, i) => acc + si * u[i], 0);

  // w = v - s·u (mod q)
  const w = mod(v - sDotU, q);

  // Decode: if w is close to q/2, bit = 1; if close to 0, bit = 0
  const threshold = Math.floor(q / 4);
  const half = Math.floor(q / 2);
  const bit = Math.abs(w - half) < threshold ? 1 : 0;

  return { bit, rawValue: w, threshold };
}

/**
 * Encrypt a string as a sequence of bits using LWE.
 */
export function pqcEncryptString(
  text: string,
  pk: LWEPublicKey
): LWEEncryptResult[] {
  const bytes = new TextEncoder().encode(text);
  const bits: Array<0 | 1> = [];
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push(((byte >> i) & 1) as 0 | 1);
    }
  }
  return bits.map((bit) => pqcEncryptBit(bit, pk));
}

/**
 * Decrypt a sequence of LWE ciphertexts back to a string.
 */
export function pqcDecryptString(
  ciphertexts: LWEEncryptResult[],
  sk: LWEPrivateKey
): string {
  const bits = ciphertexts.map((ct) => pqcDecryptBit(ct, sk).bit);
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i * 8 + j];
    }
    bytes[i] = byte;
  }
  return new TextDecoder().decode(bytes);
}

// ─── Quantum Threat Analysis ─────────────────────────────────────────────────

/**
 * Describes how Shor's algorithm threatens classical cryptography.
 */
export function quantumThreatAnalysis(): QuantumThreatInfo[] {
  return [
    {
      algorithm: "RSA-2048",
      classicalSecurity: "~112 bits (requires factoring large integers)",
      quantumSecurity: "~0 bits (Shor's algorithm factors in polynomial time)",
      broken: true,
      shorsApplicable: true,
    },
    {
      algorithm: "ECDSA P-256",
      classicalSecurity: "~128 bits (requires solving ECDLP)",
      quantumSecurity: "~0 bits (Shor's algorithm solves DLP in polynomial time)",
      broken: true,
      shorsApplicable: true,
    },
    {
      algorithm: "AES-256",
      classicalSecurity: "256 bits",
      quantumSecurity: "~128 bits (Grover's algorithm halves effective key length)",
      broken: false,
      shorsApplicable: false,
    },
    {
      algorithm: "ML-KEM (Kyber)",
      classicalSecurity: "~128 bits (hardness of Module-LWE)",
      quantumSecurity: "~128 bits (no known quantum speedup for LWE)",
      broken: false,
      shorsApplicable: false,
    },
    {
      algorithm: "ML-DSA (Dilithium)",
      classicalSecurity: "~128 bits (hardness of Module-LWE/SIS)",
      quantumSecurity: "~128 bits (no known quantum speedup)",
      broken: false,
      shorsApplicable: false,
    },
  ];
}

/**
 * Returns NIST PQC standardization timeline for display.
 */
export function nistPQCTimeline(): Array<{
  year: number;
  event: string;
}> {
  return [
    { year: 2016, event: "NIST launches PQC standardization competition" },
    { year: 2017, event: "69 submissions received from global researchers" },
    { year: 2019, event: "Round 2: 26 candidates selected" },
    { year: 2020, event: "Round 3: 7 finalists + 8 alternates" },
    { year: 2022, event: "NIST announces 4 algorithms for standardization" },
    { year: 2024, event: "FIPS 203 (ML-KEM/Kyber), FIPS 204 (ML-DSA/Dilithium), FIPS 205 (SLH-DSA) finalized" },
  ];
}

// ─── Lattice Visualization ────────────────────────────────────────────────────

/**
 * Generate a simple 2D lattice visualization for UI rendering.
 * Returns basis vectors and sample lattice points in integer grid.
 */
export function generateLatticeVisualization(scale = 40): LatticeVisualization {
  // Basis vectors for a simple lattice
  const b1: [number, number] = [scale, 0];
  const b2: [number, number] = [Math.floor(scale * 0.3), scale];

  // Generate lattice points as integer combinations of basis vectors
  const points: Array<[number, number]> = [];
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      points.push([
        i * b1[0] + j * b2[0],
        i * b1[1] + j * b2[1],
      ]);
    }
  }

  // A "noisy" point: closest lattice point + small random error
  const basePt = points[Math.floor(points.length / 2 + 1)];
  const noisyPoint: [number, number] = [
    basePt[0] + Math.floor(scale * 0.15),
    basePt[1] + Math.floor(scale * 0.1),
  ];

  return {
    basis: [b1, b2],
    points,
    noisyPoint,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mod(a: number, m: number): number {
  return ((a % m) + m) % m;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSmallInt(bound: number): number {
  return Math.floor(Math.random() * (2 * bound + 1)) - bound;
}

function matVecMul(matrix: number[][], vec: number[], q: number): number[] {
  return matrix.map((row) =>
    mod(
      row.reduce((sum, val, i) => sum + val * vec[i], 0),
      q
    )
  );
}

function transpose(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  return Array.from({ length: cols }, (_, j) =>
    Array.from({ length: rows }, (_, i) => matrix[i][j])
  );
}
