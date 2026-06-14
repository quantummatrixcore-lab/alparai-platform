import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";
export const alt = "ALPAR AI — Incident Audit Report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function IncidentOG({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const db = createAdminClient();

  const { data: incident } = await db
    .from("incidents")
    .select("title_masked, severity, category, ai_provider_id")
    .eq("id", id)
    .maybeSingle();

  if (!incident) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0f1e" }} />,
      { ...size }
    );
  }

  let providerName = "";
  if (incident.ai_provider_id) {
    const { data: provider } = await db
      .from("ai_providers")
      .select("name")
      .eq("id", incident.ai_provider_id)
      .maybeSingle();
    if (provider) {
      providerName = provider.name;
    }
  }

  const severityColors = {
    critical: { bg: "#7f1d1d", text: "#fca5a5" },
    high: { bg: "#7c2d12", text: "#fed7aa" },
    medium: { bg: "#713f12", text: "#fef08a" },
    low: { bg: "#1e3a8a", text: "#bfdbfe" },
  } as const;

  const sev = (incident.severity || "medium").toLowerCase() as keyof typeof severityColors;
  const colors = severityColors[sev] || severityColors.medium;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0A0F1E 0%, #151A2E 100%)",
        color: "white",
        padding: 80,
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#a855f7", letterSpacing: 1 }}>
            ALPAR AI
          </span>
          <span style={{ fontSize: 20, color: "#475569" }}>|</span>
          <span style={{ fontSize: 20, color: "#94a3b8", fontWeight: 500 }}>INCIDENT REPORT</span>
        </div>
        {providerName && (
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#06b6d4",
              background: "rgba(6, 182, 212, 0.1)",
              padding: "6px 16px",
              borderRadius: 20,
              border: "1px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            {providerName}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          marginTop: 40,
          marginBottom: 40,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              background: colors.bg,
              color: colors.text,
              fontSize: 16,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 6,
              textTransform: "uppercase",
            }}
          >
            {incident.severity}
          </div>
          <div
            style={{
              background: "#334155",
              color: "#e2e8f0",
              fontSize: 16,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 6,
              textTransform: "uppercase",
            }}
          >
            {incident.category}
          </div>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.25,
            color: "#ffffff",
            maxWidth: 1040,
          }}
        >
          {incident.title_masked}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          borderTop: "1px solid #1e293b",
          paddingTop: 32,
        }}
      >
        <span style={{ fontSize: 18, color: "#64748b" }}>
          Trust Infrastructure for AI Accountability
        </span>
        <span style={{ fontSize: 20, fontWeight: 600, color: "#94a3b8" }}>alparai.com</span>
      </div>
    </div>,
    { ...size }
  );
}
