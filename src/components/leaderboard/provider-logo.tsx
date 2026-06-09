"use client";

import { useState } from "react";

interface ProviderLogoProps {
  src: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
} as const;

function hashStringToColor(name: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palettes = [
    { bg: "from-brand-500/30 to-brand-700/30", fg: "text-brand-300" },
    { bg: "from-purple-500/30 to-pink-500/30", fg: "text-purple-300" },
    { bg: "from-blue-500/30 to-cyan-500/30", fg: "text-blue-300" },
    { bg: "from-emerald-500/30 to-teal-500/30", fg: "text-emerald-300" },
    { bg: "from-amber-500/30 to-orange-500/30", fg: "text-amber-300" },
    { bg: "from-rose-500/30 to-red-500/30", fg: "text-rose-300" },
    { bg: "from-indigo-500/30 to-violet-500/30", fg: "text-indigo-300" },
    { bg: "from-fuchsia-500/30 to-pink-500/30", fg: "text-fuchsia-300" },
  ];
  const idx = Math.abs(hash) % palettes.length;
  const palette = palettes[idx] ?? palettes[0];
  if (!palette)
    return { bg: "bg-gradient-to-br from-brand-500/30 to-brand-700/30", fg: "text-brand-300" };
  return { bg: `bg-gradient-to-br ${palette.bg}`, fg: palette.fg };
}

function getInitials(name: string): string {
  const cleaned = name.replace(/[^\p{L}\p{N}\s]/gu, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export function ProviderLogo({ src, name, size = "md" }: ProviderLogoProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const palette = hashStringToColor(name);
  const sizeClass = SIZE_CLASS[size];

  if (!src || imgError) {
    return (
      <div
        className={`flex items-center justify-center rounded-md font-black tracking-tight ${palette.bg} ${palette.fg} ${sizeClass}`}
        aria-label={`${name} logo placeholder`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className={`h-full w-full rounded-md object-contain p-1.5`}
      onError={() => setImgError(true)}
    />
  );
}
