import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Build the Content-Security-Policy header value with a per-request nonce.
 * - script-src uses nonce instead of unsafe-inline / unsafe-eval
 * - style-src keeps unsafe-inline (required by Framer Motion runtime styles)
 */
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export default function middleware(request: NextRequest) {
  // Generate a cryptographic nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Set nonce on request headers so server components can read it via headers()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // Run next-intl middleware
  const intlResponse = intlMiddleware(request);

  // If next-intl returns a redirect or rewrite, copy CSP onto that response
  if (intlResponse.headers.has("location") || intlResponse.status !== 200) {
    intlResponse.headers.set("Content-Security-Policy", buildCsp(nonce));
    intlResponse.headers.set("x-nonce", nonce);
    return intlResponse;
  }

  // For normal responses, create a new response that passes nonce via request headers
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Copy next-intl headers (locale cookie, etc.) onto our response
  intlResponse.headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  // Set CSP on response
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: ["/", "/(en|vi)/:path*"],
};
