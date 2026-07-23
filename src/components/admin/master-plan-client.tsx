"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, Clock, LayoutGrid, List } from "lucide-react";
import type { PlanItem } from "@/lib/utils/markdown-parser";

interface MasterPlanClientProps {
  items: PlanItem[];
}

export function MasterPlanClient({ items }: MasterPlanClientProps) {
  const t = useTranslations("admin");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");

  const { pendingItems, completedItems, pausedItems, progress, completedCount, activeTotal } =
    useMemo(() => {
      const pending = items.filter((i) => i.status === "pending");
      const completed = items.filter((i) => i.status === "completed");
      const paused = items.filter((i) => i.status === "paused");

      const cCount = completed.length;
      const aTotal = items.length - paused.length;
      const prog = aTotal > 0 ? (cCount / aTotal) * 100 : 0;

      return {
        pendingItems: pending,
        completedItems: completed,
        pausedItems: paused,
        completedCount: cCount,
        activeTotal: aTotal,
        progress: prog,
      };
    }, [items]);

  return (
    <div className="space-y-8">
      {/* Dashboard Header Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-bg-secondary border-border-subtle relative overflow-hidden rounded-xl border p-6">
          <div className="bg-brand-500/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl"></div>
          <div className="text-fg-muted mb-1 text-sm font-medium tracking-wider uppercase">
            {t("progress_title")}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{Math.round(progress)}%</span>
            <span className="text-fg-muted mb-1 text-sm font-medium">
              {t("progress_active", { completed: completedCount, total: activeTotal })}
            </span>
          </div>
          <div className="bg-bg-tertiary mt-5 h-3 w-full overflow-hidden rounded-full shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="from-brand-600 to-brand-400 h-full rounded-full bg-gradient-to-r shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="border-border-subtle flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-bold text-white">{t("execution_board")}</h2>
        <div className="bg-bg-tertiary border-border-subtle flex items-center gap-1 rounded-lg border p-1">
          <button
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
            aria-label={t("view_list")}
            className={`focus:ring-brand-500/50 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-all focus:ring-2 focus:outline-none ${viewMode === "list" ? "bg-bg-secondary text-white shadow-sm" : "text-fg-muted hover:text-white"}`}
          >
            <List className="h-4 w-4" />
            {t("view_list")}
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            aria-pressed={viewMode === "kanban"}
            aria-label={t("view_kanban")}
            className={`focus:ring-brand-500/50 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-all focus:ring-2 focus:outline-none ${viewMode === "kanban" ? "bg-bg-secondary text-white shadow-sm" : "text-fg-muted hover:text-white"}`}
          >
            <LayoutGrid className="h-4 w-4" />
            {t("view_kanban")}
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pending Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-white">
                <Clock className="h-5 w-5 text-amber-400" />
                {t("pending_column")}
              </h3>
              <span className="bg-bg-tertiary text-fg-muted rounded-full px-2.5 py-0.5 text-xs font-bold">
                {pendingItems.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingItems.length === 0 ? (
                <div className="bg-bg-secondary/40 border-border-subtle/50 text-fg-muted flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                  <Clock className="mb-2 h-6 w-6 opacity-40" />
                  <p className="text-xs font-medium">No pending items</p>
                </div>
              ) : (
                <AnimatePresence>
                  {pendingItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-bg-secondary border-border-subtle hover:border-brand-500/30 group relative flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-bg-tertiary text-fg-secondary border-border-subtle rounded border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase">
                          Item {item.id}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${item.priority.includes("P0") ? "border border-red-500/20 bg-red-500/10 text-red-400" : item.priority.includes("P1") ? "border border-amber-500/20 bg-amber-500/10 text-amber-400" : "border border-blue-500/20 bg-blue-500/10 text-blue-400"}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="font-medium text-white">{item.title}</p>
                      {item.owner && (
                        <span className="text-fg-muted self-end text-[10px] font-semibold tracking-wider uppercase">
                          [{item.owner}]
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Paused / Founder-Gated Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-white">
                <Clock className="h-5 w-5 text-purple-400" />
                {t("paused_column")}
              </h3>
              <span className="bg-bg-tertiary text-fg-muted rounded-full px-2.5 py-0.5 text-xs font-bold">
                {pausedItems.length}
              </span>
            </div>
            <div className="space-y-3">
              {pausedItems.length === 0 ? (
                <div className="bg-bg-secondary/40 border-border-subtle/50 text-fg-muted flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                  <Clock className="mb-2 h-6 w-6 opacity-40" />
                  <p className="text-xs font-medium">No paused items</p>
                </div>
              ) : (
                <AnimatePresence>
                  {pausedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-bg-secondary border-border-subtle group relative flex flex-col gap-3 rounded-xl border border-purple-500/20 p-4 shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-bg-tertiary text-fg-secondary border-border-subtle rounded border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase">
                          Item {item.id}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${item.priority.includes("P0") ? "border border-red-500/20 bg-red-500/10 text-red-400" : item.priority.includes("P1") ? "border border-amber-500/20 bg-amber-500/10 text-amber-400" : "border border-blue-500/20 bg-blue-500/10 text-blue-400"}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="font-medium text-white">{item.title}</p>
                      {item.owner && (
                        <span className="text-fg-muted self-end text-[10px] font-semibold tracking-wider uppercase">
                          [{item.owner}]
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                {t("completed_column")}
              </h3>
              <span className="bg-bg-tertiary text-fg-muted rounded-full px-2.5 py-0.5 text-xs font-bold">
                {completedItems.length}
              </span>
            </div>
            <div className="space-y-3 opacity-60 transition-opacity hover:opacity-100">
              {completedItems.length === 0 ? (
                <div className="bg-bg-secondary/40 border-border-subtle/50 text-fg-muted flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                  <CheckCircle2 className="mb-2 h-6 w-6 opacity-40" />
                  <p className="text-xs font-medium">No completed items</p>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {completedItems.slice(0, 15).map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="group relative flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="bg-bg-tertiary text-fg-secondary border-border-subtle rounded border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase">
                            Item {item.id}
                          </span>
                        </div>
                        <p className="text-fg-secondary text-sm font-medium line-through">
                          {item.title}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {completedItems.length > 15 && (
                    <div className="text-fg-muted text-center text-sm font-medium">
                      {t("more_completed", { count: completedItems.length - 15 })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
                item.status === "completed"
                  ? "border-emerald-500/10 bg-emerald-500/5"
                  : "bg-bg-secondary border-border-subtle hover:border-brand-500/30"
              }`}
            >
              <div className="mt-0.5">
                {item.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : item.status === "paused" ? (
                  <Clock className="h-5 w-5 text-purple-400" />
                ) : (
                  <Circle className="text-fg-muted h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="bg-bg-tertiary text-fg-secondary border-border-subtle rounded border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase">
                    Item {item.id}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                      item.priority.includes("P0")
                        ? "border border-red-500/20 bg-red-500/10 text-red-400"
                        : item.priority.includes("P1")
                          ? "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : "border border-blue-500/20 bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p
                  className={`text-sm ${item.status === "completed" ? "text-fg-secondary line-through" : "font-medium text-white"}`}
                >
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
