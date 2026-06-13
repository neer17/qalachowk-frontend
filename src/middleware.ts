import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COMING_SOON_PATH = "/coming-soon";

const EXEMPT_PATHS = new Set([
  COMING_SOON_PATH,
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
]);

const ASSET_EXT_RE =
  /\.(?:ico|png|jpe?g|gif|svg|webp|avif|woff2?|ttf|otf|css|js|map|mp4|webm|json|xml|txt)$/i;

export function middleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_COMING_SOON_MODE !== "true") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (
    EXEMPT_PATHS.has(pathname) ||
    pathname.startsWith(COMING_SOON_PATH) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    ASSET_EXT_RE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = COMING_SOON_PATH;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
