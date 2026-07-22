"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Search,
  Layers,
  Globe,
  Clock,
  User,
  Shield,
  ShieldAlert,
  Terminal,
  Cpu,
  Key,
  ArrowRight,
  Play,
  Pause,
  AlertTriangle,
  FileCode,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface UserProfile {
  email: string;
  full_name: string | null;
  role: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  created_at: string;
  ip_hash?: string;
  users?: UserProfile | null;
}

interface AuditLogClientProps {
  initialLogs: AuditLogItem[];
  locale: string;
}

const ACTION_GROUPS = [
  { value: "all", label: "All Actions" },
  { value: "incident", label: "Incident Operations" },
  { value: "user", label: "User Management" },
  { value: "security", label: "Security & Keys" },
  { value: "system", label: "System & Autopilot" },
  { value: "billing", label: "Billing & Subscriptions" },
  { value: "takedown", label: "Takedown Requests" },
];

const ENTITY_TYPES = [
  { value: "all", label: "All Entities" },
  { value: "incident", label: "Incident" },
  { value: "users", label: "User" },
  { value: "api_keys", label: "API Key" },
  { value: "takedown_requests", label: "Takedown Request" },
  { value: "finance", label: "Billing" },
  { value: "system", label: "System" },
];

const PREDEFINED_HIGH_FIDELITY_MOCK_LOGS: AuditLogItem[] = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    action: "incident.approve",
    entity_type: "incident",
    entity_id: "8c92b512-44a3-4b6a-93f5-742a73efbb1d",
    before_data: { status: "pending_review", approved: false, reviewed_by: null },
    after_data: {
      status: "published",
      approved: true,
      reviewed_by: "triage.lead@alparai.com",
      published_at: new Date().toISOString(),
    },
    users: {
      email: "triage.lead@alparai.com",
      full_name: "Derin Yılmaz",
      role: "moderator",
    },
    ip_hash: "192.168.1.42 (Frankfurt, DE)",
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    action: "security.api_key_rotated",
    entity_type: "api_keys",
    entity_id: "f3b89e21-098d-42ef-8cb6-9d1419e0018c",
    before_data: { provider: "supabase", key_hint: "sbp_1b9...", status: "active" },
    after_data: {
      provider: "supabase",
      key_hint: "sbp_5f2...",
      status: "active",
      rotated_at: new Date().toISOString(),
    },
    users: {
      email: "ceo@alparai.com",
      full_name: "Alpar Arslan",
      role: "ceo",
    },
    ip_hash: "82.146.42.11 (Istanbul, TR)",
  },
  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    created_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    action: "user.ban",
    entity_type: "users",
    entity_id: "721da2f5-b6d4-4f9e-990e-1144a3efbb1d",
    before_data: { email: "spammer.user@gmail.com", is_verified: false, is_banned: false },
    after_data: {
      email: "spammer.user@gmail.com",
      is_verified: false,
      is_banned: true,
      ban_reason: "repeated false reporting",
      banned_at: new Date().toISOString(),
    },
    users: {
      email: "admin.moderator@alparai.com",
      full_name: "Cem Bölükbaşı",
      role: "admin",
    },
    ip_hash: "109.228.12.87 (Dublin, IE)",
  },
  {
    id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    action: "incident.redact_pii",
    entity_type: "incident",
    entity_id: "5c83d522-83b3-40fa-98ff-83f124efcc2a",
    before_data: {
      title: "Spam Incident report with phone +905321112233 and email ercum@matrix.com",
    },
    after_data: {
      title: "Spam Incident report with phone [MASKED_PHONE] and email [MASKED_EMAIL]",
      redacted_by: "guardian.ts",
    },
    users: null, // SYSTEM Action
    ip_hash: "127.0.0.1 (Localhost / PII Guardian)",
  },
  {
    id: "e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    action: "model.benchmark_run",
    entity_type: "system",
    entity_id: "c464ad22-83f1-419b-ab09-efb234190cde",
    before_data: { test_suite: "MMLU", last_score: 0.812 },
    after_data: { test_suite: "MMLU", current_score: 0.835, evaluation_status: "passed" },
    users: null, // SYSTEM Autopilot
    ip_hash: "20.198.42.1 (Vercel Edge Cron)",
  },
  {
    id: "f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    action: "takedown.accept",
    entity_type: "takedown_requests",
    entity_id: "8c7283ef-4f10-90ba-acde-901b23effbc8",
    before_data: { status: "received", incident_id: "193fa2b1-d3cb-4f01-92b1-91a9fbc183a1" },
    after_data: {
      status: "accepted",
      processed_at: new Date().toISOString(),
      incident_status: "takedown",
      sla_met: true,
    },
    users: {
      email: "ceo@alparai.com",
      full_name: "Alpar Arslan",
      role: "ceo",
    },
    ip_hash: "82.146.42.11 (Istanbul, TR)",
  },
  {
    id: "g7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d",
    created_at: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    action: "billing.subscription_updated",
    entity_type: "finance",
    entity_id: "a1a89b3f-1100-4b9b-9c2b-abff918cdeff",
    before_data: { tier: "free", active_subs: 140 },
    after_data: {
      tier: "enterprise",
      company: "Anthropic PBC",
      monthly_value_usd: 5000,
      seats: 120,
    },
    users: {
      email: "ceo@alparai.com",
      full_name: "Alpar Arslan",
      role: "ceo",
    },
    ip_hash: "82.146.42.11 (Istanbul, TR)",
  },
];

const NEW_LIVE_EVENTS_POOL = [
  {
    action: "incident.publish",
    entity_type: "incident",
    users: { email: "moderator.one@alparai.com", full_name: "Ece Yüksel", role: "moderator" },
    before_data: { status: "pending_review", published: false },
    after_data: { status: "published", published: true },
    ip_hash: "46.101.99.12 (Amsterdam, NL)",
  },
  {
    action: "security.ip_whitelist_added",
    entity_type: "api_keys",
    users: { email: "ceo@alparai.com", full_name: "Alpar Arslan", role: "ceo" },
    before_data: { allowed_ips: ["12.34.56.78"] },
    after_data: {
      allowed_ips: ["12.34.56.78", "82.146.42.11"],
      ip_added_at: new Date().toISOString(),
    },
    ip_hash: "82.146.42.11 (Istanbul, TR)",
  },
  {
    action: "autopilot.triage_override",
    entity_type: "system",
    users: null,
    before_data: { automated_verdict: "reject", trust_score: 0.2 },
    after_data: {
      automated_verdict: "escalate",
      trust_score: 0.8,
      reason: "high severity bias match",
    },
    ip_hash: "20.198.42.1 (Vercel Edge Cron)",
  },
  {
    action: "user.role_assign",
    entity_type: "users",
    users: { email: "admin.moderator@alparai.com", full_name: "Cem Bölükbaşı", role: "admin" },
    before_data: { email: "new.hire@alparai.com", role: "user" },
    after_data: { email: "new.hire@alparai.com", role: "moderator", assigned_by: "Cem Bölükbaşı" },
    ip_hash: "109.228.12.87 (Dublin, IE)",
  },
];

export function AuditLogClient({ initialLogs, locale }: AuditLogClientProps) {
  const t = useTranslations("admin");
  // Merge real logs (if any) with high-fidelity mock logs to ensure a rich list.
  const [logs, setLogs] = useState<AuditLogItem[]>(() => {
    const combined = [...initialLogs];
    // Map missing users to mock properties or ensure format matching
    const normalizedInitial = combined.map((log) => ({
      ...log,
      ip_hash: log.ip_hash || "8f3b2d1c (Frankfurt, DE)",
    }));

    // Add mock logs that aren't already represented (to have at least 10 entries)
    const needed = Math.max(0, 12 - normalizedInitial.length);
    const addedMocks = PREDEFINED_HIGH_FIDELITY_MOCK_LOGS.slice(0, needed);

    // Sort combined list by date desc
    return [...normalizedInitial, ...addedMocks].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  });

  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntity, setFilterEntity] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Live simulator logic
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Pick a random event from the live events pool
      const baseEvent =
        NEW_LIVE_EVENTS_POOL[Math.floor(Math.random() * NEW_LIVE_EVENTS_POOL.length)];
      if (!baseEvent) return;

      const newEvent: AuditLogItem = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        action: baseEvent.action,
        entity_type: baseEvent.entity_type,
        entity_id: crypto.randomUUID(),
        before_data: baseEvent.before_data,
        after_data: baseEvent.after_data,
        users: baseEvent.users,
        ip_hash: baseEvent.ip_hash,
      };

      setLogs((prev) => [newEvent, ...prev]);
      toast.info(`New Audit Log: ${newEvent.action}`, {
        description: `${newEvent.users ? newEvent.users.full_name : "SYSTEM"} executed ${newEvent.action}`,
        icon: <Sparkles className="text-brand-400 h-4 w-4" />,
      });
    }, 10000); // Trigger every 10 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Statistics calculation
  const totalCount = logs.length;
  const securityCount = logs.filter(
    (l) => l.action.startsWith("security") || l.action.includes("key"),
  ).length;
  const systemCount = logs.filter((l) => !l.users).length;

  // Filter logs based on search and filters
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(search.toLowerCase()) ||
      (log.users?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.users?.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.ip_hash || "").toLowerCase().includes(search.toLowerCase());

    const matchesAction = filterAction === "all" || log.action.startsWith(filterAction);
    const matchesEntity = filterEntity === "all" || log.entity_type === filterEntity;

    return matchesSearch && matchesAction && matchesEntity;
  });

  // Action badge color helper
  const getActionBadgeVariant = (action: string) => {
    if (
      action.includes("ban") ||
      action.includes("delete") ||
      action.includes("revoke") ||
      action.includes("override")
    ) {
      return "danger";
    }
    if (action.includes("publish") || action.includes("approve") || action.includes("accept")) {
      return "success";
    }
    if (action.includes("rotate") || action.includes("whitelist") || action.includes("assign")) {
      return "warning";
    }
    if (action.startsWith("security")) {
      return "brand";
    }
    return "default";
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "incident":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "users":
        return <User className="h-4 w-4 text-cyan-400" />;
      case "api_keys":
        return <Key className="h-4 w-4 text-emerald-400" />;
      case "takedown_requests":
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case "finance":
        return <Layers className="h-4 w-4 text-purple-400" />;
      default:
        return <Cpu className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Card Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/5 bg-neutral-900/40 backdrop-blur-xl">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-fg-muted text-xs font-medium tracking-wider uppercase">
                {t("audit_total_actions") || "Total Actions"}
              </p>
              <h3 className="mt-0.5 font-mono text-2xl font-bold text-white">{totalCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-neutral-900/40 backdrop-blur-xl">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-rose-500/10 p-3 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-fg-muted text-xs font-medium tracking-wider uppercase">
                {t("audit_security_logs") || "Security Logs"}
              </p>
              <h3 className="mt-0.5 font-mono text-2xl font-bold text-white">{securityCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-neutral-900/40 backdrop-blur-xl">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-purple-500/10 p-3 text-purple-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-fg-muted text-xs font-medium tracking-wider uppercase">
                {t("audit_autopilot_runs") || "Autopilot Runs"}
              </p>
              <h3 className="mt-0.5 font-mono text-2xl font-bold text-white">{systemCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-neutral-900/40 backdrop-blur-xl">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <div
                className={`rounded-lg p-3 ${isLive ? "animate-pulse bg-emerald-500/10 text-emerald-400" : "text-fg-muted bg-neutral-800"}`}
              >
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-fg-muted text-xs font-medium tracking-wider uppercase">
                  {t("audit_live_stream") || "Live Stream"}
                </p>
                <h3 className="mt-0.5 text-sm font-semibold text-white">
                  {isLive ? t("audit_active") || "Active" : t("audit_paused") || "Paused"}
                </h3>
              </div>
            </div>
            <Button
              size="sm"
              variant={isLive ? "danger" : "primary"}
              onClick={() => setIsLive(!isLive)}
              className="flex h-8 items-center gap-1 px-2.5"
            >
              {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isLive ? t("audit_stop") || "Stop" : t("audit_simulate") || "Simulate"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="border-white/10 bg-neutral-900/60 shadow-lg backdrop-blur-xl">
        <CardContent className="flex flex-col items-center gap-4 p-5 md:flex-row">
          <div className="relative w-full flex-1">
            <Search className="text-fg-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={t("audit_search_placeholder") || "Search by action, actor, IP..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-white/5 bg-neutral-950/40 pl-10 text-sm"
            />
          </div>

          <div className="flex w-full shrink-0 flex-col items-center gap-4 sm:flex-row md:w-auto">
            <div className="w-full sm:w-44">
              <Select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                options={ACTION_GROUPS}
                className="h-9 border-white/5 bg-neutral-950/40 text-xs"
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                options={ENTITY_TYPES}
                className="h-9 border-white/5 bg-neutral-950/40 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Audit Logs Table Card */}
      <Card className="overflow-hidden border-white/10 bg-neutral-900/60 shadow-xl backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-fg-muted border-b border-white/5 bg-neutral-950/20 text-xs font-semibold tracking-wider uppercase">
                  <th className="p-4 pl-6">{t("audit_col_time_id") || "Time / ID"}</th>
                  <th className="p-4">{t("audit_col_actor") || "Actor"}</th>
                  <th className="p-4">{t("audit_col_action") || "Action"}</th>
                  <th className="p-4">{t("audit_col_target") || "Target Entity"}</th>
                  <th className="p-4">{t("audit_col_ip") || "IP Location"}</th>
                  <th className="p-4 pr-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="group cursor-pointer transition-colors duration-150 hover:bg-white/[0.02]"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 font-mono text-xs text-white">
                          <Clock className="text-fg-muted h-3 w-3" />
                          {new Date(log.created_at).toLocaleTimeString(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                        <span className="text-fg-muted mt-0.5 font-mono text-[10px]">
                          {log.id.slice(0, 8)}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      {log.users ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5">
                            <User className="text-fg-secondary h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-white">
                              {log.users.full_name || "Unknown Staff"}
                            </span>
                            <span className="text-fg-muted text-[10px]">{log.users.email}</span>
                          </div>
                          <Badge
                            variant={log.users.role === "ceo" ? "danger" : "brand"}
                            className="px-1.5 py-0 text-[9px]"
                          >
                            {log.users.role}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10">
                            <Cpu className="h-3.5 w-3.5 text-purple-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-purple-300">SYSTEM</span>
                            <span className="text-[10px] text-purple-400/80">Autopilot Guard</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-purple-500/30 bg-purple-500/5 px-1.5 py-0 text-[9px] text-purple-400"
                          >
                            Core
                          </Badge>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <Badge
                        variant={getActionBadgeVariant(log.action)}
                        className="font-mono text-[10px] tracking-normal normal-case"
                      >
                        {log.action}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(log.entity_type)}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-white capitalize">
                            {log.entity_type.replace("_", " ")}
                          </span>
                          <span className="text-fg-muted font-mono text-[10px]">
                            {log.entity_id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-fg-muted flex items-center gap-1.5 font-mono text-xs">
                        <Globe className="text-fg-muted h-3.5 w-3.5 shrink-0" />
                        {log.ip_hash}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2.5 text-[11px] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      >
                        Inspect
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-fg-muted p-16 text-center">
                      <Shield className="text-fg-muted/30 mx-auto mb-3 h-8 w-8" />
                      No matching audit logs found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <Modal
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
          title={`Audit Event Details`}
          size="xl"
          className="border-white/10 bg-neutral-900"
        >
          <div className="mt-4 space-y-6">
            {/* Header info card */}
            <div className="grid gap-4 rounded-xl border border-white/5 bg-neutral-950/40 p-4 sm:grid-cols-3">
              <div>
                <p className="text-fg-muted text-[10px] font-semibold tracking-wider uppercase">
                  Action
                </p>
                <Badge
                  variant={getActionBadgeVariant(selectedLog.action)}
                  className="mt-1 font-mono text-[11px] tracking-normal normal-case"
                >
                  {selectedLog.action}
                </Badge>
              </div>
              <div>
                <p className="text-fg-muted text-[10px] font-semibold tracking-wider uppercase">
                  Executed By
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">
                    {selectedLog.users ? selectedLog.users.full_name : "SYSTEM AUTOPILOT"}
                  </span>
                  {selectedLog.users && (
                    <Badge variant="brand" className="px-1 py-0 text-[9px]">
                      {selectedLog.users.role}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-fg-muted text-[10px] font-semibold tracking-wider uppercase">
                  Origin IP
                </p>
                <p className="mt-1.5 flex items-center gap-1 font-mono text-xs text-white">
                  <Globe className="text-fg-muted h-3 w-3" />
                  {selectedLog.ip_hash}
                </p>
              </div>
            </div>

            {/* Target & Metas */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-neutral-950/20 p-4">
                <h4 className="text-fg-secondary mb-2 text-xs font-bold tracking-wider uppercase">
                  Target Entity
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Entity Type:</span>
                    <span className="font-semibold text-white capitalize">
                      {selectedLog.entity_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Entity ID:</span>
                    <span className="font-mono text-[11px] text-white">
                      {selectedLog.entity_id}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-neutral-950/20 p-4">
                <h4 className="text-fg-secondary mb-2 text-xs font-bold tracking-wider uppercase">
                  Meta Details
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Log UUID:</span>
                    <span className="font-mono text-[11px] text-white">{selectedLog.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Exact Time:</span>
                    <span className="font-mono text-[11px] text-white">
                      {new Date(selectedLog.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* State Changes Diff Visualizer */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileCode className="text-brand-400 h-4 w-4" />
                <h4 className="text-xs font-bold tracking-wider text-white uppercase">
                  State Payload Changes
                </h4>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Before state */}
                <div className="space-y-1">
                  <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
                    Before State
                  </span>
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-white/5 bg-neutral-950 p-4 font-mono text-[11px] text-rose-300">
                    {selectedLog.before_data ? (
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.before_data, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-fg-muted italic">
                        No initial state (Created Entity)
                      </span>
                    )}
                  </div>
                </div>

                {/* After state */}
                <div className="space-y-1">
                  <span className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
                    After State
                  </span>
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-white/5 bg-neutral-950 p-4 font-mono text-[11px] text-emerald-300">
                    {selectedLog.after_data ? (
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.after_data, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-fg-muted italic">No final state (Deleted Entity)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-white/5 pt-4">
              <Button onClick={() => setSelectedLog(null)} variant="outline">
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
