import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: { w: 90, h: 24 },
  md: { w: 120, h: 32 },
  lg: { w: 180, h: 48 },
  xl: { w: 360, h: 96 },
} as const;

export function Logo({ className, size = "md", ...props }: LogoProps) {
  const { w, h } = sizeMap[size];
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: w, height: h }}
      role="img"
      aria-label="ALPAR AI"
      {...props}
    >
      <Image
        src="/logo.svg"
        alt="ALPAR AI"
        width={w}
        height={h}
        className="h-full w-auto"
        priority={size === "xl" || size === "lg"}
      />
    </span>
  );
}
