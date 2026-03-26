"use client";

import { type Era } from "@/lib/constants";
import AESDemo from "@/components/demos/AESDemo";
import AESAttack from "@/components/attacks/AESAttack";

interface StationProps {
  era: Era;
}

export default function AESStation({ era }: StationProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AESDemo era={era} />
      <AESAttack era={era} />
    </div>
  );
}
