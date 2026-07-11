"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { saveApiKey, deleteApiKey } from "@/actions/api-keys";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Trash2, Plus, RefreshCw, Layers, Globe } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ApiKeyRow {
  provider: string;
  api_key: string;
  tier?: string;
  client_type?: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  initialKeys: ApiKeyRow[];
}

export function ApiKeysClient({ initialKeys }: Props) {
  const t = useTranslations("admin");
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [keyType, setKeyType] = useState<"internal" | "external">("internal");
  const [provider, setProvider] = useState("openrouter");
  const [customProvider, setCustomProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [tier, setTier] = useState<"free" | "developer" | "enterprise">("developer");
  const [pending, start] = useTransition();

  const internalProviders = [
    { value: "openrouter", name: "OpenRouter", description: t("openrouter_desc") },
    { value: "cohere", name: "Cohere", description: t("cohere_desc") },
    {
      value: "huggingface",
      name: "HuggingFace",
      description: t("huggingface_desc", { defaultValue: "HuggingFace keys" }),
    },
    {
      value: "google",
      name: "Google Gemini",
      description: t("google_desc", { defaultValue: "Gemini keys" }),
    },
    {
      value: "google_vertex",
      name: "Google Vertex",
      description: t("google_vertex_desc", { defaultValue: "Vertex AI keys" }),
    },
    {
      value: "blackbox",
      name: "Blackbox AI",
      description: t("blackbox_desc", { defaultValue: "Blackbox keys" }),
    },
  ];

  const handleGenerateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomArray = new Uint8Array(32);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(randomArray);
    }
    const token = Array.from(randomArray)
      .map((x) => chars[x % chars.length])
      .join("");

    const prefix =
      tier === "enterprise" ? "alpar_ent_" : tier === "developer" ? "alpar_dev_" : "alpar_free_";
    setApiKey(`${prefix}${token}`);
    toast.success("Secure API Key generated!");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    const finalProvider = keyType === "internal" ? provider : customProvider.trim().toLowerCase();
    if (!finalProvider) {
      toast.error("Provider/Client name is required");
      return;
    }

    start(async () => {
      const res = await saveApiKey(finalProvider, apiKey, tier, keyType);
      if (res.ok) {
        toast.success(t("key_saved"));
        setApiKey("");
        setCustomProvider("");

        // Reload keys locally with correct masked values
        const newKeys = [...keys];
        const existingIdx = newKeys.findIndex((k) => k.provider === finalProvider);

        let maskedKey = "••••";
        if (keyType === "internal") {
          maskedKey = apiKey.length > 8 ? `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}` : "••••";
        } else {
          // For external client keys, we show hash prefix since it is saved as SHA-256 in DB
          maskedKey = `sha256:••••`;
        }

        const newRow: ApiKeyRow = {
          provider: finalProvider,
          api_key: maskedKey,
          tier: keyType === "internal" ? "enterprise" : tier,
          client_type: keyType,
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
        <Card variant="glass" className="border-border-subtle/80">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Plus className="text-brand-400 h-5 w-5" />
              {t("add_api_key")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Toggle Switch */}
            <div className="bg-bg-tertiary/40 mb-5 flex rounded-xl p-1">
              <button
                type="button"
                onClick={() => setKeyType("internal")}
                className={`flex-1 rounded-lg py-2 text-center text-xs font-medium transition-all ${
                  keyType === "internal"
                    ? "bg-bg-primary text-fg-primary shadow-sm"
                    : "text-fg-muted hover:text-fg-primary"
                }`}
              >
                Internal LLM Key
              </button>
              <button
                type="button"
                onClick={() => setKeyType("external")}
                className={`flex-1 rounded-lg py-2 text-center text-xs font-medium transition-all ${
                  keyType === "external"
                    ? "bg-bg-primary text-fg-primary shadow-sm"
                    : "text-fg-muted hover:text-fg-primary"
                }`}
              >
                External Client Key
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {keyType === "internal" ? (
                <div>
                  <label className="text-fg-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                    {t("provider")}
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="border-border-subtle bg-bg-primary focus:ring-brand-500 w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:outline-none"
                  >
                    {internalProviders.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-fg-muted mt-1 text-xs">
                    {internalProviders.find((p) => p.value === provider)?.description}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-fg-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                      Client / App Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. client_developer_hub"
                      value={customProvider}
                      onChange={(e) => setCustomProvider(e.target.value)}
                      className="border-border-subtle bg-bg-primary focus:ring-brand-500 w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-fg-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                      Access Tier
                    </label>
                    <select
                      value={tier}
                      onChange={(e) =>
                        setTier(e.target.value as "free" | "developer" | "enterprise")
                      }
                      className="border-border-subtle bg-bg-primary focus:ring-brand-500 w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:outline-none"
                    >
                      <option value="free">Free Tier</option>
                      <option value="developer">Developer Tier</option>
                      <option value="enterprise">Enterprise Tier</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-fg-secondary block text-xs font-semibold tracking-wider uppercase">
                    {t("api_key")}
                  </label>
                  {keyType === "external" && (
                    <button
                      type="button"
                      onClick={handleGenerateKey}
                      className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 text-xs font-medium"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Generate Secure Key
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder={keyType === "internal" ? "sk-..." : "alpar_..."}
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
              {keys.length === 0 ? (
                <div className="text-fg-muted py-8 text-center text-sm">
                  No API keys configured yet.
                </div>
              ) : (
                keys.map((k) => {
                  const isInternal = k.client_type === "internal";
                  const tierVal = k.tier ?? "developer";

                  return (
                    <div
                      key={k.provider}
                      className="bg-bg-tertiary/20 hover:bg-bg-tertiary/35 border-border-subtle flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-300"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-fg-primary text-sm font-semibold capitalize">
                            {k.provider}
                          </h4>
                          {/* Client Type Badge */}
                          <Badge
                            variant={isInternal ? "muted" : "brand"}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px]"
                          >
                            {isInternal ? (
                              <Layers className="h-2.5 w-2.5" />
                            ) : (
                              <Globe className="h-2.5 w-2.5" />
                            )}
                            {isInternal ? "Internal LLM" : "External Client"}
                          </Badge>
                          {/* Tier Badge */}
                          <Badge
                            variant={
                              tierVal === "enterprise"
                                ? "success"
                                : tierVal === "developer"
                                  ? "brand"
                                  : "warning"
                            }
                            className="px-2 py-0.5 text-[10px]"
                          >
                            {tierVal}
                          </Badge>
                        </div>
                        <p className="text-fg-muted mt-2 font-mono text-xs">
                          {t("api_key")}:{" "}
                          <span className="text-brand-300 font-mono">{k.api_key}</span>
                        </p>
                        <p className="text-fg-muted mt-1 text-[10px]">
                          Last Updated: {new Date(k.updated_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                          onClick={() => handleDelete(k.provider)}
                          isLoading={pending}
                        >
                          {t("delete") ?? "Delete"}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
