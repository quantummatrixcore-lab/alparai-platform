"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/layout";
import { Code, Globe, Shield, Scale, CheckCircle } from "lucide-react";

const items = [
  {
    icon: Code,
    titleKey: "trust_1_title",
    descKey: "trust_1_desc",
    accentClass: "text-brand-400",
    iconBgClass: "bg-brand-500/10 border-brand-500/20",
    tagClass: "bg-brand-500/10 text-brand-400 border-brand-500/20",
    tag: "AGPL-3.0",
  },
  {
    icon: Globe,
    titleKey: "trust_2_title",
    descKey: "trust_2_desc",
    accentClass: "text-accent-400",
    iconBgClass: "bg-accent-500/10 border-accent-500/20",
    tagClass: "bg-accent-500/10 text-accent-400 border-accent-500/20",
    tag: "EU · GDPR",
  },
  {
    icon: Shield,
    titleKey: "trust_3_title",
    descKey: "trust_3_desc",
    accentClass: "text-success-400",
    iconBgClass: "bg-success-500/10 border-success-500/20",
    tagClass: "bg-success-500/10 text-success-400 border-success-500/20",
    tag: "Auto-mask",
  },
  {
    icon: Scale,
    titleKey: "trust_4_title",
    descKey: "trust_4_desc",
    accentClass: "text-warning-400",
    iconBgClass: "bg-warning-500/10 border-warning-500/20",
    tagClass: "bg-warning-500/10 text-warning-400 border-warning-500/20",
    tag: "Art. 14",
  },
] as const;

export function TrustBar() {
  const t = useTranslations("hero");

  return (
    <Section className="bg-bg-secondary border-fg-muted/10 relative overflow-hidden border-y">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03),transparent_60%)]"
      />
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-center gap-2 text-center"
        >
          <div className="border-success-500/30 bg-success-500/10 text-success-400 mb-2 inline-flex items-center gap-2 rounded-sm border px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase">
            <CheckCircle className="h-3.5 w-3.5" />
            {t("trust_title")}
          </div>
          <p className="text-fg-secondary max-w-lg text-base">{t("trust_subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group"
              >
                <div className="bg-bg-primary/70 border-fg-muted/10 hover:border-brand-500/20 flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${item.iconBgClass}`}
                    >
                      <Icon className={`h-5 w-5 ${item.accentClass}`} />
                    </div>
                    <span
                      className={`rounded-sm border px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${item.tagClass}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-sm font-black ${item.accentClass}`}>{t(item.titleKey)}</h3>
                    <p className="text-fg-muted mt-1 text-xs leading-relaxed">{t(item.descKey)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
