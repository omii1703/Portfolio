import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me-in-env-local"
);

export const SESSION_COOKIE_NAME = "portfolio_admin_session";

export async function signSessionToken(payload: { role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<{ role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { role: string };
  } catch {
    return null;
  }
}

export async function verifyPassword(plain: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add ADMIN_PASSWORD=yourpassword to .env.local"
    );
  }
  // Trim both sides to guard against copy-paste whitespace
  return plain.trim() === password.trim();
}
