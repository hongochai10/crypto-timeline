import { NextRequest } from "next/server";
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

  // Create a new request with the nonce header before passing to next-intl
  const requestWithNonce = new NextRequest(request, {
    headers: requestHeaders,
  });

  // Run next-intl middleware with the nonce-enriched request
  const response = intlMiddleware(requestWithNonce);

  // Set CSP and nonce on the response (works for redirects, rewrites, and pass-throughs)
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: ["/", "/(en|vi)/:path*"],
};
