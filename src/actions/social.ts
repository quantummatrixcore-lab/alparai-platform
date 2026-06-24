/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function getSocialPosts(): Promise<any[]> {
  await requireAdmin();
  const supabase = (await createServerClient()) as any;
  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getSocialTemplates(): Promise<any[]> {
  await requireAdmin();
  const supabase = (await createServerClient()) as any;
  const { data, error } = await supabase.from("social_templates").select("*").order("name");
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getSocialAssets(): Promise<any[]> {
  await requireAdmin();
  const supabase = (await createServerClient()) as any;
  const { data, error } = await supabase
    .from("social_assets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createSocialPost(post: {
  platform: "linkedin" | "x" | "instagram" | "facebook" | "whatsapp";
  status: "draft" | "scheduled" | "published" | "archived";
  content_type:
    | "manifesto"
    | "case_study"
    | "weekly_report"
    | "incident_spotlight"
    | "thread"
    | "poll";
  title: string;
  body_text: string;
  image_prompt?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  hashtags?: string[];
  linked_incident_id?: string | null;
  scheduled_at?: string | null;
  published_at?: string | null;
  external_url?: string | null;
  estimated_reach?: number;
  likes?: number;
  comments_count?: number;
  shares_count?: number;
}) {
  const user = await requireAdmin();
  const supabase = (await createServerClient()) as any;
  const { error } = await supabase.from("social_posts").insert({
    ...post,
    created_by: user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/social", "page");
  return { success: true };
}

export async function updateSocialPost(
  id: string,
  updates: {
    platform?: "linkedin" | "x" | "instagram" | "facebook" | "whatsapp";
    status?: "draft" | "scheduled" | "published" | "archived";
    content_type?:
      | "manifesto"
      | "case_study"
      | "weekly_report"
      | "incident_spotlight"
      | "thread"
      | "poll";
    title?: string;
    body_text?: string;
    image_prompt?: string | null;
    image_url?: string | null;
    video_url?: string | null;
    hashtags?: string[];
    linked_incident_id?: string | null;
    scheduled_at?: string | null;
    published_at?: string | null;
    external_url?: string | null;
    estimated_reach?: number;
    likes?: number;
    comments_count?: number;
    shares_count?: number;
  },
) {
  await requireAdmin();
  const supabase = (await createServerClient()) as any;
  const { error } = await supabase
    .from("social_posts")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/social", "page");
  return { success: true };
}
