"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MasterPlanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("admin");

  useEffect(() => {
    console.error("MasterPlan Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6">
      <div className="flex max-w-md flex-col items-center justify-center space-y-2 rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <AlertTriangle className="mb-2 h-10 w-10 text-red-500" />
        <h2 className="text-lg font-bold text-white">{t("plan_error_title")}</h2>
        <p className="text-sm text-red-400/90">{error.message || t("plan_error_body")}</p>
        <button
          onClick={reset}
          className="mt-6 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
        >
          <RefreshCcw className="h-4 w-4" />
          {t("retry_button") || "Tekrar Dene"}
        </button>
      </div>
    </div>
  );
}
