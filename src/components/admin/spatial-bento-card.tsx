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
        "group relative flex flex-col overflow-hidden rounded-[32px]",
        "border border-white/[0.08] bg-white/[0.02] backdrop-blur-[24px]",
        "transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 flex flex-1 flex-col p-8">
        {(title || description || actionIcon) && (
          <div className="mb-6 flex items-start justify-between">
            <div className="space-y-1.5">
              {title && (
                <h3 className="text-[17px] font-medium tracking-[-0.01em] text-neutral-100">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-[14px] leading-relaxed text-neutral-400">{description}</p>
              )}
            </div>
            {actionIcon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-neutral-300 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/[0.1]">
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
