"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Globe, Shield, Scale } from "lucide-react";

const items = [
  { icon: Code, titleKey: "trust_1_title", descKey: "trust_1_desc" },
  { icon: Globe, titleKey: "trust_2_title", descKey: "trust_2_desc" },
  { icon: Shield, titleKey: "trust_3_title", descKey: "trust_3_desc" },
  { icon: Scale, titleKey: "trust_4_title", descKey: "trust_4_desc" },
] as const;

export function TrustBar() {
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
              >
                <Card variant="default">
                  <CardHeader>
                    <div className="bg-success-500/10 text-success-400 mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-fg-primary text-base">{t(item.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-fg-secondary text-sm leading-relaxed">{t(item.descKey)}</p>
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
