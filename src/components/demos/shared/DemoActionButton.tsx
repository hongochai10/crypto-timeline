import { type Era } from "@/lib/constants";

interface DemoActionButtonProps {
  era: Era;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  ariaLabel: string;
  testId: string;
}

export default function DemoActionButton({ era, onClick, disabled, label, ariaLabel, testId }: DemoActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      aria-label={ariaLabel}
      className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
      style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
    >
      {label}
    </button>
  );
}
