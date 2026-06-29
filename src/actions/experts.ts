"use server";

import { z } from "zod";
import { APP_EMAIL } from "@/lib/constants";
import { Resend } from "resend";
import { headers } from "next/headers";
import { withAutopilot, attemptsOf, durationOf } from "@/lib/autopilot";
import type { AttemptContext, AttemptOutcome, AutopilotPolicy } from "@/lib/autopilot";
import { DEFAULT_BREAKER, DEFAULT_IDEMPOTENCY, DEFAULT_RETRY } from "@/lib/autopilot";
import { checkRateLimit, RATE_LIMIT_KEYS } from "@/lib/utils/rate-limit";
import { hashIp } from "@/lib/utils/hash";
import { createAdminClient } from "@/lib/supabase/admin";

export const expertApplicationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  titleInstitution: z
    .string()
    .min(2, "Title/Institution must be at least 2 characters")
    .max(200, "Title/Institution must be at most 200 characters"),
  expertise: z
    .string()
    .min(5, "Expertise must be at least 5 characters")
    .max(500, "Expertise must be at most 500 characters"),
  linkedinUrl: z.string().url("Please provide a valid LinkedIn URL"),
});

export type ExpertApplicationInput = z.infer<typeof expertApplicationSchema>;

export interface ExpertState {
  ok: boolean;
  error?: string;
  formError?: string;
  fieldErrors?: Record<string, string[]>;
  autopilot?: { attempts: number; durationMs: number; kind: string };
}

export const submitExpertPolicy: AutopilotPolicy = {
  config: {
    action: "submitExpert",
    retry: { ...DEFAULT_RETRY, attempts: 3, baseMs: 500, maxMs: 4_000 },
    breaker: { ...DEFAULT_BREAKER, threshold: 12, cooldownMs: 30_000 },
    budget: { maxMs: 6_000, maxTokens: 800 },
    idempotency: { ...DEFAULT_IDEMPOTENCY, enabled: true, hashInputs: true },
    onExhaust: "toast_warn",
    redactionFields: ["password", "token", "secret", "api_key"],
  },
};

interface ExpertWorkInput {
  name: string;
  titleInstitution: string;
  expertise: string;
  linkedinUrl: string;
  ip: string;
  userAgent: string;
}

const runExpertWork = async (
  _ctx: AttemptContext,
  data: ExpertWorkInput,
): Promise<AttemptOutcome<{ sent: boolean; channel: "email" | "log" }>> => {
  try {
    const admin = createAdminClient();
    const { error: dbError } = await admin.from("expert_applications" as never).insert({
      name: data.name,
      title_institution: data.titleInstitution,
      expertise: data.expertise,
      linkedin_url: data.linkedinUrl,
      status: "pending",
    } as never);
    if (dbError) {
      console.error("[submitExpert] Database insert failed:", dbError);
    }
  } catch (dbEx) {
    console.error("[submitExpert] Database exception:", dbEx);
  }

  if (!process.env.RESEND_API_KEY) {
    return { kind: "success", value: { sent: true, channel: "log" } };
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `ALPAR AI Expert Panel <${APP_EMAIL}>`,
      to: APP_EMAIL,
      subject: `[Expert Panel Application] ${data.name}`,
      text: `Expert Panel Application:\n\nName: ${data.name}\nTitle/Institution: ${data.titleInstitution}\nArea of Expertise: ${data.expertise}\nLinkedIn: ${data.linkedinUrl}\n\n--\nIP: ${data.ip}\nUA: ${data.userAgent}`,
      html: `
        <h2>Expert Panel Application</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Title/Institution:</strong> ${data.titleInstitution}</p>
        <p><strong>Area of Expertise:</strong> ${data.expertise}</p>
        <p><strong>LinkedIn:</strong> <a href="${data.linkedinUrl}" target="_blank" rel="noopener noreferrer">${data.linkedinUrl}</a></p>
        <hr/>
        <p style="font-size: 11px; color: #666;">IP: ${data.ip}<br/>User Agent: ${data.userAgent}</p>
      `,
    });
    return { kind: "success", value: { sent: true, channel: "email" } };
  } catch (e) {
    return {
      kind: "retryable",
      error: e instanceof Error ? e.message : "resend_failed",
    };
  }
};

export async function submitExpert(_prev: ExpertState, formData: FormData): Promise<ExpertState> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = hdrs.get("user-agent") ?? "unknown";

  const rl = await checkRateLimit(`${RATE_LIMIT_KEYS.contact_submission}:${ip}`);
  if (!rl.ok) {
    return { ok: false, formError: `Too many submissions. Try again in ${rl.retryAfter}s.` };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    titleInstitution: String(formData.get("titleInstitution") ?? ""),
    expertise: String(formData.get("expertise") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
  };

  const parsed = expertApplicationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const clientIdempotencyKey = hdrs.get("x-idempotency-key");

  const result = await withAutopilot<{ sent: boolean; channel: "email" | "log" }>(
    submitExpertPolicy,
    [
      parsed.data.name,
      parsed.data.titleInstitution,
      parsed.data.expertise,
      parsed.data.linkedinUrl,
    ],
    (ctx) =>
      runExpertWork(ctx, {
        name: parsed.data.name,
        titleInstitution: parsed.data.titleInstitution,
        expertise: parsed.data.expertise,
        linkedinUrl: parsed.data.linkedinUrl,
        ip,
        userAgent,
      }),
    {
      context: {
        userId: null,
        ipHash: hashIp(ip),
        clientIdempotencyKey,
      },
    },
  );

  if (result.kind === "ok" || result.kind === "replayed") {
    return {
      ok: true,
      autopilot: {
        attempts: attemptsOf(result),
        durationMs: durationOf(result),
        kind: result.kind,
      },
    };
  }
  if (result.kind === "circuit_open") {
    return { ok: false, formError: "Service temporarily unavailable. Please try again later." };
  }
  if (result.kind === "budget_exceeded") {
    return { ok: false, formError: "Request timed out. Please try again shortly." };
  }
  if (result.kind === "exhausted") {
    return { ok: false, formError: "Failed to send. Please try again later." };
  }
  return { ok: false, formError: "Unexpected error occurred." };
}
