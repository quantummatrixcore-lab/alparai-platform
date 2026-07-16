"use client";

import React, { useState } from "react";
import {
  Check,
  Megaphone,
  ShareNetwork,
  Video,
  Image as ImageIcon,
  Sparkle,
  Pen,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { socialDrafts } from "@/lib/data/social-mock-data";

export function SocialClient() {
  const [drafts, setDrafts] = useState(socialDrafts);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      setIsProcessing(null);
    }, 800);
  };

  const handleReject = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      setIsProcessing(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Platform Connections */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-bg-secondary border-border-subtle group hover:border-brand-500/30 relative overflow-hidden rounded-xl border p-6 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <ShareNetwork className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">LinkedIn Company Page</h3>
                <p className="text-fg-muted flex items-center gap-2 text-sm">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  Connected
                </p>
              </div>
            </div>
            <button className="border-border-subtle bg-bg-tertiary rounded-md border px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5">
              Manage
            </button>
          </div>
        </div>

        <div className="bg-bg-secondary border-border-subtle group hover:border-brand-500/30 relative overflow-hidden rounded-xl border p-6 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                <ShareNetwork className="h-6 w-6 text-sky-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">X (Twitter)</h3>
                <p className="text-fg-muted flex items-center gap-2 text-sm">
                  <span className="flex h-2 w-2 rounded-full bg-red-500" />
                  Disconnected
                </p>
              </div>
            </div>
            <button className="bg-brand-500 hover:bg-brand-600 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-colors">
              Connect
            </button>
          </div>
        </div>
      </div>

      {/* Human in the loop queue */}
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <Megaphone className="text-brand-400 h-5 w-5" />
          Approval Queue (Human in the Loop)
        </h2>

        {drafts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-secondary border-border-subtle rounded-xl border p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Sparkle className="text-brand-400 h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Queue Empty</h3>
            <p className="text-fg-muted">
              No pending drafts. Spark will generate new content based on recent AI pulses.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {drafts.map((draft) => (
                <motion.div
                  key={draft.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  className="bg-bg-secondary border-border-subtle overflow-hidden rounded-xl border shadow-lg"
                >
                  <div className="border-border-subtle bg-bg-tertiary flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded border px-2 py-1 text-xs font-bold tracking-wider uppercase ${draft.platform.includes("LinkedIn") ? "border-blue-500/20 bg-blue-500/10 text-blue-400" : "border-sky-500/20 bg-sky-500/10 text-sky-400"}`}
                      >
                        {draft.platform}
                      </span>
                      <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs">
                        <Sparkle className="text-brand-400 h-3.5 w-3.5" />
                        <span className="text-white">AI Confidence: {draft.ai_confidence}%</span>
                      </div>
                    </div>
                    <span className="text-fg-muted text-xs">
                      {new Date(draft.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-6 p-6 md:flex-row">
                    <div className="flex-1 space-y-4">
                      <div className="group relative">
                        <p className="whitespace-pre-wrap text-white">{draft.content}</p>
                        <button className="bg-bg-tertiary text-fg-muted absolute -top-2 -right-2 hidden rounded-md p-1.5 shadow-sm group-hover:block hover:text-white">
                          <Pen className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {draft.media_url && (
                      <div className="w-full shrink-0 md:w-64">
                        <div className="border-border-subtle group relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-black">
                          {draft.media_type === "video" ? (
                            <div className="relative h-full w-full">
                              <video
                                src={draft.media_url}
                                className="h-full w-full object-cover opacity-50"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                                  <Video className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative h-full w-full">
                              <img
                                src={draft.media_url}
                                alt="Draft preview"
                                className="h-full w-full object-cover opacity-70"
                              />
                              <div className="absolute top-2 right-2 rounded bg-black/60 p-1.5 backdrop-blur-sm">
                                <ImageIcon className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="absolute right-2 bottom-2 left-2 rounded bg-black/70 py-1 text-center text-xs text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                            Preview Asset
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-border-subtle bg-bg-tertiary/50 flex items-center justify-end gap-3 border-t p-4">
                    <button
                      onClick={() => handleReject(draft.id)}
                      disabled={isProcessing === draft.id}
                      className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash className="h-4 w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(draft.id)}
                      disabled={isProcessing === draft.id}
                      className="flex items-center gap-2 rounded-md bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:bg-emerald-600 disabled:scale-100 disabled:opacity-50"
                    >
                      {isProcessing === draft.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve & Publish
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
