"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--era-caesar), var(--era-des), var(--era-aes), var(--era-rsa), var(--era-ecc), var(--era-pqc))",
      }}
    />
  );
}
