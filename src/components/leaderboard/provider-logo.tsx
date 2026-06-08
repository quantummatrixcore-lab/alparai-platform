"use client";

import { useState } from "react";

interface ProviderLogoProps {
  src: string | null;
  name: string;
}

export function ProviderLogo({ src, name }: ProviderLogoProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="bg-bg-tertiary text-fg-muted flex h-full w-full items-center justify-center text-sm font-bold">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className="h-full w-full object-contain p-1.5"
      onError={() => setImgError(true)}
    />
  );
}
