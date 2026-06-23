import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: { w: 24, h: 24 },
  md: { w: 32, h: 32 },
  lg: { w: 48, h: 48 },
  xl: { w: 96, h: 96 },
} as const;

export function Logo({ className, size = "md", ...props }: LogoProps) {
  const { w, h } = sizeMap[size];
  return (
    <span
      className={cn("group/logo relative inline-block shrink-0 select-none", className)}
      style={{ width: w, height: h }}
      role="img"
      aria-label="ALPAR AI"
      {...props}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-full w-full overflow-visible"
      >
        <defs>
          {/* Left Shield elements gradient (Fuchsia -> Purple) */}
          <linearGradient
            id="logo-left-grad"
            x1="50"
            y1="20"
            x2="26"
            y2="84"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Right Tech elements gradient (Cyan -> Teal/Blue) */}
          <linearGradient
            id="logo-right-grad"
            x1="50"
            y1="30"
            x2="85"
            y2="68"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Symmetrical border gradient (Fuchsia -> Purple -> Cyan) */}
          <linearGradient
            id="logo-border-grad"
            x1="15"
            y1="50"
            x2="85"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          {/* Shield glassmorphism body fill gradient */}
          <linearGradient
            id="logo-shield-fill-grad"
            x1="50"
            y1="20"
            x2="26"
            y2="84"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0a0f1e" stopOpacity="0.55" />
          </linearGradient>

          {/* Center divider/sword column gradient */}
          <linearGradient
            id="logo-center-grad"
            x1="50"
            y1="20"
            x2="50"
            y2="84"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          {/* Premium neon glow effect */}
          <filter id="logo-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Full Shield Body for Glassmorphism Fill (Symmetric) */}
        <path
          d="M 50,15 C 28,17 15,22 15,25 V 50 C 15,70 32,82 50,88 C 68,82 85,70 85,50 V 25 C 85,22 72,17 50,15 Z"
          fill="url(#logo-shield-fill-grad)"
          className="group-hover/logo:fill-opacity-30 transition-all duration-500"
        />

        {/* Symmetrical Shield Neon Border */}
        <path
          d="M 50,15 C 28,17 15,22 15,25 V 50 C 15,70 32,82 50,88 C 68,82 85,70 85,50 V 25 C 85,22 72,17 50,15 Z"
          stroke="url(#logo-border-grad)"
          strokeWidth="3.2"
          strokeLinejoin="round"
          className="transition-all duration-500 group-hover/logo:stroke-[3.8px]"
        />

        {/* Center Sword / Divider Column (Symmetric) */}
        <path
          d="M 50,22 V 78"
          stroke="url(#logo-center-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="transition-all duration-500 group-hover/logo:stroke-[3.8px]"
        />
        {/* Hilt / Base pedestal */}
        <path
          d="M 42,78 H 58"
          stroke="url(#logo-center-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="transition-all duration-500 group-hover/logo:stroke-[3.8px]"
        />
        {/* Top Finial Node */}
        <circle
          cx="50"
          cy="22"
          r="2.5"
          fill="#ffffff"
          stroke="#a855f7"
          strokeWidth="1.2"
          filter="url(#logo-glow)"
          className="transition-all duration-300 group-hover/logo:scale-110"
        />

        {/* Symmetrical Scales of Justice */}
        {/* Scale Beam */}
        <path
          d="M 30,36 H 70"
          stroke="url(#logo-center-grad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          className="transition-all duration-500 group-hover/logo:stroke-[3.2px]"
        />

        {/* Left Scale Pan */}
        <path
          d="M 30,36 L 22,54 L 38,54 Z"
          stroke="url(#logo-left-grad)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="url(#logo-left-grad)"
          fillOpacity="0.05"
          className="group-hover/logo:fill-opacity-15 transition-all duration-500"
        />
        <path
          d="M 18,54 H 42"
          stroke="url(#logo-left-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 21,54 C 21,61 39,61 39,54 Z"
          fill="url(#logo-left-grad)"
          fillOpacity="0.75"
          className="group-hover/logo:fill-opacity-90 transition-all duration-500"
        />

        {/* Right Scale Pan */}
        <path
          d="M 70,36 L 62,54 L 78,54 Z"
          stroke="url(#logo-right-grad)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="url(#logo-right-grad)"
          fillOpacity="0.05"
          className="group-hover/logo:fill-opacity-15 transition-all duration-500"
        />
        <path
          d="M 58,54 H 82"
          stroke="url(#logo-right-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 61,54 C 61,61 79,61 79,54 Z"
          fill="url(#logo-right-grad)"
          fillOpacity="0.75"
          className="group-hover/logo:fill-opacity-90 transition-all duration-500"
        />

        {/* Symmetrical AI Tech Circuits (Branching Symmetrically) */}
        {/* Top Circuit Traces */}
        <path
          d="M 50,48 H 36 L 31,43 H 26"
          stroke="url(#logo-left-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
        <circle
          cx="23"
          cy="43"
          r="2.5"
          fill="#ffffff"
          stroke="#d946ef"
          strokeWidth="1.2"
          filter="url(#logo-glow)"
          className="transition-all duration-300 group-hover/logo:scale-110"
        />

        <path
          d="M 50,48 H 64 L 69,43 H 74"
          stroke="url(#logo-right-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
        <circle
          cx="77"
          cy="43"
          r="2.5"
          fill="#ffffff"
          stroke="#22d3ee"
          strokeWidth="1.2"
          filter="url(#logo-glow)"
          className="transition-all duration-300 group-hover/logo:scale-110"
        />

        {/* Bottom Circuit Traces */}
        <path
          d="M 50,65 H 38 L 34,70 H 28"
          stroke="url(#logo-left-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
        <circle
          cx="25"
          cy="70"
          r="2.5"
          fill="#ffffff"
          stroke="#d946ef"
          strokeWidth="1.2"
          filter="url(#logo-glow)"
          className="transition-all duration-300 group-hover/logo:scale-110"
        />

        <path
          d="M 50,65 H 62 L 66,70 H 72"
          stroke="url(#logo-right-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
        <circle
          cx="75"
          cy="70"
          r="2.5"
          fill="#ffffff"
          stroke="#22d3ee"
          strokeWidth="1.2"
          filter="url(#logo-glow)"
          className="transition-all duration-300 group-hover/logo:scale-110"
        />
      </svg>
    </span>
  );
}
