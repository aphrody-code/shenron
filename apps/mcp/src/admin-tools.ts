/** Outils MCP d'administration, enregistrés uniquement après Bearer valide. */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ApiError, botAdminGet, botAdminPost, siteAdminPost } from "./api.ts";

type ToolResult = {
	content: { type: "text"; text: string }[];
	isError?: boolean;
};

function result(data: unknown): ToolResult {
	return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function error(err: unknown): ToolResult {
	const message = err instanceof ApiError || err instanceof Error ? err.message : "Erreur inconnue";
	return { content: [{ type: "text", text: `Erreur : ${message}` }], isError: true };
}

const ADMIN_READ = { readOnlyHint: true, destructiveHint: false, openWorldHint: true } as const;
const ADMIN_WRITE = { readOnlyHint: false, destructiveHint: true, openWorldHint: true } as const;

/**
 * Cette surface est volontairement explicite : ne jamais remplacer ces outils
 * par un proxy `method/path/body` générique, qui contournerait les gardes de
 * l'API bot et rendrait impossible l'audit des actions effectuées par un agent.
 */
export function registerAdminTools(server: McpServer): void {
	server.registerTool(
		"admin_databooks_deposit",
		{
			title: "Déposer des transcriptions databooks validées",
			description:
				"Dépose des transcriptions OCR déjà vérifiées sur un databook. Écrit des révisions réversibles dans le site ; fusion ciblée uniquement, sans remplacer les scans.",
			inputSchema: {
				databookId: z.number().int().positive(),
				pages: z
					.array(z.object({ number: z.number().int().positive(), text: z.string().min(1).max(40_000) }))
					.min(1)
					.max(2000),
			},
			annotations: { title: "Déposer des transcriptions databooks", ...ADMIN_WRITE },
		},
		async ({ databookId, pages }) => {
			try {
				return result(
					await siteAdminPost(`/api/databooks/${databookId}/transcription`, { mode: "merge", pages })
				);
			} catch (err) {
				return error(err);
			}
		}
	);

	server.registerTool(
		"admin_bot_commands",
		{
			title: "Catalogue des commandes bot",
			description: "Liste les commandes exécutables via l'API d'administration Shenron.",
			inputSchema: {},
			annotations: { title: "Catalogue des commandes bot", ...ADMIN_READ },
		},
		async () => {
			try {
				return result(await botAdminGet("/api/bot/commands/catalog"));
			} catch (err) {
				return error(err);
			}
		}
	);

	server.registerTool(
		"admin_bot_command_execute",
		{
			title: "Exécuter une commande Shenron",
			description:
				"Exécute une commande Discord sous l'identité administrateur du bot. Consulte d'abord admin_bot_commands ; les réponses sont capturées par l'API.",
			inputSchema: {
				invocation: z.string().min(1).max(160),
				options: z.record(z.string(), z.unknown()).optional(),
				channelId: z.string().regex(/^\d{17,20}$/).optional(),
			},
			annotations: { title: "Exécuter une commande Shenron", ...ADMIN_WRITE },
		},
		async ({ invocation, options, channelId }) => {
			try {
				return result(await botAdminPost("/api/bot/commands/exec", { invocation, options, channelId }));
			} catch (err) {
				return error(err);
			}
		}
	);

	server.registerTool(
		"admin_services",
		{
			title: "Actions de service autorisées",
			description: "Liste les actions de service explicitement autorisées par Shenron.",
			inputSchema: {},
			annotations: { title: "Actions de service autorisées", ...ADMIN_READ },
		},
		async () => {
			try {
				return result(await botAdminGet("/api/services"));
			} catch (err) {
				return error(err);
			}
		}
	);

	server.registerTool(
		"admin_service_action",
		{
			title: "Exécuter une action de service autorisée",
			description:
				"Exécute une action figurant dans admin_services. Aucun nom de service ou shell arbitraire n'est accepté.",
			inputSchema: {
				service: z.string().regex(/^[a-z0-9-]{1,80}$/),
				action: z.string().regex(/^[a-z0-9-]{1,80}$/),
				arguments: z.record(z.string(), z.unknown()).optional(),
			},
			annotations: { title: "Exécuter une action de service", ...ADMIN_WRITE },
		},
		async ({ service, action, arguments: args }) => {
			try {
				return result(await botAdminPost(`/api/services/${service}/${action}`, args ?? {}));
			} catch (err) {
				return error(err);
			}
		}
	);
}
