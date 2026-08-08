import { setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/layout";
import { Shield, Zap, Lock, Code } from "lucide-react";
import { ShowcasePageTracker, TrackedCtaButton } from "@/components/analytics/showcase-tracker";
import { Link } from "@/i18n/routing";
import { getGlobalMetrics } from "@/lib/services/metrics-service";

export default async function ArsApiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const metrics = await getGlobalMetrics();

  return (
    <div className="pt-24 pb-16">
      <ShowcasePageTracker pagePath="/products/ars-api" />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="border-danger-500/30 bg-danger-500/10 text-danger-400 inline-flex items-center gap-2 rounded-sm border px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase">
                <Shield className="h-4 w-4" />
                <span>Enterprise API</span>
              </div>
            </div>
            <h1 className="text-fg-primary mb-6 text-5xl font-black tracking-tight lg:text-6xl">
              ALPAR Risk Score API
            </h1>
            <p className="text-fg-secondary text-lg leading-relaxed">
              Integrate the world's most comprehensive AI accountability index directly into your
              risk models, compliance workflows, and cyber insurance underwriting processes.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <Zap className="text-warning-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Real-time Telemetry</h3>
              <p className="text-fg-secondary text-sm">
                Stream verified AI incidents and risk score changes the moment they happen.
              </p>
            </div>
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <Lock className="text-brand-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Actuarial Precision</h3>
              <p className="text-fg-secondary text-sm">
                Built for insurance. Our models calculate risk based on {metrics.totalIncidents}+
                verified historical incidents.
              </p>
            </div>
            <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-xl">
              <Code className="text-success-400 mb-4 h-8 w-8" />
              <h3 className="text-fg-primary mb-2 text-xl font-bold">Developer First</h3>
              <p className="text-fg-secondary text-sm">
                REST and GraphQL endpoints with webhooks, typed SDKs, and 99.99% uptime SLA.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-glass inline-block rounded-2xl border border-white/5 p-8 shadow-2xl">
              <h2 className="text-fg-primary mb-4 text-2xl font-bold">Early Access Program</h2>
              <p className="text-fg-secondary mb-6 max-w-md">
                We are currently onboarding design partners for the ARS API. Apply now for early
                access and dedicated integration support.
              </p>
              <TrackedCtaButton pagePath="/products/ars-api" ctaAction="request_api_access" asChild>
                <Link
                  href="/contact"
                  className="bg-brand-600 hover:bg-brand-500 inline-flex h-12 items-center justify-center rounded-md px-8 text-sm font-bold text-white transition-all hover:scale-105"
                >
                  Request API Access
                </Link>
              </TrackedCtaButton>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
