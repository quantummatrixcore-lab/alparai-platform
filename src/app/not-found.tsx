import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Home, FileSearch, ArrowLeft, AlertCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/lib/constants";

export async function generateMetadata() {
  try {
    const t = await getTranslations({ locale: DEFAULT_LOCALE, namespace: "errors" });
    return { title: t("notFoundTitle") };
  } catch {
    return { title: "Page not found" };
  }
}

export default async function NotFound() {
  const t = await getTranslations({ locale: DEFAULT_LOCALE, namespace: "errors" });
  const tNav = await getTranslations({ locale: DEFAULT_LOCALE, namespace: "nav" });

  return (
    <Container size="narrow" className="py-24">
      <div
        className="border-danger-500/30 bg-danger-500/5 text-danger-400 mx-auto mb-6 inline-flex items-center gap-2 rounded-sm border px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase"
        role="status"
      >
        <AlertCircle className="h-4 w-4" />
        {t("error_404")}
      </div>

      <p className="from-brand-300 via-danger-400 to-brand-500 bg-gradient-to-r bg-clip-text text-8xl font-black tracking-tighter text-transparent md:text-9xl">
        404
      </p>

      <h1 className="text-fg-primary mt-4 text-3xl font-black tracking-tight md:text-4xl">
        {t("notFoundTitle")}
      </h1>
      <p className="text-fg-secondary mt-3 text-base md:text-lg">{t("notFoundDesc")}</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/"
          className="border-border-subtle bg-bg-secondary hover:border-brand-500/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
        >
          <Home className="text-brand-400 h-5 w-5 shrink-0" />
          <div className="text-left">
            <p className="text-fg-primary text-sm font-semibold">{t("goHome")}</p>
            <p className="text-fg-muted text-xs">{t("goHomeDesc")}</p>
          </div>
        </Link>
        <Link
          href="/incidents"
          className="border-border-subtle bg-bg-secondary hover:border-brand-500/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
        >
          <FileSearch className="text-brand-400 h-5 w-5 shrink-0" />
          <div className="text-left">
            <p className="text-fg-primary text-sm font-semibold">{tNav("incidents")}</p>
            <p className="text-fg-muted text-xs">{t("browseDesc")}</p>
          </div>
        </Link>
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="text-fg-muted hover:text-brand-400 inline-flex items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("goBack")}
        </Link>
      </div>
    </Container>
  );
}
