/**
 * Auth helpers — get current user, role checks, etc.
 */

import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/types";
import type { Database } from "@/types/database";

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  type UserProfile = Omit<Database["public"]["Tables"]["users"]["Row"], "email">;

  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, avatar_url, role, is_verified, created_at")
    .eq("id", user.id)
    .single<UserProfile>();

  if (!profile) return null;

  return {
    id: profile.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    role: profile.role,
    isVerified: profile.is_verified,
    createdAt: profile.created_at,
  };
});

export async function isModerator(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "moderator" || user?.role === "admin" || user?.role === "ceo";
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin" || user?.role === "ceo";
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireModerator(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "moderator" && user.role !== "admin" && user.role !== "ceo") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin" && user.role !== "ceo") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireCEO(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ceo" && user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireAdvisor(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "advisor" && user.role !== "ceo" && user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
