"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShieldOff } from "lucide-react";

const stats = [
  { icon: TrendingUp, titleKey: "why_stat_1_title", descKey: "why_stat_1_desc" },
  { icon: Users, titleKey: "why_stat_2_title", descKey: "why_stat_2_desc" },
  { icon: ShieldOff, titleKey: "why_stat_3_title", descKey: "why_stat_3_desc" },
] as const;

export function WhyItMatters() {
  const t = useTranslations("hero");

  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-fg-primary text-2xl font-bold sm:text-3xl">{t("why_title")}</h2>
          <p className="text-fg-secondary mt-4 text-lg">{t("why_subtitle")}</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="inline-flex items-center gap-2">
                      <Icon className="text-danger-400 h-5 w-5" />
                      <span className="text-fg-primary">{t(stat.titleKey)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-fg-secondary text-sm leading-relaxed">{t(stat.descKey)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
