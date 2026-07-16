"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, HelpCircle, ExternalLink } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  category: string;
  status: "live" | "manual_check" | "stub";
  description: string;
  url?: string;
}

const VENDORS: Vendor[] = [
  {
    id: "vercel",
    name: "Vercel",
    category: "Hosting & Edge",
    status: "manual_check",
    description: "Frontend hosting, Edge functions, CI/CD",
    url: "https://vercel.com",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Database & Auth",
    status: "manual_check",
    description: "PostgreSQL, Auth, Storage, Edge Functions",
    url: "https://supabase.com",
  },
  {
    id: "resend",
    name: "Resend",
    category: "Email",
    status: "manual_check",
    description: "Transactional emails (Cap: 100/day free)",
    url: "https://resend.com",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    category: "AI Gateway",
    status: "manual_check",
    description: "LLM routing and failover",
    url: "https://openrouter.ai",
  },
  {
    id: "vertex",
    name: "Google Vertex / Gemini",
    category: "AI Models",
    status: "manual_check",
    description: "Gemini Pro/Flash natively",
    url: "https://console.cloud.google.com/vertex-ai",
  },
  {
    id: "upstash",
    name: "Upstash",
    category: "Redis / Rate Limiting",
    status: "manual_check",
    description: "Serverless Redis for rate-limiting",
    url: "https://upstash.com",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    category: "Security",
    status: "manual_check",
    description: "Turnstile CAPTCHA and DNS",
    url: "https://dash.cloudflare.com",
  },
  {
    id: "sentry",
    name: "Sentry",
    category: "Observability",
    status: "manual_check",
    description: "Error tracking and performance",
    url: "https://sentry.io",
  },
  {
    id: "plausible",
    name: "Plausible",
    category: "Analytics",
    status: "manual_check",
    description: "Privacy-friendly analytics",
    url: "https://plausible.io",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    status: "stub",
    description: "Stub for future subscriptions",
    url: "https://stripe.com",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    category: "AI Models",
    status: "manual_check",
    description: "Claude 3.5 Sonnet directly",
    url: "https://console.anthropic.com",
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "AI Models",
    status: "manual_check",
    description: "GPT-4o usage directly",
    url: "https://platform.openai.com",
  },
  {
    id: "blackbox",
    name: "Blackbox AI",
    category: "AI Models",
    status: "manual_check",
    description: "Code analysis models",
    url: "https://blackbox.ai",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "AI Image & Models",
    status: "manual_check",
    description: "FLUX.1-schnell image fallback",
    url: "https://huggingface.co",
  },
  {
    id: "github",
    name: "GitHub",
    category: "VCS & CI",
    status: "manual_check",
    description: "Source control and GitHub Actions",
    url: "https://github.com",
  },
];

export function ResourcesClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 p-2 lg:p-6">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
          Resource Efficiency & Vendors
        </h1>
        <p className="text-fg-secondary text-sm">
          Monitor status and links for all 15 active ALPAR AI infrastructure vendors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {VENDORS.map((v) => (
          <Card key={v.id} className="bg-bg-secondary/40 border-white/5 backdrop-blur-xl">
            <CardHeader className="border-b border-white/5 pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2 text-[10px] tracking-wider uppercase">
                    {v.category}
                  </Badge>
                  <CardTitle className="text-lg font-bold text-white">{v.name}</CardTitle>
                </div>
                {v.status === "manual_check" && (
                  <Badge
                    variant="warning"
                    className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
                    title="Check dashboard manually"
                  >
                    <HelpCircle className="mr-1 h-3 w-3" /> Manual Check
                  </Badge>
                )}
                {v.status === "live" && (
                  <Badge
                    variant="success"
                    className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Live API
                  </Badge>
                )}
                {v.status === "stub" && (
                  <Badge
                    variant="muted"
                    className="border-neutral-500/20 bg-neutral-500/10 text-neutral-400"
                  >
                    Stub
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between pt-4">
              <CardDescription className="text-fg-muted mb-4 min-h-[40px] text-sm">
                {v.description}
              </CardDescription>
              {v.url && (
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1.5 font-mono text-xs transition-colors"
                >
                  Vendor Dashboard <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
