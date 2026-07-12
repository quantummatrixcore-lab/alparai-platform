import * as React from "react";
import { Pulse, ShieldCheck, Users } from "@phosphor-icons/react/dist/ssr";

interface LiveStatusBarProps {
  healthScore?: number;
  activeModerators?: number;
  lastIncidentTime?: string;
}

export function LiveStatusBar({
  healthScore = 98,
  activeModerators = 3,
  lastIncidentTime = "5 mins ago",
}: LiveStatusBarProps) {
  return (
    <div className="bg-bg-secondary/20 border-border-subtle sticky top-0 z-20 flex w-full items-center justify-between border-b px-6 py-2.5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="text-fg-secondary text-xs font-bold tracking-wider uppercase">
          Live Audit Feed
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-fg-muted flex items-center gap-1.5 text-xs">
          <Pulse className="text-brand-400 h-4 w-4" />
          <span>System Health:</span>
          <span className="font-mono font-bold text-white">{healthScore}%</span>
        </div>
        <div className="text-fg-muted flex items-center gap-1.5 text-xs">
          <Users className="h-4 w-4 text-cyan-400" />
          <span>Active Staff:</span>
          <span className="font-mono font-bold text-white">{activeModerators}</span>
        </div>
        <div className="text-fg-muted flex items-center gap-1.5 text-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Last Audit:</span>
          <span className="font-semibold text-white">{lastIncidentTime}</span>
        </div>
      </div>
    </div>
  );
}
