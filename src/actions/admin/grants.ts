"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireModerator } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/utils/logger";

const updateGrantSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "not_started",
    "drafting",
    "submitted_pending_review",
    "approved",
    "rejected",
    "accepted_by_program",
  ]),
  phase: z.number().int().min(1).max(3),
});

export async function updateGrantStatus(
  input: z.infer<typeof updateGrantSchema>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireModerator();
    if (!user) return { success: false, error: "Unauthorized" };

    const parsed = updateGrantSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid input" };

    const { id, status, phase } = parsed.data;
    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from("grant_applications")
      .update({
        status,
        phase,
        ...(status === "approved"
          ? { approved_by: user.id, approved_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", id);

    if (updateError) {
      logger.error("Failed to update grant application", { error: updateError, id });
      return { success: false, error: "Failed to update grant application" };
    }

    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "UPDATE_GRANT_APPLICATION",
      entity_type: "grant_applications",
      entity_id: id,
      after_data: { new_status: status, new_phase: phase },
    });

    revalidatePath("/admin/grants");
    revalidatePath("/tr/admin/grants");
    revalidatePath("/de/admin/grants");
    revalidatePath("/fr/admin/grants");
    revalidatePath("/ru/admin/grants");

    return { success: true };
  } catch (error) {
    logger.error("updateGrantStatus error", undefined, error instanceof Error ? error : undefined);
    return { success: false, error: "Internal server error" };
  }
}
