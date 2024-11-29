import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/uat")) {
    return NextResponse.redirect("https://forms.gle/Fi4yYUNKPo9RnUB78");
  }

  if (request.nextUrl.pathname.startsWith("/iso")) {
    return NextResponse.redirect("https://forms.gle/gYz3X6tpabCC6JzR7");
  }
}
