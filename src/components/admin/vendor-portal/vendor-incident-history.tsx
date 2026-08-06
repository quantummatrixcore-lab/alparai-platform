"use client";

import { AlertCircle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import type { VendorIncident } from "@/actions/admin/vendor-portal";

interface VendorIncidentHistoryProps {
  incidents: VendorIncident[];
}

export function VendorIncidentHistory({ incidents }: VendorIncidentHistoryProps) {
  const getSeverityBadge = (severity: VendorIncident["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  const getStatusBadge = (status: VendorIncident["status"]) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Resolved
          </span>
        );
      case "investigating":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            <Clock className="h-3 w-3 animate-pulse" /> Investigating
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
            <AlertCircle className="h-3 w-3" /> Open
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Vendor Incident Log</h2>
        </div>
        <span className="font-mono text-xs text-zinc-400">Real-time Telemetry</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="border-b border-white/10 bg-white/5 text-xs tracking-wider text-zinc-400 uppercase">
            <tr>
              <th className="p-3.5">Provider</th>
              <th className="p-3.5">Incident</th>
              <th className="p-3.5">Severity</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {incidents.map((inc) => (
              <tr key={inc.id} className="transition-colors hover:bg-white/5">
                <td className="p-3.5 font-bold text-white">{inc.providerName}</td>
                <td className="p-3.5 font-medium text-zinc-200">{inc.title}</td>
                <td className="p-3.5">
                  <span
                    className={`rounded-lg border px-2 py-0.5 text-xs font-bold tracking-wider uppercase ${getSeverityBadge(
                      inc.severity,
                    )}`}
                  >
                    {inc.severity}
                  </span>
                </td>
                <td className="p-3.5">{getStatusBadge(inc.status)}</td>
                <td className="p-3.5 font-mono text-xs text-zinc-400">
                  {new Date(inc.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {incidents.length === 0 && (
          <div className="py-8 text-center text-zinc-500">
            No active or past incidents recorded.
          </div>
        )}
      </div>
    </div>
  );
}
