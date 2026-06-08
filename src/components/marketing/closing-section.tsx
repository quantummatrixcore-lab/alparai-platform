"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/layout";

export function ClosingSection() {
  const t = useTranslations("hero");

  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-fg-primary text-2xl font-bold sm:text-3xl md:text-4xl">
            {t("closing_title")}
          </h2>
          <p className="text-fg-secondary mt-6 text-lg leading-relaxed">{t("closing_subtitle")}</p>
        </motion.div>
      </Container>
    </Section>
  );
}
