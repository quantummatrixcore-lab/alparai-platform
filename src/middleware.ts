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
  return await updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, API routes, and auth callback (Supabase OAuth needs raw query params)
    "/((?!api|_next|_vercel|auth/callback|.*\\..*).*)",
  ],
};
