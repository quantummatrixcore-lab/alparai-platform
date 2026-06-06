"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { INCIDENT_CATEGORIES, SEVERITY_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function IncidentFilters({
  defaultCategory,
  defaultSeverity,
  basePath = "/incidents",
}: {
  defaultCategory?: string;
  defaultSeverity?: string;
  basePath?: string;
}) {
  const t = useTranslations("incident");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(defaultCategory ?? "");
  const [severity, setSeverity] = useState(defaultSeverity ?? "");

  const submitHref = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (severity) params.set("severity", severity);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }, [q, category, severity, basePath]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{tCommon("filter")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted"
            aria-hidden="true"
          />
          <Input
            name="q"
            placeholder={tCommon("search")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <CategoryPill
            label={tCommon("all")}
            value=""
            active={!category}
            onClick={() => setCategory("")}
          />
          {INCIDENT_CATEGORIES.map((c) => (
            <CategoryPill
              key={c.value}
              label={tCat(c.value)}
              value={c.value}
              active={category === c.value}
              onClick={() => setCategory(c.value)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <SeverityChip
            label={tCommon("all")}
            value=""
            active={!severity}
            onClick={() => setSeverity("")}
          />
          {SEVERITY_LEVELS.map((s) => (
            <SeverityChip
              key={s.value}
              label={t(`severity_${s.value}`)}
              value={s.value}
              active={severity === s.value}
              onClick={() => setSeverity(s.value)}
            />
          ))}
        </div>
        <Link
          href={submitHref as never}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
        >
          {tCommon("search")}
        </Link>
      </CardContent>
    </Card>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  value?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors text-left",
        active
          ? "border-brand-500 bg-brand-500/10 text-brand-300"
          : "border-border-subtle bg-bg-tertiary text-fg-muted hover:border-border-strong"
      )}
    >
      {label}
    </button>
  );
}

function SeverityChip({
  label,
  active,
  onClick,
}: {
  label: string;
  value?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
        active
          ? "bg-brand-500 text-white"
          : "bg-bg-tertiary text-fg-muted hover:bg-bg-elevated"
      )}
    >
      {label}
    </button>
  );
}
