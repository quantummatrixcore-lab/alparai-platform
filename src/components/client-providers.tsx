"use client";

import * as React from "react";
import { CookieBanner } from "./legal/cookie-banner";
import { Toaster } from "sonner";

export function ClientProviders() {
  return (
    <>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "rgb(var(--color-bg-elevated))",
            border: "1px solid rgb(var(--color-border-subtle))",
            color: "rgb(var(--color-fg-primary))",
          },
        }}
      />
      <CookieBanner />
    </>
  );
}
