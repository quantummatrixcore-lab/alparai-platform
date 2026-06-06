"use client";

import * as React from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn, formatNumber } from "@/lib/utils";

export interface EvidenceUploaderProps {
  name?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
}

export function EvidenceUploader({
  name = "evidence",
  maxFiles = 5,
  maxSizeMB = 10,
  accept = "image/*,video/*,application/pdf",
  onFilesChange,
  disabled = false,
}: EvidenceUploaderProps) {
  const t = useTranslations("incident");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setError(null);
    const next: File[] = [];
    for (const f of Array.from(incoming)) {
      if (files.length + next.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files`);
        break;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${f.name}" exceeds ${maxSizeMB}MB`);
        continue;
      }
      next.push(f);
    }
    const merged = [...files, ...next];
    setFiles(merged);
    onFilesChange?.(merged);
  };

  const remove = (i: number) => {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onFilesChange?.(next);
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
          dragOver
            ? "border-brand-500 bg-brand-500/5"
            : "border-border-subtle hover:border-brand-500/50 hover:bg-bg-tertiary/30",
          disabled && "pointer-events-none opacity-50"
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label={t("evidence")}
      >
        <Upload className="h-6 w-6 text-fg-muted" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-fg-primary">
            {t("evidence")}
          </p>
          <p className="text-xs text-fg-muted">{t("evidence_hint")}</p>
        </div>
        <input
          ref={inputRef}
          name={name}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>
      {error && <p className="text-xs text-danger-500" role="alert">{error}</p>}
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-md border border-border-subtle bg-bg-secondary px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-fg-muted" />
                <span className="truncate text-sm text-fg-primary">{f.name}</span>
                <span className="shrink-0 text-xs text-fg-muted">
                  {formatNumber(Math.round(f.size / 1024))} KB
                </span>
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-fg-muted hover:text-danger-500"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  const t = useTranslations("incident");
  return (
    <Button type="submit" isLoading={pending} size="lg" className={className}>
      {pending ? t("submitting") : children}
    </Button>
  );
}
