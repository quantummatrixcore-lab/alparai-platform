import { setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/layout";
import { ShieldCheck, Eye, Search, AlertTriangle } from "lucide-react";
import { ShowcasePageTracker, TrackedCtaButton } from "@/components/analytics/showcase-tracker";

export default async function BrowserExtensionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-24 pb-16">
      <ShowcasePageTracker pagePath="/products/browser-extension" />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="border-warning-500/30 bg-warning-500/10 text-warning-400 inline-flex items-center gap-2 rounded-sm border px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase">
                <ShieldCheck className="h-4 w-4" />
                <span>Consumer Protection</span>
              </div>
            </div>
            <h1 className="text-fg-primary mb-6 text-5xl font-black tracking-tight lg:text-6xl">
              ALPAR AI Guard
            </h1>
            <p className="text-fg-secondary text-lg leading-relaxed">
              Real-time protection for your daily AI interactions. Our browser extension warns you
              about hallucinating models, privacy-invasive prompts, and biased AI systems before you
              interact with them.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <Eye className="text-brand-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">In-Browser Alerts</h3>
              <p className="text-fg-secondary text-sm">
                Get instant warnings when visiting AI tools with known privacy violations or high
                incident rates.
              </p>
            </div>
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <AlertTriangle className="text-danger-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Prompt Scanner</h3>
              <p className="text-fg-secondary text-sm">
                Automatically detects and blocks PII (Personally Identifiable Information) before it
                is sent to external AI providers.
              </p>
            </div>
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <Search className="text-success-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Trust Scores Everywhere</h3>
              <p className="text-fg-secondary text-sm">
                See ALPAR Trust Scores injected directly into AI product pages and directories.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-glass inline-block rounded-2xl border border-white/5 p-8 shadow-2xl">
              <h2 className="text-fg-primary mb-4 text-2xl font-bold">
                Coming to Chrome & Firefox
              </h2>
              <p className="text-fg-secondary mb-6 max-w-md">
                The ALPAR AI Guard extension is currently in development. Join the waitlist to get
                early access to our consumer protection tools.
              </p>
              <TrackedCtaButton
                pagePath="/products/browser-extension"
                ctaAction="join_waitlist"
                href="mailto:hello@alparai.com?subject=ALPAR Guard Waitlist"
                className="bg-brand-600 hover:bg-brand-500 inline-flex h-12 items-center justify-center rounded-md px-8 text-sm font-bold text-white transition-all hover:scale-105"
              >
                Join Waitlist
              </TrackedCtaButton>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
