import { env } from "~/lib/env";
import { getBetterAuthSession } from "~/lib/better-auth";
import { readCookie, verifySession } from "./session";

/**
 * Auth admin pour les routes protégées de l'API.
 *
 * Trois mécanismes :
 *   1. **Bearer token** (`Authorization: Bearer <API_ADMIN_TOKEN>`) — clients API.
 *   2. **Better Auth** (`shenron_ba_session_token` cookie + DB ba_session) —
 *      flow OAuth Discord moderne, geré par /api/auth/* (Better Auth handler).
 *   3. **Cookie session HMAC** (`shenron_session=<signed>`) — flow legacy
 *      `/auth/login` (token) ou `/auth/discord` (manuel).
 *
 * Si aucun ne match → 401.
 */
export async function checkAdmin(req: Request): Promise<Response | null> {
  if (!env.API_ADMIN_TOKEN) {
    return Response.json(
      { error: "API_ADMIN_TOKEN non configuré côté bot — route admin désactivée." },
      { status: 503 },
    );
  }

  // 1. Bearer token
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7).trim();
    if (constantTimeEqual(token, env.API_ADMIN_TOKEN)) return null;
    return Response.json({ error: "Token invalide." }, { status: 401 });
  }

  // 2. Better Auth (cookie BA + DB session)
  const baSession = await getBetterAuthSession(req);
  if (baSession?.user) return null;

  // 3. Cookie session HMAC legacy
  const sessionCookie = readCookie(req, "shenron_session");
  const session = await verifySession(sessionCookie);
  if (session) return null;

  return Response.json({ error: "Authorization requise." }, { status: 401 });
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export { constantTimeEqual };
