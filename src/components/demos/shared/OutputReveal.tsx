import { motion } from "framer-motion";
import { type ReactNode, type CSSProperties } from "react";

interface OutputRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function OutputReveal({ children, className = "", style }: OutputRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
