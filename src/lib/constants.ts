export type EraId = "caesar" | "des" | "aes" | "rsa" | "ecc" | "pqc";

export type EraStatus = "broken" | "weakened" | "secure" | "quantum-threatened" | "quantum-safe";

export interface Era {
  id: EraId;
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
  status: EraStatus;
}

export const ERAS: Era[] = [
  {
    id: "caesar",
    color: "#c9a227",
    bgColor: "#1a1208",
    surfaceColor: "#2d1f0a",
    textColor: "#e8d5a3",
    glowColor: "rgba(201,162,39,0.22)",
    bgClass: "bg-caesar-bg",
    textClass: "text-caesar-accent",
    borderClass: "border-caesar-border",
    status: "broken",
  },
  {
    id: "des",
    color: "#e8850a",
    bgColor: "#0d1117",
    surfaceColor: "#161b22",
    textColor: "#cdd9e5",
    glowColor: "rgba(232,133,10,0.22)",
    bgClass: "bg-des-bg",
    textClass: "text-des-accent",
    borderClass: "border-des-border",
    status: "broken",
  },
  {
    id: "aes",
    color: "#00a3ff",
    bgColor: "#040d21",
    surfaceColor: "#0a1628",
    textColor: "#c9d8e8",
    glowColor: "rgba(0,163,255,0.22)",
    bgClass: "bg-aes-bg",
    textClass: "text-aes-accent",
    borderClass: "border-aes-border",
    status: "secure",
  },
  {
    id: "rsa",
    color: "#c084fc",
    bgColor: "#0f0a1e",
    surfaceColor: "#1a1030",
    textColor: "#d8c8f0",
    glowColor: "rgba(192,132,252,0.22)",
    bgClass: "bg-rsa-bg",
    textClass: "text-rsa-accent",
    borderClass: "border-rsa-border",
    status: "quantum-threatened",
  },
  {
    id: "ecc",
    color: "#10b981",
    bgColor: "#051208",
    surfaceColor: "#0a2010",
    textColor: "#c0e0cc",
    glowColor: "rgba(16,185,129,0.22)",
    bgClass: "bg-ecc-bg",
    textClass: "text-ecc-accent",
    borderClass: "border-ecc-border",
    status: "quantum-threatened",
  },
  {
    id: "pqc",
    color: "#22d3ee",
    bgColor: "#050a12",
    surfaceColor: "#0a1520",
    textColor: "#cce8f0",
    glowColor: "rgba(34,211,238,0.22)",
    bgClass: "bg-pqc-bg",
    textClass: "text-pqc-accent",
    borderClass: "border-pqc-border",
    status: "quantum-safe",
  },
];

export const ERA_STATUS_COLORS: Record<EraStatus, string> = {
  broken: "text-red-400 bg-red-400/10 border-red-400/30",
  weakened: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  secure: "text-green-400 bg-green-400/10 border-green-400/30",
  "quantum-threatened": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "quantum-safe": "text-teal-400 bg-teal-400/10 border-teal-400/30",
};
