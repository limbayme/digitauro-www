import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nextUrl = request.nextUrl.clone();
  const preservedStaticPages = new Set([
    "/01_internal_overview.html",
    "/02_sell_tool_external.html",
    "/03_sell_video_external.html",
    "/04_sell_api_external.html",
    "/services.html"
  ]);

  if (preservedStaticPages.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/index.html") {
    nextUrl.pathname = "/";
    return NextResponse.rewrite(nextUrl);
  }

  const insightMatch = pathname.match(/^\/insights\/([^/]+)\.html$/);
  if (insightMatch) {
    nextUrl.pathname = `/insights/${insightMatch[1]}`;
    return NextResponse.rewrite(nextUrl);
  }

  const topLevelMatch = pathname.match(/^\/([^/]+)\.html$/);
  if (topLevelMatch) {
    nextUrl.pathname = `/${topLevelMatch[1]}`;
    return NextResponse.rewrite(nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"]
};
