import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wordmark } from "@/components/layout/wordmark";
import { Download, Mail, Globe, Award, FileText } from "lucide-react";

export async function generateMetadata() {
  return {
    title: "Press Kit — ALPAR AI",
    description: "Brand guidelines, logos, and media assets for ALPAR AI.",
  };
}

export default async function PressKitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <div className="border-b border-white/5 bg-[#0A1622] py-20 text-center">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold tracking-wider text-emerald-400 uppercase">
              Media Resources
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Press Kit & Brand Assets
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-400">
              Official brand guidelines, logos, and resources for media coverage of ALPAR AI.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* Brand Story Section */}
            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5 text-emerald-400" /> About ALPAR AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-slate-300">
                <p>
                  ALPAR AI is the world’s first community-governed AI accountability and trust
                  infrastructure, designed to track, audit, and address AI failures, hallucinations,
                  and compliance deviations in real-time.
                </p>
                <p>
                  By combining community incident reporting, cryptographically verified auditing
                  logs, and independent moderation policies compliant with EU AI Act and local data
                  protection regulations, ALPAR AI bridges the trust gap between AI builders and the
                  general public.
                </p>
              </CardContent>
            </Card>

            {/* Brand Assets & Guidelines */}
            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Award className="h-5 w-5 text-emerald-400" /> Brand Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm leading-relaxed text-slate-300">
                  Please use our official brand marks and colors in all publications. Do not
                  distort, modify, or change the aspect ratio of the logos.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-white/5 bg-[#08121C] p-6 text-center">
                    <Wordmark size="md" />
                    <span className="text-xs text-slate-400">ALPAR AI Wordmark (Dark Theme)</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-white/5 bg-[#08121C] p-6 text-center">
                    <div className="text-2xl font-black tracking-tighter text-emerald-400">
                      ALPAR AI
                    </div>
                    <span className="text-xs text-slate-400">Standard Logotype</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5 text-emerald-400" /> Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/5 bg-[#0A1622] p-4 text-center">
                  <div className="mb-2 h-12 w-full rounded-md bg-[#00FF88] shadow-inner" />
                  <span className="block text-xs font-bold text-white">Emerald (Brand)</span>
                  <span className="text-[10px] text-slate-500">#00FF88</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#0A1622] p-4 text-center">
                  <div className="mb-2 h-12 w-full rounded-md border border-white/10 bg-[#0A1622] shadow-inner" />
                  <span className="block text-xs font-bold text-white">Dark Slate (Bg)</span>
                  <span className="text-[10px] text-slate-500">#0A1622</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-[#0A1622] p-4 text-center">
                  <div className="mb-2 h-12 w-full rounded-md bg-[#E2E8F0] shadow-inner" />
                  <span className="block text-xs font-bold text-white">Light Gray (Fg)</span>
                  <span className="text-[10px] text-slate-500">#E2E8F0</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardContent className="space-y-4 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Download Assets</h3>
                <p className="text-xs text-slate-400">
                  Get high-resolution logos, product screenshots, and executive headshots.
                </p>
                <a
                  href="/brand-assets.zip"
                  className="block w-full rounded-md bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#0A1622] shadow-lg shadow-emerald-400/10 transition-colors hover:bg-emerald-300"
                >
                  Download Media Kit (.zip)
                </a>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-[#0F1E2E]">
              <CardContent className="space-y-3 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <Mail className="h-4 w-4 text-emerald-400" /> Media Contact
                </p>
                <p className="text-xs text-slate-400">
                  For press inquiries, interviews, or expert commentary on AI safety.
                </p>
                <a
                  href="mailto:press@alparai.com"
                  className="block border-t border-white/5 pt-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
                >
                  press@alparai.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
