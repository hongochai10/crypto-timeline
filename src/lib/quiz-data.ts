import { type EraId } from "@/lib/constants";
import { type QuizQuestion } from "@/components/quiz/StationQuiz";

type TranslateFn = (key: string) => string;

/**
 * Build quiz questions for a given era using the translation function.
 * Each era has 3 questions; translations live under `quiz.{eraId}.q{n}.*`.
 */
export function getQuizQuestions(eraId: EraId, t: TranslateFn): QuizQuestion[] {
  const meta = QUIZ_META[eraId];
  return meta.map((m, i) => ({
    id: `${eraId}-q${i}`,
    type: m.type,
    question: t(`${eraId}.q${i}.question`),
    options: m.optionCount
      ? Array.from({ length: m.optionCount }, (_, j) => t(`${eraId}.q${i}.options.${j}`))
      : undefined,
    correctAnswers: m.correctAnswers,
    hint: t(`${eraId}.q${i}.hint`),
    explanation: t(`${eraId}.q${i}.explanation`),
  }));
}

/** Structural metadata only — no translatable strings */
interface QuestionMeta {
  type: QuizQuestion["type"];
  optionCount: number;
  correctAnswers: number[];
}

const QUIZ_META: Record<EraId, QuestionMeta[]> = {
  caesar: [
    // Q0: Crack this cipher (shift = 3, "KHOOR" → "HELLO")
    { type: "crack-cipher", optionCount: 4, correctAnswers: [1] },
    // Q1: How many possible keys?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [0] },
    // Q2: What attack breaks Caesar?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [2] },
  ],
  des: [
    // Q0: Why is 56-bit key breakable?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [2] },
    // Q1: How long did Deep Crack take?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [1] },
    // Q2: What replaced DES?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [3] },
  ],
  aes: [
    // Q0: Match key size to security level
    { type: "multiple-choice", optionCount: 4, correctAnswers: [2] },
    // Q1: How did AES become the standard?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [1] },
    // Q2: AES-256 key space comparison
    { type: "multiple-choice", optionCount: 4, correctAnswers: [3] },
  ],
  rsa: [
    // Q0: What mathematical problem secures RSA?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [0] },
    // Q1: Factor this small number (15 = 3 × 5)
    { type: "crack-cipher", optionCount: 4, correctAnswers: [2] },
    // Q2: Why is RSA quantum-threatened?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [1] },
  ],
  ecc: [
    // Q0: Compare key sizes — 256-bit ECC equals?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [2] },
    // Q1: Where is ECC used?
    { type: "select-many", optionCount: 4, correctAnswers: [0, 1, 3] },
    // Q2: Why smaller keys matter
    { type: "multiple-choice", optionCount: 4, correctAnswers: [3] },
  ],
  pqc: [
    // Q0: Which algorithms are quantum-safe? (select many)
    { type: "select-many", optionCount: 5, correctAnswers: [0, 2, 4] },
    // Q1: What makes lattice problems hard for quantum?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [1] },
    // Q2: When did NIST standardize PQC?
    { type: "multiple-choice", optionCount: 4, correctAnswers: [2] },
  ],
};
