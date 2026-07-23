import { setRequestLocale } from "next-intl/server";
import { getApiKeys } from "@/actions/api-keys";
import { ApiKeysClient } from "@/components/admin/api-keys-client";
import { Container } from "@/components/ui/layout";
import { ShieldCheck, Cpu } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Provider Keys — Admin ALPAR AI",
  description: "Configure and rotate AI provider API keys with AES-256-GCM encryption at rest.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProvidersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const keysRes = await getApiKeys();
  const keys = keysRes.ok && keysRes.data ? keysRes.data : [];

  return (
    <Container className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-white">
            <Cpu className="h-7 w-7 text-emerald-400" />
            AI Provider Keys & Integrations
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure encrypted AI provider integrations and rotate keys securely with AES-256-GCM
            vault protection.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          AES-256-GCM Encrypted at Rest
        </div>
      </div>

      <ApiKeysClient initialKeys={keys} />
    </Container>
  );
}
