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
          {/* Left Shield neon border gradient (Fuchsia -> Purple) */}
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

          {/* Right Tech circuits gradient (Cyan -> Teal/Blue) */}
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
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Shield Half (Accountability & Truth) */}
        <path
          d="M 50,20 C 35,21.5 27.5,24 26,26 V 48 C 26,68 38,78 50,84 Z"
          fill="url(#logo-shield-fill-grad)"
          stroke="url(#logo-left-grad)"
          strokeWidth="3.2"
          strokeLinejoin="round"
          className="group-hover/logo:fill-opacity-30 transition-all duration-500 group-hover/logo:stroke-[3.8px]"
        />

        {/* Scales of Justice inside Left Shield */}
        {/* Scale beam */}
        <path
          d="M 50,35 H 38"
          stroke="url(#logo-left-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="opacity-90 transition-all duration-500 group-hover/logo:opacity-100"
        />
        {/* Scale pan cords and shape */}
        <path
          d="M 38,35 L 31,51 H 45 Z"
          stroke="url(#logo-left-grad)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="#d946ef"
          fillOpacity="0.06"
          className="group-hover/logo:fill-opacity-20 transition-all duration-500 group-hover/logo:stroke-[2.2px]"
        />
        {/* Scale pan platform */}
        <path
          d="M 29,51 H 47"
          stroke="url(#logo-left-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Right Circuits (AI & Innovation) */}
        {/* Top Circuit Trace */}
        <path
          d="M 50,30 H 68 L 74,24 H 82"
          stroke="url(#logo-right-grad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logo-glow)"
          className="transition-all duration-500 group-hover/logo:stroke-[3.5px]"
        />
        <circle
          cx="85"
          cy="24"
          r="3.5"
          fill="#ffffff"
          stroke="#22d3ee"
          strokeWidth="1.8"
          filter="url(#logo-glow)"
          className="transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:fill-[#22d3ee]"
        />

        {/* Middle Circuit Trace */}
        <path
          d="M 50,48 H 68 L 74,42 H 82"
          stroke="url(#logo-right-grad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logo-glow)"
          className="transition-all duration-500 group-hover/logo:stroke-[3.5px]"
        />
        <circle
          cx="85"
          cy="42"
          r="3.5"
          fill="#ffffff"
          stroke="#22d3ee"
          strokeWidth="1.8"
          filter="url(#logo-glow)"
          className="transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:fill-[#22d3ee]"
        />

        {/* Bottom Circuit Trace */}
        <path
          d="M 50,62 H 68 L 74,68 H 82"
          stroke="url(#logo-right-grad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logo-glow)"
          className="transition-all duration-500 group-hover/logo:stroke-[3.5px]"
        />
        <circle
          cx="85"
          cy="68"
          r="3.5"
          fill="#ffffff"
          stroke="#22d3ee"
          strokeWidth="1.8"
          filter="url(#logo-glow)"
          className="transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:fill-[#22d3ee]"
        />

        {/* Center Sword / Divider Column (Strength & Balance) */}
        {/* Main blade/shaft */}
        <path
          d="M 50,20 V 84"
          stroke="url(#logo-center-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="transition-all duration-500 group-hover/logo:stroke-[4px]"
        />
        {/* Hilt / Base pedestal */}
        <path
          d="M 42,78 H 58"
          stroke="url(#logo-center-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="transition-all duration-500 group-hover/logo:stroke-[4px]"
        />
      </svg>
    </span>
  );
}
