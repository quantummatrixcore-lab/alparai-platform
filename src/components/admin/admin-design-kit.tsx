import * as React from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  icon,
  title,
  subtitle,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-fg-primary inline-flex items-center gap-2 text-2xl font-bold">
          {icon}
          {title}
        </h1>
        {subtitle && <p className="text-fg-muted mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  variant = "default",
  className,
}: {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}) {
  const colorClasses = {
    default: "text-fg-primary",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-rose-400",
  };
  return (
    <div className={cn("bg-bg-secondary border-border-subtle rounded-xl border p-6", className)}>
      <p className="text-fg-muted text-xs font-bold tracking-wide uppercase">{label}</p>
      <p className={cn("mt-2 font-mono text-3xl font-black", colorClasses[variant])}>{value}</p>
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
