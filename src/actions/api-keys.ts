"use server";

import { getCurrentUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

interface DbApiKeyRow {
  provider: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

export async function getApiKeys() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "ceo")) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await (
      admin as unknown as {
        from: (name: string) => {
          select: (cols: string) => {
            order: (col: string) => Promise<{ data: DbApiKeyRow[] | null; error: unknown }>;
          };
        };
      }
    )
      .from("api_keys")
      .select("provider, api_key, created_at, updated_at")
      .order("provider");

    if (error) throw error;

    // Mask the API keys before returning to the client
    const masked = (data ?? []).map((row) => {
      const key = row.api_key;
      let maskedKey = "••••";
      if (key && key.length > 8) {
        maskedKey = `${key.slice(0, 4)}••••${key.slice(-4)}`;
      }
      return {
        provider: row.provider,
        api_key: maskedKey,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return { ok: true, data: masked };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch keys";
    return { ok: false, error: msg };
  }
}

export async function saveApiKey(provider: string, apiKey: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "ceo")) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  if (!provider || !apiKey) {
    return { ok: false, error: "Provider and API Key are required." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await (
      admin as unknown as {
        from: (name: string) => {
          upsert: (values: Record<string, unknown>) => Promise<{ error: unknown }>;
        };
      }
    )
      .from("api_keys")
      .upsert({
        provider: provider.toLowerCase(),
        api_key: apiKey,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    revalidatePath("/admin/api-keys");
    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save key";
    return { ok: false, error: msg };
  }
}

export async function deleteApiKey(provider: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "ceo")) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  try {
    const admin = createAdminClient();
    const { error } = await (
      admin as unknown as {
        from: (name: string) => {
          delete: () => {
            eq: (col: string, val: string) => Promise<{ error: unknown }>;
          };
        };
      }
    )
      .from("api_keys")
      .delete()
      .eq("provider", provider.toLowerCase());

    if (error) throw error;

    revalidatePath("/admin/api-keys");
    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete key";
    return { ok: false, error: msg };
  }
}
