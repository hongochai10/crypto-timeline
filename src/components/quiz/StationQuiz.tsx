"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { type EraId } from "@/lib/constants";
import { useProgressTracking } from "@/hooks/useProgressTracking";

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "crack-cipher" | "match" | "factor" | "select-many";
  question: string;
  /** For multiple-choice / crack-cipher */
  options?: string[];
  /** Index(es) of correct answer(s) */
  correctAnswers: number[];
  /** Hint shown after first wrong attempt */
  hint: string;
  /** Explanation shown after correct answer */
  explanation: string;
}

interface StationQuizProps {
  eraId: EraId;
  color: string;
  questions: QuizQuestion[];
}

function OptionButton({
  label,
  index,
  color,
  state,
  onClick,
  disabled,
}: {
  label: string;
  index: number;
  color: string;
  state: "idle" | "selected" | "correct" | "wrong";
  onClick: () => void;
  disabled: boolean;
}) {
  const bgMap = {
    idle: color + "08",
    selected: color + "20",
    correct: "#10b98120",
    wrong: "#ef444420",
  };
  const borderMap = {
    idle: color + "25",
    selected: color + "60",
    correct: "#10b98160",
    wrong: "#ef444460",
  };
  const textMap = {
    idle: "var(--text-secondary)",
    selected: color,
    correct: "#10b981",
    wrong: "#ef4444",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left rounded-lg border p-3 font-mono text-sm transition-colors disabled:cursor-not-allowed"
      style={{
        backgroundColor: bgMap[state],
        borderColor: borderMap[state],
        color: textMap[state],
      }}
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
    >
      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold" style={{ backgroundColor: color + "18", color }}>
        {String.fromCharCode(65 + index)}
      </span>
      {label}
    </motion.button>
  );
}

function SelectManyButton({
  label,
  index,
  color,
  selected,
  state,
  onClick,
  disabled,
}: {
  label: string;
  index: number;
  color: string;
  selected: boolean;
  state: "idle" | "correct" | "wrong";
  onClick: () => void;
  disabled: boolean;
}) {
  const isHighlighted = selected || state !== "idle";
  const bgColor = state === "correct" ? "#10b98120" : state === "wrong" ? "#ef444420" : selected ? color + "20" : color + "08";
  const borderColor = state === "correct" ? "#10b98160" : state === "wrong" ? "#ef444460" : selected ? color + "60" : color + "25";
  const textColor = state === "correct" ? "#10b981" : state === "wrong" ? "#ef4444" : isHighlighted ? color : "var(--text-secondary)";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left rounded-lg border p-3 font-mono text-sm transition-colors disabled:cursor-not-allowed"
      style={{ backgroundColor: bgColor, borderColor, color: textColor }}
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
    >
      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold" style={{ backgroundColor: color + "18", color }}>
        {selected ? "✓" : String.fromCharCode(65 + index)}
      </span>
      {label}
    </motion.button>
  );
}

export default function StationQuiz({ eraId, color, questions }: StationQuizProps) {
  const t = useTranslations("quiz");
  const { markQuizCompleted } = useProgressTracking();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [_isCorrect, setIsCorrect] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [optionStates, setOptionStates] = useState<Record<number, "idle" | "selected" | "correct" | "wrong">>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [started, setStarted] = useState(false);

  // Mark quiz as completed in progress tracking
  useEffect(() => {
    if (quizComplete) {
      markQuizCompleted(eraId);
    }
  }, [quizComplete, eraId, markQuizCompleted]);

  const question = questions[currentQ];

  const resetQuestion = useCallback(() => {
    setAttempts(0);
    setShowHint(false);
    setAnswered(false);
    setIsCorrect(false);
    setSelectedOptions([]);
    setOptionStates({});
  }, []);

  const handleSingleSelect = useCallback(
    (index: number) => {
      if (answered) return;

      const correct = question.correctAnswers.includes(index);
      const newStates: Record<number, "idle" | "selected" | "correct" | "wrong"> = {};

      if (correct) {
        newStates[index] = "correct";
        setOptionStates(newStates);
        setAnswered(true);
        setIsCorrect(true);
        setScore((s) => s + (attempts === 0 ? 1 : 0));
      } else {
        newStates[index] = "wrong";
        setOptionStates((prev) => ({ ...prev, ...newStates }));
        setAttempts((a) => a + 1);
        if (attempts === 0) setShowHint(true);
      }
    },
    [answered, question, attempts]
  );

  const handleMultiToggle = useCallback(
    (index: number) => {
      if (answered) return;
      setSelectedOptions((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    },
    [answered]
  );

  const handleMultiSubmit = useCallback(() => {
    if (answered || selectedOptions.length === 0) return;

    const correct = question.correctAnswers;
    const isMatch =
      selectedOptions.length === correct.length &&
      selectedOptions.every((i) => correct.includes(i));

    const newStates: Record<number, "idle" | "correct" | "wrong"> = {};
    selectedOptions.forEach((i) => {
      newStates[i] = correct.includes(i) ? "correct" : "wrong";
    });

    setOptionStates(newStates);

    if (isMatch) {
      setAnswered(true);
      setIsCorrect(true);
      setScore((s) => s + (attempts === 0 ? 1 : 0));
    } else {
      setAttempts((a) => a + 1);
      if (attempts === 0) setShowHint(true);
      // Reset selections after a short delay
      setTimeout(() => {
        setSelectedOptions([]);
        setOptionStates({});
      }, 1200);
    }
  }, [answered, selectedOptions, question, attempts]);

  const handleNext = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      setQuizComplete(true);
    } else {
      setCurrentQ((q) => q + 1);
      resetQuestion();
    }
  }, [currentQ, questions.length, resetQuestion]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setScore(0);
    setQuizComplete(false);
    setStarted(false);
    resetQuestion();
  }, [resetQuestion]);

  if (!started) {
    return (
      <motion.div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: color + "25", backgroundColor: color + "06" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold"
              style={{ backgroundColor: color + "18", color }}
            >
              ?
            </span>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest" style={{ color }}>
                {t("title")}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {t("questionCount", { count: questions.length })}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="rounded-lg border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            style={{ color, borderColor: color + "50", backgroundColor: color + "14" }}
          >
            {t("startQuiz")}
          </button>
        </div>
      </motion.div>
    );
  }

  if (quizComplete) {
    const percent = Math.round((score / questions.length) * 100);
    const grade = percent === 100 ? "perfect" : percent >= 60 ? "good" : "tryAgain";

    return (
      <motion.div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: color + "25", backgroundColor: color + "06" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="p-5 md:p-6 text-center">
          <motion.div
            className="text-4xl mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            {grade === "perfect" ? "🏆" : grade === "good" ? "🎯" : "📚"}
          </motion.div>

          <h3 className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color }}>
            {t("quizComplete")}
          </h3>

          <div className="mb-4">
            <span className="text-3xl font-bold font-mono" style={{ color }}>
              {score}/{questions.length}
            </span>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {t(grade === "perfect" ? "resultPerfect" : grade === "good" ? "resultGood" : "resultTryAgain")}
            </p>
          </div>

          {/* Score bar */}
          <div className="h-2 w-full max-w-xs mx-auto overflow-hidden rounded-full mb-4" style={{ backgroundColor: color + "15" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </div>

          <button
            onClick={handleRestart}
            className="rounded-lg border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            style={{ color, borderColor: color + "50", backgroundColor: color + "14" }}
          >
            {t("retryQuiz")}
          </button>
        </div>
      </motion.div>
    );
  }

  const isMulti = question.type === "select-many";

  return (
    <motion.div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: color + "25", backgroundColor: color + "06" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 md:p-6 pb-0 md:pb-0">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold"
            style={{ backgroundColor: color + "18", color }}
          >
            ?
          </span>
          <h3 className="font-mono text-xs uppercase tracking-widest" style={{ color }}>
            {t("title")}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
            {t("progress", { current: currentQ + 1, total: questions.length })}
          </span>
          <span className="font-mono text-xs font-bold" style={{ color }}>
            {t("score", { score })}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-5 md:mx-6 mt-3 h-1 overflow-hidden rounded-full" style={{ backgroundColor: color + "15" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          className="p-5 md:p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Question */}
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            {question.question}
          </p>
          {isMulti && (
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              {t("selectAll")}
            </p>
          )}
          {!isMulti && <div className="mb-3" />}

          {/* Options */}
          <div className="flex flex-col gap-2">
            {question.options?.map((opt, i) =>
              isMulti ? (
                <SelectManyButton
                  key={i}
                  label={opt}
                  index={i}
                  color={color}
                  selected={selectedOptions.includes(i)}
                  state={(optionStates[i] as "idle" | "correct" | "wrong") || "idle"}
                  onClick={() => handleMultiToggle(i)}
                  disabled={answered}
                />
              ) : (
                <OptionButton
                  key={i}
                  label={opt}
                  index={i}
                  color={color}
                  state={optionStates[i] || "idle"}
                  onClick={() => handleSingleSelect(i)}
                  disabled={answered}
                />
              )
            )}
          </div>

          {/* Submit button for multi-select */}
          {isMulti && !answered && (
            <button
              onClick={handleMultiSubmit}
              disabled={selectedOptions.length === 0}
              className="mt-3 w-full rounded-lg border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color, borderColor: color + "50", backgroundColor: color + "14" }}
            >
              {t("submitAnswer")}
            </button>
          )}

          {/* Hint */}
          <AnimatePresence>
            {showHint && !answered && (
              <motion.div
                className="mt-3 rounded-lg border p-3 text-xs"
                style={{ borderColor: "#f59e0b40", backgroundColor: "#f59e0b08", color: "#f59e0b" }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span className="font-semibold">{t("hint")}:</span> {question.hint}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation on correct */}
          <AnimatePresence>
            {answered && (
              <motion.div
                className="mt-3 rounded-lg border p-3 text-xs"
                style={{
                  borderColor: "#10b98140",
                  backgroundColor: "#10b98108",
                  color: "#10b981",
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span className="font-semibold">{t("correct")}!</span> {question.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {answered && (
            <motion.button
              onClick={handleNext}
              className="mt-4 w-full rounded-lg border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ color, borderColor: color + "50", backgroundColor: color + "14" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentQ + 1 >= questions.length ? t("seeResults") : t("nextQuestion")}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
