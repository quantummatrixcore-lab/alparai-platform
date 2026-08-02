"use client";

import { useState } from "react";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import { Shield, Lock, Server, Save, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function SettingsDashboardClient() {
  const t = useTranslations("admin");
  const [settings, setSettings] = useState({
    piiGuardian: true,
    strictSsr: true,
    rateLimitRequestsPerMin: 60,
    maintenanceMode: false,
    publicApiEnabled: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8" data-testid="settings-dashboard">
      <form onSubmit={handleSave} className="space-y-8">
        <AdminSectionCard title={t("security_privacy_policy_settings")}>
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <Shield className="h-4 w-4 text-emerald-400" /> {t("pii_guardian_sanitization")}
                </span>
                <p className="text-fg-muted mt-0.5 text-xs">
                  {t("mask_emails_phone_numbers_and_tc_identit")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.piiGuardian}
                onChange={(e) => setSettings({ ...settings, piiGuardian: e.target.checked })}
                className="h-5 w-5 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0"
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <Lock className="h-4 w-4 text-cyan-400" /> {t("ssrf_policy_strict_allowlist")}
                </span>
                <p className="text-fg-muted mt-0.5 text-xs">
                  {t("enforce_https_only_and_block_internal_ip")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.strictSsr}
                onChange={(e) => setSettings({ ...settings, strictSsr: e.target.checked })}
                className="h-5 w-5 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0"
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <Server className="h-4 w-4 text-purple-400" />{" "}
                  {t("public_read_only_incidents_api")}
                </span>
                <p className="text-fg-muted mt-0.5 text-xs">
                  {t("expose_api_public_incidents_api_public_i")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.publicApiEnabled}
                onChange={(e) => setSettings({ ...settings, publicApiEnabled: e.target.checked })}
                className="h-5 w-5 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0"
              />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title={t("rate_limiting_operational_ceilings")}>
          <div className="space-y-4 p-6">
            <div>
              <label className="text-fg-muted mb-1 block text-xs font-semibold">
                {t("global_rate_limit_requests_minute_ip")}
              </label>
              <input
                type="number"
                value={settings.rateLimitRequestsPerMin}
                onChange={(e) =>
                  setSettings({ ...settings, rateLimitRequestsPerMin: Number(e.target.value) })
                }
                className="text-fg-primary w-full max-w-xs rounded border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </AdminSectionCard>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-400"
          >
            <Save className="h-4 w-4" /> {t("save_system_settings")}
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> {t("system_settings_updated_successfully")}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
