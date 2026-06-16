import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { NotFoundClient } from "@/components/ui/not-found-client";

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
    <NotFoundClient
      code="404"
      badge={t("error_404")}
      title={t("notFoundTitle")}
      description={t("notFoundDesc")}
      homeLabel={t("goHome")}
      homeDesc={t("goHomeDesc")}
      incidentsLabel={tNav("incidents")}
      incidentsDesc={t("browseDesc")}
      backLabel={t("goBack")}
    />
  );
}
