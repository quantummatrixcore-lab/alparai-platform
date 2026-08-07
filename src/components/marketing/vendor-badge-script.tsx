import { Container, Section } from "@/components/ui/layout";
import { Shield, CheckCircle, Copy } from "lucide-react";

export function VendorBadgeScript() {
  const snippetCode = `<a href="https://alparai.com/leaderboard" target="_blank" rel="noopener noreferrer">
  <img src="https://alparai.com/api/badges/trust-score?provider=your-provider-slug&theme=dark" alt="ALPAR AI Trust Score" width="250" height="60" />
</a>`;

  return (
    <Section className="bg-bg-tertiary border-y border-white/5 py-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="border-brand-500/30 bg-brand-500/10 text-brand-400 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold">
              <Shield className="h-4 w-4" />
              <span>ALPAR Trust Score™ Badge</span>
            </div>
            <h2 className="text-fg-primary mb-6 text-3xl font-black tracking-tight md:text-4xl">
              Embed Trust Directly on Your Site
            </h2>
            <p className="text-fg-secondary mb-8 text-lg leading-relaxed">
              Show your users that you take AI accountability seriously. Embed your live ALPAR Trust
              Score directly into your product's landing page, footer, or documentation.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-success-400 mt-1 h-5 w-5 shrink-0" />
                <span className="text-fg-primary">
                  Updates in real-time as your incident response metrics improve.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-success-400 mt-1 h-5 w-5 shrink-0" />
                <span className="text-fg-primary">
                  Builds immediate trust with enterprise buyers and regulators.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-success-400 mt-1 h-5 w-5 shrink-0" />
                <span className="text-fg-primary">Zero-latency SVG delivery via edge CDN.</span>
              </li>
            </ul>
          </div>

          <div className="bg-glass rounded-2xl border border-white/5 p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-fg-primary text-sm font-bold">Preview</h3>
              <span className="text-fg-muted text-xs">Dark Theme</span>
            </div>

            <div className="bg-bg-primary mb-8 flex h-32 items-center justify-center rounded-xl border border-white/5 shadow-inner">
              {/* Mock Badge */}
              <div className="flex overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-lg">
                <div className="flex items-center gap-2 bg-neutral-800 px-4 py-3">
                  <Shield className="text-brand-400 h-5 w-5" />
                  <span className="text-sm font-bold text-white">ALPAR AI</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs font-medium text-neutral-400">TRUST SCORE</span>
                  <span className="text-success-400 text-lg font-black">92/100</span>
                </div>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-fg-primary text-sm font-bold">Integration Code</h3>
              <button className="text-brand-400 hover:text-brand-300 flex items-center gap-1 text-xs font-bold transition-colors">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
            <div className="bg-bg-primary overflow-hidden rounded-xl border border-white/5">
              <pre className="overflow-x-auto p-4 text-xs font-medium text-neutral-300">
                <code>{snippetCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
