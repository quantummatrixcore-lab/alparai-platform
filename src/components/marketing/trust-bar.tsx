"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Globe, Shield, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: Code,
    titleKey: "trust_1_title",
    descKey: "trust_1_desc",
    glowClass:
      "from-brand-500/20 to-brand-500/5 text-brand-450 border-brand-500/20 shadow-brand-500/5 group-hover:border-brand-500/40 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]",
  },
  {
    icon: Globe,
    titleKey: "trust_2_title",
    descKey: "trust_2_desc",
    glowClass:
      "from-accent-500/20 to-accent-500/5 text-accent-400 border-accent-500/20 shadow-accent-500/5 group-hover:border-accent-500/40 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]",
  },
  {
    icon: Shield,
    titleKey: "trust_3_title",
    descKey: "trust_3_desc",
    glowClass:
      "from-success-500/20 to-success-500/5 text-success-400 border-success-500/20 shadow-success-500/5 group-hover:border-success-500/40 group-hover:shadow-[0_0_15px_rgba(46,204,113,0.25)]",
  },
  {
    icon: Scale,
    titleKey: "trust_4_title",
    descKey: "trust_4_desc",
    glowClass:
      "from-warning-500/20 to-warning-500/5 text-warning-400 border-warning-500/20 shadow-warning-500/5 group-hover:border-warning-500/40 group-hover:shadow-[0_0_15px_rgba(241,196,15,0.25)]",
  },
] as const;

export function TrustBar() {
  const t = useTranslations("hero");

  return (
    <Section className="relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.02),transparent_60%)]" />
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-fg-primary text-2xl font-bold sm:text-3xl">{t("trust_title")}</h2>
          <p className="text-fg-secondary mt-4 text-lg">{t("trust_subtitle")}</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group h-full"
              >
                <Card
                  variant="glass"
                  className="border-border-subtle group-hover:border-brand-500/20 h-full transition-all duration-300"
                >
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      className={cn(
                        "mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br shadow-sm transition-all duration-300",
                        item.glowClass,
                      )}
                    >
                      <Icon className="animate-pulse-slow h-6 w-6" />
                    </motion.div>
                    <CardTitle className="text-fg-primary group-hover:text-brand-350 text-base transition-colors duration-300">
                      {t(item.titleKey)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-fg-muted group-hover:text-fg-secondary text-sm leading-relaxed transition-colors duration-300">
                      {t(item.descKey)}
                    </p>
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
