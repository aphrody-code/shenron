import { env } from "~/lib/env";
import { readCookie, verifySession } from "./session";

/**
 * Auth admin pour les routes protégées de l'API.
 *
 * Deux mécanismes :
 *   1. **Bearer token** (`Authorization: Bearer <API_ADMIN_TOKEN>`) — pour les
 *      clients API externes (curl, autre app, dashboard self-hosted ailleurs).
 *   2. **Cookie session** (`shenron_session=<signed>`) — pour le dashboard SPA
 *      embarqué : posé après /auth/login, vérifié HMAC SHA-256.
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

  // Bearer token
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7).trim();
    if (constantTimeEqual(token, env.API_ADMIN_TOKEN)) return null;
    return Response.json({ error: "Token invalide." }, { status: 401 });
  }

  // Cookie session (dashboard SPA)
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
