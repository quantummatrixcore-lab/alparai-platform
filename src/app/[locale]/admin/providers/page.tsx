import { setRequestLocale } from "next-intl/server";
import { getApiKeys } from "@/actions/api-keys";
import { getVerifiedRespondentProviders } from "@/actions/admin";
import { ApiKeysClient } from "@/components/admin/api-keys-client";
import { VerifiedRespondentListClient } from "@/components/admin/verified-respondent-list-client";
import { Container } from "@/components/ui/layout";
import { ShieldCheck, Cpu, Key, BadgeCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Provider Management & Verified Respondents — Admin ALPAR AI",
  description:
    "Configure and rotate AI provider API keys with AES-256-GCM encryption at rest, and grant Verified Respondent badges.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProvidersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [keysRes, providersRes] = await Promise.all([
    getApiKeys(),
    getVerifiedRespondentProviders(),
  ]);

  const keys = keysRes.ok && keysRes.data ? keysRes.data : [];
  const providers = providersRes.ok && providersRes.data ? providersRes.data : [];

  return (
    <Container className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-white">
            <Cpu className="h-7 w-7 text-emerald-400" />
            AI Provider Management Hub
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure encrypted AI provider integrations, rotate keys securely, and moderate
            Verified Respondent badges.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          AES-256-GCM Encrypted at Rest
        </div>
      </div>

      <div className="space-y-10">
        {/* Section 1: AI Provider Keys */}
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Key className="h-4 w-4 text-emerald-400" />
            <span>AI Provider API Keys (AES-256-GCM Encrypted)</span>
          </div>
          <ApiKeysClient initialKeys={keys} />
        </div>

        {/* Section 2: Verified Respondent Badge Moderation */}
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <BadgeCheck className="h-4 w-4 text-emerald-400" />
            <span>Verified Respondent Moderation</span>
          </div>
          <VerifiedRespondentListClient providers={providers} />
        </div>
      </div>
    </Container>
  );
}
