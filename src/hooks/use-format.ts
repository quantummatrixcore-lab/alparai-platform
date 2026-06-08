"use client";

import { useLocale } from "next-intl";

export function useFormatDate() {
  const locale = useLocale();
  return (date: Date, options?: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    }).format(date);
}

export function useFormatNumber() {
  const locale = useLocale();
  return (num: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locale, options).format(num);
}
