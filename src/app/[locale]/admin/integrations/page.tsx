"use client";

import * as React from "react";
import { Cpu, RefreshCw, AlertTriangle } from "lucide-react";
import {
  AdminContainer,
  AdminPageHeader,
  ZeroCostBanner,
} from "@/components/admin/admin-design-kit";
import { CategoryGroup } from "@/components/admin/integrations/category-group";
import { INTEGRATION_SERVICES, CATEGORIES } from "@/lib/integrations/registry";
import type { IntegrationStatus, IntegrationAlternative } from "@/lib/integrations/types";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function AdminIntegrationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations("admin");
  const unwrappedParams = React.use(params);
  const locale = unwrappedParams.locale;

  const [data, setData] = React.useState<{
    services: IntegrationStatus[];
    alternatives: Record<string, IntegrationAlternative[]>;
    lastUpdated: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedServices, setExpandedServices] = React.useState<Set<string>>(new Set());

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/integrations");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statusMap = React.useMemo(() => {
    const map = new Map<string, IntegrationStatus>();
    if (data?.services) {
      for (const s of data.services) {
        map.set(s.serviceId, s);
      }
    }
    return map;
  }, [data]);

  // Only show services that have env vars (active integrations)
  const activeServiceIds = React.useMemo(
    () => new Set(INTEGRATION_SERVICES.filter((s) => s.envVars.length > 0).map((s) => s.id)),
    [],
  );

  const toggleService = (id: string) => {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalConnected = React.useMemo(
    () => (data?.services || []).filter((s) => s.status === "connected").length,
    [data],
  );
  const totalServices = React.useMemo(() => activeServiceIds.size, [activeServiceIds]);

  const mockZeroCostServices = [
    { name: "Supabase", monthlyCost: 0, freeLimit: "500MB DB", usedPercent: 76 },
    { name: "Vercel", monthlyCost: 0, freeLimit: "100GB Bandwidth", usedPercent: 23 },
    { name: "Upstash", monthlyCost: 0, freeLimit: "10k req/day", usedPercent: 41 },
    { name: "Resend", monthlyCost: 0, freeLimit: "3k emails/mo", usedPercent: 7 },
    { name: "Sentry", monthlyCost: 0, freeLimit: "5k events/mo", usedPercent: 37 },
    { name: "Cloudflare", monthlyCost: 0, freeLimit: "Unlimited", usedPercent: 12 },
  ];

  if (loading && !data) {
    return (
      <AdminContainer>
        <AdminPageHeader
          icon={<Cpu className="text-brand-400 h-6 w-6 animate-pulse" />}
          title={t("integrations_title")}
          subtitle={t("integrations_syncing")}
        />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="bg-bg-secondary/30 h-5 w-48 animate-pulse rounded-md" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="bg-bg-secondary/20 h-[72px] animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminContainer>
    );
  }

  if (error) {
    return (
      <AdminContainer>
        <AdminPageHeader
          icon={<AlertTriangle className="h-6 w-6 text-rose-400" />}
          title={t("integrations_title")}
          subtitle={t("integrations_sync_failed")}
        />
        <div className="bg-bg-secondary/40 border-border-subtle rounded-xl border p-8 text-center">
          <p className="mb-4 text-sm text-rose-400">{error}</p>
          <Button
            onClick={fetchData}
            variant="outline"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            {t("integrations_retry")}
          </Button>
        </div>
      </AdminContainer>
    );
  }

  const lastUpdatedTime = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleTimeString(locale, { hour12: false })
    : "—";

  return (
    <AdminContainer>
      <AdminPageHeader
        icon={<Cpu className="text-brand-400 h-6 w-6" />}
        title={`${t("integrations_title")} (${totalConnected}/${totalServices})`}
        subtitle={t("integrations_subtitle")}
        lastUpdated={lastUpdatedTime}
        action={
          <Button
            onClick={fetchData}
            disabled={loading}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
          >
            {loading ? t("integrations_refreshing") : t("integrations_refresh")}
          </Button>
        }
      />

      {/* Zero Cost Banner Shield */}
      <ZeroCostBanner services={mockZeroCostServices} totalSaved="$347.00 / mo" locale={locale} />

      <div className="mt-8 space-y-8">
        {CATEGORIES.map((cat) => {
          const services = INTEGRATION_SERVICES.filter(
            (s) => s.category === cat.id && activeServiceIds.has(s.id),
          );
          if (services.length === 0) return null;

          return (
            <CategoryGroup
              key={cat.id}
              categoryId={cat.id}
              label={cat.label}
              services={services}
              statuses={statusMap}
              alternatives={data?.alternatives || {}}
              expandedServices={expandedServices}
              onToggleService={toggleService}
            />
          );
        })}
      </div>
    </AdminContainer>
  );
}
