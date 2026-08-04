"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MasterPlanLoading() {
  const t = useTranslations("admin");
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-brand-500 h-8 w-8 animate-spin" />
      <p className="text-fg-muted text-sm font-medium">
        {t("loading_master_plan") || "Loading Master Plan..."}
      </p>
    </div>
  );
}
