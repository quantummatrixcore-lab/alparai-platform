"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/layout";
import { formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("legal");
  const locale = useLocale();
  return (
    <Container size="narrow" className="py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-brand-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {t("back")}
      </Link>
      <header className="mt-6 border-b border-border-subtle pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-fg-primary">{title}</h1>
        <p className="mt-2 text-sm text-fg-muted">
          {t("last_updated")}: {formatDate(new Date(lastUpdated), locale)}
        </p>
      </header>
      <div className="prose prose-invert mt-6 max-w-none text-fg-primary">
        {children}
      </div>
    </Container>
  );
}
