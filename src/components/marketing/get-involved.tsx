"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Award, Handshake, BookOpen } from "lucide-react";

const ctas = [
  {
    icon: ArrowRight,
    titleKey: "join_cta_1",
    descKey: "join_cta_1_desc",
    href: "/submit",
    primary: true,
  },
  {
    icon: Award,
    titleKey: "join_cta_2",
    descKey: "join_cta_2_desc",
    href: "/dilemmas?tab=suggestions",
    primary: false,
  },
  {
    icon: Handshake,
    titleKey: "join_cta_3",
    descKey: "join_cta_3_desc",
    href: "/contact",
    primary: false,
  },
  {
    icon: BookOpen,
    titleKey: "join_cta_4",
    descKey: "join_cta_4_desc",
    href: "/transparency",
    primary: false,
  },
] as const;

export function GetInvolved() {
  const t = useTranslations("hero");

  return (
    <Section className="bg-bg-secondary/30">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-fg-primary text-2xl font-bold sm:text-3xl">{t("join_title")}</h2>
          <p className="text-fg-secondary mt-4 text-lg">{t("join_subtitle")}</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ctas.map((cta, i) => {
            const Icon = cta.icon;
            return (
              <motion.div
                key={cta.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={cta.href} className="block h-full">
                  <Card
                    variant={cta.primary ? "gradient" : "default"}
                    className="h-full transition-transform hover:scale-[1.02]"
                  >
                    <CardHeader>
                      <div
                        className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                          cta.primary
                            ? "bg-danger-500/10 text-danger-400"
                            : "bg-brand-500/10 text-brand-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-fg-primary text-base">{t(cta.titleKey)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-fg-secondary text-sm leading-relaxed">{t(cta.descKey)}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
