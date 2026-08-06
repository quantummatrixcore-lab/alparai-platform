import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    const validKey = process.env.PUBLIC_API_KEY || "alparai-public-api-token"; // Basic check

    if (!apiKey || apiKey !== validKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Getting approved incidents
    const { data: incidents, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 });
    }

    return NextResponse.json({
      data: incidents,
      count: incidents?.length || 0,
    });
  } catch (_err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS(_request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    },
  });
}
