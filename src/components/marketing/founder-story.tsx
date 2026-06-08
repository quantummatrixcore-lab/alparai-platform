"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Fingerprint } from "lucide-react";

export function FounderStory() {
  const t = useTranslations("marketing.founder_story");

  return (
    <Section className="bg-bg-secondary/30 border-border-subtle border-b">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="bg-danger-500/10 border-danger-500/20 rounded-full border p-3">
              <AlertTriangle className="text-danger-400 h-6 w-6" />
            </div>
            <h2 className="text-fg-primary text-3xl font-extrabold sm:text-4xl">{t("title")}</h2>
          </div>

          <Card
            variant="elevated"
            className="border-danger-500/20 from-bg-elevated/80 to-bg-elevated/40 relative overflow-hidden bg-gradient-to-b shadow-[0_0_50px_rgba(244,63,94,0.05)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute top-0 right-0 opacity-5">
              <Fingerprint className="-mt-20 -mr-20 h-96 w-96" />
            </div>

            <CardContent className="relative z-10 p-8 sm:p-12">
              <div className="text-fg-secondary space-y-6 text-lg leading-relaxed">
                <p>
                  <strong className="text-fg-primary mb-2 block text-xl font-semibold">
                    {t("highlight")}
                  </strong>
                  {t("p1")}
                </p>
                <p>{t("p2")}</p>
                <div className="border-brand-500 text-brand-100/90 my-8 border-l-4 py-2 pl-6 text-xl font-medium italic">
                  &ldquo;{t("quote")}&rdquo;
                </div>
                <p>{t("p3")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Section>
  );
}
