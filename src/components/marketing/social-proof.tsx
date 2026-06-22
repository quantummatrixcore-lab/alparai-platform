"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, CheckCircle, Award } from "lucide-react";

export function SocialProof() {
  const t = useTranslations("marketing.social_proof");

  const pillars = [
    {
      icon: Shield,
      title: t("pillar1_title"),
      desc: t("pillar1_desc"),
    },
    {
      icon: FileText,
      title: t("pillar2_title"),
      desc: t("pillar2_desc"),
    },
    {
      icon: CheckCircle,
      title: t("pillar3_title"),
      desc: t("pillar3_desc"),
    },
  ];

  return (
    <section className="bg-bg-secondary border-border-subtle border-y py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl space-y-3 text-center">
          <div className="bg-brand-500/10 border-brand-500/20 text-brand-400 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold tracking-widest uppercase">
            <Award className="h-4.5 w-4.5" />
            {t("badge")}
          </div>
          <h2 className="text-fg-primary text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-fg-muted mx-auto max-w-2xl text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} variant="glass" className="border-border-subtle/40">
                <CardContent className="flex flex-col space-y-4 p-6">
                  <div className="bg-brand-500/10 text-brand-400 border-brand-500/20 flex h-10 w-10 items-center justify-center rounded-lg border">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-fg-primary text-base font-bold">{pillar.title}</h3>
                    <p className="text-fg-secondary text-sm leading-relaxed">{pillar.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="border-border-subtle/30 mt-12 border-t pt-8">
          <p className="text-fg-muted mb-6 text-center text-xs font-semibold tracking-widest uppercase">
            {t("trust_signals_title", { defaultValue: "Platform Trust Signals" })}
          </p>
          <div className="text-fg-muted flex flex-wrap items-center justify-center gap-6 text-xs font-semibold md:gap-10">
            <span className="flex items-center gap-1.5">
              <Shield className="text-success-500 h-3.5 w-3.5" />
              {t("signal_open_source", { defaultValue: "AGPL-3.0 Open Source" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="text-accent-400 h-3.5 w-3.5" />
              {t("signal_eu_hosting", { defaultValue: "EU Data Hosting" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="text-brand-400 h-3.5 w-3.5" />
              {t("signal_compliant", { defaultValue: "KVKK + GDPR Compliant" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="text-warning-400 h-3.5 w-3.5" />
              {t("signal_community_verified", { defaultValue: "Community Verified" })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
