"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface SlideOverPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SlideOverPanel({ open, onClose, title, children, className }: SlideOverPanelProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="animate-in fade-in fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      />
      <aside
        className={cn(
          "bg-bg-secondary animate-in slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/5 shadow-2xl transition-all duration-300 ease-in-out",
          className,
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-6">
          {title && <h2 className="text-fg-primary text-lg font-bold">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg-primary -mr-2 rounded-xl p-2 transition-all duration-200 ease-in-out"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </aside>
    </>
  );
}
