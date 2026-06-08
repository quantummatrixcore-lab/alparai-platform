"use server";

import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function submitVote(
  pollId: string,
  choice: "yes" | "no" | "unsure",
  turnstileToken: string
) {
  try {
    // 1. Verify Turnstile (skip in dev unless configured)
    if (process.env.NODE_ENV === "production" || process.env.TURNSTILE_SECRET_KEY) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA"}&response=${turnstileToken}`,
      });

      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return { error: "Bot verification failed." };
      }
    }

    const supabase = await createServerClient();
    const headersList = await headers();
    const rawIp = headersList.get("x-forwarded-for") || "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(rawIp).digest("hex");

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const supabaseAdmin = createAdminClient();

    // 2. Insert vote into ai_poll_votes using admin to bypass RLS on insert if needed
    // But votes should be insertable by authenticated users or anon via admin
    const { error: voteError } = await supabaseAdmin.from("ai_poll_votes").insert({
      poll_id: pollId,
      user_id: userId || null,
      ip_hash: ipHash,
      choice,
    });

    if (voteError) {
      if (voteError.code === "23505") {
        // unique violation
        return { error: "You have already voted on this dilemma." };
      }
      console.error("Vote error:", voteError);
      return { error: "Failed to record vote." };
    }

    // 3. Increment the count on ai_polls table
    // We fetch current count and increment. (RPC is better, but this works for now)
    const { data: poll } = await supabaseAdmin
      .from("ai_polls")
      .select("yes_count, no_count, unsure_count")
      .eq("id", pollId)
      .single();

    if (poll) {
      const updates: { yes_count?: number; no_count?: number; unsure_count?: number } = {};
      if (choice === "yes") updates.yes_count = poll.yes_count + 1;
      if (choice === "no") updates.no_count = poll.no_count + 1;
      if (choice === "unsure") updates.unsure_count = poll.unsure_count + 1;

      await supabaseAdmin.from("ai_polls").update(updates).eq("id", pollId);
    }

    // 4. Gamification (Badges)
    let awardedBadge = null;
    let badgeIcon = null;
    if (userId) {
      const badgeName =
        choice === "yes"
          ? "Kıyamet Hazırlıkçısı"
          : choice === "no"
            ? "Teknoloji İyimseri"
            : "Gözlemci";
      badgeIcon = choice === "yes" ? "🛡️" : choice === "no" ? "🌟" : "👁️";

      const { error: badgeError } = await supabaseAdmin.from("user_badges").insert({
        user_id: userId,
        badge_name: badgeName,
        badge_icon: badgeIcon,
        description: `"${choice.toUpperCase()}" oyu vererek bu rozeti kazandınız.`,
      });

      if (!badgeError) {
        awardedBadge = badgeName;
        
        // Also update the users table to add reputation points and the badge to the array
        const { data: userRecord } = await supabaseAdmin
          .from("users")
          .select("reputation_score, badges")
          .eq("id", userId)
          .single();
          
        if (userRecord) {
          const newReputation = (userRecord.reputation_score || 0) + 10;
          const currentBadges = userRecord.badges || [];
          
          if (!currentBadges.includes(badgeName)) {
            currentBadges.push(badgeName);
          }
          
          await supabaseAdmin
            .from("users")
            .update({ 
              reputation_score: newReputation,
              badges: currentBadges
            })
            .eq("id", userId);
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/dilemmas");

    return { success: true, awardedBadge, badgeIcon };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return { error: "An unexpected error occurred." };
  }
}
