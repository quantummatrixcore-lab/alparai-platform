import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/i18n/routing";
import { logger } from "@/lib/utils/logger";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Server actions use POST with a Next-Action header.
  // Skip intl middleware + session refresh for action POSTs to avoid
  // redirects or cookie mutations that break the action response.
  if (request.headers.has("next-action")) {
    return NextResponse.next();
  }

  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const requestWithId = new NextRequest(request, {
    headers: requestHeaders,
  });

  let intlResponse;
  try {
    intlResponse = intlMiddleware(requestWithId);
  } catch (err) {
    logger.error("[proxy] intlMiddleware threw", undefined, err instanceof Error ? err : undefined);
    return NextResponse.next();
  }

  let response;
  try {
    response = await updateSession(requestWithId, intlResponse);
  } catch (err) {
    logger.error("[proxy] updateSession threw", undefined, err instanceof Error ? err : undefined);
    response = intlResponse;
  }

  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, API routes, and auth callback (Supabase OAuth needs raw query params)
    "/((?!api|_next|_vercel|auth/callback|.*\\..*).*)",
  ],
};
