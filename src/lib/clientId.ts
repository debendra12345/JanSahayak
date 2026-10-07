import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "jansahayak_client_id";

/**
 * Returns a stable per-browser client id (no login required) so saved
 * schemes and application tracking persist across visits during the demo.
 */
export async function getOrCreateClientId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return id;
}
