import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 96,
};

export function Logo({ className, size = "md", ...props }: LogoProps) {
  const px = sizeMap[size];
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: px, height: px }}
      role="img"
      aria-label="ALPAR AI logo"
      {...props}
    >
      <Image
        src="/logo.png"
        alt="ALPAR AI"
        width={px}
        height={px}
        className="rounded-full"
        priority={size === "xl" || size === "lg"}
      />
    </span>
  );
}
