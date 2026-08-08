import { setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/layout";
import { Database, Download, FileJson, Scale } from "lucide-react";
import { ShowcasePageTracker, TrackedCtaButton } from "@/components/analytics/showcase-tracker";
import { Link } from "@/i18n/routing";

export default async function DatasetsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-24 pb-16">
      <ShowcasePageTracker pagePath="/products/datasets" />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="border-success-500/30 bg-success-500/10 text-success-400 inline-flex items-center gap-2 rounded-sm border px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase">
                <Database className="h-4 w-4" />
                <span>Open Data & Research</span>
              </div>
            </div>
            <h1 className="text-fg-primary mb-6 text-5xl font-black tracking-tight lg:text-6xl">
              ALPAR AI Datasets
            </h1>
            <p className="text-fg-secondary text-lg leading-relaxed">
              Access curated, structured, and cross-audited datasets of AI failures. Built for
              researchers, red-teamers, and policy makers to advance the safety of artificial
              intelligence.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <FileJson className="text-brand-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Structured Exports</h3>
              <p className="text-fg-secondary text-sm">
                Download incident reports in JSON, CSV, and Parquet formats, ready for immediate
                analysis in your data pipeline.
              </p>
            </div>
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <Scale className="text-danger-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Taxonomy Aligned</h3>
              <p className="text-fg-secondary text-sm">
                Incidents are mapped to CSET, AIID, and EU AI Act risk categorizations for
                standardized research.
              </p>
            </div>
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <Download className="text-success-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Academic License</h3>
              <p className="text-fg-secondary text-sm">
                Free for academic and non-commercial research purposes to support the global AI
                safety community.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-glass inline-block rounded-2xl border border-white/5 p-8 shadow-2xl">
              <h2 className="text-fg-primary mb-4 text-2xl font-bold">Access the Data</h2>
              <p className="text-fg-secondary mb-6 max-w-md">
                We provide bulk dataset access to verified research institutions and policy
                organizations.
              </p>
              <TrackedCtaButton
                pagePath="/products/datasets"
                ctaAction="request_dataset_access"
                asChild
              >
                <Link
                  href="/contact"
                  className="bg-brand-600 hover:bg-brand-500 inline-flex h-12 items-center justify-center rounded-md px-8 text-sm font-bold text-white transition-all hover:scale-105"
                >
                  Request Dataset Access
                </Link>
              </TrackedCtaButton>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
