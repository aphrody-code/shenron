/**
 * Helpers pour récupérer un access_token Discord valide depuis une session OAuth.
 * Refresh transparent si expiré (skew 60s).
 */

import { logger } from "~/lib/logger";
import { getOAuthConfig, refreshTokens } from "./oauth";
import {
  buildSessionCookie,
  createSession,
  readCookie,
  verifySession,
  type SessionPayload,
} from "./session";

const SKEW_MS = 60_000;

export interface UsableSession {
  payload: SessionPayload;
  /**
   * Si le token a été refresh, ce champ contient un nouveau cookie à attacher en
   * Set-Cookie sur la réponse. Sinon `undefined`.
   */
  refreshedCookie?: string;
}

export async function getDiscordSession(req: Request): Promise<UsableSession | null> {
  const cookie = readCookie(req, "shenron_session");
  const payload = await verifySession(cookie);
  if (!payload || payload.source !== "discord") return null;
  if (!payload.accessToken || !payload.refreshToken || !payload.accessTokenExpiresAt) return null;

  // Encore valide ? OK.
  if (payload.accessTokenExpiresAt > Date.now() + SKEW_MS) {
    return { payload };
  }

  // Refresh nécessaire
  const config = getOAuthConfig();
  if (!config) return null;
  try {
    const tokens = await refreshTokens(config, payload.refreshToken);
    const next = await createSession({
      userId: payload.userId!,
      username: payload.username!,
      avatar: payload.avatar ?? null,
      email: payload.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? payload.refreshToken,
      accessTokenExpiresAt: Date.now() + tokens.expires_in * 1000,
    });
    return {
      payload: {
        ...payload,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? payload.refreshToken,
        accessTokenExpiresAt: Date.now() + tokens.expires_in * 1000,
      },
      refreshedCookie: buildSessionCookie(next),
    };
  } catch (err) {
    logger.warn({ err }, "OAuth refresh failed → session expirée");
    return null;
  }
}
