import { describe, it, expect } from "vitest";
import { getQuizQuestions } from "./quiz-data";
import { type EraId } from "./constants";
import enMessages from "../../messages/en.json";
import viMessages from "../../messages/vi.json";

// Helper: resolve nested key from messages object
function resolveKey(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

function makeTranslator(messages: Record<string, unknown>) {
  return (key: string) => resolveKey(messages, `quiz.${key}`);
}

const ALL_ERAS: EraId[] = ["caesar", "des", "aes", "rsa", "ecc", "pqc"];

// ─── getQuizQuestions ─────────────────────────────────────────────────────────

describe("getQuizQuestions", () => {
  const t = makeTranslator(enMessages as Record<string, unknown>);

  it("returns 5 questions for each era", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      expect(questions).toHaveLength(5);
    }
  });

  it("generates unique IDs for each question within an era", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      const ids = questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("generates unique IDs across all eras", () => {
    const allIds: string[] = [];
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      allIds.push(...questions.map((q) => q.id));
    }
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it("each question has a valid type", () => {
    const validTypes = ["multiple-choice", "crack-cipher", "match", "factor", "select-many"];
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        expect(validTypes).toContain(q.type);
      }
    }
  });

  it("each question has non-empty question text", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        expect(q.question.length).toBeGreaterThan(0);
        // Should not be the raw translation key
        expect(q.question).not.toContain(".question");
      }
    }
  });

  it("each question has a non-empty hint", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        expect(q.hint.length).toBeGreaterThan(0);
        expect(q.hint).not.toContain(".hint");
      }
    }
  });

  it("each question has a non-empty explanation", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        expect(q.explanation.length).toBeGreaterThan(0);
        expect(q.explanation).not.toContain(".explanation");
      }
    }
  });

  it("each question with options has at least 2 options", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        if (q.options) {
          expect(q.options.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it("correctAnswers indices are within option bounds", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        if (q.options) {
          for (const idx of q.correctAnswers) {
            expect(idx).toBeGreaterThanOrEqual(0);
            expect(idx).toBeLessThan(q.options.length);
          }
        }
      }
    }
  });

  it("each question has at least one correct answer", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        expect(q.correctAnswers.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("select-many questions have multiple correct answers", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        if (q.type === "select-many") {
          expect(q.correctAnswers.length).toBeGreaterThan(1);
        }
      }
    }
  });

  it("single-select questions have exactly one correct answer", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        if (q.type === "multiple-choice" || q.type === "crack-cipher") {
          expect(q.correctAnswers).toHaveLength(1);
        }
      }
    }
  });

  it("question IDs follow the pattern {eraId}-q{index}", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      questions.forEach((q, i) => {
        expect(q.id).toBe(`${era}-q${i}`);
      });
    }
  });

  it("option texts are non-empty strings and not raw keys", () => {
    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, t);
      for (const q of questions) {
        if (q.options) {
          for (const opt of q.options) {
            expect(typeof opt).toBe("string");
            expect(opt.length).toBeGreaterThan(0);
            expect(opt).not.toContain(".options.");
          }
        }
      }
    }
  });
});

// ─── i18n completeness ───────────────────────────────────────────────────────

describe("quiz i18n completeness", () => {
  it("Vietnamese translations exist for all quiz questions", () => {
    const tVI = makeTranslator(viMessages as Record<string, unknown>);

    for (const era of ALL_ERAS) {
      const questions = getQuizQuestions(era, tVI);
      for (const q of questions) {
        // If translation is missing, the key itself is returned
        expect(q.question).not.toMatch(/^quiz\./);
        expect(q.hint).not.toMatch(/^quiz\./);
        expect(q.explanation).not.toMatch(/^quiz\./);
        if (q.options) {
          for (const opt of q.options) {
            expect(opt).not.toMatch(/^quiz\./);
          }
        }
      }
    }
  });

  it("EN and VI have the same number of questions per era", () => {
    const tEN = makeTranslator(enMessages as Record<string, unknown>);
    const tVI = makeTranslator(viMessages as Record<string, unknown>);

    for (const era of ALL_ERAS) {
      const enQs = getQuizQuestions(era, tEN);
      const viQs = getQuizQuestions(era, tVI);
      expect(enQs.length).toBe(viQs.length);
    }
  });

  it("EN and VI questions have the same structure (same number of options)", () => {
    const tEN = makeTranslator(enMessages as Record<string, unknown>);
    const tVI = makeTranslator(viMessages as Record<string, unknown>);

    for (const era of ALL_ERAS) {
      const enQs = getQuizQuestions(era, tEN);
      const viQs = getQuizQuestions(era, tVI);
      for (let i = 0; i < enQs.length; i++) {
        expect(enQs[i].options?.length).toBe(viQs[i].options?.length);
        expect(enQs[i].correctAnswers).toEqual(viQs[i].correctAnswers);
        expect(enQs[i].type).toBe(viQs[i].type);
      }
    }
  });
});
