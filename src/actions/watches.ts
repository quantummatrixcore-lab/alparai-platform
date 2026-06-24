/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { requireUser, getCurrentUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function watchProvider(providerId: string): Promise<{ success: boolean }> {
  const user = await requireUser();
  const supabase = (await createServerClient()) as any;
  const { error } = await supabase.from("user_provider_watches").insert({
    user_id: user.id,
    provider_id: providerId,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/feed");
  return { success: true };
}

export async function unwatchProvider(providerId: string): Promise<{ success: boolean }> {
  const user = await requireUser();
  const supabase = (await createServerClient()) as any;
  const { error } = await supabase
    .from("user_provider_watches")
    .delete()
    .eq("user_id", user.id)
    .eq("provider_id", providerId);
  if (error) throw new Error(error.message);
  revalidatePath("/feed");
  return { success: true };
}

export async function getWatchedProviders(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = (await createServerClient()) as any;
  const { data, error } = await supabase
    .from("user_provider_watches")
    .select("provider_id")
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  return (data || []).map((row: any) => row.provider_id);
}
