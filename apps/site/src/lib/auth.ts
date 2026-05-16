import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "../db/schema";
import { env } from "./env";

export const auth = betterAuth({
	appName: "DBFR",
	baseURL: env.BETTER_AUTH_URL ?? "https://dbfr.fr",
	basePath: "/api/auth",
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.baUser,
			session: schema.baSession,
			account: schema.baAccount,
			verification: schema.baVerification,
		},
	}),
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
			scope: ["identify", "email", "guilds", "guilds.members.read"],
		},
	},
	// Synchroniser les users Better Auth avec la table User de l'app
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					// On récupère le discordId via le premier account lié
					const account = await db.query.baAccount.findFirst({
						where: (acc, { eq }) => eq(acc.userId, user.id),
					});

					if (account && account.providerId === "discord") {
						await db
							.insert(schema.users)
							.values({
								discordId: account.accountId,
								username: user.name,
								avatar: user.image,
							})
							.onConflictDoUpdate({
								target: schema.users.discordId,
								set: {
									username: user.name,
									avatar: user.image,
								},
							});
					}
				},
			},
		},
	},
	trustedOrigins: [
		"https://dbfr.vercel.app",
		"https://dbfr.fr",
		"http://localhost:3000",
	],
	advanced: {
		trustProxy: true,
	},
});
