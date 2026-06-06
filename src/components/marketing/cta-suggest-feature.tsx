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
    <section className="border-t border-border-subtle bg-bg-secondary/30">
      <Container className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-bg-secondary to-bg-tertiary p-8 sm:p-10"
        >
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl"
          />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-medium text-brand-300">
                <Lightbulb className="h-3 w-3" />
                {t("cta_secondary")}
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-fg-primary sm:text-3xl">
                {t("suggestionTitle", { defaultValue: "Shape the future of ALPAR" })}
              </h2>
              <p className="mt-2 text-sm text-fg-muted">
                {t("suggestionSubtitle", {
                  defaultValue:
                    "Tell us what's missing. The community votes. We build what matters most.",
                })}
              </p>
            </div>
            <Link href="/suggestions">
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
