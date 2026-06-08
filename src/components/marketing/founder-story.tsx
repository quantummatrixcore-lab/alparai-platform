"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function FounderStory() {
  const t = useTranslations("hero");

  return (
    <Section className="bg-bg-secondary/30">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-6 flex items-center gap-2">
            <AlertTriangle className="text-danger-400 h-5 w-5" />
            <h2 className="text-fg-primary text-2xl font-bold sm:text-3xl">{t("founder_title")}</h2>
          </div>
          <Card variant="gradient">
            <CardContent className="py-6">
              <p className="text-fg-secondary text-lg leading-relaxed">{t("founder_subtitle")}</p>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Section>
  );
}
