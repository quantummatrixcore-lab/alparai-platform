import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
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
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="ALPAR AI logo"
      {...props}
    >
      <defs>
        <linearGradient id="alpar-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3FBFE3" />
          <stop offset="100%" stopColor="#1B95C0" />
        </linearGradient>
        <linearGradient id="alpar-sword" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6F7FC" />
          <stop offset="100%" stopColor="#9CCBDE" />
        </linearGradient>
        <radialGradient id="alpar-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3FBFE3" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3FBFE3" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="32" cy="32" r="30" fill="url(#alpar-glow)" />

      <path
        d="M32 4 L56 14 V32 C56 44 46 54 32 60 C18 54 8 44 8 32 V14 Z"
        fill="url(#alpar-shield)"
        stroke="#0A2236"
        strokeWidth="1.5"
      />

      <path
        d="M32 6 L54 15 V32 C54 43 45 52 32 58 C19 52 10 43 10 32 V15 Z"
        fill="none"
        stroke="#3FBFE3"
        strokeWidth="0.75"
        strokeOpacity="0.5"
      />

      <line
        x1="32"
        y1="14"
        x2="32"
        y2="48"
        stroke="url(#alpar-sword)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M28 14 H36 V18 H28 Z"
        fill="#E6F7FC"
        stroke="#0A2236"
        strokeWidth="0.5"
      />
      <circle cx="32" cy="20" r="1.5" fill="#0A2236" />
      <path
        d="M30 48 L32 52 L34 48 Z"
        fill="url(#alpar-sword)"
        stroke="#0A2236"
        strokeWidth="0.5"
      />

      <g stroke="#E6F7FC" strokeWidth="1" strokeLinecap="round">
        <line x1="20" y1="28" x2="14" y2="28" />
        <line x1="44" y1="28" x2="50" y2="28" />
        <line x1="32" y1="28" x2="32" y2="36" />
      </g>
      <g fill="#E6F7FC">
        <rect x="11" y="26" width="6" height="4" rx="0.5" />
        <rect x="47" y="26" width="6" height="4" rx="0.5" />
        <rect x="30" y="38" width="4" height="6" rx="0.5" />
      </g>
      <g fill="#3FBFE3">
        <circle cx="20" cy="28" r="1" />
        <circle cx="44" cy="28" r="1" />
        <circle cx="32" cy="36" r="1" />
      </g>

      <g fill="none" stroke="#3FBFE3" strokeWidth="0.75" opacity="0.8">
        <circle cx="14" cy="20" r="1.5" />
        <circle cx="50" cy="20" r="1.5" />
        <circle cx="14" cy="44" r="1.5" />
        <circle cx="50" cy="44" r="1.5" />
        <circle cx="32" cy="52" r="1.5" />
      </g>
      <g fill="#3FBFE3" opacity="0.8">
        <circle cx="14" cy="20" r="0.5" />
        <circle cx="50" cy="20" r="0.5" />
        <circle cx="14" cy="44" r="0.5" />
        <circle cx="50" cy="44" r="0.5" />
        <circle cx="32" cy="52" r="0.5" />
      </g>
    </svg>
  );
}
