"use client";

import { useTranslations, useLocale } from "next-intl";

export function useI18n(namespace: string) {
  const locale = useLocale();
  const t = useTranslations(namespace);
  return { t, locale };
}
