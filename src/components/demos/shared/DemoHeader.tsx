"use client";

import { useTranslations } from "next-intl";
import { type Era, type EraId } from "@/lib/constants";
import ShareDemoButton from "@/components/ui/ShareDemoButton";

interface DemoHeaderProps {
  era: Era;
  subtitle: string;
  stationId: EraId;
  shareParams: Record<string, string | number>;
}

export default function DemoHeader({ era, subtitle, stationId, shareParams }: DemoHeaderProps) {
  const tc = useTranslations("common");

  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          {tc("interactiveDemo")}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
      </div>
      <ShareDemoButton stationId={stationId} params={shareParams} accentColor={era.color} />
    </div>
  );
}
