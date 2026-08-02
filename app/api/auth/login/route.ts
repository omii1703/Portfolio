import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Basic in-memory rate limiting to slow down brute-force attempts.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 20; // generous limit for dev

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const now = Date.now();
  const record = attempts.get(ip);

  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const password: string = (body.password ?? "").trim();

  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  let valid = false;
  try {
    valid = await verifyPassword(password);
  } catch (err) {
    console.error("[auth] verifyPassword error:", err);
    return NextResponse.json(
      { error: "Server auth is not configured. See README." },
      { status: 500 }
    );
  }

  if (!valid) {
    const next =
      record && record.resetAt > now
        ? { count: record.count + 1, resetAt: record.resetAt }
        : { count: 1, resetAt: now + WINDOW_MS };
    attempts.set(ip, next);
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  attempts.delete(ip);

  const token = await signSessionToken({ role: "admin" });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
