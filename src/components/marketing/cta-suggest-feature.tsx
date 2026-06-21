"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/layout";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function SuggestFeatureCTA() {
  const t = useTranslations("hero");
  return (
    <section className="border-border-subtle bg-bg-secondary/30 border-t">
      <Container className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="border-brand-500/30 from-bg-secondary to-bg-tertiary relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 sm:p-10"
        >
          <div
            aria-hidden="true"
            className="bg-brand-500/20 absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl"
          />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="bg-brand-500/10 text-brand-300 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
                <Lightbulb className="h-3 w-3" />
                {t("cta_secondary")}
              </div>
              <h2 className="text-fg-primary mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("suggestionTitle", { defaultValue: "Shape the future of ALPAR" })}
              </h2>
              <p className="text-fg-muted mt-2 text-sm">
                {t("suggestionSubtitle", {
                  defaultValue:
                    "Tell us what's missing. The community votes. We build what matters most.",
                })}
              </p>
            </div>
            <Link href="/dilemmas?tab=suggestions">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                {t("cta_secondary")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
