"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, ShieldAlert, Target } from "lucide-react";
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
    <section className="bg-bg-primary relative overflow-hidden pt-28 pb-32">
      {/* DORA Elite "War Room" Background Effects */}
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <motion.div
          style={{ y: y1, opacity }}
          className="bg-brand-600/10 absolute -top-[30%] left-1/4 h-[800px] w-[800px] -translate-x-1/2 rounded-full mix-blend-screen blur-[140px]"
        />
        <div className="bg-danger-500/15 absolute top-[20%] right-[10%] h-[600px] w-[600px] rounded-full mix-blend-screen blur-[160px]" />

        {/* Technical grid lines for HUD effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] bg-[size:64px_64px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10 flex justify-center"
          >
            <div className="border-danger-500/30 bg-danger-500/10 text-danger-400 inline-flex items-center gap-2 rounded-sm border px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(230,57,70,0.3)] backdrop-blur-md">
              <Target className="h-4 w-4" />
              <span>{t("zero_tolerance")}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-fg-primary pb-6 text-6xl leading-[0.95] font-black tracking-tighter drop-shadow-lg sm:text-7xl md:text-8xl lg:text-[100px]"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-fg-secondary mx-auto mt-6 max-w-3xl text-xl leading-relaxed font-medium tracking-tight sm:text-2xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <Link
              href="/submit"
              className="group bg-danger-500 hover:bg-danger-400 relative inline-flex h-16 w-full items-center justify-center gap-3 rounded-md px-10 text-lg font-black text-white shadow-[0_0_30px_rgba(230,57,70,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(230,57,70,0.7)] sm:w-auto"
            >
              <ShieldAlert className="h-6 w-6" />
              {t("cta_primary")}
            </Link>
            <Link
              href="/incidents"
              className="border-border-strong bg-bg-elevated/40 text-fg-primary hover:border-brand-500/50 hover:bg-bg-elevated/80 inline-flex h-16 w-full items-center justify-center gap-3 rounded-md border px-10 text-lg font-bold shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 sm:w-auto"
            >
              {t("cta_secondary")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3"
          >
            <StatCard
              label={t("stats_incidents")}
              value={totalIncidents}
              glowColor="rgba(230,57,70,0.15)"
            />
            <StatCard
              label={t("stats_providers")}
              value={totalProviders}
              glowColor="rgba(168,85,247,0.15)"
            />
            <StatCard
              label={t("stats_countries")}
              value={totalCountries}
              glowColor="rgba(39,174,96,0.15)"
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
      className="border-border-strong bg-bg-primary/40 hover:border-border-subtle relative overflow-hidden rounded-lg border p-8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1"
      style={{ boxShadow: `0 0 40px ${glowColor} inset` }}
    >
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <p className="text-fg-primary text-5xl font-black tracking-tighter md:text-6xl">
        {value.toLocaleString()}
      </p>
      <p className="text-fg-muted mt-3 text-sm font-bold tracking-[0.2em] uppercase">{label}</p>
    </div>
  );
}
