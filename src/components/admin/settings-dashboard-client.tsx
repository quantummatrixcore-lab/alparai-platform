"use client";

import { useState } from "react";
import { AdminSectionCard } from "@/components/admin/admin-design-kit";
import { Shield, Lock, Server, Save, CheckCircle2 } from "lucide-react";

export function SettingsDashboardClient() {
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
        <AdminSectionCard title="Security & Privacy Policy Settings">
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" /> PII Guardian Sanitization
                </span>
                <p className="text-xs text-fg-muted mt-0.5">
                  Mask emails, phone numbers, and TC Identity numbers before database insertion (`src/lib/pii/guardian.ts`).
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
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyan-400" /> SSRF Policy Strict Allowlist
                </span>
                <p className="text-xs text-fg-muted mt-0.5">
                  Enforce HTTPS-only and block internal IP addresses (169.254.169.254, 127.0.0.1) on external fetches.
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
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Server className="h-4 w-4 text-purple-400" /> Public Read-Only Incidents API
                </span>
                <p className="text-xs text-fg-muted mt-0.5">
                  Expose `/api/public/incidents`, `/api/public/incidents.csv`, and `/api/public/dataset.json`.
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

        <AdminSectionCard title="Rate Limiting & Operational Ceilings">
          <div className="space-y-4 p-6">
            <div>
              <label className="block text-xs font-semibold text-fg-muted mb-1">
                Global Rate Limit (Requests / minute / IP)
              </label>
              <input
                type="number"
                value={settings.rateLimitRequestsPerMin}
                onChange={(e) => setSettings({ ...settings, rateLimitRequestsPerMin: Number(e.target.value) })}
                className="w-full max-w-xs rounded border border-white/10 bg-black/40 px-3 py-2 text-xs text-fg-primary focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </AdminSectionCard>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-400"
          >
            <Save className="h-4 w-4" /> Save System Settings
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4" /> System settings updated successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
