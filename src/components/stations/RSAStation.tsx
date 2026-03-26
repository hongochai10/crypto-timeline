"use client";

import { type Era } from "@/lib/constants";
import RSADemo from "@/components/demos/RSADemo";
import RSAAttack from "@/components/attacks/RSAAttack";

interface StationProps {
  era: Era;
}

export default function RSAStation({ era }: StationProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <RSADemo era={era} />
      <RSAAttack era={era} />
    </div>
  );
}
