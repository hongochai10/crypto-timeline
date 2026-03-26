"use client";

import { type Era } from "@/lib/constants";
import PQCDemo from "@/components/demos/PQCDemo";
import PQCAttack from "@/components/attacks/PQCAttack";

interface StationProps {
  era: Era;
}

export default function PQCStation({ era }: StationProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PQCDemo era={era} />
      <PQCAttack era={era} />
    </div>
  );
}
