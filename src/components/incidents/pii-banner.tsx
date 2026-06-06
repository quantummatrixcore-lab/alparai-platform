import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function PIIBanner({ className }: { className?: string }) {
  const t = useTranslations("incident");
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-success-500/30 bg-success-500/5 p-3",
        className
      )}
      role="status"
    >
      <ShieldCheck className="h-5 w-5 shrink-0 text-success-500" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-fg-primary">
          {t("piiProtectedTitle", { defaultValue: "PII protected" })}
        </p>
        <p className="text-xs text-fg-muted">
          {t("piiProtectedDesc", {
            defaultValue:
              "Personal information such as emails, phone numbers, IDs and access tokens are automatically masked before publication.",
          })}
        </p>
      </div>
    </div>
  );
}
