"use server";

import { z } from "zod";
import { APP_EMAIL } from "@/lib/constants";
import { getResendClient } from "@/lib/email/resend";
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
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters"),
  institution: z
    .string()
    .min(2, "Institution must be at least 2 characters")
    .max(100, "Institution must be at most 100 characters"),
  expertiseArea: z.enum(
    ["legal", "medical", "cybersecurity", "research", "ethics", "policy", "other"],
    {
      errorMap: () => ({ message: "Please select a valid area of expertise" }),
    },
  ),
  linkedinUrl: z.string().url("Please provide a valid LinkedIn URL").optional().or(z.literal("")),
  email: z.string().email("Please provide a valid email address").max(200),
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
  title: string;
  institution: string;
  expertiseArea: string;
  linkedinUrl?: string;
  email: string;
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
      title_institution: `${data.title} - ${data.institution}`,
      expertise: data.expertiseArea, // Note: legacy column used to store the dropdown value
      linkedin_url: data.linkedinUrl || null,
      email: data.email,
      expertise_area: data.expertiseArea,
      status: "pending",
    } as never);
    if (dbError) {
      console.error("[submitExpert] Database insert failed:", dbError);
      return { kind: "retryable", error: dbError.message };
    }
  } catch (dbEx) {
    console.error("[submitExpert] Database exception:", dbEx);
    return { kind: "retryable", error: dbEx instanceof Error ? dbEx.message : "db_error" };
  }

  const resend = getResendClient();
  if (!resend) {
    return { kind: "success", value: { sent: true, channel: "log" } };
  }
  try {
    await resend.emails.send({
      from: `ALPAR AI Expert Panel <${APP_EMAIL}>`,
      to: APP_EMAIL,
      subject: `[Expert Panel Application] ${data.name}`,
      text: `Expert Panel Application:\n\nName: ${data.name}\nEmail: ${data.email}\nTitle: ${data.title}\nInstitution: ${data.institution}\nArea of Expertise: ${data.expertiseArea}\nLinkedIn: ${data.linkedinUrl || "N/A"}\n\n--\nIP Hash: ${hashIp(data.ip)}`,
      html: `
        <h2>Expert Panel Application</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>Institution:</strong> ${data.institution}</p>
        <p><strong>Area of Expertise:</strong> ${data.expertiseArea}</p>
        <p><strong>LinkedIn:</strong> ${data.linkedinUrl ? `<a href="${data.linkedinUrl}" target="_blank" rel="noopener noreferrer">${data.linkedinUrl}</a>` : "N/A"}</p>
        <hr/>
        <p style="font-size: 11px; color: #666;">IP Hash: ${hashIp(data.ip)}</p>
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
  try {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const userAgent = hdrs.get("user-agent") ?? "unknown";

    const rl = await checkRateLimit(`${RATE_LIMIT_KEYS.expert_application}:${ip}`);
    if (!rl.ok) {
      return { ok: false, formError: `Too many submissions. Try again in ${rl.retryAfter}s.` };
    }

    const raw = {
      name: String(formData.get("name") ?? ""),
      title: String(formData.get("title") ?? ""),
      institution: String(formData.get("institution") ?? ""),
      expertiseArea: String(formData.get("expertiseArea") ?? ""),
      linkedinUrl: formData.get("linkedinUrl") ? String(formData.get("linkedinUrl")) : undefined,
      email: String(formData.get("email") ?? ""),
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
        parsed.data.title,
        parsed.data.institution,
        parsed.data.expertiseArea,
        parsed.data.linkedinUrl || "",
        parsed.data.email,
      ],
      (ctx) =>
        runExpertWork(ctx, {
          name: parsed.data.name,
          title: parsed.data.title,
          institution: parsed.data.institution,
          expertiseArea: parsed.data.expertiseArea,
          linkedinUrl: parsed.data.linkedinUrl,
          email: parsed.data.email,
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
  } catch (e) {
    console.error("[submitExpert] Unhandled exception:", e);
    return { ok: false, formError: "An unexpected error occurred. Please try again." };
  }
}
