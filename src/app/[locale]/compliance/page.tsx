import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _locale } = await params;
  const title = "EU AI Act §73 Compliance — ALPAR AI";
  const description =
    "Free compliance checklist for AI providers under the EU AI Act Article 73 — powered by ALPAR AI's community-governed trust infrastructure.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CompliancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "compliance" });

  const checklistItems = [
    { title: t("item1_title"), desc: t("item1_desc") },
    { title: t("item2_title"), desc: t("item2_desc") },
    { title: t("item3_title"), desc: t("item3_desc") },
    { title: t("item4_title"), desc: t("item4_desc") },
    { title: t("item5_title"), desc: t("item5_desc") },
    { title: t("item6_title"), desc: t("item6_desc") },
    { title: t("item7_title"), desc: t("item7_desc") },
    { title: t("item8_title"), desc: t("item8_desc") },
    { title: t("item9_title"), desc: t("item9_desc") },
    { title: t("item10_title"), desc: t("item10_desc") },
    { title: t("item11_title"), desc: t("item11_desc") },
    { title: t("item12_title"), desc: t("item12_desc") },
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20 ring-inset">
            {t("header_badge")}
          </span>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("header_title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">{t("header_subtitle")}</p>
        </div>

        <div className="space-y-8">
          {checklistItems.map((item, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-blue-500/30 hover:bg-white/10"
            >
              <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-b from-blue-900/20 to-black p-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">{t("cta_title")}</h2>
          <p className="mb-8 text-gray-400">{t("cta_desc")}</p>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-gray-200"
          >
            {t("cta_button")}
          </Link>
        </div>
      </div>
    </main>
  );
}
