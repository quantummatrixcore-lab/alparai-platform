/**
 * i18n configuration for next-intl.
 */

import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/lib/constants";
import type { AbstractIntlMessages } from "next-intl";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !SUPPORTED_LOCALES.includes(locale as Locale)) {
    locale = DEFAULT_LOCALE;
  }

  let messages: AbstractIntlMessages;
  try {
    if (locale === "tr") {
      messages = (await import("../../messages/tr.json")).default as AbstractIntlMessages;
    } else if (locale === "de") {
      messages = (await import("../../messages/de.json")).default as AbstractIntlMessages;
    } else if (locale === "fr") {
      messages = (await import("../../messages/fr.json")).default as AbstractIntlMessages;
    } else {
      messages = (await import("../../messages/en.json")).default as AbstractIntlMessages;
    }
  } catch {
    notFound();
  }

  return {
    locale,
    messages,
    timeZone: "Europe/Istanbul",
    now: new Date(),
  };
});
