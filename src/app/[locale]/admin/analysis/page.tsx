import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { getCurrentUser } from "@/lib/auth/session";
import { FileText } from "lucide-react";
import { Link } from "@/i18n/routing";
import { AnalysisDashboardClient } from "@/components/admin/analysis-dashboard-client";
import fs from "fs";
import path from "path";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("analysisTitle") };
}

export default async function AnalysisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/analysis`);
  if (user.role !== "admin" && user.role !== "ceo") {
    redirect(`/${locale}`);
  }

  // Load structured audit registry JSON
  const registryPath = path.join(process.cwd(), "docs", "ai-audit", "audit-registry.json");
  let registryData = null;
  try {
    const rawRegistry = fs.readFileSync(registryPath, "utf-8");
    registryData = JSON.parse(rawRegistry);
  } catch {
    // Fallback if not created yet or fails to parse
    registryData = {
      metadata: {
        project: "ALPAR AI",
        created: "2026-06-08",
        last_updated: "2026-06-22",
        total_models: 0,
        scoring_weights: {},
      },
      audits: [],
      consensus_findings: { unanimous: [], strong_consensus: [] },
      p0_tracker: [],
      score_evolution: [],
    };
  }

  // Load raw Markdown analyses
  const masterPath = path.join(process.cwd(), "docs", "MASTER-ANALYSIS.md");
  let masterContent = "";
  try {
    masterContent = fs.readFileSync(masterPath, "utf-8");
  } catch {
    masterContent = "# MASTER-ANALYSIS.md not found\n\nThe analysis file has not been created yet.";
  }

  const sections = masterContent.split(/^### ANALYSIS #/m).filter(Boolean);
  const promptSection = sections[0] ?? "";
  const analyses = sections.slice(1);

  return (
    <Container className="py-10">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
            <FileText className="text-brand-400 h-6 w-6" />
            {t("analysisHeading")}
          </h1>
          <p className="text-fg-muted mt-1 text-sm">
            Consolidated Multi-Model AI Auditing & Vulnerability Tracker
          </p>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href={`/${locale}/admin` as never}
            className="text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary rounded-md px-3 py-1.5 transition-colors"
          >
            {t("dashboard")}
          </Link>
          <Link
            href={`/${locale}/admin/moderation` as never}
            className="text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary rounded-md px-3 py-1.5 transition-colors"
          >
            {t("moderation")}
          </Link>
          <span className="bg-bg-tertiary text-brand-400 rounded-md px-3 py-1.5 font-medium">
            {t("analysis")}
          </span>
        </nav>
      </header>

      <AnalysisDashboardClient
        registryData={registryData}
        promptSection={promptSection}
        analyses={analyses}
        translations={{
          analysisHeading: t("analysisHeading"),
          masterPrompt: t("masterPrompt"),
          aiModelAnalyses: t("aiModelAnalyses"),
          dashboard: t("dashboard"),
          moderation: t("moderation"),
          analysis: t("analysis"),
        }}
      />
    </Container>
  );
}
