import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 600; // 10 min cache

interface CsvIncidentRow {
  id: string;
  title?: string;
  description?: string;
  vendor?: string;
  severity?: string;
  created_at?: string;
  source_url?: string;
}

export async function GET() {
  const admin = createAdminClient();
  const db = admin as unknown as {
    from: (table: string) => {
      select: (cols: string) => {
        eq: (col: string, val: boolean) => {
          order: (col: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: CsvIncidentRow[] | null; error: { message: string } | null }>;
          };
        };
      };
    };
  };

  const { data, error } = await db
    .from("incidents")
    .select("id, title, description, vendor, severity, created_at, source_url")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error || !data) {
    return new NextResponse("Error generating CSV", { status: 500 });
  }

  const headers = ["id", "title", "vendor", "severity", "created_at", "source_url", "description"];
  const rows = data.map((item) => [
    `"${item.id}"`,
    `"${(item.title || "").replace(/"/g, '""')}"`,
    `"${(item.vendor || "").replace(/"/g, '""')}"`,
    `"${item.severity || ""}"`,
    `"${item.created_at || ""}"`,
    `"${(item.source_url || "").replace(/"/g, '""')}"`,
    `"${(item.description || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="alparai-incidents.csv"',
      "Cache-Control": "public, max-age=600, s-maxage=1200",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
