import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Secret code appended to the main URL to open admin login.
// e.g. visit  http://localhost:3000/?om77.it@
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || "om77.it@";

// Cookie name used to gate access to /admin/login
const ADMIN_GATE_COOKIE = "admin_gate";

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // ── Secret-code redirect ──────────────────────────────────────────────────
  // Visiting /?om77.it@ sets a short-lived gate cookie and redirects to login.
  if (searchParams.has(ADMIN_SECRET_CODE)) {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.set(ADMIN_GATE_COOKIE, "1", {
      httpOnly: true,
      sameSite: "strict",
      path: "/admin",
      maxAge: 60 * 10, // 10 minutes — enough to log in
    });
    return res;
  }

  // ── Protect /admin/login ──────────────────────────────────────────────────
  // Block direct URL access; only allow if the gate cookie is present
  // OR the user already has a valid admin session.
  if (pathname === "/admin/login") {
    const hasGate = req.cookies.has(ADMIN_GATE_COOKIE);
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!hasGate && !session) {
      // Silently return 404 so the route is invisible
      return new NextResponse(null, { status: 404 });
    }
  }

  // ── Protect /admin/dashboard/* routes ────────────────────────────────────
  if (pathname.startsWith("/admin/dashboard")) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes so secret-code redirect works everywhere,
    // but skip Next.js internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
