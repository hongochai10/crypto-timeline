export type EraId = "caesar" | "des" | "aes" | "rsa" | "ecc" | "pqc";

export interface Era {
  id: EraId;
  name: string;
  year: string;
  subtitle: string;
  description: string;
  /** Primary accent / highlight color */
  color: string;
  /** Deep background color for this era */
  bgColor: string;
  /** Card/surface background */
  surfaceColor: string;
  /** Body text color */
  textColor: string;
  /** CSS rgba glow for shadows / radial gradients */
  glowColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  keyFact: string;
  status: "broken" | "weakened" | "secure" | "quantum-threatened" | "quantum-safe";
}

export const ERAS: Era[] = [
  {
    id: "caesar",
    name: "Caesar Cipher",
    year: "50 BC",
    subtitle: "The Birth of Secret Writing",
    description:
      "Julius Caesar communicated with his generals using a simple shift cipher — each letter replaced by one three positions ahead in the alphabet. Revolutionary for its time, trivial by modern standards.",
    color: "#c9a227",
    bgColor: "#1a1208",
    surfaceColor: "#2d1f0a",
    textColor: "#e8d5a3",
    glowColor: "rgba(201,162,39,0.22)",
    bgClass: "bg-caesar-bg",
    textClass: "text-caesar-accent",
    borderClass: "border-caesar-border",
    keyFact: "Key space: only 25 possible keys — a child can brute-force it today",
    status: "broken",
  },
  {
    id: "des",
    name: "DES",
    year: "1977",
    subtitle: "The Government Standard",
    description:
      "The Data Encryption Standard was adopted by NIST and used by banks worldwide. With a 56-bit key, it seemed unbreakable — until the EFF's Deep Crack machine cracked it in 22 hours.",
    color: "#e8850a",
    bgColor: "#0d1117",
    surfaceColor: "#161b22",
    textColor: "#cdd9e5",
    glowColor: "rgba(232,133,10,0.22)",
    bgClass: "bg-des-bg",
    textClass: "text-des-accent",
    borderClass: "border-des-border",
    keyFact: "56-bit key = 2⁵⁶ possibilities — cracked in 22 hours in 1998",
    status: "broken",
  },
  {
    id: "aes",
    name: "AES",
    year: "2001",
    subtitle: "The Unbreakable Standard",
    description:
      "The Advanced Encryption Standard (Rijndael) won a global competition. AES-256 has a keyspace larger than the number of atoms in the observable universe. No practical attack exists.",
    color: "#00a3ff",
    bgColor: "#040d21",
    surfaceColor: "#0a1628",
    textColor: "#c9d8e8",
    glowColor: "rgba(0,163,255,0.22)",
    bgClass: "bg-aes-bg",
    textClass: "text-aes-accent",
    borderClass: "border-aes-border",
    keyFact: "2²⁵⁶ keys — more than atoms in the observable universe",
    status: "secure",
  },
  {
    id: "rsa",
    name: "RSA",
    year: "1977",
    subtitle: "The Public Key Revolution",
    description:
      "Rivest, Shamir and Adleman solved the key distribution problem. RSA lets strangers share secrets over an open channel — the foundation of HTTPS and modern internet security.",
    color: "#c084fc",
    bgColor: "#0f0a1e",
    surfaceColor: "#1a1030",
    textColor: "#d8c8f0",
    glowColor: "rgba(192,132,252,0.22)",
    bgClass: "bg-rsa-bg",
    textClass: "text-rsa-accent",
    borderClass: "border-rsa-border",
    keyFact: "Security relies on the hardness of integer factorization — vulnerable to Shor's algorithm",
    status: "quantum-threatened",
  },
  {
    id: "ecc",
    name: "ECC",
    year: "1985",
    subtitle: "Elliptic Curves and the Mobile Era",
    description:
      "Elliptic Curve Cryptography achieves the same security as RSA with much smaller keys — crucial for mobile devices, TLS, and Bitcoin's digital signatures.",
    color: "#10b981",
    bgColor: "#051208",
    surfaceColor: "#0a2010",
    textColor: "#c0e0cc",
    glowColor: "rgba(16,185,129,0.22)",
    bgClass: "bg-ecc-bg",
    textClass: "text-ecc-accent",
    borderClass: "border-ecc-border",
    keyFact: "256-bit ECC ≈ 3072-bit RSA in security — also vulnerable to quantum computers",
    status: "quantum-threatened",
  },
  {
    id: "pqc",
    name: "Post-Quantum",
    year: "2024+",
    subtitle: "We Are Here — Preparing for Q-Day",
    description:
      "NIST standardized CRYSTALS-Kyber and CRYSTALS-Dilithium in 2024. These lattice-based algorithms resist attacks from quantum computers. The race to migrate begins now.",
    color: "#22d3ee",
    bgColor: "#050a12",
    surfaceColor: "#0a1520",
    textColor: "#cce8f0",
    glowColor: "rgba(34,211,238,0.22)",
    bgClass: "bg-pqc-bg",
    textClass: "text-pqc-accent",
    borderClass: "border-pqc-border",
    keyFact: "Lattice problems: even Shor's algorithm cannot break them efficiently",
    status: "quantum-safe",
  },
];

export const ERA_STATUS_LABELS: Record<Era["status"], string> = {
  broken: "Broken",
  weakened: "Weakened",
  secure: "Secure",
  "quantum-threatened": "Quantum Threatened",
  "quantum-safe": "Quantum Safe",
};

export const ERA_STATUS_COLORS: Record<Era["status"], string> = {
  broken: "text-red-400 bg-red-400/10 border-red-400/30",
  weakened: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  secure: "text-green-400 bg-green-400/10 border-green-400/30",
  "quantum-threatened": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "quantum-safe": "text-teal-400 bg-teal-400/10 border-teal-400/30",
};
