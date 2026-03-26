/**
 * Caesar Cipher — Shift cipher from ~50 BC
 * Browser-safe, no external dependencies.
 */

export interface CaesarResult {
  output: string;
  shift: number;
}

/**
 * Encrypt plaintext using Caesar cipher with the given shift (1–25).
 * Non-alphabetic characters are passed through unchanged.
 */
export function caesarEncrypt(plaintext: string, shift: number): CaesarResult {
  const normalizedShift = ((shift % 26) + 26) % 26;
  const output = plaintext
    .split("")
    .map((char) => shiftChar(char, normalizedShift))
    .join("");
  return { output, shift: normalizedShift };
}

/**
 * Decrypt ciphertext encrypted with Caesar cipher.
 */
export function caesarDecrypt(ciphertext: string, shift: number): CaesarResult {
  const normalizedShift = ((shift % 26) + 26) % 26;
  return caesarEncrypt(ciphertext, 26 - normalizedShift);
}

/**
 * Brute-force all 25 possible shifts and return them all.
 * Used for the attack demonstration.
 */
export function caesarBruteForce(
  ciphertext: string
): Array<{ shift: number; output: string }> {
  return Array.from({ length: 26 }, (_, i) => ({
    shift: i,
    output: caesarDecrypt(ciphertext, i).output,
  }));
}

/**
 * Calculate letter frequency map for frequency analysis attack demo.
 * Returns a record of lowercase letter → count.
 */
export function letterFrequency(text: string): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const char of text.toLowerCase()) {
    if (char >= "a" && char <= "z") {
      freq[char] = (freq[char] ?? 0) + 1;
    }
  }
  return freq;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function shiftChar(char: string, shift: number): string {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    // Uppercase A–Z
    return String.fromCharCode(((code - 65 + shift) % 26) + 65);
  }
  if (code >= 97 && code <= 122) {
    // Lowercase a–z
    return String.fromCharCode(((code - 97 + shift) % 26) + 97);
  }
  return char;
}
