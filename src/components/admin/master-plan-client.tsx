"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { PlanItem } from "@/lib/utils/markdown-parser";

interface MasterPlanClientProps {
  items: PlanItem[];
}

export function MasterPlanClient({ items }: MasterPlanClientProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const completedCount = items.filter((i) => i.status === "completed").length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Dashboard Header Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-bg-secondary border-border-subtle rounded-xl border p-6">
          <div className="text-fg-muted mb-1 text-sm font-medium tracking-wider uppercase">
            Total Progress
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-white">{Math.round(progress)}%</span>
            <span className="text-fg-muted mb-1 text-sm">
              {completedCount} / {totalCount} items
            </span>
          </div>
          <div className="bg-bg-tertiary mt-4 h-2 w-full overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-brand-500 h-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-border-subtle flex items-center gap-2 border-b pb-4">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${filter === "all" ? "bg-brand-500/10 text-brand-400 border-brand-500/20 border" : "text-fg-muted hover:text-white"}`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${filter === "pending" ? "border border-amber-500/20 bg-amber-500/10 text-amber-400" : "text-fg-muted hover:text-white"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${filter === "completed" ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "text-fg-muted hover:text-white"}`}
        >
          Completed
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
              item.status === "completed"
                ? "border-emerald-500/10 bg-emerald-500/5"
                : "bg-bg-secondary border-border-subtle hover:border-brand-500/30"
            }`}
          >
            <div className="mt-0.5">
              {item.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
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

            {item.status === "pending" && (
              <div className="flex items-center gap-2">
                <Clock className="text-fg-muted h-4 w-4" />
                <span className="text-fg-muted font-mono text-xs">Pending</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
