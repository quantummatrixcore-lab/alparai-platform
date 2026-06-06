import { cn } from "@/lib/utils";
import { Button } from "./button";
import { FileQuestion, SearchX, ShieldAlert, Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const variantIcons: Record<string, LucideIcon> = {
  "no-results": SearchX,
  "no-data": Inbox,
  error: ShieldAlert,
  default: FileQuestion,
};

export interface EmptyStateProps {
  variant?: "no-results" | "no-data" | "error" | "default";
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  variant = "default",
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = icon ?? variantIcons[variant] ?? FileQuestion;
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary">
        <Icon className="h-8 w-8 text-fg-muted" aria-hidden="true" />
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="text-lg font-semibold text-fg-primary">{title}</h3>
        {description && <p className="text-sm text-fg-muted">{description}</p>}
      </div>
      {actionLabel && actionHref && (
        <a href={actionHref}>
          <Button variant="secondary" size="sm">{actionLabel}</Button>
        </a>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button variant="secondary" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
