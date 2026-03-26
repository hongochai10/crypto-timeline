"use client";

import { type Era } from "@/lib/constants";
import DESDemo from "@/components/demos/DESDemo";
import DESAttack from "@/components/attacks/DESAttack";

interface StationProps {
  era: Era;
}

export default function DESStation({ era }: StationProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DESDemo era={era} />
      <DESAttack era={era} />
    </div>
  );
}
