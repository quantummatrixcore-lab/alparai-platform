import * as React from "react";
import { cn } from "@/lib/utils";
import type { IncidentSeverity } from "@/types/database";

type BadgeVariant =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-bg-tertiary text-fg-primary border border-border-subtle",
  brand: "bg-brand-500/15 text-brand-300 border border-brand-500/30",
  success: "bg-success-500/15 text-success-400 border border-success-500/30",
  warning: "bg-warning-500/15 text-warning-400 border border-warning-500/30",
  danger: "bg-danger-500/15 text-danger-400 border border-danger-500/30",
  outline: "bg-transparent text-fg-secondary border border-border-strong",
  muted: "bg-bg-tertiary text-fg-muted border border-transparent",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        "uppercase tracking-wider",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success-500",
            variant === "danger" && "bg-danger-500",
            variant === "warning" && "bg-warning-500",
            variant === "brand" && "bg-brand-500",
            (variant === "default" || variant === "muted" || variant === "outline") &&
              "bg-fg-muted"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  const map: Record<IncidentSeverity, { variant: BadgeVariant; label: string }> = {
    low: { variant: "success", label: "Low" },
    medium: { variant: "warning", label: "Medium" },
    high: { variant: "danger", label: "High" },
    critical: { variant: "danger", label: "Critical" },
  };
  const { variant, label } = map[severity];
  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    pending_review: { variant: "warning", label: "Pending review" },
    published: { variant: "success", label: "Published" },
    rejected: { variant: "muted", label: "Rejected" },
    archived: { variant: "muted", label: "Archived" },
    takedown: { variant: "danger", label: "Taken down" },
  };
  const { variant, label } = map[status] ?? {
    variant: "muted" as const,
    label: status,
  };
  return <Badge variant={variant}>{label}</Badge>;
}
