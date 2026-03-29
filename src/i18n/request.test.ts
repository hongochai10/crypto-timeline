import { describe, it, expect } from "vitest";
import { deepMerge } from "./request";
import enMessages from "../../messages/en.json";
import viMessages from "../../messages/vi.json";

describe("i18n fallback", () => {
  describe("deepMerge", () => {
    it("returns base values when override is empty", () => {
      const base = { a: "hello", b: { c: "world" } };
      const result = deepMerge(base, {});
      expect(result).toEqual({ a: "hello", b: { c: "world" } });
    });

    it("overrides values from the override object", () => {
      const base = { a: "hello", b: "world" };
      const override = { a: "xin chào" };
      const result = deepMerge(base, override);
      expect(result).toEqual({ a: "xin chào", b: "world" });
    });

    it("deep merges nested objects", () => {
      const base = { ns: { key1: "English 1", key2: "English 2" } };
      const override = { ns: { key1: "Vietnamese 1" } };
      const result = deepMerge(base, override);
      expect(result).toEqual({ ns: { key1: "Vietnamese 1", key2: "English 2" } });
    });

    it("preserves English values for keys missing in Vietnamese", () => {
      // Simulate a missing key: take vi messages and remove one key
      const partialVi = JSON.parse(JSON.stringify(viMessages)) as Record<string, unknown>;
      const commonVi = partialVi.common as Record<string, unknown>;
      delete commonVi.historicalNarrative;

      const merged = deepMerge(
        enMessages as Record<string, unknown>,
        partialVi,
      );

      const mergedCommon = merged.common as Record<string, string>;
      // The deleted key should fall back to English
      expect(mergedCommon.historicalNarrative).toBe("Historical Narrative");
      // An existing Vietnamese key should remain Vietnamese
      expect(mergedCommon.timeline).toBe("Dòng Thời Gian");
    });
  });

  describe("real en/vi message files", () => {
    it("all top-level namespaces in en.json exist in vi.json", () => {
      const enKeys = Object.keys(enMessages);
      const viKeys = Object.keys(viMessages);
      for (const key of enKeys) {
        expect(viKeys).toContain(key);
      }
    });

    it("merged messages contain all English keys even if vi is partial", () => {
      const merged = deepMerge(
        enMessages as Record<string, unknown>,
        viMessages as Record<string, unknown>,
      );
      // Every key in English should exist in merged result
      function checkKeys(en: Record<string, unknown>, result: Record<string, unknown>, path = "") {
        for (const key of Object.keys(en)) {
          const fullPath = path ? `${path}.${key}` : key;
          expect(result).toHaveProperty(key, expect.anything());
          if (typeof en[key] === "object" && en[key] !== null) {
            checkKeys(en[key] as Record<string, unknown>, result[key] as Record<string, unknown>, fullPath);
          }
        }
      }
      checkKeys(enMessages as Record<string, unknown>, merged);
    });
  });
});
