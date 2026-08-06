"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface AdminPageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  icon: Icon,
  actions,
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "border-border-subtle bg-bg-secondary/60 relative mb-6 overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-200",
        className,
      )}
    >
      {/* Background Subtle Accent Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="border-border-subtle bg-bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-cyan-400 shadow-sm">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-fg-primary text-xl font-bold tracking-tight sm:text-2xl">
                {title}
              </h1>
              {badge && (
                <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                  {badge}
                </div>
              )}
            </div>
            {description && (
              <p className="text-fg-muted text-sm leading-relaxed font-normal">{description}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2.5 sm:self-center">{actions}</div>
        )}
      </div>

      {children && <div className="border-border-subtle/80 mt-6 border-t pt-4">{children}</div>}
    </div>
  );
}
