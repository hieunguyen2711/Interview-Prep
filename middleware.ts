import type { NextRequest } from "next/server";

// Auth0 middleware disabled - using simple authentication instead
// import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  // Simple middleware that just passes through requests
  // No authentication middleware needed for simple auth system
  return;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - api (API routes)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|api|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};
