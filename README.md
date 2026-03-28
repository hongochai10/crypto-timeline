# Crypto Timeline

An interactive museum-exhibit web application that tells the story of 2,000 years of cryptographic evolution through six educational stations -- from Caesar's simple substitution cipher (50 BC) to post-quantum lattice-based cryptography (2024).

## Overview

Crypto Timeline is a single-page educational experience built with Next.js. Each "station" represents a distinct cryptographic algorithm and its historical era, featuring:

- **Historical narrative** with key figures and timeline of events
- **Interactive demos** for encryption, decryption, key generation, and digital signatures
- **Simulated attacks** showing how and why algorithms get broken
- **Museum-quality visuals** with era-specific color palettes, cinematic transitions, and scroll-driven animations

> **Educational use only.** The cryptographic implementations in this project are designed to teach concepts. Some (Caesar, DES, toy LWE) are intentionally simplified and must not be used for real-world security.

## The Six Stations

| # | Station | Era | Algorithm | Status |
|---|---------|-----|-----------|--------|
| 1 | **Caesar Cipher** | 50 BC | Shift substitution | Broken |
| 2 | **DES** | 1977 | Feistel network, 56-bit key | Broken |
| 3 | **AES** | 2001 | AES-256-GCM (Web Crypto API) | Secure |
| 4 | **RSA** | 1977 | RSA-OAEP 2048/4096-bit (Web Crypto API) | Quantum-Threatened |
| 5 | **ECC** | 1985 | ECDSA / ECDH P-256 (Web Crypto API) | Quantum-Threatened |
| 6 | **Post-Quantum** | 2024 | Learning With Errors (lattice-based) | Quantum-Safe |

### Station Details

**Caesar Cipher** -- The birth of secret writing. Demonstrates shift encryption and frequency analysis attacks pioneered by Al-Kindi. Brute-forces all 25 possible keys in real time.

**DES** -- The government standard. Full 16-round Feistel network with S-box substitution, expansion permutation, and key scheduling. Shows why 56-bit keys fell to EFF's Deep Crack in 22 hours (1998).

**AES** -- The unbreakable standard. Uses the browser's Web Crypto API for AES-256-GCM authenticated encryption with PBKDF2 key derivation (100,000 iterations). Visualizes the 2^256 keyspace.

**RSA** -- The public-key revolution. Generates real 2048-bit key pairs via Web Crypto API. Includes a toy factorization demo on small semi-primes to illustrate the mathematical trapdoor.

**ECC** -- Elliptic curves and the mobile era. ECDSA signing/verification and ECDH key agreement on P-256. Compares key-size efficiency against RSA (256-bit ECC ~ 3072-bit RSA).

**Post-Quantum Cryptography** -- Preparing for Q-Day. Educational Learning With Errors (LWE) implementation with 2D lattice visualization. Covers NIST standards: ML-KEM (Kyber), ML-DSA (Dilithium), SLH-DSA.

## Architecture

```
src/
  app/
    layout.tsx            # Root layout, fonts, metadata
    page.tsx              # Homepage entry point
    globals.css           # CSS variables for era color palettes
  components/
    Timeline.tsx          # Main orchestrator + hero section
    Station.tsx           # Shared station wrapper (scroll animations, era theming)
    stations/             # 6 station content components
    demos/                # 6 interactive demo components
    attacks/              # 6 attack simulation components
    ui/                   # EraTransition, InteractiveInput, ScrollProgress
  lib/
    constants.ts          # Era definitions, status mappings
    crypto/               # Algorithm implementations + unit tests
      caesar.ts           # Shift cipher, frequency analysis, brute-force
      des.ts              # Full DES: Feistel, S-boxes, key schedule (educational)
      aes.ts              # AES-256-GCM via Web Crypto API + PBKDF2
      rsa.ts              # RSA-OAEP via Web Crypto API + toy factorization
      ecc.ts              # ECDSA/ECDH via Web Crypto API
      pqc.ts              # LWE toy implementation + lattice visualization
  e2e/
    timeline.spec.ts      # Playwright end-to-end tests
```

### Component Hierarchy

```
<Timeline>
  <StarField />              # Hero background particles
  <EraColorStrip />          # Animated era selector
  <ScrollProgress />         # Fixed progress indicator
  {ERAS.map → <Station>}     # 6 stations, each containing:
    <*Station />              #   Historical narrative + key figures
      <*Demo />              #   Interactive encryption/decryption
      <*Attack />            #   Vulnerability demonstration
  <EraTransition />          # Cinematic transitions between eras
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS with era-specific design tokens |
| Animation | Framer Motion |
| Icons | Lucide React |
| Crypto | Web Crypto API (SubtleCrypto) -- no Node.js modules |
| Unit Tests | Vitest + Testing Library |
| E2E Tests | Playwright |
| Fonts | Cinzel (display), Geist Sans (body), Geist Mono (code) |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** (included with Node.js)
- A modern browser with [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) support (Chrome, Firefox, Safari, Edge)

### Installation

```bash
git clone <repository-url>
cd crypto-timeline-project
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Testing

```bash
# Unit tests
npm test

# Unit tests in watch mode
npm run test:watch

# Unit tests with coverage
npm run test:coverage

# E2E tests (requires Playwright browsers)
npx playwright install
npx playwright test
```

## Browser Compatibility

This project relies on the **Web Crypto API** (`window.crypto.subtle`) for AES, RSA, and ECC operations. All modern browsers support this:

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 37+ |
| Firefox | 34+ |
| Safari | 11+ |
| Edge | 12+ |

Caesar, DES, and PQC stations use pure JavaScript implementations and work in any browser.

> **HTTPS required in production.** The Web Crypto API is only available in [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) (HTTPS or localhost).

## Deployment

### Vercel (recommended)

The project is configured for zero-config deployment on [Vercel](https://vercel.com):

```bash
npx vercel
```

### Other Platforms

Build the production bundle and serve the `.next` output:

```bash
npm run build
npm start          # Starts on port 3000
```

The `next.config.mjs` includes security headers (CSP, HSTS, X-Frame-Options) that apply automatically.

## Cryptographic Algorithms -- Security Disclaimers

| Algorithm | Implementation | Security Notes |
|-----------|---------------|----------------|
| **Caesar** | Educational, pure JS | Trivially breakable. 25 possible keys. |
| **DES** | Educational, pure JS | Broken. 56-bit key cracked in hours with modern hardware. |
| **AES-256-GCM** | Web Crypto API | Production-grade. NIST standard, no known practical attacks. |
| **RSA-OAEP** | Web Crypto API | Secure today (2048+ bit keys), but vulnerable to future quantum computers (Shor's algorithm). |
| **ECDSA/ECDH** | Web Crypto API | Secure today (P-256+), but also vulnerable to Shor's algorithm. |
| **LWE (PQC)** | Educational toy (n=8, q=97) | Toy parameters only. Real ML-KEM (Kyber) uses n=256, q=3329. |

**Do not use the Caesar, DES, or toy LWE implementations for anything other than learning.**

## License

This project is for educational purposes.
