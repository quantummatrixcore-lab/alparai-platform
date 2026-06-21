"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, ShieldAlert, Target, Trophy, Quote, Sparkles, Radio } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroSection({
  totalIncidents = 0,
  totalProviders = 0,
  topProviders = [],
}: {
  totalIncidents?: number;
  totalProviders?: number;
  topProviders?: Array<{ name: string; count: number; slug: string }>;
}) {
  const t = useTranslations("hero");
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="bg-bg-primary relative overflow-hidden pt-24 pb-16">
      {/* Background Effects */}
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <motion.div
          style={{ y: y1, opacity }}
          animate={{
            scale: [1, 1.1, 1],
            x: ["-50%", "-48%", "-52%", "-50%"],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="bg-brand-600/8 absolute -top-[30%] left-1/4 h-[800px] w-[800px] rounded-full mix-blend-screen blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.05, 0.95, 1], y: [0, 20, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="bg-danger-500/10 absolute top-[20%] right-[5%] h-[500px] w-[500px] rounded-full mix-blend-screen blur-[160px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[55fr_45fr]">
          {/* LEFT: Manifesto Column */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex"
            >
              <div className="border-danger-500/30 bg-danger-500/10 text-danger-400 inline-flex items-center gap-2 rounded-sm border px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(230,57,70,0.3)] backdrop-blur-md">
                <Target className="h-4 w-4" />
                <span>{t("eyebrow")}</span>
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-fg-primary pb-4 text-5xl leading-[0.95] font-black tracking-tighter drop-shadow-lg sm:text-6xl lg:text-[72px]"
            >
              {t("title_primary")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-fg-secondary mt-6 max-w-xl text-lg leading-relaxed font-medium tracking-tight"
            >
              {t("subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/submit"
                className="group bg-danger-500 hover:bg-danger-400 relative inline-flex h-13 items-center justify-center gap-3 rounded-md px-8 text-base font-black text-white shadow-[0_0_25px_rgba(230,57,70,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_40px_rgba(230,57,70,0.7)]"
              >
                <ShieldAlert className="h-5 w-5" />
                {t("cta_primary")}
              </Link>
              <Link
                href="/incidents"
                className="bg-glass text-fg-primary hover:border-brand-500/40 inline-flex h-13 items-center justify-center gap-3 rounded-md px-8 text-base font-bold shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              >
                {t("cta_secondary")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>

            {/* Bug Bounty badge — compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8"
            >
              <div className="bg-glass border-warning-500/20 inline-flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg">
                <div className="border-warning-500/40 bg-warning-500/15 text-warning-400 inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[10px] font-black tracking-[0.2em] uppercase">
                  <Sparkles className="h-3 w-3" />
                  {t("bug_bounty_badge", { defaultValue: "Bug Bounty" })}
                </div>
                <span className="from-warning-300 to-warning-500 bg-gradient-to-r bg-clip-text text-sm font-black text-transparent">
                  {t("title_accent")}
                </span>
                <Link
                  href="/bounties"
                  className="text-warning-400 hover:text-warning-300 inline-flex items-center gap-1 text-xs font-bold"
                >
                  <Trophy className="h-3.5 w-3.5" />
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>

            {/* Founder Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="bg-glass border-danger-500/30 relative mt-8 overflow-hidden rounded-xl border-l-4 p-5"
            >
              <div className="from-danger-500/5 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent" />
              <div className="relative z-10 flex items-start gap-3">
                <div className="bg-danger-500/10 border-danger-500/20 text-danger-400 mt-0.5 shrink-0 rounded-lg border p-2">
                  <Quote className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-danger-400 mb-1 text-xs font-black tracking-wide uppercase">
                    {t("founder_title")}
                  </h4>
                  <blockquote className="text-fg-secondary text-sm leading-relaxed font-semibold">
                    "{t("founder_subtitle")}"
                  </blockquote>
                  <p className="text-fg-muted mt-2 text-xs font-bold tracking-wider uppercase">
                    — Ercüment Erden, Kurucu
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Live Data Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* LIVE badge */}
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-danger-500 h-2 w-2 rounded-full shadow-[0_0_8px_rgba(230,57,70,0.8)]"
              />
              <span className="text-danger-400 text-xs font-black tracking-[0.2em] uppercase">
                {t("live_data")}
              </span>
            </div>

            {/* Stats Panel */}
            <div className="bg-glass rounded-2xl border border-white/5 p-5 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                <LiveStatCard
                  value={totalIncidents}
                  label={t("stats_incidents")}
                  glowColor="rgba(230,57,70,0.15)"
                  accentClass="text-danger-400"
                />
                <LiveStatCard
                  value={totalProviders}
                  label={t("stats_providers")}
                  glowColor="rgba(168,85,247,0.15)"
                  accentClass="text-brand-400"
                />
                <LiveStatCard
                  value="47"
                  label={t("stats_countries")}
                  glowColor="rgba(39,174,96,0.15)"
                  accentClass="text-success-400"
                />
              </div>
            </div>

            {/* Leaderboard Panel */}
            <div className="bg-glass rounded-2xl border border-white/5 p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-fg-primary text-sm font-black tracking-wider uppercase">
                  📊 {t("leaderboard_title")}
                </h3>
                <Link
                  href="/leaderboard"
                  className="text-brand-400 hover:text-brand-300 flex items-center gap-1 text-xs font-bold transition-colors"
                >
                  {t("view_all")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-2.5">
                {topProviders.length > 0
                  ? topProviders
                      .slice(0, 5)
                      .map((p, i) => (
                        <ProviderBar
                          key={p.slug}
                          rank={i + 1}
                          name={p.name}
                          count={p.count}
                          maxCount={topProviders[0]?.count ?? 1}
                        />
                      ))
                  : [
                      { name: "ChatGPT", count: 847 },
                      { name: "Gemini", count: 612 },
                      { name: "Grok", count: 441 },
                      { name: "Claude", count: 318 },
                      { name: "Copilot", count: 204 },
                    ].map((p, i) => (
                      <ProviderBar
                        key={p.name}
                        rank={i + 1}
                        name={p.name}
                        count={p.count}
                        maxCount={847}
                      />
                    ))}
              </div>
              <Link
                href="/leaderboard"
                className="text-fg-muted hover:text-brand-400 mt-4 block text-center text-xs font-medium transition-colors"
              >
                {t("view_full_leaderboard")}
              </Link>
            </div>

            {/* Last report indicator */}
            <div className="flex items-center gap-2 px-1">
              <Radio className="text-fg-muted h-3.5 w-3.5" />
              <span className="text-fg-muted text-xs">{t("last_report")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AnimatedValue({ value }: { value: number | string }) {
  const [count, setCount] = React.useState(0);
  const numVal = typeof value === "number" ? value : 0;

  React.useEffect(() => {
    if (numVal === 0) return;
    let start = 0;
    const duration = 1200;
    const range = numVal;
    const stepTime = Math.max(16, Math.floor(duration / 60));
    const increment = Math.max(1, Math.ceil(range / (duration / stepTime)));
    const timer = setInterval(() => {
      start += increment;
      if (start >= numVal) {
        setCount(numVal);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [numVal]);

  if (typeof value === "string") return <>{value}</>;
  return <>{count.toLocaleString()}</>;
}

function LiveStatCard({
  value,
  label,
  glowColor,
  accentClass,
}: {
  value: number | string;
  label: string;
  glowColor: string;
  accentClass: string;
}) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ boxShadow: `inset 0 0 20px ${glowColor}` }}
    >
      <p className={`font-mono text-3xl font-black tracking-tight ${accentClass}`}>
        <AnimatedValue value={value} />
      </p>
      <p className="text-fg-muted mt-1 text-[10px] leading-tight font-bold tracking-[0.15em] uppercase">
        {label}
      </p>
    </div>
  );
}

function ProviderBar({
  rank,
  name,
  count,
  maxCount,
}: {
  rank: number;
  name: string;
  count: number;
  maxCount: number;
}) {
  const pct = Math.round((count / maxCount) * 100);
  const rankColors = [
    "text-danger-400",
    "text-warning-400",
    "text-brand-400",
    "text-fg-secondary",
    "text-fg-muted",
  ];
  const barColors = [
    "bg-danger-500/70",
    "bg-warning-500/70",
    "bg-brand-500/70",
    "bg-fg-secondary/40",
    "bg-fg-muted/30",
  ];

  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-4 text-center font-mono text-xs font-black ${rankColors[rank - 1] ?? "text-fg-muted"}`}
      >
        #{rank}
      </span>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-fg-primary text-xs font-bold">{name}</span>
          <span className="text-fg-muted font-mono text-xs">{count.toLocaleString()}</span>
        </div>
        <div className="bg-bg-tertiary h-1.5 w-full overflow-hidden rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: rank * 0.1, ease: "easeOut" }}
            className={`h-full rounded-full ${barColors[rank - 1] ?? "bg-fg-muted/30"}`}
          />
        </div>
      </div>
    </div>
  );
}
