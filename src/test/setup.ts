import "@testing-library/jest-dom";
import enMessages from "../../messages/en.json";

// Helper to resolve a nested key from messages object
function resolveKey(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path; // Return the key itself if not found
    }
  }
  return typeof current === "string" ? current : path;
}

// Mock next-intl so all components get real English translations in tests
vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const t = (key: string, params?: Record<string, string | number>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      let value = resolveKey(enMessages as Record<string, unknown>, fullKey);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    };
    // next-intl rich text support: t.rich() returns the same as t()
    t.rich = t;
    return t;
  },
  useLocale: () => "en",
  useMessages: () => enMessages,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
  hasLocale: (locales: string[], locale: string) => locales.includes(locale),
}));

// Mock next-intl/server
vi.mock("next-intl/server", () => ({
  getMessages: async () => enMessages,
  setRequestLocale: () => {},
  getRequestConfig: (fn: unknown) => fn,
}));

// Mock framer-motion to render plain elements in unit tests
vi.mock("framer-motion", () => {
  const React = require("react");
  const actual = {
    motion: new Proxy(
      {},
      {
        get: (_target: unknown, prop: string) => {
          return React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
            const {
              animate: _a,
              initial: _i,
              exit: _e,
              transition: _t,
              whileInView: _w,
              whileHover: _wh,
              whileTap: _wt,
              viewport: _v,
              variants: _va,
              ...rest
            } = props;
            return React.createElement(prop, { ...rest, ref });
          });
        },
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: (val: unknown) => val,
    useInView: () => true,
  };
  return actual;
});

// Mock next/navigation for useSearchParams
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
  usePathname: () => "/",
  notFound: () => {},
}));

// Mock i18n navigation used by LanguageSwitcher
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
    const React = require("react");
    return React.createElement("a", props, children);
  },
  useRouter: () => ({ replace: () => {}, push: () => {} }),
  usePathname: () => "/",
  redirect: () => {},
}));

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "vi"], defaultLocale: "en" },
}));

// Mock ThemeProvider for tests
vi.mock("@/components/ThemeProvider", () => {
  const React = require("react");
  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    useTheme: () => ({ theme: "dark", toggleTheme: () => {} }),
  };
});

// Mock IntersectionObserver for jsdom (skip in node environment)
if (typeof window !== "undefined") {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, "IntersectionObserver", {
    value: MockIntersectionObserver,
  });
}
