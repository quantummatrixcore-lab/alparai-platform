"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { checkRateLimit, RATE_LIMIT_KEYS } from "@/lib/utils/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";

export interface WaitlistState {
  ok: boolean;
  error?: string;
  formError?: string;
  fieldErrors?: Record<string, string[]>;
}

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  try {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Rate limiting
    const rl = await checkRateLimit(`${RATE_LIMIT_KEYS.contact_submission}:${ip}`);
    if (!rl.ok) {
      return { ok: false, formError: `Too many requests. Try again in ${rl.retryAfter}s.` };
    }

    const raw = {
      email: String(formData.get("email") ?? "").trim(),
    };

    const parsed = waitlistSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const supabase = createAdminClient();

    // Check if email already registered in waitlist or email preferences
    const { data: existing } = await supabase
      .from("email_preferences")
      .select("id")
      .eq("email", parsed.data.email)
      .maybeSingle();

    if (existing) {
      return { ok: true };
    }

    // Insert waitlist entry
    const { error } = await supabase.from("email_preferences").insert({
      email: parsed.data.email,
      marketing_opt_in: true,
      source: "waitlist",
      weekly_digest: true,
      watches: true,
      reporter_notifications: true,
    });

    if (error) {
      logger.error(
        "[joinWaitlist] Database error",
        undefined,
        error instanceof Error ? error : undefined,
      );
      return { ok: false, formError: "Failed to join the waitlist. Please try again." };
    }

    return { ok: true };
  } catch (e) {
    logger.error(
      "[joinWaitlist] Unhandled exception",
      undefined,
      e instanceof Error ? e : undefined,
    );
    return { ok: false, formError: "An unexpected error occurred. Please try again." };
  }
}
