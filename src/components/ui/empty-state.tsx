import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border-subtle bg-bg-secondary/30 mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center",
        className
      )}
      role="status"
    >
      {icon && (
        <div className="bg-bg-tertiary text-fg-muted mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-fg-primary text-base font-semibold">{title}</h3>
      {description && <p className="text-fg-muted mt-2 text-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
