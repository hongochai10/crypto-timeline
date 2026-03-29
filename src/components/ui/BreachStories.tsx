"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface BreachStory {
  title: string;
  year: string;
  summary: string;
  impact: string;
}

interface BreachStoriesProps {
  stories: BreachStory[];
  color: string;
}

export default function BreachStories({ stories, color }: BreachStoriesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tc = useTranslations("common");

  if (stories.length === 0) return null;

  return (
    <motion.div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: color + "25", backgroundColor: color + "06" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 md:p-6 text-left transition-colors hover:bg-white/[0.02]"
        aria-expanded={isOpen}
        aria-label={isOpen ? tc("hideBreachStories") : tc("showBreachStories")}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
            style={{ backgroundColor: color + "18", color }}
          >
            {"\u{1F6E1}"}
          </span>
          <h3 className="font-mono text-xs uppercase tracking-widest" style={{ color }}>
            {tc("breachStories")}
          </h3>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs"
          style={{ color: color + "80" }}
        >
          &#9660;
        </motion.span>
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-5 pb-5 md:px-6 md:pb-6">
              {stories.map((story, i) => (
                <motion.div
                  key={story.title}
                  className="rounded-lg border p-4"
                  style={{ borderColor: color + "18", backgroundColor: color + "08" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  {/* Story header */}
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <span
                      className="inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest"
                      style={{ color, borderColor: color + "40", backgroundColor: color + "12" }}
                    >
                      {story.year}
                    </span>
                    <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      {story.title}
                    </h4>
                  </div>

                  {/* Story summary */}
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                    {story.summary}
                  </p>

                  {/* Impact callout */}
                  <div
                    className="flex items-start gap-2 rounded-lg border px-3 py-2"
                    style={{ borderColor: color + "20", backgroundColor: color + "0a" }}
                  >
                    <span className="shrink-0 text-xs mt-0.5" style={{ color }}>
                      {tc("impact")}:
                    </span>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {story.impact}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
