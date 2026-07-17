"use client";

import * as React from "react";
import { PlugsConnected, ArrowsClockwise, WarningCircle } from "@phosphor-icons/react";
import { AdminContainer, AdminPageHeader } from "@/components/admin/admin-design-kit";
import { CategoryGroup } from "@/components/admin/integrations/category-group";
import { INTEGRATION_SERVICES, CATEGORIES } from "@/lib/integrations/registry";
import type { IntegrationStatus, IntegrationAlternative } from "@/lib/integrations/types";

export default function AdminIntegrationsPage() {
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
  const totalMissing = React.useMemo(
    () => (data?.services || []).filter((s) => s.status === "missing_key").length,
    [data],
  );

  if (loading && !data) {
    return (
      <AdminContainer>
        <AdminPageHeader
          icon={<PlugsConnected weight="duotone" className="text-brand-400 h-6 w-6" />}
          title="Integrations"
          subtitle="Loading third-party service status..."
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
          icon={<WarningCircle weight="duotone" className="h-6 w-6 text-rose-400" />}
          title="Integrations"
          subtitle="Failed to load integration status"
        />
        <div className="bg-bg-secondary/40 border-border-subtle rounded-xl border p-8 text-center">
          <p className="mb-4 text-sm text-rose-400">{error}</p>
          <button
            onClick={fetchData}
            className="bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors"
          >
            <ArrowsClockwise weight="duotone" className="h-4 w-4" />
            Retry
          </button>
        </div>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminPageHeader
        icon={<PlugsConnected weight="duotone" className="text-brand-400 h-6 w-6" />}
        title={`Integrations (${totalConnected}/${totalServices})`}
        subtitle={`${totalConnected} connected · ${totalMissing} missing keys · Last updated ${data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : "—"}`}
        action={
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50"
          >
            <ArrowsClockwise
              weight="duotone"
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        }
      />

      <div className="space-y-8">
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
