import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";

type Messages = Record<string, unknown>;

export function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const key of Object.keys(override)) {
    if (
      typeof base[key] === "object" &&
      base[key] !== null &&
      typeof override[key] === "object" &&
      override[key] !== null
    ) {
      result[key] = deepMerge(base[key] as Messages, override[key] as Messages);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const enMessages = (await import(`../../messages/en.json`)).default;

  let messages: Messages;
  if (locale === "en") {
    messages = enMessages;
  } else {
    const localeMessages = (await import(`../../messages/${locale}.json`)).default;
    messages = deepMerge(enMessages, localeMessages);
  }

  return {
    locale,
    messages,
    onError(error) {
      if (error.code === "MISSING_MESSAGE") {
        // Silently fall back — the deep-merged English value is already present
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    },
    getMessageFallback({ namespace, key }) {
      return namespace ? `${namespace}.${key}` : key;
    },
  };
});
