import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "@/i18n/routing";
import { logger } from "@/lib/utils/logger";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  if (request.headers.has("next-action")) {
    return NextResponse.next();
  }

  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/api/")) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
        },
      },
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const locale = request.cookies.get("NEXT_LOCALE")?.value ?? "en";
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
    }
  }

  const requestWithId = new NextRequest(request, {
    headers: requestHeaders,
  });

  let intlResponse: NextResponse;
  try {
    intlResponse = intlMiddleware(requestWithId);
  } catch (err) {
    logger.error(
      "[middleware] intlMiddleware threw",
      undefined,
      err instanceof Error ? err : undefined,
    );
    return NextResponse.next();
  }

  let response: NextResponse;
  try {
    response = await updateSession(requestWithId, intlResponse);
  } catch (err) {
    logger.error(
      "[middleware] updateSession threw",
      undefined,
      err instanceof Error ? err : undefined,
    );
    response = intlResponse;
  }

  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|auth/callback|.*\\..*).*)"],
};
