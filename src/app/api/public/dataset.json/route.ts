import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 600; // 10 min cache

interface DatasetItem {
  id: string;
  title: string;
  description: string;
  vendor: string;
  severity: string;
  created_at: string;
  published_at?: string;
  source_url?: string;
}

export async function GET() {
  const admin = createAdminClient();
  const db = admin as unknown as {
    from: (table: string) => {
      select: (cols: string) => {
        eq: (col: string, val: boolean) => {
          order: (col: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: DatasetItem[] | null; error: { message: string } | null }>;
          };
        };
      };
    };
  };

  const { data, error } = await db
    .from("incidents")
    .select("id, title, description, vendor, severity, created_at, published_at, source_url")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error || !data) {
    return NextResponse.json({ error: "Failed to generate dataset" }, { status: 500 });
  }

  return NextResponse.json(
    {
      dataset_name: "ALPAR AI Registry Open Dataset",
      version: "1.0",
      license: "AGPL-3.0",
      exported_at: new Date().toISOString(),
      record_count: data.length,
      incidents: data,
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=600, s-maxage=1200",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
