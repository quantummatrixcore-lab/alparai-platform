import * as React from "react";
import { cn } from "@/lib/utils";

interface SpatialBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actionIcon?: React.ReactNode;
}

export function SpatialBentoCard({
  className,
  title,
  description,
  actionIcon,
  children,
  ...props
}: SpatialBentoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl",
        "border border-white/10 bg-white/5 backdrop-blur-xl",
        "transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-1 flex-col p-6">
        {(title || description || actionIcon) && (
          <div className="mb-4 flex items-start justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
              )}
              {description && <p className="mt-1 text-sm text-neutral-400">{description}</p>}
            </div>
            {actionIcon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-transform group-hover:scale-110 group-hover:bg-white/20">
                {actionIcon}
              </div>
            )}
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
