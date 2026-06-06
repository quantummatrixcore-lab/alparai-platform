/**
 * Next.js middleware — combines i18n routing + Supabase session refresh.
 */

import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Internationalization routing
  const intlResponse = intlMiddleware(request);

  // 2. Supabase session refresh
  const supabaseResponse = await updateSession(request);

  // Merge cookies from both middleware layers
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie);
  });
  intlResponse.cookies.getAll().forEach((cookie) => {
    if (!supabaseResponse.cookies.has(cookie.name)) {
      supabaseResponse.cookies.set(cookie);
    }
  });

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, API routes (handled separately)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
