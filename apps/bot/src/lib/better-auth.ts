/**
 * Better Auth — handler OAuth Discord robuste avec sessions DB-backed.
 *
 * Coexiste avec les routes legacy `/auth/*` (login token admin) :
 *  - Better Auth servi sur `/api/auth/*` (sign-in, callback, signout, get-session)
 *  - Mes routes legacy restent pour `/auth/login` (token admin)
 *
 * Tables : ba_user, ba_session, ba_account, ba_verification (cf. db/schema.ts).
 *
 * Endpoints principaux :
 *   GET  /api/auth/sign-in/social/discord  → redirect Discord OAuth
 *   GET  /api/auth/callback/discord        → handle code + create session
 *   POST /api/auth/sign-out                → clear session
 *   GET  /api/auth/get-session             → { user, session } | null
 *
 * Doc : https://www.better-auth.com/docs
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { container } from "tsyringe";
import { DatabaseService } from "~/db/index";
import { baAccount, baSession, baUser, baVerification } from "~/db/schema";
import { env } from "./env";
import { logger } from "./logger";

// any-typed pour éviter les inférences inter-versions Better Auth qui se
// resserrent à chaque release ; le type `ReturnType<typeof betterAuth>` du
// callsite est suffisant pour les tests d'autocomplétion en aval.
let _auth: any = null;

export function getAuth() {
  if (_auth) return _auth;

  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
    throw new Error("Better Auth requires DISCORD_CLIENT_ID + DISCORD_CLIENT_SECRET in .env");
  }

  const dbs = container.resolve(DatabaseService);

  _auth = betterAuth({
    appName: "Shenron",
    baseURL: env.OAUTH_REDIRECT_URI?.replace(/\/auth\/callback$/, "") ?? "https://shenron.rpbey.fr",
    basePath: "/api/auth",

    secret: env.SESSION_SECRET ?? env.API_ADMIN_TOKEN ?? "dev-secret-change-me",

    // bun:sqlite via drizzle (mêmes tables que le bot, préfixe ba_)
    database: drizzleAdapter(dbs.db, {
      provider: "sqlite",
      schema: {
        user: baUser,
        session: baSession,
        account: baAccount,
        verification: baVerification,
      },
    }),

    // Pas de signup local — uniquement OAuth Discord
    emailAndPassword: { enabled: false },

    socialProviders: {
      discord: {
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
        // identify (id, username, avatar) + email + guilds + membership read
        scope: ["identify", "email", "guilds", "guilds.members.read"],
      },
    },

    session: {
      // Session 7 jours, renouvelée à chaque requête (sliding window)
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24, // refresh expiry 1×/jour
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // cache cookie 5min côté client (sliding session)
      },
    },

    advanced: {
      // En dev (NODE_ENV=development), Secure cookie désactivé pour localhost
      useSecureCookies: env.NODE_ENV === "production",
      cookiePrefix: "shenron_ba",
      crossSubDomainCookies: { enabled: false },
    },

    // Whitelist : seuls OWNER_ID + OAUTH_ALLOWED_USERS peuvent se connecter.
    // On hook après création du compte Discord pour rejeter les non-whitelistés.
    databaseHooks: {
      account: {
        create: {
          before: async (account) => {
            if (account.providerId !== "discord") return;
            const discordId = account.accountId;
            const allowed =
              discordId === env.OWNER_ID || env.OAUTH_ALLOWED_USERS.includes(discordId);
            if (!allowed) {
              logger.warn(
                { discordId, providerId: account.providerId },
                "Better Auth — login Discord refusé (hors whitelist)",
              );
              throw new Error(
                `Accès refusé : votre ID Discord (${discordId}) n'est pas whitelisté.`,
              );
            }
            logger.info({ discordId }, "Better Auth — login Discord whitelisté");
          },
        },
      },
    },

    // CORS / origin trust : same-origin uniquement
    trustedOrigins: ["https://shenron.rpbey.fr"],
  });

  return _auth;
}

/**
 * Handler à appeler depuis Bun.serve. Retourne `Response | null` :
 *  - Response : Better Auth a matché et géré la requête
 *  - null : route non gérée par Better Auth, laisser passer aux autres routes
 */
export async function handleBetterAuthRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/api/auth/")) return null;
  const auth = getAuth();
  return auth.handler(req);
}

/**
 * Récupère la session Better Auth depuis les headers de la requête.
 * Retourne `null` si pas de session valide.
 */
export async function getBetterAuthSession(req: Request) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: req.headers });
    return session;
  } catch {
    return null;
  }
}
