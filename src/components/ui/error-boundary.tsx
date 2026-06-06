"use client";

import { useTranslations } from "next-intl";
import { Button } from "./button";
import { AlertTriangle } from "lucide-react";

export function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-500/10">
        <AlertTriangle className="h-8 w-8 text-danger-500" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold text-fg-primary">{t("somethingWentWrong")}</h2>
        <p className="text-sm text-fg-muted">
          {error.message || t("unexpectedError")}
        </p>
        {error.digest && (
          <p className="text-xs text-fg-muted">Error ID: {error.digest}</p>
        )}
      </div>
      <Button variant="secondary" onClick={reset}>
        {t("tryAgain")}
      </Button>
    </div>
  );
}
