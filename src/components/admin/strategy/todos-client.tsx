"use client";

import React, { useState } from "react";
import { Plus, Trash2, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleTodoAction, deleteTodoAction, createTodoAction } from "@/actions/todos";
import { toast } from "sonner";
import type { StrategyTodo } from "@/types";

interface TodosClientProps {
  initialTodos: StrategyTodo[];
  isReadOnly: boolean;
  locale: string;
}

export function RoadmapTodosClient({ initialTodos, isReadOnly, locale }: TodosClientProps) {
  const [todos, setTodos] = useState<StrategyTodo[]>(initialTodos);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    if (isReadOnly) return;
    try {
      const res = await toggleTodoAction(id, !currentStatus);
      if (res.success) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_completed: !currentStatus } : t)),
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update todo.");
    }
  };

  const handleDelete = async (id: string) => {
    if (isReadOnly) return;
    if (
      !confirm(
        locale === "tr"
          ? "Bu görevi silmek istediğinize emin misiniz?"
          : "Are you sure you want to delete this task?",
      )
    ) {
      return;
    }
    try {
      const res = await deleteTodoAction(id);
      if (res.success) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
        toast.success(locale === "tr" ? "Görev silindi." : "Task deleted.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task.");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !newTitle.trim()) return;

    setIsSaving(true);
    try {
      const res = await createTodoAction(newTitle.trim(), newPriority);
      if (res.success) {
        setTodos((prev) => [
          ...prev,
          {
            id: res.id,
            title: newTitle.trim(),
            priority: newPriority,
            is_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setNewTitle("");
        setIsAdding(false);
        toast.success(locale === "tr" ? "Yeni görev eklendi." : "New task added.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add task.");
    } finally {
      setIsSaving(false);
    }
  };

  // Group by priority
  const priorities = [1, 2, 3, 4, 5];
  const priorityLabels: Record<number, string> = {
    1: locale === "tr" ? "Öncelik 1 - Acil" : "Priority 1 - Urgent",
    2: locale === "tr" ? "Öncelik 2 - Kritik" : "Priority 2 - Critical",
    3: locale === "tr" ? "Öncelik 3 - Önemli" : "Priority 3 - Important",
    4: locale === "tr" ? "Öncelik 4 - Orta Vade" : "Priority 4 - Medium Term",
    5: locale === "tr" ? "Öncelik 5 - Uzun Vade" : "Priority 5 - Long Term",
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {locale === "tr" ? "Yol Haritası Görevleri" : "Roadmap Tasks"}
        </h2>
        {!isReadOnly && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-brand-600 hover:bg-brand-500 hover:shadow-brand-500/10 flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg transition"
          >
            <Plus className="h-4 w-4" />
            {locale === "tr" ? "Yeni Görev" : "Add Task"}
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="bg-bg-secondary/40 rounded-xl border border-white/10 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={locale === "tr" ? "Görev başlığı..." : "Task title..."}
              className="bg-bg-tertiary border-border-subtle focus:border-brand-500 focus:ring-brand-500 flex-1 rounded-lg border px-3 py-2 text-sm text-white focus:ring-1 focus:outline-none"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(Number(e.target.value))}
              className="bg-bg-tertiary border-border-subtle focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border px-3 py-2 text-sm text-white focus:ring-1 focus:outline-none sm:w-48"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {priorityLabels[p]}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-brand-600 hover:bg-brand-500 flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : locale === "tr" ? (
                  "Ekle"
                ) : (
                  "Add"
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="border-border-subtle rounded-lg border px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {priorities.map((priority) => {
          const priorityTodos = todos.filter((t) => t.priority === priority);
          if (priorityTodos.length === 0) return null;

          return (
            <div key={priority} className="space-y-3">
              <h3 className="text-fg-muted border-b border-white/5 pb-2 text-xs font-bold tracking-wider uppercase">
                {priorityLabels[priority]}
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {priorityTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 transition",
                      todo.is_completed
                        ? "bg-bg-tertiary/10 border-white/5 opacity-60"
                        : "bg-bg-secondary/40 border-white/10 hover:border-white/20",
                    )}
                  >
                    <button
                      onClick={() => handleToggle(todo.id, todo.is_completed)}
                      disabled={isReadOnly}
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition",
                        todo.is_completed
                          ? "bg-brand-500 border-brand-500 text-white"
                          : "border-white/20 bg-transparent text-transparent hover:border-white/40",
                      )}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-sm leading-snug font-medium",
                        todo.is_completed ? "text-fg-muted line-through" : "text-white",
                      )}
                    >
                      {todo.title}
                    </span>
                    {!isReadOnly && (
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="text-fg-muted rounded p-1 opacity-0 transition group-hover:opacity-100 hover:bg-red-400/10 hover:text-red-400 md:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {todos.length === 0 && (
          <p className="text-fg-muted py-8 text-center text-sm italic">
            {locale === "tr" ? "Henüz görev eklenmemiş." : "No tasks added yet."}
          </p>
        )}
      </div>
    </div>
  );
}
