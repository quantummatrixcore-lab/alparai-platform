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
    <section className="border-border-subtle relative overflow-hidden border-b">
      <div aria-hidden="true" className="bg-gradient-hero pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="bg-danger-500/10 pointer-events-none absolute -top-32 left-1/2 h-96 w-[640px] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border-danger-500/30 bg-danger-500/10 text-danger-300 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
          >
            <Sparkles className="h-3 w-3" />
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-fg-primary mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-fg-secondary mt-6 text-lg leading-relaxed sm:text-xl"
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
              className="bg-danger-500 hover:bg-danger-600 inline-flex h-12 items-center gap-2 rounded-md px-8 text-sm font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(239,68,68,0.5)]"
            >
              {t("cta_primary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/incidents"
              className="border-border-strong text-fg-primary hover:border-brand-500 hover:text-brand-400 inline-flex h-12 items-center gap-2 rounded-md border px-6 text-sm font-semibold transition-colors"
            >
              {t("cta_secondary")}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="border-border-subtle mt-16 grid grid-cols-3 gap-6 border-t pt-10"
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
      <p className="text-danger-400 text-3xl font-bold sm:text-4xl">{value.toLocaleString()}</p>
      <p className="text-fg-muted mt-1 text-xs tracking-wider uppercase sm:text-sm">{label}</p>
    </div>
  );
}
