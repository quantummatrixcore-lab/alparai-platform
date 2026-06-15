import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { FileText, Lock, AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/routing";
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
  if (user.role !== "admin") {
    redirect(`/${locale}`);
  }

  const filePath = path.join(process.cwd(), "docs", "MASTER-ANALYSIS.md");
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    content = "# MASTER-ANALYSIS.md not found\n\nThe analysis file has not been created yet.";
  }

  const sections = content.split(/^### ANALYSIS #/m).filter(Boolean);
  const promptSection = sections[0] ?? "";
  const analyses = sections.slice(1);

  const pendingCount = analyses.filter((a) => a.includes("[PENDING:")).length;
  const completedCount = analyses.length - pendingCount;

  return (
    <Container className="py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
            <FileText className="text-brand-400 h-6 w-6" />
            {t("analysisHeading")}
          </h1>
          <p className="text-fg-muted mt-1 text-sm">
            {t("analysisStats", { completedCount, pendingCount, totalCount: 13 })}
          </p>
        </div>
        <nav className="hidden items-center gap-1 text-sm md:flex">
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
          <Link
            href={`/${locale}/admin/analysis` as never}
            className="bg-bg-tertiary text-brand-400 rounded-md px-3 py-1.5"
          >
            {t("analysis")}
          </Link>
        </nav>
      </header>

      <Card variant="default" className="border-warning-500/30 bg-warning-500/5 mb-6">
        <CardContent className="flex items-start gap-3 py-4">
          <AlertTriangle className="text-warning-500 mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-fg-primary text-sm font-medium">{t("immutableTitle")}</p>
            <p className="text-fg-muted text-xs">{t("immutableDesc")}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {promptSection && (
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2 text-sm">
                <Lock className="text-brand-400 h-4 w-4" />
                {t("masterPrompt")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm text-fg-secondary max-w-none whitespace-pre-wrap">
                {promptSection.trim()}
              </div>
            </CardContent>
          </Card>
        )}

        <h2 className="text-fg-primary text-lg font-semibold">{t("aiModelAnalyses")}</h2>

        {analyses.map((analysis, i) => {
          const isPending = analysis.includes("[PENDING:");
          const modelMatch = analysis.match(/^\s*(.+?)\n/);
          const modelName = modelMatch?.[1]?.replace(/\]/g, "").trim() ?? `Model ${i + 1}`;

          return (
            <Card
              key={i}
              variant={isPending ? "default" : "elevated"}
              className={isPending ? "border-border-subtle opacity-60" : ""}
            >
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2 text-sm">
                  {isPending ? (
                    <span className="bg-bg-tertiary h-2 w-2 rounded-full" />
                  ) : (
                    <span className="bg-success-500 h-2 w-2 rounded-full" />
                  )}
                  #{i + 1} — {modelName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <p className="text-fg-muted text-sm italic">{t("analysisPending")}</p>
                ) : (
                  <div className="prose prose-invert prose-sm text-fg-secondary max-w-none whitespace-pre-wrap">
                    {analysis.trim()}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
