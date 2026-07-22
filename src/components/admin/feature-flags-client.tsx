"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import { toggleFeatureFlagAction, type FeatureFlagItem } from "@/actions/system-mgmt";
import { ToggleLeft, ToggleRight, ShieldCheck, Zap } from "lucide-react";

interface FeatureFlagsClientProps {
  initialFlags: FeatureFlagItem[];
}

export function FeatureFlagsClient({ initialFlags }: FeatureFlagsClientProps) {
  const t = useTranslations("admin");
  const [flags, setFlags] = useState<FeatureFlagItem[]>(initialFlags);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const handleToggle = async (key: string, currentEnabled: boolean) => {
    setUpdatingKey(key);
    const newEnabled = !currentEnabled;
    const res = await toggleFeatureFlagAction(key, newEnabled);
    setUpdatingKey(null);

    if (res.success) {
      setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, enabled: newEnabled } : f)));
    }
  };

  return (
    <div className="space-y-6" data-testid="feature-flags-client">
      <AdminSectionCard title={t("ff_controls_title")}>
        <div className="divide-y divide-white/10 p-6">
          {flags.map((flag) => (
            <div
              key={flag.key}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">{flag.key}</span>
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                      flag.enabled
                        ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                        : "text-fg-muted bg-white/10"
                    }`}
                  >
                    {flag.enabled ? t("ff_active") : t("ff_disabled")}
                  </span>
                </div>
                <p className="text-fg-muted text-xs">{flag.description}</p>
              </div>

              <button
                type="button"
                disabled={updatingKey === flag.key}
                onClick={() => handleToggle(flag.key, flag.enabled)}
                className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-semibold transition hover:bg-white/10 disabled:opacity-50"
              >
                {flag.enabled ? (
                  <>
                    <ToggleRight className="h-6 w-6 text-emerald-400" />
                    <span className="text-emerald-400">{t("ff_on")}</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="text-fg-muted h-6 w-6" />
                    <span className="text-fg-muted">{t("ff_off")}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </AdminSectionCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="text-fg-muted space-y-1 rounded-lg border border-white/10 bg-white/5 p-4 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Zap className="h-4 w-4 text-amber-400" /> {t("ff_edge_cache")}
          </span>
          <p>{t("ff_edge_cache_desc")}</p>
        </div>
        <div className="text-fg-muted space-y-1 rounded-lg border border-white/10 bg-white/5 p-4 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> {t("ff_rls_protection")}
          </span>
          <p>{t("ff_rls_protection_desc")}</p>
        </div>
      </div>
    </div>
  );
}
