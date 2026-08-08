import { setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/layout";
import { Target, CheckCircle2, FileText, Settings } from "lucide-react";
import { ShowcasePageTracker, TrackedCtaButton } from "@/components/analytics/showcase-tracker";

export default async function EuAiActPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-24 pb-16">
      <ShowcasePageTracker pagePath="/products/eu-ai-act" />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="border-brand-500/30 bg-brand-500/10 text-brand-400 inline-flex items-center gap-2 rounded-sm border px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase">
                <Target className="h-4 w-4" />
                <span>Compliance SaaS</span>
              </div>
            </div>
            <h1 className="text-fg-primary mb-6 text-5xl font-black tracking-tight lg:text-6xl">
              EU AI Act Compliance
            </h1>
            <p className="text-fg-secondary text-lg leading-relaxed">
              Automate your Article 73 incident reporting and compliance lifecycle. Identify
              high-risk AI models, map incidents to regulatory frameworks, and generate one-click
              audit reports.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <CheckCircle2 className="text-success-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Article 73 Readiness</h3>
              <p className="text-fg-secondary text-sm">
                Ensure your organization meets the strict incident reporting timelines required by
                the EU AI Act.
              </p>
            </div>
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <FileText className="text-brand-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Automated Audit Trails</h3>
              <p className="text-fg-secondary text-sm">
                Immutable logs of all internal AI incidents, resolutions, and regulatory
                communications.
              </p>
            </div>
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <Settings className="text-warning-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Risk Categorization</h3>
              <p className="text-fg-secondary text-sm">
                Automatically classify your AI systems into Unacceptable, High, Limited, or Minimal
                risk tiers.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-glass inline-block rounded-2xl border border-white/5 p-8 shadow-2xl">
              <h2 className="text-fg-primary mb-4 text-2xl font-bold">Join the Beta</h2>
              <p className="text-fg-secondary mb-6 max-w-md">
                Our compliance dashboard is currently in closed beta. Sign up to secure your spot
                and start your compliance journey early.
              </p>
              <TrackedCtaButton
                pagePath="/products/eu-ai-act"
                ctaAction="join_waitlist"
                href="mailto:hello@alparai.com?subject=EU AI Act Beta Access"
                className="bg-brand-600 hover:bg-brand-500 inline-flex h-12 items-center justify-center rounded-md px-8 text-sm font-bold text-white transition-all hover:scale-105"
              >
                Join the Waitlist
              </TrackedCtaButton>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
