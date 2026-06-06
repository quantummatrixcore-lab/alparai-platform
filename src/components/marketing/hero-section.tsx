"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Sparkles, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroSection({
  totalIncidents = 0,
  totalProviders = 0,
  totalCountries = 0,
}: {
  totalIncidents?: number;
  totalProviders?: number;
  totalCountries?: number;
}) {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-hero pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 h-96 w-[640px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300"
          >
            <Sparkles className="h-3 w-3" />
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-bold tracking-tight text-fg-primary sm:text-5xl md:text-6xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-fg-secondary"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/submit"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-brand-500 px-6 text-sm font-semibold text-white hover:bg-brand-600 hover:shadow-[0_0_24px_rgba(27,149,192,0.5)] transition-all"
            >
              {t("cta_primary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/suggestions"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-border-strong px-6 text-sm font-semibold text-fg-primary hover:border-brand-500 hover:text-brand-400 transition-colors"
            >
              {t("cta_secondary")}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-6 border-t border-border-subtle pt-10"
          >
            <Stat label={t("stats_incidents")} value={totalIncidents} />
            <Stat label={t("stats_providers")} value={totalProviders} />
            <Stat label={t("stats_countries")} value={totalCountries} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-brand-400 sm:text-4xl">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-fg-muted sm:text-sm">
        {label}
      </p>
    </div>
  );
}
