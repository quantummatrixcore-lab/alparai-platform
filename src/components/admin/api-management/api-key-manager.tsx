"use client";

import React, { useState } from "react";
import { Copy, Eye, EyeOff, Trash2, RotateCw, Plus } from "lucide-react";
import type { Provider } from "./api-hub";

interface ApiKey {
  id: string;
  providerId: string;
  keyName: string;
  maskedKey: string;
  fullKey: string;
  status: "active" | "inactive";
  createdAt: string;
  lastUsed: string;
  requestCount: number;
}

const MOCK_API_KEYS: ApiKey[] = [
  {
    id: "key_1",
    providerId: "openai",
    keyName: "Production API Key",
    maskedKey: "sk-****...BJ9D",
    fullKey: "sk-proj-abcdefghijklmnopqrstuvwxyzBJ9D",
    status: "active",
    createdAt: "2026-01-15",
    lastUsed: "2 minutes ago",
    requestCount: 4250000,
  },
  {
    id: "key_2",
    providerId: "anthropic",
    keyName: "Claude API Key",
    maskedKey: "sk-ant-****...4x2F",
    fullKey: "sk-ant-abcdefghijklmnopqrstuvwxyz4x2F",
    status: "active",
    createdAt: "2026-02-01",
    lastUsed: "Just now",
    requestCount: 8920000,
  },
  {
    id: "key_3",
    providerId: "google",
    keyName: "Gemini API Key",
    maskedKey: "AIza****...kA7X",
    fullKey: "AIzaSyAbcdefghijklmnopqrstuvwxyzKA7X",
    status: "active",
    createdAt: "2026-03-10",
    lastUsed: "1 hour ago",
    requestCount: 2400,
  },
  {
    id: "key_4",
    providerId: "openai",
    keyName: "Staging API Key",
    maskedKey: "sk-****...mP2K",
    fullKey: "sk-proj-abcdefghijklmnopqrstuvwxyzmP2K",
    status: "inactive",
    createdAt: "2025-12-20",
    lastUsed: "15 days ago",
    requestCount: 125000,
  },
];

export function ApiKeyManager({ providers }: { providers: Provider[] }) {
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_API_KEYS);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCopyKey = (keyId: string, fullKey: string) => {
    navigator.clipboard.writeText(fullKey);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleRotateKey = (keyId: string) => {
    const today = new Date().toISOString().split("T")[0] as string;
    setKeys(
      keys.map((k) => (k.id === keyId ? { ...k, createdAt: today, lastUsed: "Just now" } : k)),
    );
  };

  const handleDeleteKey = (keyId: string) => {
    setKeys(keys.filter((k) => k.id !== keyId));
  };

  const getProviderName = (providerId: string) => {
    return providers.find((p) => p.id === providerId)?.name || "Unknown";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">Manage API credentials for all integrated providers</p>
        <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/10">
          <Plus className="h-3.5 w-3.5" />
          Add Key
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-800/50">
                <th className="px-6 py-3 text-left font-semibold text-white">Provider</th>
                <th className="px-6 py-3 text-left font-semibold text-white">Key Name</th>
                <th className="px-6 py-3 text-left font-semibold text-white">API Key</th>
                <th className="px-6 py-3 text-left font-semibold text-white">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-white">Created</th>
                <th className="px-6 py-3 text-left font-semibold text-white">Last Used</th>
                <th className="px-6 py-3 text-center font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr
                  key={key.id}
                  className="border-b border-white/5 transition-colors hover:bg-zinc-800/30"
                >
                  <td className="px-6 py-3 text-zinc-300">{getProviderName(key.providerId)}</td>
                  <td className="px-6 py-3 font-medium text-white">{key.keyName}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-black/40 px-2 py-1 font-mono text-xs text-zinc-400">
                        {visibleKeyId === key.id ? key.fullKey : key.maskedKey}
                      </code>
                      <button
                        onClick={() => setVisibleKeyId(visibleKeyId === key.id ? null : key.id)}
                        className="text-zinc-400 transition-colors hover:text-white"
                        title="Toggle visibility"
                      >
                        {visibleKeyId === key.id ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopyKey(key.id, key.fullKey)}
                        className="text-zinc-400 transition-colors hover:text-white"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {copiedKeyId === key.id && (
                        <span className="animate-pulse text-xs text-emerald-400">Copied!</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        key.status === "active"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-zinc-500/20 text-zinc-400"
                      }`}
                    >
                      {key.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-zinc-400">{key.createdAt}</td>
                  <td className="px-6 py-3 text-xs text-zinc-400">{key.lastUsed}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleRotateKey(key.id)}
                        className="text-zinc-400 transition-colors hover:text-amber-400"
                        title="Rotate key"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="text-zinc-400 transition-colors hover:text-red-400"
                        title="Delete key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {keys.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-12 text-center">
          <p className="text-zinc-400">No API keys configured yet</p>
          <button className="bg-brand-400/20 text-brand-300 hover:bg-brand-400/30 mt-4 rounded-lg px-4 py-2 text-sm font-semibold transition-colors">
            Add Your First Key
          </button>
        </div>
      )}
    </div>
  );
}
