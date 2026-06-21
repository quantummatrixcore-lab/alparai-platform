/**
 * Next.js proxy — combines i18n routing + Supabase session refresh.
 */

import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  const requestWithId = new NextRequest(request, {
    headers: requestHeaders,
  });

  const intlResponse = intlMiddleware(requestWithId);
  const response = await updateSession(requestWithId, intlResponse);
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, API routes, and auth callback (Supabase OAuth needs raw query params)
    "/((?!api|_next|_vercel|auth/callback|.*\\..*).*)",
  ],
};
