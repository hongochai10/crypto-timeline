"use client";

import { type Era } from "@/lib/constants";
import CaesarDemo from "@/components/demos/CaesarDemo";
import CaesarAttack from "@/components/attacks/CaesarAttack";

interface StationProps {
  era: Era;
}

export default function CaesarStation({ era }: StationProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CaesarDemo era={era} />
      <CaesarAttack era={era} />
    </div>
  );
}
