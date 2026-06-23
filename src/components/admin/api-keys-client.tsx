"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { saveApiKey, deleteApiKey } from "@/actions/api-keys";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ApiKeyRow {
  provider: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  initialKeys: ApiKeyRow[];
}

export function ApiKeysClient({ initialKeys }: Props) {
  const t = useTranslations("admin");
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [provider, setProvider] = useState("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [pending, start] = useTransition();

  const providers = [
    {
      value: "openrouter",
      name: "OpenRouter",
      description: t("openrouter_desc"),
    },
    { value: "cohere", name: "Cohere", description: t("cohere_desc") },
    { value: "huggingface", name: "HuggingFace", description: t("huggingface_desc") },
    { value: "google", name: "Google Gemini", description: t("google_desc") },
    { value: "blackbox", name: "Blackbox AI", description: t("blackbox_desc") },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    start(async () => {
      const res = await saveApiKey(provider, apiKey);
      if (res.ok) {
        toast.success(t("key_saved"));
        setApiKey("");
        // Reload keys locally
        const newKeys = [...keys];
        const existingIdx = newKeys.findIndex((k) => k.provider === provider);
        const maskedKey =
          apiKey.length > 8 ? `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}` : "••••";
        const newRow = {
          provider,
          api_key: maskedKey,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        if (existingIdx >= 0) {
          newKeys[existingIdx] = newRow;
        } else {
          newKeys.push(newRow);
        }
        setKeys(newKeys);
      } else {
        toast.error(res.error ?? t("save_failed"));
      }
    });
  };

  const handleDelete = (prov: string) => {
    if (!confirm(t("delete_confirm", { provider: prov }))) return;

    start(async () => {
      const res = await deleteApiKey(prov);
      if (res.ok) {
        toast.success(t("key_deleted"));
        setKeys(keys.filter((k) => k.provider !== prov));
      } else {
        toast.error(res.error ?? t("delete_failed"));
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Configuration Form */}
      <div className="lg:col-span-1">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Plus className="text-brand-400 h-5 w-5" />
              {t("add_api_key")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-fg-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("provider")}
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="border-border-subtle bg-bg-primary focus:ring-brand-500 w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:outline-none"
                >
                  {providers.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <p className="text-fg-muted mt-1 text-xs">
                  {providers.find((p) => p.value === provider)?.description}
                </p>
              </div>

              <div>
                <label className="text-fg-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("api_key")}
                </label>
                <input
                  type="password"
                  required
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="border-border-subtle bg-bg-primary focus:ring-brand-500 w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              <Button type="submit" className="w-full" isLoading={pending} disabled={!apiKey}>
                {t("save") ?? "Save"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Keys List */}
      <div className="lg:col-span-2">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Key className="text-brand-400 h-5 w-5" />
              {t("api_keys")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {providers.map((p) => {
                const configRow = keys.find((k) => k.provider === p.value);
                return (
                  <div
                    key={p.value}
                    className="bg-bg-tertiary/20 hover:bg-bg-tertiary/35 border-border-subtle flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-300"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-fg-primary text-sm font-semibold">{p.name}</h4>
                        <span className="text-fg-muted font-mono text-xs">({p.value})</span>
                      </div>
                      <p className="text-fg-muted mt-1 text-xs">{p.description}</p>
                      {configRow && (
                        <p className="text-fg-muted mt-2 font-mono text-xs">
                          {t("api_key")}:{" "}
                          <span className="text-brand-300">{configRow.api_key}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {configRow ? (
                        <>
                          <Badge variant="success" dot className="px-2.5 py-1 text-xs">
                            {t("api_keys_active")}
                          </Badge>
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                            onClick={() => handleDelete(p.value)}
                            isLoading={pending}
                          >
                            {t("delete") ?? "Delete"}
                          </Button>
                        </>
                      ) : (
                        <Badge variant="warning" dot className="px-2.5 py-1 text-xs">
                          {t("api_keys_not_configured")}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
