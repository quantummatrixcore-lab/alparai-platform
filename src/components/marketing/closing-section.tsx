"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/layout";
import { Link } from "@/i18n/routing";
import { ShieldAlert } from "lucide-react";

export function ClosingSection() {
  const t = useTranslations("hero");

  return (
    <Section className="border-border-subtle border-t">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Block: Urgent Warning */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center text-left"
          >
            <h2 className="text-fg-primary text-3xl font-black tracking-tight sm:text-4xl">
              {t("closing_title")}
            </h2>
            <p className="text-fg-secondary mt-6 text-base leading-relaxed font-medium">
              {t("closing_subtitle")}
            </p>
            <div className="mt-8">
              <Link
                href="/submit"
                className="group bg-danger-500 hover:bg-danger-400 relative inline-flex h-12 items-center justify-center gap-3 rounded-md px-8 text-base font-black text-white shadow-[0_0_20px_rgba(230,57,70,0.3)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_35px_rgba(230,57,70,0.6)]"
              >
                <ShieldAlert className="h-5 w-5" />
                {t("cta_primary")}
              </Link>
            </div>
          </motion.div>

          {/* Right Block: The Good News / Hope Balance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border-brand-500/20 bg-brand-500/5 flex flex-col justify-center rounded-2xl border p-8 backdrop-blur-sm"
          >
            <h3 className="text-brand-400 text-2xl font-black tracking-tight">
              {t("closing_good_news_title")}
            </h3>
            <p className="text-fg-secondary mt-4 text-sm leading-relaxed font-medium">
              {t("closing_good_news_body")}
            </p>
            <div className="mt-6">
              <Link
                href="/submit"
                className="text-brand-400 hover:text-brand-300 decoration-brand-500/30 text-sm font-bold underline decoration-2 underline-offset-4 transition-colors"
              >
                {t("closing_good_news_cta")}
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
