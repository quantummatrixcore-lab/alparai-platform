import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 300; // 5 min cache

interface PublicIncidentItem {
  id: string;
  title: string;
  description: string;
  vendor: string;
  severity: string;
  created_at: string;
  published_at?: string;
  source_url?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const vendor = searchParams.get("vendor");
  const offset = (page - 1) * limit;

  const admin = createAdminClient();
  const db = admin as unknown as {
    from: (table: string) => {
      select: (cols: string, opts: { count: string }) => {
        eq: (col: string, val: boolean) => {
          order: (col: string, opts: { ascending: boolean }) => {
            range: (from: number, to: number) => Promise<{ data: PublicIncidentItem[] | null; count: number | null; error: { message: string } | null }>;
            ilike?: (col: string, pattern: string) => {
              order: (col: string, opts: { ascending: boolean }) => {
                range: (from: number, to: number) => Promise<{ data: PublicIncidentItem[] | null; count: number | null; error: { message: string } | null }>;
              };
            };
          };
        };
      };
    };
  };

  try {
    const { data, count, error } = await db
      .from("incidents")
      .select("id, title, description, vendor, severity, created_at, published_at, source_url", { count: "exact" })
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch public incidents" }, { status: 500 });
    }

    return NextResponse.json(
      {
        page,
        limit,
        total: count || 0,
        incidents: data || [],
        license: "AGPL-3.0 / Open Data",
        api_version: "v1-public",
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=600",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch public incidents" }, { status: 500 });
  }
}
