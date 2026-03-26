"use client";

import { type Era } from "@/lib/constants";
import ECCDemo from "@/components/demos/ECCDemo";
import ECCAttack from "@/components/attacks/ECCAttack";

interface StationProps {
  era: Era;
}

export default function ECCStation({ era }: StationProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ECCDemo era={era} />
      <ECCAttack era={era} />
    </div>
  );
}
