import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import JSZip from "jszip";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    const userId = user.id;
    const adminClient = createAdminClient();

    const [profileRes, incidentsRes, commentsRes, votesRes, appsRes] = await Promise.all([
      adminClient.from("profiles").select("*").eq("id", userId).maybeSingle(),
      adminClient.from("incidents").select("*").eq("user_id", userId),
      adminClient.from("incident_comments").select("*").eq("user_id", userId),
      adminClient.from("incident_votes").select("*").eq("user_id", userId),
      adminClient.from("expert_applications").select("*").eq("id", userId),
    ]);

    const zip = new JSZip();

    const meta = {
      export_meta: {
        platform: "ALPAR AI",
        legal_basis: "GDPR Article 20 / KVKK Article 11 Data Portability",
        generated_at: new Date().toISOString(),
        user_id: userId,
      },
      profile: profileRes.data || null,
    };
    zip.file("profile.json", JSON.stringify(meta, null, 2));
    zip.file("incidents.json", JSON.stringify(incidentsRes.data || [], null, 2));
    zip.file("comments.json", JSON.stringify(commentsRes.data || [], null, 2));
    zip.file("votes.json", JSON.stringify(votesRes.data || [], null, 2));
    zip.file("expert_applications.json", JSON.stringify(appsRes.data || [], null, 2));

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="alpar-ai-portable-${userId}.zip"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("DSAR Portable API Error", undefined, error instanceof Error ? error : undefined);
    return NextResponse.json({ error: "internal_error", message }, { status: 500 });
  }
}
