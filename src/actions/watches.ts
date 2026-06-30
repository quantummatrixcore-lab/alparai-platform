"use server";

import { createServerClient } from "@/lib/supabase/server";
import { requireUser, getCurrentUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function watchProvider(providerId: string): Promise<{ success: boolean }> {
  const user = await requireUser();
  const supabase = await createServerClient();
  const { error } = await supabase.from("user_provider_watches" as never).insert({
    user_id: user.id,
    provider_id: providerId,
  } as never);
  if (error) throw new Error(error.message);
  revalidatePath("/feed");
  return { success: true };
}

export async function unwatchProvider(providerId: string): Promise<{ success: boolean }> {
  const user = await requireUser();
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("user_provider_watches" as never)
    .delete()
    .eq("user_id" as never, user.id as never)
    .eq("provider_id" as never, providerId as never);
  if (error) throw new Error(error.message);
  revalidatePath("/feed");
  return { success: true };
}

export async function getWatchedProviders(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("user_provider_watches" as never)
    .select("provider_id" as never)
    .eq("user_id" as never, user.id as never);
  if (error) throw new Error(error.message);
  const rows = data as unknown as { provider_id: string }[] | null;
  return (rows || []).map((row) => row.provider_id);
}
