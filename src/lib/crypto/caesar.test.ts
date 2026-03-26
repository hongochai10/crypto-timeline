import { describe, it, expect } from "vitest";
import {
  caesarEncrypt,
  caesarDecrypt,
  caesarBruteForce,
  letterFrequency,
} from "./caesar";

// ─── caesarEncrypt ────────────────────────────────────────────────────────────

describe("caesarEncrypt", () => {
  it("encrypts lowercase letters correctly", () => {
    expect(caesarEncrypt("hello", 3).output).toBe("khoor");
  });

  it("encrypts uppercase letters correctly", () => {
    expect(caesarEncrypt("HELLO", 3).output).toBe("KHOOR");
  });

  it("preserves mixed case", () => {
    expect(caesarEncrypt("Hello World", 3).output).toBe("Khoor Zruog");
  });

  it("passes through non-alphabetic characters unchanged", () => {
    expect(caesarEncrypt("abc 123!@#", 1).output).toBe("bcd 123!@#");
  });

  it("wraps around at end of alphabet (lowercase)", () => {
    expect(caesarEncrypt("xyz", 3).output).toBe("abc");
  });

  it("wraps around at end of alphabet (uppercase)", () => {
    expect(caesarEncrypt("XYZ", 3).output).toBe("ABC");
  });

  it("shift of 0 leaves plaintext unchanged", () => {
    expect(caesarEncrypt("hello", 0).output).toBe("hello");
  });

  it("shift of 26 is identity (full cycle)", () => {
    expect(caesarEncrypt("hello", 26).output).toBe("hello");
  });

  it("handles shift > 26 correctly via modulo", () => {
    expect(caesarEncrypt("abc", 27).output).toBe("bcd"); // 27 % 26 = 1
  });

  it("handles negative shifts correctly", () => {
    // shift -1 → normalizedShift = ((-1 % 26) + 26) % 26 = 25
    expect(caesarEncrypt("bcd", -1).output).toBe("abc");
  });

  it("returns the normalised shift value in result", () => {
    const result = caesarEncrypt("abc", 29);
    expect(result.shift).toBe(3); // 29 % 26 = 3
  });

  it("encrypts empty string", () => {
    expect(caesarEncrypt("", 5).output).toBe("");
  });

  it("encrypts string with only spaces", () => {
    expect(caesarEncrypt("   ", 10).output).toBe("   ");
  });

  it("handles shift = 13 (ROT13 — self-inverse)", () => {
    const first = caesarEncrypt("Hello", 13).output;
    expect(caesarEncrypt(first, 13).output).toBe("Hello");
  });

  // Historical accuracy: Caesar's actual cipher used shift 3
  it("historical Caesar cipher — shift 3 on 'VENI VIDI VICI'", () => {
    expect(caesarEncrypt("VENI VIDI VICI", 3).output).toBe("YHQL YLGL YLFL");
  });
});

// ─── caesarDecrypt ────────────────────────────────────────────────────────────

describe("caesarDecrypt", () => {
  it("decrypts back to original plaintext", () => {
    const { output: ciphertext } = caesarEncrypt("hello world", 7);
    expect(caesarDecrypt(ciphertext, 7).output).toBe("hello world");
  });

  it("decrypts uppercase ciphertext", () => {
    const { output: ciphertext } = caesarEncrypt("HELLO", 13);
    expect(caesarDecrypt(ciphertext, 13).output).toBe("HELLO");
  });

  it("decrypt(encrypt(x, k), k) === x for all shifts 0–25", () => {
    const plaintext = "The quick brown fox";
    for (let shift = 0; shift <= 25; shift++) {
      const { output: ciphertext } = caesarEncrypt(plaintext, shift);
      expect(caesarDecrypt(ciphertext, shift).output).toBe(plaintext);
    }
  });

  it("decrypt with shift 0 is identity", () => {
    expect(caesarDecrypt("hello", 0).output).toBe("hello");
  });

  it("decrypt with shift 26 is identity", () => {
    expect(caesarDecrypt("hello", 26).output).toBe("hello");
  });

  it("preserves non-alphabetic characters during decryption", () => {
    const ciphertext = caesarEncrypt("Hello, World! 2024", 5).output;
    expect(caesarDecrypt(ciphertext, 5).output).toBe("Hello, World! 2024");
  });

  it("handles negative shift in decrypt", () => {
    const ciphertext = caesarEncrypt("abc", -1).output;
    expect(caesarDecrypt(ciphertext, -1).output).toBe("abc");
  });
});

// ─── caesarBruteForce ────────────────────────────────────────────────────────

describe("caesarBruteForce", () => {
  it("returns exactly 26 entries", () => {
    const results = caesarBruteForce("khoor");
    expect(results).toHaveLength(26);
  });

  it("includes all shifts 0–25", () => {
    const results = caesarBruteForce("test");
    const shifts = results.map((r) => r.shift);
    expect(shifts).toEqual(Array.from({ length: 26 }, (_, i) => i));
  });

  it("shift 3 entry decrypts 'khoor' to 'hello'", () => {
    const results = caesarBruteForce("khoor");
    const entry = results.find((r) => r.shift === 3);
    expect(entry?.output).toBe("hello");
  });

  it("shift 0 entry is identity (ciphertext unchanged)", () => {
    const ciphertext = "KHOOR";
    const results = caesarBruteForce(ciphertext);
    expect(results[0].output).toBe(ciphertext);
  });

  it("handles empty string", () => {
    const results = caesarBruteForce("");
    expect(results).toHaveLength(26);
    results.forEach((r) => expect(r.output).toBe(""));
  });

  it("each entry's output reverses the corresponding shift", () => {
    const original = "Hello, World!";
    const { output: ciphertext } = caesarEncrypt(original, 17);
    const results = caesarBruteForce(ciphertext);
    const entry = results.find((r) => r.shift === 17);
    expect(entry?.output).toBe(original);
  });
});

// ─── letterFrequency ─────────────────────────────────────────────────────────

describe("letterFrequency", () => {
  it("counts each letter correctly", () => {
    const freq = letterFrequency("aab");
    expect(freq["a"]).toBe(2);
    expect(freq["b"]).toBe(1);
  });

  it("is case-insensitive (normalises to lowercase)", () => {
    const freq = letterFrequency("AaBb");
    expect(freq["a"]).toBe(2);
    expect(freq["b"]).toBe(2);
  });

  it("ignores non-alphabetic characters", () => {
    const freq = letterFrequency("hello 123 world!");
    expect(Object.keys(freq).every((k) => k >= "a" && k <= "z")).toBe(true);
    expect(freq["h"]).toBe(1);
    expect(freq["l"]).toBe(3);
  });

  it("returns empty object for empty string", () => {
    expect(letterFrequency("")).toEqual({});
  });

  it("returns empty object for string with no letters", () => {
    expect(letterFrequency("123!@# ")).toEqual({});
  });

  it("counts all 26 letters present in a pangram", () => {
    const pangram = "the quick brown fox jumps over the lazy dog";
    const freq = letterFrequency(pangram);
    const letters = Object.keys(freq);
    // A pangram contains all 26 letters
    expect(letters.length).toBe(26);
  });

  it("total count matches number of alphabetic characters", () => {
    const text = "Hello, World!";
    const freq = letterFrequency(text);
    const total = Object.values(freq).reduce((a, b) => a + b, 0);
    // "HelloWorld" = 10 letters
    expect(total).toBe(10);
  });

  it("frequency values are positive integers", () => {
    const freq = letterFrequency("cryptography");
    Object.values(freq).forEach((count) => {
      expect(count).toBeGreaterThan(0);
      expect(Number.isInteger(count)).toBe(true);
    });
  });
});
