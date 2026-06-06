import * as React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export interface WordmarkProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  tagline?: string;
}

const sizeMap = {
  sm: { logo: "sm" as const, text: "text-base" },
  md: { logo: "md" as const, text: "text-xl" },
  lg: { logo: "lg" as const, text: "text-3xl" },
};

export function Wordmark({
  className,
  size = "md",
  showTagline = false,
  tagline,
  ...props
}: WordmarkProps) {
  const { logo, text } = sizeMap[size];
  return (
    <div
      className={cn("inline-flex items-center gap-2.5", className)}
      {...props}
    >
      <Logo size={logo} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-bold tracking-tight",
            text,
            "bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent"
          )}
        >
          ALPAR AI
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-fg-muted">
            {tagline ?? "Trust Infrastructure"}
          </span>
        )}
      </div>
    </div>
  );
}
