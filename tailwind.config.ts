import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================================
      // DESIGN TOKENS — Crypto Timeline Museum Exhibit
      // Each era has a distinct visual identity
      // ============================================================

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // ── Era Color Palettes ────────────────────────────────────
        // 1. Caesar Cipher (50 BC) — Ancient stone, papyrus, gold
        caesar: {
          bg:      "#1a1208",
          surface: "#2d1f0a",
          border:  "#4a3515",
          accent:  "#c9a227",
          muted:   "#7a6030",
          text:    "#e8d5a3",
          dim:     "#b89e72",
          glow:    "rgba(201,162,39,0.2)",
        },

        // 2. DES (1977) — Cold War industrial, steel amber
        des: {
          bg:      "#0d1117",
          surface: "#161b22",
          border:  "#2a2e36",
          accent:  "#e8850a",
          muted:   "#6b4c1a",
          text:    "#cdd9e5",
          dim:     "#9aabb8",
          glow:    "rgba(232,133,10,0.2)",
        },

        // 3. AES (2001) — Digital blue, clean tech
        aes: {
          bg:      "#040d21",
          surface: "#0a1628",
          border:  "#142033",
          accent:  "#00a3ff",
          muted:   "#1a3a5c",
          text:    "#c9d8e8",
          dim:     "#8aadc8",
          glow:    "rgba(0,163,255,0.2)",
        },

        // 4. RSA (1977) — Mathematical purple, cryptographic elegance
        rsa: {
          bg:      "#0f0a1e",
          surface: "#1a1030",
          border:  "#281848",
          accent:  "#a855f7",
          muted:   "#4a2d7a",
          text:    "#d8c8f0",
          dim:     "#a898cc",
          glow:    "rgba(168,85,247,0.2)",
        },

        // 5. ECC (1985) — Mobile emerald, efficient green
        ecc: {
          bg:      "#051208",
          surface: "#0a2010",
          border:  "#102a16",
          accent:  "#10b981",
          muted:   "#1a5030",
          text:    "#c0e0cc",
          dim:     "#80b898",
          glow:    "rgba(16,185,129,0.2)",
        },

        // 6. PQC (2024+) — Quantum cyan, beyond classical
        pqc: {
          bg:      "#050a12",
          surface: "#0a1520",
          border:  "#102030",
          accent:  "#22d3ee",
          muted:   "#0e3d4d",
          text:    "#cce8f0",
          dim:     "#80b8c8",
          glow:    "rgba(34,211,238,0.2)",
        },

        // ── Neutral palette ───────────────────────────────────────
        ink: {
          950: "#050505",
          900: "#0d0d0d",
          800: "#1a1a1a",
          700: "#2a2a2a",
          600: "#404040",
          500: "#666666",
          400: "#999999",
          300: "#c0c0c0",
          200: "#e0e0e0",
          100: "#f0f0f0",
        },
      },

      fontFamily: {
        // Primary display — era titles, station numbers
        display: ["'Cinzel'", "Georgia", "serif"],
        // Body prose — historical context, descriptions
        body:    ["var(--font-sans)", "system-ui", "sans-serif"],
        // Sans — mapped to Geist Sans loaded in layout.tsx
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        // Monospace — keys, cipher text, code snippets
        mono:    ["var(--font-mono)", "'JetBrains Mono'", "monospace"],
      },

      boxShadow: {
        // Era-specific glow effects
        "glow-caesar":  "0 0 40px 8px rgba(201,162,39,0.25), 0 0 80px 20px rgba(201,162,39,0.1)",
        "glow-des":     "0 0 40px 8px rgba(232,133,10,0.25), 0 0 80px 20px rgba(232,133,10,0.1)",
        "glow-aes":     "0 0 40px 8px rgba(0,163,255,0.25), 0 0 80px 20px rgba(0,163,255,0.1)",
        "glow-rsa":     "0 0 40px 8px rgba(168,85,247,0.25), 0 0 80px 20px rgba(168,85,247,0.1)",
        "glow-ecc":     "0 0 40px 8px rgba(16,185,129,0.25), 0 0 80px 20px rgba(16,185,129,0.1)",
        "glow-pqc":     "0 0 40px 8px rgba(34,211,238,0.25), 0 0 80px 20px rgba(34,211,238,0.1)",

        // UI component shadows
        "panel":        "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)",
        "panel-lg":     "0 8px 48px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)",
        "inner":        "inset 0 1px 3px rgba(0,0,0,0.6)",
        "card":         "0 2px 16px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05)",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scan: {
          "0%":   { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 89%, 91%, 93%, 100%": { opacity: "1" },
          "90%":                      { opacity: "0.8" },
          "92%":                      { opacity: "0.9" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },

      animation: {
        float:             "float 5s ease-in-out infinite",
        "glow-pulse":      "glow-pulse 3s ease-in-out infinite",
        blink:             "blink 1s step-end infinite",
        "slide-up":        "slide-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in-right":  "slide-in-right 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":         "fade-in 0.8s ease-out both",
        "pulse-slow":      "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer:           "shimmer 2.5s linear infinite",
        scan:              "scan 10s linear infinite",
        flicker:           "flicker 12s infinite",
        "pulse-ring":      "pulse-ring 1.5s cubic-bezier(0,0,0.2,1) infinite",
      },

      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        snap:   "cubic-bezier(0.77, 0, 0.18, 1)",
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      transitionDuration: {
        "400":  "400ms",
        "600":  "600ms",
        "800":  "800ms",
        "1200": "1200ms",
        "2000": "2000ms",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      zIndex: {
        "60":  "60",
        "70":  "70",
        "80":  "80",
        "90":  "90",
        "100": "100",
      },

      backdropBlur: {
        xs: "2px",
      },

      backgroundImage: {
        "glow-radial": "radial-gradient(ellipse at center, var(--tw-gradient-from) 0%, transparent 70%)",
        "scanlines":   "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
