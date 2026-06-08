"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Sparkles, ArrowRight, ShieldAlert } from "lucide-react";
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
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="border-border-subtle bg-bg-primary relative overflow-hidden border-b pt-24 pb-32">
      {/* Deep Space Background Effects */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <motion.div
          style={{ y: y1, opacity }}
          className="bg-brand-500/10 absolute -top-[40%] left-1/2 h-[800px] w-[1000px] -translate-x-1/2 rounded-full mix-blend-screen blur-[120px]"
        />
        <div className="bg-accent-500/5 absolute top-[20%] left-[20%] h-[400px] w-[400px] rounded-full mix-blend-screen blur-[100px]" />
        <div className="bg-danger-500/5 absolute top-[30%] right-[10%] h-[500px] w-[500px] rounded-full mix-blend-screen blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <div className="border-brand-500/30 bg-brand-500/10 text-brand-300 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              <span>{t("eyebrow")}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="via-fg-secondary to-brand-300 bg-gradient-to-br from-white bg-clip-text pb-4 text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-fg-muted mx-auto mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl md:text-2xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/submit"
              className="group bg-danger-500 hover:bg-danger-400 relative inline-flex h-14 items-center gap-2 rounded-xl px-8 text-base font-bold text-white shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(244,63,94,0.6)]"
            >
              <ShieldAlert className="h-5 w-5" />
              {t("cta_primary")}
            </Link>
            <Link
              href="/incidents"
              className="border-border-strong bg-bg-elevated/50 text-fg-primary hover:border-brand-500 hover:text-brand-300 inline-flex h-14 items-center gap-2 rounded-xl border px-8 text-base font-semibold backdrop-blur-md transition-colors"
            >
              {t("cta_secondary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3"
          >
            <StatCard
              label={t("stats_incidents")}
              value={totalIncidents}
              glowColor="rgba(244,63,94,0.15)"
            />
            <StatCard
              label={t("stats_providers")}
              value={totalProviders}
              glowColor="rgba(168,85,247,0.15)"
            />
            <StatCard
              label={t("stats_countries")}
              value={totalCountries}
              glowColor="rgba(6,182,212,0.15)"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  glowColor,
}: {
  label: string;
  value: number;
  glowColor: string;
}) {
  return (
    <div
      className="border-border-strong bg-bg-elevated/30 hover:border-border-subtle relative overflow-hidden rounded-2xl border p-8 backdrop-blur-md transition-all"
      style={{ boxShadow: `0 0 40px ${glowColor} inset` }}
    >
      <p className="text-fg-primary text-4xl font-extrabold md:text-5xl">
        {value.toLocaleString()}
      </p>
      <p className="text-fg-muted mt-2 text-sm font-medium tracking-widest uppercase">{label}</p>
    </div>
  );
}
