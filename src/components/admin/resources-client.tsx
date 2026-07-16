"use client";

import React, { useState, useEffect } from "react";

export function ResourcesClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 p-2 lg:p-6">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-white">Resource Efficiency</h1>
        <p className="text-fg-secondary text-sm">
          Monitor and optimize system resource utilization
        </p>
      </div>

      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10">
        <p className="text-fg-muted text-sm">
          No data yet — connect Supabase/Vercel/Upstash monitoring APIs for real resource metrics.
        </p>
      </div>
    </div>
  );
}
