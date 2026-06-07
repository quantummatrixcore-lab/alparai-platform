import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const SAFE_NEXT_PATH = /^\/[a-zA-Z0-9_\-/]*$/;

function safeNextPath(raw: string | null): string {
  if (!raw) return "/profile";
  if (!raw.startsWith("/")) return "/profile";
  if (raw.startsWith("//") || raw.startsWith("/\\")) return "/profile";
  if (raw.includes(":")) return "/profile";
  if (!SAFE_NEXT_PATH.test(raw)) return "/profile";
  if (raw.length > 200) return "/profile";
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));
  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/auth/signin?error=oauth`);
}
