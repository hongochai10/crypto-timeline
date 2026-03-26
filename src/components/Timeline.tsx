"use client";

import { useRef } from "react";
import { ERAS } from "@/lib/constants";
import Station from "./Station";
import ScrollProgress from "./ui/ScrollProgress";
import CaesarStation from "./stations/CaesarStation";
import DESStation from "./stations/DESStation";
import AESStation from "./stations/AESStation";
import RSAStation from "./stations/RSAStation";
import ECCStation from "./stations/ECCStation";
import PQCStation from "./stations/PQCStation";

const STATION_COMPONENTS = {
  caesar: CaesarStation,
  des: DESStation,
  aes: AESStation,
  rsa: RSAStation,
  ecc: ECCStation,
  pqc: PQCStation,
} as const;

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed scroll progress bar */}
      <ScrollProgress />

      {/* Hero intro */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-[var(--text-muted)] uppercase mb-6">
          TechBi Labs · Interactive Exhibit
        </p>
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-[var(--text-primary)] md:text-7xl">
          Crypto
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--era-caesar)] via-[var(--era-pqc)] to-[var(--era-ecc)]">
            Timeline
          </span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
          A journey through 2,000 years of secret writing — from Julius Caesar&apos;s shift cipher to
          lattice-based post-quantum cryptography.
        </p>
        <div className="mt-16 flex flex-col items-center gap-2 text-[var(--text-muted)]">
          <span className="font-mono text-xs tracking-widest uppercase">Scroll to explore</span>
          <div className="h-12 w-px bg-gradient-to-b from-[var(--border-default)] to-transparent" />
        </div>
      </section>

      {/* Era stations */}
      {ERAS.map((era, index) => {
        const StationContent = STATION_COMPONENTS[era.id];
        return (
          <Station key={era.id} era={era} index={index}>
            <StationContent era={era} />
          </Station>
        );
      })}

      {/* Footer */}
      <footer className="flex items-center justify-center px-6 py-20 text-center">
        <div>
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
            End of Timeline
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            The story continues — quantum computing evolves every day.
          </p>
        </div>
      </footer>
    </div>
  );
}
