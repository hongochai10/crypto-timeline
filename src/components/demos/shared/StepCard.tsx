import { type Era } from "@/lib/constants";
import { type ReactNode } from "react";

interface StepCardProps {
  era: Era;
  children: ReactNode;
}

export default function StepCard({ era, children }: StepCardProps) {
  return (
    <div
      className="rounded-lg border p-4 flex flex-col gap-3"
      style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}
    >
      {children}
    </div>
  );
}
