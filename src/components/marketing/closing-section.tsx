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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-fg-primary text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            {t("closing_title")}
          </h2>
          <p className="text-fg-secondary mt-6 text-lg leading-relaxed font-medium">
            {t("closing_subtitle")}
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/submit"
              className="group bg-danger-500 hover:bg-danger-400 relative inline-flex h-14 items-center justify-center gap-3 rounded-md px-10 text-lg font-black text-white shadow-[0_0_25px_rgba(230,57,70,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_40px_rgba(230,57,70,0.7)]"
            >
              <ShieldAlert className="h-5 w-5" />
              {t("cta_primary")}
            </Link>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
