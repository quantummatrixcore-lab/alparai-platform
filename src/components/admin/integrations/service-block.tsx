"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CaretRight, ArrowsClockwise, Globe } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type {
  IntegrationService,
  IntegrationStatus,
  IntegrationAlternative,
} from "@/lib/integrations/types";
import { LOGO_MAP } from "@/lib/integrations/logos";
import { AlternativeCards } from "./alternative-cards";

interface ServiceBlockProps {
  service: IntegrationService;
  status: IntegrationStatus | undefined;
  alternatives: IntegrationAlternative[];
  isExpanded: boolean;
  onToggle: () => void;
}

const STATUS_CONFIG = {
  connected: { dot: "bg-emerald-400", label: "Connected", pulse: "shadow-emerald-400/50" },
  missing_key: { dot: "bg-amber-400", label: "Missing Key", pulse: "shadow-amber-400/50" },
  error: { dot: "bg-rose-400", label: "Error", pulse: "shadow-rose-400/50" },
  not_configured: { dot: "bg-zinc-600", label: "N/A", pulse: "shadow-zinc-600/50" },
} as const;

export function ServiceBlock({
  service,
  status,
  alternatives,
  isExpanded,
  onToggle,
}: ServiceBlockProps) {
  const cfg = STATUS_CONFIG[status?.status ?? "not_configured"];
  const Logo = LOGO_MAP[service.id];

  return (
    <div className="bg-bg-secondary/60 border-border-subtle overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 hover:border-white/10">
      <button
        onClick={onToggle}
        className="group flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 p-2.5">
          {Logo ? (
            <Logo className="h-full w-full" />
          ) : (
            <span className="text-fg-muted text-xs font-bold uppercase">
              {service.name.slice(0, 2)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-fg-primary truncate text-base font-bold">{service.name}</h3>
            <div className="flex items-center gap-1.5">
              <span
                className={cn("inline-block h-2 w-2 rounded-full shadow-lg", cfg.dot, cfg.pulse)}
              />
              <span className="text-fg-muted text-xs">{cfg.label}</span>
            </div>
          </div>
          <p className="text-fg-muted mt-0.5 truncate text-sm">{service.description}</p>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {status?.monthlyCost !== undefined && status.monthlyCost > 0 && (
            <div className="text-right">
              <p className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">Cost</p>
              <p className="text-fg-primary font-mono text-sm font-bold">
                ${status.monthlyCost.toFixed(2)}
              </p>
            </div>
          )}
          {service.url && (
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-fg-muted hover:text-fg-primary rounded-lg p-2 transition-colors"
              title="Open service dashboard"
            >
              <Globe weight="duotone" className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="text-fg-muted shrink-0">
          {isExpanded ? (
            <CaretDown weight="bold" className="h-4 w-4" />
          ) : (
            <CaretRight weight="bold" className="h-4 w-4" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-border-subtle border-t">
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-fg-primary text-sm font-bold tracking-wider uppercase">
                    Alternatives ({alternatives.length})
                  </h4>
                  {alternatives.length > 0 && (
                    <span className="text-fg-muted flex items-center gap-1.5 text-[10px] tracking-wider uppercase">
                      <ArrowsClockwise weight="duotone" className="h-3 w-3" />
                      Live data
                    </span>
                  )}
                </div>

                {alternatives.length > 0 ? (
                  <AlternativeCards alternatives={alternatives} />
                ) : (
                  <p className="text-fg-muted py-4 text-center text-sm">
                    No alternatives tracked for this service.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
