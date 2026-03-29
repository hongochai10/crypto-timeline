"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full border px-1 py-1"
      style={{
        backgroundColor: "rgba(8,11,20,0.85)",
        borderColor: "var(--border-default)",
        backdropFilter: "blur(8px)",
      }}
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          aria-pressed={locale === loc}
          className="rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-all"
          style={
            locale === loc
              ? {
                  backgroundColor: "var(--era-active-color, #c9a227)" + "30",
                  color: "var(--era-active-color, #c9a227)",
                }
              : {
                  backgroundColor: "transparent",
                  color: "var(--text-muted)",
                }
          }
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
