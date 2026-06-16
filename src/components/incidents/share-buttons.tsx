"use client";

import * as React from "react";
import { useState } from "react";
import { Share2, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ShareButtons({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const t = useTranslations("incident");
  const [copied, setCopied] = useState(false);
  const fullUrl = React.useMemo(() => {
    if (typeof window === "undefined") return url;
    return `${window.location.origin}${url}`;
  }, [url]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success(t("share_copy") + " ✓");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      toast.error("Copy failed");
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-fg-muted text-xs font-medium tracking-wider uppercase">
        <Share2 className="mr-1 inline h-3.5 w-3.5" /> {t("share")}
      </p>
      <div className="flex items-center gap-2">
        <a
          href={xUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="border-border-subtle bg-bg-secondary text-fg-secondary hover:border-brand-500 hover:text-brand-400 inline-flex h-9 w-9 items-center justify-center rounded-md border"
          aria-label={t("share_x")}
        >
          <Twitter className="h-4 w-4" />
        </a>
        <a
          href={liUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="border-border-subtle bg-bg-secondary text-fg-secondary hover:border-brand-500 hover:text-brand-400 inline-flex h-9 w-9 items-center justify-center rounded-md border"
          aria-label={t("share_linkedin")}
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <button
          onClick={onCopy}
          className="border-border-subtle bg-bg-secondary text-fg-secondary hover:border-brand-500 hover:text-brand-400 inline-flex h-9 w-9 items-center justify-center rounded-md border"
          aria-label={t("share_copy")}
        >
          {copied ? (
            <Check className="text-success-500 h-4 w-4" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
