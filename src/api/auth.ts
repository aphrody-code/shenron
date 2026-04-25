import { env } from "~/lib/env";

/**
 * Auth bearer pour les routes admin de l'API. Équivalent de
 * `DevAuthenticated` côté tscord, simplifié : pas de token Discord live, juste
 * un bearer statique partagé via `API_ADMIN_TOKEN`.
 *
 * Utilisation :
 *   const authError = checkAdmin(req);
 *   if (authError) return authError;
 *   // ... handler protégé
 */
export function checkAdmin(req: Request): Response | null {
  if (!env.API_ADMIN_TOKEN) {
    return Response.json(
      { error: "API_ADMIN_TOKEN non configuré côté bot — route admin désactivée." },
      { status: 503 },
    );
  }
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return Response.json({ error: "Authorization Bearer manquant." }, { status: 401 });
  }
  const token = auth.slice(7).trim();
  // Comparaison constant-time pour éviter un timing attack trivial.
  if (!constantTimeEqual(token, env.API_ADMIN_TOKEN)) {
    return Response.json({ error: "Token invalide." }, { status: 401 });
  }
  return null;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
