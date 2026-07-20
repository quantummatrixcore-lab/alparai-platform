"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShieldCheck, Sparkles, Search, X } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function AdminPageHeader({
  icon,
  title,
  subtitle,
  action,
  badge,
  breadcrumb,
  lastUpdated,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  breadcrumb?: { label: string; href: string }[];
  lastUpdated?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 flex flex-col gap-3", className)}>
      {/* Breadcrumb Navigation */}
      {breadcrumb && (
        <nav className="text-fg-muted mb-1 flex items-center gap-1.5 text-xs">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={item.href}>
              <Link href={item.href} className="hover:text-fg-primary transition-colors">
                {item.label}
              </Link>
              {index < breadcrumb.length - 1 && <span className="text-white/10">/</span>}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-fg-primary inline-flex items-center gap-2.5 text-2xl font-black tracking-tight">
            {icon}
            <span>{title}</span>
            {badge && <span className="shrink-0">{badge}</span>}
          </h1>
          {subtitle && <p className="text-fg-muted mt-1 text-sm">{subtitle}</p>}
          {lastUpdated && (
            <p className="text-fg-muted mt-1.5 font-mono text-[10px]">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        {action && <div className="flex items-center gap-3">{action}</div>}
      </div>
    </header>
  );
}

export function MetricCard({
  label,
  value,
  variant = "default",
  delta,
  sparkline,
  icon,
  href,
  tooltip,
  className,
}: {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
  delta?: { value: number; isPositive: boolean };
  sparkline?: number[];
  icon?: React.ReactNode;
  href?: string;
  tooltip?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const colorClasses = {
    default: "text-fg-primary",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-rose-400",
  };

  const glowRgb = {
    default: "168,85,247",
    success: "39,174,96",
    warning: "243,156,18",
    danger: "230,57,70",
  }[variant];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-fg-muted text-xs font-bold tracking-wide uppercase" title={tooltip}>
            {label}
          </p>
          <p
            className={cn(
              "mt-2.5 font-mono text-3xl font-black tracking-tight",
              colorClasses[variant],
            )}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div className="text-fg-secondary rounded-lg border border-white/5 bg-white/5 p-2">
            {icon}
          </div>
        )}
      </div>

      {(delta || sparkline) && (
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.03] pt-3.5">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs font-bold",
                delta.isPositive
                  ? "bg-success-500/10 text-success-400 border-success-500/20 border"
                  : "bg-danger-500/10 text-danger-400 border-danger-500/20 border",
              )}
            >
              {delta.isPositive ? "+" : ""}
              {delta.value}%
            </span>
          )}

          {sparkline && sparkline.length > 1 && (
            <svg className="h-6 w-20 shrink-0" viewBox="0 0 100 30">
              <path
                d={`M ${sparkline.map((val, idx) => `${(idx / (sparkline.length - 1)) * 100} ${30 - val}`).join(" L ")}`}
                fill="none"
                stroke={delta ? (delta.isPositive ? "#27ae60" : "#e63946") : "#a855f7"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}
    </>
  );

  const classes = cn(
    "bg-bg-secondary border-border-subtle relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
    href
      ? "hover:border-brand-500/40 cursor-pointer hover:bg-neutral-900/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)]"
      : "",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {cardContent}
        <ArrowUpRight className="text-fg-muted absolute top-3 right-3 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={classes}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(${glowRgb},0.12), transparent 70%)`,
          }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          opacity: isHovered ? 1 : 0,
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: isHovered ? "shimmer 2s infinite" : "none",
        }}
      />
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {cardContent}
    </div>
  );
}

export function GlowCard({
  children,
  glowColor = "success",
  className,
}: {
  children: React.ReactNode;
  glowColor?: "success" | "brand" | "danger" | "warning" | "accent";
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const glowClasses = {
    brand: "shadow-[0_0_30px_rgba(168,85,247,0.06)] border-brand-500/20 hover:border-brand-500/35",
    accent:
      "shadow-[0_0_30px_rgba(6,182,212,0.06)] border-accent-500/20 hover:border-accent-500/35",
    success:
      "shadow-[0_0_25px_rgba(39,174,96,0.06)] border-success-500/20 hover:border-success-500/35",
    danger:
      "shadow-[0_0_25px_rgba(230,57,70,0.06)] border-danger-500/20 hover:border-danger-500/35",
    warning:
      "shadow-[0_0_25px_rgba(243,156,18,0.06)] border-warning-500/20 hover:border-warning-500/35",
  };

  const glowRgb = {
    brand: "168,85,247",
    accent: "6,182,212",
    success: "39,174,96",
    danger: "230,57,70",
    warning: "243,156,18",
  }[glowColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "bg-bg-secondary relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:scale-[1.002]",
        glowClasses[glowColor],
        className,
      )}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, rgba(${glowRgb},0.08), transparent 70%)`,
          }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isHovered ? 1 : 0,
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.015) 45%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.015) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: isHovered ? "shimmer 2.5s infinite" : "none",
        }}
      />
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {children}
    </div>
  );
}

export function ZeroCostBanner({
  services,
  totalSaved,
  locale = "en",
}: {
  services: { name: string; monthlyCost: number; freeLimit: string; usedPercent?: number }[];
  totalSaved: string;
  locale?: string;
}) {
  const isTr = locale === "tr";
  return (
    <GlowCard glowColor="success" className="border-success-500/20 relative overflow-hidden">
      {/* Background subtle glowing accent */}
      <div className="bg-success-500/10 pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full blur-3xl" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="bg-success-500/10 text-success-400 border-success-500/20 rounded-lg border p-3 shadow-[0_0_15px_rgba(39,174,96,0.15)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-md flex items-center gap-1.5 font-bold tracking-wider text-white uppercase">
              {isTr ? "Sıfır Maliyet Kalkanı Aktif" : "Zero Cost Shield Active"}
              <Sparkles className="text-success-400 h-4 w-4 animate-pulse" />
            </h3>
            <p className="text-fg-muted mt-1 text-xs sm:text-sm">
              {isTr
                ? "Tüm platform altyapısı ücretsiz limitler dahilinde optimize edilmiştir."
                : "All platform infrastructure is optimized to run fully within free tiers."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:text-right">
          <div className="rounded-xl border border-white/5 bg-neutral-950/40 px-6 py-3 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
            <p className="text-fg-muted text-[10px] font-bold tracking-wider uppercase">
              {isTr ? "Toplam Aylık Tasarruf" : "Total Monthly Savings"}
            </p>
            <p className="text-success-400 mt-1 font-mono text-xl font-black drop-shadow-[0_0_8px_rgba(39,174,96,0.3)] sm:text-2xl">
              {totalSaved}
            </p>
          </div>
        </div>
      </div>

      {/* Mini services cost bars */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-5 sm:grid-cols-3 md:grid-cols-6">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="space-y-1 rounded-lg border border-white/[0.02] bg-neutral-950/20 p-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-fg-secondary truncate text-[10px] font-bold">{svc.name}</span>
              <span className="text-success-400 bg-success-500/10 border-success-500/20 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold">
                $0
              </span>
            </div>
            <div className="text-fg-muted flex items-center justify-between text-[9px]">
              <span>{svc.freeLimit}</span>
              {svc.usedPercent !== undefined && <span>{svc.usedPercent}%</span>}
            </div>
            {svc.usedPercent !== undefined && (
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="bg-success-500 h-full rounded-full"
                  style={{ width: `${Math.min(svc.usedPercent, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </GlowCard>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

export function TabNav({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { label: string; value: string; count?: number }[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("border-border-subtle flex gap-4 overflow-x-auto border-b pb-px", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative flex items-center gap-1.5 pb-3 text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none",
              isActive
                ? "text-brand-400 border-brand-500 border-b-2 font-bold"
                : "text-fg-muted hover:text-fg-primary",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold transition-colors duration-200",
                  isActive
                    ? "bg-brand-500/15 text-brand-300 border-brand-500/30 border"
                    : "bg-bg-tertiary text-fg-muted border-border-subtle border",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-neutral-950/10 p-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-fg-muted mb-4">{icon}</div>}
      <h3 className="text-md font-bold tracking-wide text-white uppercase">{title}</h3>
      <p className="text-fg-muted mt-1.5 max-w-sm text-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function FilterBar({
  value,
  onChange,
  placeholder = "Search...",
  filters,
  activeFilter,
  onFilterChange,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  filters?: { label: string; value: string }[];
  activeFilter?: string;
  onFilterChange?: (val: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      {/* Search Input */}
      <div className="relative max-w-md flex-1">
        <span className="text-fg-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-border-subtle placeholder-fg-muted focus:border-brand-500 w-full rounded-lg border bg-neutral-950/40 py-2 pr-10 pl-10 text-sm text-white transition-colors focus:outline-none"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="text-fg-muted absolute inset-y-0 right-0 flex items-center pr-3 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      {filters && activeFilter && onFilterChange && (
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const isSelected = f.value === activeFilter;
            return (
              <button
                key={f.value}
                onClick={() => onFilterChange(f.value)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150 select-none",
                  isSelected
                    ? "bg-brand-500/15 border-brand-500/30 text-brand-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                    : "border-border-subtle text-fg-muted bg-neutral-950/20 hover:text-white",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminTable({
  columns,
  children,
  className,
}: {
  columns: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-border-subtle text-fg-muted border-b bg-neutral-950/20 text-xs font-bold tracking-wider uppercase">
            {columns.map((c, i) => (
              <th key={i} className="p-4 first:pl-6 last:pr-6">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  );
}

export function AdminSectionCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-bg-secondary border-border-subtle overflow-hidden rounded-xl border",
        className,
      )}
    >
      {title && (
        <div className="border-border-subtle border-b px-6 py-4">
          <h2 className="text-fg-primary text-sm font-bold tracking-wide uppercase">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

export function AdminContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
