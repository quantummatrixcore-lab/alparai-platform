"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/layout";
import { AlertCircle, Cpu, Globe } from "lucide-react";

interface CounterProps {
  value: number;
}

function AnimatedNumber({ value }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  React.useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  React.useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

interface LiveStatsProps {
  totalIncidents: number;
  totalProviders: number;
  totalCountries: number;
}

export function LiveStats({ totalIncidents, totalProviders, totalCountries }: LiveStatsProps) {
  const t = useTranslations("hero");

  const statItems = [
    {
      label: t("stats_incidents"),
      value: totalIncidents,
      icon: AlertCircle,
      accent: "text-danger-400 border-danger-500/20 bg-danger-500/5",
    },
    {
      label: t("stats_providers"),
      value: totalProviders,
      icon: Cpu,
      accent: "text-warning-400 border-warning-500/20 bg-warning-500/5",
    },
    {
      label: t("stats_countries"),
      value: totalCountries,
      icon: Globe,
      accent: "text-brand-400 border-brand-500/20 bg-brand-500/5",
    },
  ];

  return (
    <div className="bg-bg-secondary/20 border-border-subtle relative overflow-hidden border-y py-8">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex items-center gap-4 rounded-2xl border p-6 backdrop-blur-sm ${item.accent}`}
              >
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-fg-primary text-3xl font-black tracking-tight">
                    <AnimatedNumber value={item.value} />
                  </div>
                  <div className="text-fg-secondary mt-1 text-xs font-semibold tracking-wider uppercase">
                    {item.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
