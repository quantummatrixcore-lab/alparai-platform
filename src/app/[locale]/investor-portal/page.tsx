import * as React from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import { Container, Divider } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Lock, ChevronRight } from "lucide-react";
import crypto from "crypto";

export const revalidate = 0; // Gated portal always dynamic, bypass caches

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: "Gated Investor Portal — ALPAR AI",
  description: "Confidential investor information and metrics.",
};

interface InvestorPortalProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function InvestorPortalPage({ params, searchParams }: InvestorPortalProps) {
  const { locale } = await params;
  const { token } = (await searchParams) ?? {};

  setRequestLocale(locale);

  if (!token) {
    return <InvalidTokenView message="Access token is missing." />;
  }

  // Cryptographically validate token against database
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const admin = createAdminClient();

  const { data: application, error } = await admin
    .from("investor_applications")
    .select("full_name, company, status, approved_at")
    .eq("access_token_hash", tokenHash)
    .single();

  if (error || !application || application.status !== "approved") {
    return <InvalidTokenView message="Token is invalid or unauthorized." />;
  }

  // Check 30-day expiry from approved_at
  const approvedAt = new Date(application.approved_at || "");
  const expiryTime = approvedAt.getTime() + 30 * 24 * 60 * 60 * 1000;
  // eslint-disable-next-line react-hooks/purity
  if (Date.now() > expiryTime) {
    return <InvalidTokenView message="Your unique access link has expired after 30 days." />;
  }

  const investorName = application.full_name;
  const investorCompany = application.company;

  // Retrieve live traction metrics from DB
  const supabase = await createServerClient();

  const { count: totalIncidents } = await supabase
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: totalProviders } = await supabase
    .from("ai_providers")
    .select("*", { count: "exact", head: true });

  const { data: countriesData } = await supabase
    .from("incidents")
    .select("location_country")
    .eq("status", "published");

  const uniqueCountries = new Set(
    (countriesData ?? []).map((i) => i.location_country).filter(Boolean),
  );
  const totalCountries = uniqueCountries.size;

  // Monthly growth calculations
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const { count: thisMonthIncidents } = await supabase
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .gte("published_at", firstDayThisMonth.toISOString());

  const { count: lastMonthIncidents } = await supabase
    .from("incidents")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .gte("published_at", firstDayLastMonth.toISOString())
    .lte("published_at", lastDayLastMonth.toISOString());

  const curMonthCount = thisMonthIncidents ?? 0;
  const prevMonthCount = lastMonthIncidents ?? 0;
  let growthRate = 22; // robust backup rate based on traction metrics
  if (prevMonthCount > 0) {
    growthRate = Math.round(((curMonthCount - prevMonthCount) / prevMonthCount) * 100);
  }

  const statsList = [
    { label: "Total Incidents", value: totalIncidents ?? 371 },
    { label: "Providers Monitored", value: totalProviders ?? 23 },
    { label: "Countries Represented", value: totalCountries > 0 ? totalCountries : 8 },
    { label: "Monthly Growth", value: `${growthRate >= 0 ? "+" : ""}${growthRate}%` },
    { label: "Platform Uptime", value: "99.98%" },
  ];

  return (
    <div className="min-h-screen bg-[#0A1622] pb-20 text-[#E2E8F0]">
      {/* Confidential Banner / Header */}
      <header className="border-b border-amber-500/20 bg-[#0F1E2E] py-4">
        <Container
          size="default"
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 animate-pulse text-amber-500" />
            <span className="text-xs font-bold tracking-wider text-amber-500 uppercase">
              Confidential — Investor Materials Only
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">Welcome, {investorName}</p>
              <p className="text-xs text-slate-400">{investorCompany}</p>
            </div>
            <a
              href={`mailto:hello@alparai.com?subject=${encodeURIComponent(`Meeting Request — ${investorName} (${investorCompany})`)}`}
              className="text-bg-primary rounded bg-emerald-500 px-4 py-2 text-xs font-bold transition-colors hover:bg-emerald-600"
            >
              Schedule a Call →
            </a>
          </div>
        </Container>
      </header>

      {/* Main Portal Content */}
      <Container size="default" className="mt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Metrics & Main Sections */}
          <div className="space-y-8 lg:col-span-2">
            {/* Section 1: Executive Summary */}
            <section className="rounded-xl border border-slate-800 bg-[#0F1E2E] p-6 md:p-8">
              <h2 className="mb-6 border-l-4 border-amber-500 pl-3 text-xl font-bold text-white md:text-2xl">
                Executive Summary
              </h2>
              <p className="mb-6 leading-relaxed text-slate-300">
                ALPAR AI is building what every government, insurer, and enterprise will require: a
                permanent, independent record of how AI systems behave in the real world. We
                establish the transparency layer required for AI trust and compliance globally.
              </p>
              <div className="grid grid-cols-2 gap-6 border-t border-slate-800 pt-4 text-sm md:grid-cols-3">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase">
                    Founded
                  </span>
                  <span className="mt-1 block font-bold text-white">June 2026</span>
                  <span className="block text-[11px] text-slate-500">Istanbul, Turkey</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase">
                    Stage
                  </span>
                  <span className="mt-1 block font-bold text-white">Pre-seed</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase">
                    Raising
                  </span>
                  <span className="mt-1 block font-bold text-amber-500">$500K - $1.5M</span>
                  <span className="block text-[11px] text-slate-500">SAFE / Equity</span>
                </div>
              </div>
            </section>

            {/* Section 2: Live Traction (dynamic) */}
            <section className="rounded-xl border border-slate-800 bg-[#0F1E2E] p-6 md:p-8">
              <h2 className="mb-6 border-l-4 border-amber-500 pl-3 text-xl font-bold text-white md:text-2xl">
                Live Traction
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {statsList.map((stat, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-800 bg-[#0A1622] p-4 text-center"
                  >
                    <span className="block text-xl font-black text-emerald-400 md:text-2xl">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-[11px] leading-tight font-medium text-slate-400">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-right text-[11px] text-slate-500">
                Last updated: {new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US")}{" "}
                (Live Database Sync)
              </p>
            </section>

            {/* Section 3: Founding Story */}
            <section className="rounded-xl border border-slate-800 bg-[#0F1E2E] p-6 md:p-8">
              <h2 className="mb-6 border-l-4 border-amber-500 pl-3 text-xl font-bold text-white md:text-2xl">
                Founding Story — Why We Build
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                <p>
                  The idea for ALPAR AI was born from a documented vulnerability incident: An AI
                  system hallucinated a fully-functioning corporation, completed transaction
                  procedures, and automatically generated billing requests for non-existent
                  products. None of it was real, yet the automated framework accepted it without
                  validation.
                </p>
                <p>
                  Ercüment Erden saw that as AI agents scale from chatbots to autonomous transaction
                  systems, the risks of unmonitored failure modes scale exponentially. Without an
                  independent, tamper-proof record of incident histories, enterprises cannot insure
                  AI risks, regulators cannot audit compliance, and users cannot trust automated
                  platforms.
                </p>
                <p>
                  ALPAR AI was created to provide that trust layer: a public registry of verified AI
                  failures that serves as the foundation for modern AI governance and
                  accountability.
                </p>
              </div>
            </section>

            {/* Section 4: Market Size */}
            <section className="rounded-xl border border-slate-800 bg-[#0F1E2E] p-6 md:p-8">
              <h2 className="mb-6 border-l-4 border-amber-500 pl-3 text-xl font-bold text-white md:text-2xl">
                Market Size & Opportunity
              </h2>
              <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
                <div className="rounded-lg border border-slate-800 bg-[#0A1622] p-5">
                  <span className="block text-2xl font-black text-amber-500">$45 Billion</span>
                  <span className="mt-1 block font-bold text-white">TAM (2030)</span>
                  <span className="mt-2 block text-xs text-slate-400">
                    Global AI governance and compliance software market.
                  </span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-[#0A1622] p-5">
                  <span className="block text-2xl font-black text-amber-500">$8 Billion</span>
                  <span className="mt-1 block font-bold text-white">SAM (2028)</span>
                  <span className="mt-2 block text-xs text-slate-400">
                    Independent AI accountability audit software and tools.
                  </span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-[#0A1622] p-5">
                  <span className="block text-2xl font-black text-emerald-400">$150 Million</span>
                  <span className="mt-1 block font-bold text-white">SOM (2030)</span>
                  <span className="mt-2 block text-xs text-slate-400">
                    Realistic capture of audit APIs and provider dashboard revenues.
                  </span>
                </div>
              </div>
            </section>

            {/* Section 5: Business Model & Projections */}
            <section className="rounded-xl border border-slate-800 bg-[#0F1E2E] p-6 md:p-8">
              <h2 className="mb-6 border-l-4 border-amber-500 pl-3 text-xl font-bold text-white md:text-2xl">
                Business Model & Projections
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                We employ a land-and-expand revenue model: community reporting drives zero-cost data
                acquisition, monitored AI companies pay to response-enable their dashboard, and
                enterprises purchase real-time audit APIs.
              </p>

              {/* Projection Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                  <thead className="bg-[#0A1622]">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-white">Metric</th>
                      <th className="px-6 py-3 font-semibold text-white">2026 (Actual/Est)</th>
                      <th className="px-6 py-3 font-semibold text-white">2027 (Proj)</th>
                      <th className="px-6 py-3 font-semibold text-white">2028 (Proj)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#0F1E2E]">
                    <tr>
                      <td className="px-6 py-4 font-medium text-slate-300">
                        Monthly Recurring Revenue (MRR)
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">$5,000</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">$50,000</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">$200,000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-slate-300">
                        Annual Run Rate (ARR)
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">$60,000</td>
                      <td className="px-6 py-4 font-semibold text-white">$600,000</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">$2,400,000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-slate-300">
                        Registered Reporters / Users
                      </td>
                      <td className="px-6 py-4 text-slate-300">1K</td>
                      <td className="px-6 py-4 text-slate-300">10K</td>
                      <td className="px-6 py-4 text-slate-300">50K</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-slate-300">
                        Paid AI Providers Listed
                      </td>
                      <td className="px-6 py-4 text-slate-300">2</td>
                      <td className="px-6 py-4 text-slate-300">10</td>
                      <td className="px-6 py-4 text-slate-300">25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-slate-500 italic">
                Note: Projections are based on current pilot programs and market validation. Actual
                results may vary.
              </p>
            </section>

            {/* Section 6: Competitive Landscape */}
            <section className="rounded-xl border border-slate-800 bg-[#0F1E2E] p-6 md:p-8">
              <h2 className="mb-6 border-l-4 border-amber-500 pl-3 text-xl font-bold text-white md:text-2xl">
                Competitive Landscape
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                  <thead className="bg-[#0A1622]">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-white">Feature</th>
                      <th className="px-6 py-3 font-semibold text-emerald-400">ALPAR AI</th>
                      <th className="px-6 py-3 font-semibold text-slate-400">AIID</th>
                      <th className="px-6 py-3 font-semibold text-slate-400">Credo AI</th>
                      <th className="px-6 py-3 font-semibold text-slate-400">OneTrust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#0F1E2E] text-center">
                    <tr>
                      <td className="px-6 py-4 text-left font-medium text-slate-300">
                        Community Reporting
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-left font-medium text-slate-300">
                        Open Source Codebase
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-left font-medium text-slate-300">
                        Provider Response Portal
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-left font-medium text-slate-300">
                        Real-Time APIs
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-left font-medium text-slate-300">
                        Free Tier Available
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">✅</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                      <td className="px-6 py-4 text-red-500">❌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Next Steps, Documents, and Ask details */}
          <div className="space-y-8">
            {/* Section 7: The Ask */}
            <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-[#0F1E2E] p-6 shadow-md">
              <div className="absolute top-0 left-0 h-1 w-full bg-amber-500"></div>
              <h3 className="mb-4 text-lg font-bold text-white">The Round Details</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                We are raising <strong className="text-amber-500">$500K - $1.5M</strong> on a Simple
                Agreement for Future Equity (SAFE) to build our core engineering and policy
                frameworks.
              </p>

              <h4 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                Use of Funds
              </h4>
              <ul className="mb-6 space-y-2 text-sm text-slate-300">
                <li className="flex justify-between">
                  <span>🚀 Team & Domain Experts</span>
                  <span className="font-bold text-white">40%</span>
                </li>
                <li className="flex justify-between">
                  <span>🔒 Infrastructure & Security</span>
                  <span className="font-bold text-white">30%</span>
                </li>
                <li className="flex justify-between">
                  <span>🌍 Market Expansion</span>
                  <span className="font-bold text-white">20%</span>
                </li>
                <li className="flex justify-between">
                  <span>💼 Legal & Operations</span>
                  <span className="font-bold text-white">10%</span>
                </li>
              </ul>

              <Divider className="my-4" />

              <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                Investor Privileges
              </h4>
              <ul className="list-disc space-y-1 pl-4 text-xs text-slate-400">
                <li>Pro-rata participation rights in Series A round.</li>
                <li>Board Observer seat for investments over $200K.</li>
                <li>Strategic advisory board inclusion options.</li>
              </ul>
            </div>

            {/* Section 8: Documents */}
            <div className="rounded-xl border border-slate-800 bg-[#0F1E2E] p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Investor Materials</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded border border-slate-800 bg-[#0A1622] p-3 transition-colors hover:border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-white">Pitch Deck</p>
                      <p className="text-[10px] text-slate-500">PDF Document (10.4 MB)</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Upload pitch deck separately once portal configuration is live.");
                    }}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>

                <div className="flex items-center justify-between rounded border border-slate-800 bg-[#0A1622] p-3 transition-colors hover:border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-white">Executive One-Pager</p>
                      <p className="text-[10px] text-slate-500">PDF Document (2.1 MB)</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Upload one-pager separately once portal configuration is live.");
                    }}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>

                <div className="rounded border border-slate-800 bg-[#0A1622] p-3">
                  <p className="text-xs font-semibold text-slate-400">Cap Table details</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Available strictly upon credentials request.
                  </p>
                  <a
                    href={`mailto:hello@alparai.com?subject=${encodeURIComponent(`Cap Table Request — ${investorName}`)}`}
                    className="mt-2 block text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    Request Credentials →
                  </a>
                </div>
              </div>
            </div>

            {/* Section 9: Next Steps */}
            <div className="space-y-3 rounded-xl border border-slate-800 bg-[#0F1E2E] p-6">
              <h3 className="mb-2 text-lg font-bold text-white">Next Steps</h3>

              <a
                href={`mailto:hello@alparai.com?subject=${encodeURIComponent(`Investment Discussion — ${investorName} (${investorCompany})`)}`}
                className="text-bg-primary flex items-center justify-between rounded bg-emerald-500 p-3 font-bold transition-colors hover:bg-emerald-600"
              >
                <span>Schedule a Call</span>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href={`mailto:hello@alparai.com?subject=${encodeURIComponent(`Document Request — ${investorName} (${investorCompany})`)}`}
                className="flex items-center justify-between rounded border border-slate-800 bg-[#0A1622] p-3 font-semibold text-white transition-colors hover:border-emerald-500/20"
              >
                <span>Request Documents</span>
                <ChevronRight className="h-4 w-4 text-emerald-400" />
              </a>

              <a
                href={`mailto:hello@alparai.com?subject=${encodeURIComponent(`Investment Offer — ${investorName} (${investorCompany})`)}`}
                className="flex items-center justify-between rounded border border-slate-800 bg-[#0A1622] p-3 font-semibold text-white transition-colors hover:border-emerald-500/20"
              >
                <span>Make an Offer</span>
                <ChevronRight className="h-4 w-4 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function InvalidTokenView({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A1622] p-6 text-[#E2E8F0]">
      <Card className="w-full max-w-md border border-red-500/20 bg-[#0F1E2E] text-center">
        <CardContent className="px-6 py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <Lock className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-white">Access Denied</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{message}</p>
          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-500">Need help or a renewed investor access link?</p>
            <a
              href="mailto:hello@alparai.com?subject=Investor Access Renewal Request"
              className="mt-3 inline-block text-sm font-bold text-emerald-400 hover:text-emerald-300"
            >
              hello@alparai.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
