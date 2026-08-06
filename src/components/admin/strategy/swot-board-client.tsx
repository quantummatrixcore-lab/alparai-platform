"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  X,
  Loader2,
  TrendingUp,
  Flame,
  Sparkles,
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Layers,
  Zap,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { upsertSwotItemAction, deleteSwotItemAction } from "@/actions/strategy";
import { toast } from "sonner";
import type { SwotItem } from "@/types";
import { useTranslations } from "next-intl";

interface SwotBoardClientProps {
  initialItems: SwotItem[];
  isReadOnly: boolean;
  locale: string;
}

const QUADRANT_CONFIGS: Record<
  SwotItem["category"],
  {
    titleKey: string;
    icon: React.ElementType;
    bgGradient: string;
    glowBg: string;
    borderColor: string;
    textColor: string;
    badgeStyle: string;
    accentLine: string;
    hoverShadow: string;
    lightText: string;
  }
> = {
  strength: {
    titleKey: "swot_strengths",
    icon: TrendingUp,
    bgGradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    glowBg: "bg-emerald-500/15",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
    textColor: "text-emerald-400",
    badgeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    accentLine: "from-emerald-500 to-teal-400",
    hoverShadow: "hover:shadow-emerald-500/10 hover:shadow-2xl",
    lightText: "text-emerald-300/80",
  },
  weakness: {
    titleKey: "swot_weaknesses",
    icon: Flame,
    bgGradient: "from-rose-500/10 via-rose-500/5 to-transparent",
    glowBg: "bg-rose-500/15",
    borderColor: "border-rose-500/20 hover:border-rose-500/40",
    textColor: "text-rose-400",
    badgeStyle: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    accentLine: "from-rose-500 to-red-400",
    hoverShadow: "hover:shadow-rose-500/10 hover:shadow-2xl",
    lightText: "text-rose-300/80",
  },
  opportunity: {
    titleKey: "swot_opportunities",
    icon: Sparkles,
    bgGradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    glowBg: "bg-cyan-500/15",
    borderColor: "border-cyan-500/20 hover:border-cyan-500/40",
    textColor: "text-cyan-400",
    badgeStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    accentLine: "from-cyan-500 to-blue-400",
    hoverShadow: "hover:shadow-cyan-500/10 hover:shadow-2xl",
    lightText: "text-cyan-300/80",
  },
  threat: {
    titleKey: "swot_threats",
    icon: ShieldAlert,
    bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    glowBg: "bg-amber-500/15",
    borderColor: "border-amber-500/20 hover:border-amber-500/40",
    textColor: "text-amber-400",
    badgeStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    accentLine: "from-amber-500 to-orange-400",
    hoverShadow: "hover:shadow-amber-500/10 hover:shadow-2xl",
    lightText: "text-amber-300/80",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.97, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 },
  },
  exit: { opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.15 } },
};

export function SwotBoardClient({
  initialItems,
  isReadOnly,
  locale: _locale,
}: SwotBoardClientProps) {
  const t = useTranslations("admin");
  const [items, setItems] = useState<SwotItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | SwotItem["category"]>(
    "all",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<SwotItem> | null>(null);

  // Categorize & Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.action_plan && item.action_plan.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeCategoryFilter === "all" || item.category === activeCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategoryFilter]);

  const strengths = useMemo(
    () => filteredItems.filter((i) => i.category === "strength"),
    [filteredItems],
  );
  const weaknesses = useMemo(
    () => filteredItems.filter((i) => i.category === "weakness"),
    [filteredItems],
  );
  const opportunities = useMemo(
    () => filteredItems.filter((i) => i.category === "opportunity"),
    [filteredItems],
  );
  const threats = useMemo(
    () => filteredItems.filter((i) => i.category === "threat"),
    [filteredItems],
  );

  // Quick Overview Stats
  const totalCount = items.length;
  const highImpactCount = items.filter((i) => i.weight === "high").length;
  const activeCount = items.filter((i) => i.status === "active").length;

  const handleOpenAdd = (category: SwotItem["category"]) => {
    if (isReadOnly) return;
    setActiveItem({
      category,
      title: "",
      description: "",
      weight: "medium",
      status: "active",
      action_plan: "",
      target_date: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SwotItem) => {
    if (isReadOnly) return;
    setActiveItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (isReadOnly) return;
    if (!confirm(t("swot_delete_confirm"))) {
      return;
    }

    try {
      const res = await deleteSwotItemAction(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success(t("swot_item_deleted"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("swot_delete_failed"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !activeItem || !activeItem.title) return;

    setIsSaving(true);
    try {
      const res = await upsertSwotItemAction({
        id: activeItem.id,
        category: activeItem.category || "strength",
        title: activeItem.title,
        description: activeItem.description || null,
        weight: activeItem.weight || "medium",
        action_plan: activeItem.action_plan || null,
        target_date: activeItem.target_date || null,
        status: activeItem.status || "active",
      });

      if (res.success) {
        const newItem: SwotItem = {
          id: res.id,
          category: activeItem.category || "strength",
          title: activeItem.title,
          description: activeItem.description || null,
          weight: activeItem.weight || "medium",
          action_plan: activeItem.action_plan || null,
          target_date: activeItem.target_date || null,
          status: activeItem.status || "active",
          owner_user_id: activeItem.owner_user_id || null,
          created_at: activeItem.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (activeItem.id) {
          setItems((prev) => prev.map((item) => (item.id === activeItem.id ? newItem : item)));
          toast.success(t("swot_item_updated"));
        } else {
          setItems((prev) => [...prev, newItem]);
          toast.success(t("swot_item_added"));
        }
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("operation_failed"));
    } finally {
      setIsSaving(false);
    }
  };

  const renderQuadrant = (category: SwotItem["category"], quadrantItems: SwotItem[]) => {
    const config = QUADRANT_CONFIGS[category];
    const IconComponent = config.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "group/quadrant relative flex flex-col overflow-hidden rounded-3xl border p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3),_inset_0_1px_1px_0_rgba(255,255,255,0.25)] backdrop-blur-3xl backdrop-contrast-125 backdrop-saturate-150 transition-all duration-300",
          "bg-white/5 dark:bg-slate-950/30",
          config.borderColor,
          config.hoverShadow,
        )}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover/quadrant:opacity-60",
            config.glowBg,
          )}
        />

        {/* Quadrant Header */}
        <div className="relative z-10 mb-4 flex items-center justify-between border-b border-white/5 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border shadow-inner transition-transform duration-300 group-hover/quadrant:scale-110",
                config.badgeStyle,
              )}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <h2
                className={cn(
                  "flex items-center gap-2 text-sm font-black tracking-wider uppercase",
                  config.textColor,
                )}
              >
                {t(config.titleKey)}
              </h2>
              <span className="text-fg-muted text-[11px] font-medium">
                {quadrantItems.length} {quadrantItems.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {!isReadOnly && (
            <button
              onClick={() => handleOpenAdd(category)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95",
                config.badgeStyle,
              )}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t("swot_add_item")}</span>
            </button>
          )}
        </div>

        {/* Items Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-h-[420px] flex-1 scrollbar-thin scrollbar-thumb-white/10 space-y-3.5 overflow-y-auto pr-1"
        >
          <AnimatePresence mode="popLayout">
            {quadrantItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="text-fg-muted mb-2.5 rounded-2xl border border-white/5 bg-white/5 p-3">
                  <Layers className="h-6 w-6 opacity-40" />
                </div>
                <p className="text-fg-muted text-xs font-medium italic">{t("swot_no_items")}</p>
              </motion.div>
            ) : (
              quadrantItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -3, scale: 1.01, zIndex: 20 }}
                  className={cn(
                    "group relative rounded-2xl border p-4 transition-all duration-300",
                    "bg-bg-tertiary/40 hover:bg-bg-tertiary/70 border-white/10 shadow-md backdrop-blur-md hover:border-white/20 hover:shadow-xl",
                  )}
                >
                  {/* Category Accent Stripe on Left */}
                  <div
                    className={cn(
                      "absolute top-3 bottom-3 left-0 w-1 rounded-r-full bg-gradient-to-b opacity-80 transition-opacity group-hover:opacity-100",
                      config.accentLine,
                    )}
                  />

                  {/* Card Content Header */}
                  <div className="flex items-start justify-between gap-3 pl-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm leading-snug font-bold text-white transition-colors group-hover:text-white">
                          {item.title}
                        </h4>
                        {/* Status Icon */}
                        {item.status === "done" && (
                          <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            {t("swot_status_done")}
                          </span>
                        )}
                        {item.status === "archived" && (
                          <span className="text-fg-muted flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold">
                            <Archive className="h-3 w-3" />
                            {t("swot_status_archived")}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-fg-muted line-clamp-3 text-xs leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Weight Badge */}
                    <div className="shrink-0">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase shadow-sm",
                          item.weight === "high"
                            ? "border-rose-500/30 bg-rose-500/15 text-rose-300"
                            : item.weight === "medium"
                              ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                              : "border-blue-500/30 bg-blue-500/15 text-blue-300",
                        )}
                      >
                        {item.weight === "high" && (
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
                        )}
                        {item.weight === "high"
                          ? t("swot_weight_high")
                          : item.weight === "medium"
                            ? t("swot_weight_medium")
                            : t("swot_weight_low")}
                      </span>
                    </div>
                  </div>

                  {/* Action Plan Box */}
                  {item.action_plan && (
                    <div className="mt-3 ml-2 rounded-xl border border-white/5 bg-black/30 p-2.5 backdrop-blur-sm">
                      <div className="mb-1 flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                        <span className="text-[10px] font-bold tracking-wider text-amber-300/90 uppercase">
                          {t("swot_action_plan")}
                        </span>
                      </div>
                      <p className="text-fg-muted/90 pl-5 text-xs leading-relaxed italic">
                        {item.action_plan}
                      </p>
                    </div>
                  )}

                  {/* Target Date */}
                  {item.target_date && (
                    <div className="text-fg-muted mt-3 ml-2 flex items-center gap-1.5 text-[11px] font-medium">
                      <Calendar className="text-brand-400 h-3.5 w-3.5" />
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5">
                        {item.target_date}
                      </span>
                    </div>
                  )}

                  {/* Floating Action Menu on Hover */}
                  {!isReadOnly && (
                    <div className="bg-bg-secondary/90 absolute top-3 right-3 z-30 flex items-center gap-1 rounded-xl border border-white/15 p-1 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(item);
                        }}
                        title={t("swot_edit_item")}
                        className="text-fg-muted rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        title={t("swot_delete_confirm")}
                        className="rounded-lg p-1.5 text-rose-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Premium Glassmorphic Top Overview & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3),_inset_0_1px_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-contrast-125 backdrop-saturate-150 dark:bg-slate-950/30"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Stats Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 shadow-inner">
              <Zap className="text-brand-400 h-4 w-4" />
              <div>
                <span className="text-fg-muted block text-[10px] leading-none font-bold tracking-wider uppercase">
                  Total SWOT
                </span>
                <span className="text-sm font-black text-white">{totalCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 shadow-inner">
              <Flame className="h-4 w-4 text-rose-400" />
              <div>
                <span className="block text-[10px] leading-none font-bold tracking-wider text-rose-300/80 uppercase">
                  High Priority
                </span>
                <span className="text-sm font-black text-rose-300">{highImpactCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 shadow-inner">
              <Clock className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="block text-[10px] leading-none font-bold tracking-wider text-emerald-300/80 uppercase">
                  Active Tasks
                </span>
                <span className="text-sm font-black text-emerald-300">{activeCount}</span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="text-fg-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter SWOT..."
                className="bg-bg-tertiary/40 placeholder-fg-muted/60 focus:border-brand-500 focus:ring-brand-500 w-full rounded-2xl border border-white/10 py-2 pr-4 pl-9 text-xs text-white backdrop-blur-md focus:ring-1 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-fg-muted absolute top-1/2 right-3 -translate-y-1/2 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Category Pills */}
            <div className="bg-bg-tertiary/30 flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 p-1 backdrop-blur-md">
              {(["all", "strength", "weakness", "opportunity", "threat"] as const).map(
                (category) => {
                  const isActive = activeCategoryFilter === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategoryFilter(category)}
                      className={cn(
                        "rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap capitalize transition-all duration-200",
                        isActive
                          ? "bg-brand-500 shadow-brand-500/20 text-white shadow-lg"
                          : "text-fg-muted hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {category === "all" ? "All" : t(QUADRANT_CONFIGS[category].titleKey)}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2x2 Grid of Animated Glassmorphism SWOT Quadrants */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {renderQuadrant("strength", strengths)}
        {renderQuadrant("weakness", weaknesses)}
        {renderQuadrant("opportunity", opportunities)}
        {renderQuadrant("threat", threats)}
      </div>

      {/* Glassmorphic CRUD Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="from-bg-secondary via-bg-secondary to-bg-primary relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b p-6 shadow-2xl backdrop-blur-2xl"
            >
              {/* Top Glow Accent */}
              <div className="bg-brand-500/20 pointer-events-none absolute -top-20 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full blur-3xl" />

              {/* Modal Header */}
              <div className="relative mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="border-brand-500/30 bg-brand-500/10 text-brand-400 rounded-xl border p-2">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-wider text-white uppercase">
                      {activeItem.id ? t("swot_edit_item") : t("swot_add_item")}
                    </h3>
                    <p className="text-fg-muted text-xs">
                      {activeItem.category ? t(QUADRANT_CONFIGS[activeItem.category].titleKey) : ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-fg-muted rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Visual Pills */}
                <div>
                  <label className="text-fg-secondary mb-2 block text-xs font-bold tracking-wider uppercase">
                    Quadrant Category
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(["strength", "weakness", "opportunity", "threat"] as const).map((cat) => {
                      const isCatSelected = activeItem.category === cat;
                      const cfg = QUADRANT_CONFIGS[cat];
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveItem({ ...activeItem, category: cat })}
                          className={cn(
                            "rounded-xl border p-2.5 text-center text-xs font-bold transition-all duration-200",
                            isCatSelected
                              ? cfg.badgeStyle + " shadow-md"
                              : "text-fg-muted border-white/10 bg-white/5 hover:border-white/20 hover:text-white",
                          )}
                        >
                          {t(cfg.titleKey)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-fg-secondary mb-1.5 block text-xs font-bold tracking-wider uppercase">
                    {t("swot_title_label")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeItem.title || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                    placeholder={
                      activeItem.category === "strength"
                        ? t("swot_placeholder_strength")
                        : t("swot_placeholder_weakness")
                    }
                    className="bg-bg-tertiary/60 placeholder-fg-muted/60 focus:border-brand-500 focus:ring-brand-500 w-full rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-white backdrop-blur-md focus:ring-1 focus:outline-none"
                  />
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="text-fg-secondary mb-1.5 block text-xs font-bold tracking-wider uppercase">
                    {t("swot_description_label")}
                  </label>
                  <textarea
                    value={activeItem.description || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
                    rows={2.5}
                    placeholder="Provide additional context or rationale..."
                    className="bg-bg-tertiary/60 placeholder-fg-muted/60 focus:border-brand-500 focus:ring-brand-500 w-full resize-none rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-white backdrop-blur-md focus:ring-1 focus:outline-none"
                  />
                </div>

                {/* Weight & Status Options */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Weight Selector */}
                  <div>
                    <label className="text-fg-secondary mb-1.5 block text-xs font-bold tracking-wider uppercase">
                      {t("swot_weight_label")}
                    </label>
                    <div className="bg-bg-tertiary/40 flex rounded-2xl border border-white/10 p-1">
                      {(["low", "medium", "high"] as const).map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setActiveItem({ ...activeItem, weight: w })}
                          className={cn(
                            "flex-1 rounded-xl py-1.5 text-xs font-bold capitalize transition-all duration-200",
                            activeItem.weight === w
                              ? w === "high"
                                ? "border border-rose-500/30 bg-rose-500/20 text-rose-300"
                                : w === "medium"
                                  ? "border border-amber-500/30 bg-amber-500/20 text-amber-300"
                                  : "border border-blue-500/30 bg-blue-500/20 text-blue-300"
                              : "text-fg-muted hover:text-white",
                          )}
                        >
                          {w === "low"
                            ? t("swot_weight_low")
                            : w === "medium"
                              ? t("swot_weight_medium")
                              : t("swot_weight_high")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div>
                    <label className="text-fg-secondary mb-1.5 block text-xs font-bold tracking-wider uppercase">
                      {t("swot_status_label")}
                    </label>
                    <div className="bg-bg-tertiary/40 flex rounded-2xl border border-white/10 p-1">
                      {(["active", "done", "archived"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setActiveItem({ ...activeItem, status: s })}
                          className={cn(
                            "flex-1 rounded-xl py-1.5 text-xs font-bold capitalize transition-all duration-200",
                            activeItem.status === s
                              ? "bg-brand-500 text-white shadow-md"
                              : "text-fg-muted hover:text-white",
                          )}
                        >
                          {s === "active"
                            ? t("swot_status_active")
                            : s === "done"
                              ? t("swot_status_done")
                              : t("swot_status_archived")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Plan */}
                <div>
                  <label className="text-fg-secondary mb-1.5 block text-xs font-bold tracking-wider uppercase">
                    {t("swot_action_plan_label")}
                  </label>
                  <textarea
                    value={activeItem.action_plan || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, action_plan: e.target.value })}
                    rows={2}
                    placeholder="Key mitigation steps or tactical execution plan..."
                    className="bg-bg-tertiary/60 placeholder-fg-muted/60 focus:border-brand-500 focus:ring-brand-500 w-full resize-none rounded-2xl border border-white/10 px-4 py-2 text-sm text-white backdrop-blur-md focus:ring-1 focus:outline-none"
                  />
                </div>

                {/* Target Date */}
                <div>
                  <label className="text-fg-secondary mb-1.5 block text-xs font-bold tracking-wider uppercase">
                    {t("swot_target_date_label")}
                  </label>
                  <input
                    type="date"
                    value={activeItem.target_date || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, target_date: e.target.value })}
                    className="bg-bg-tertiary/60 focus:border-brand-500 focus:ring-brand-500 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white backdrop-blur-md focus:ring-1 focus:outline-none"
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-fg-muted rounded-2xl border border-white/10 px-5 py-2.5 text-xs font-bold transition hover:bg-white/5 hover:text-white"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-brand-600 shadow-brand-600/30 hover:bg-brand-500 hover:shadow-brand-500/40 flex items-center justify-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold text-white shadow-lg transition active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("swot_saving")}
                      </>
                    ) : (
                      t("swot_save")
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
