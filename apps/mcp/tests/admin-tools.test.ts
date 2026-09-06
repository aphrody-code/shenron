import { describe, expect, test } from "bun:test";
import { registerAdminTools } from "../src/admin-tools.ts";

type Recorded = { name: string; config: { annotations?: Record<string, unknown> } };

function collect(): Recorded[] {
	const tools: Recorded[] = [];
	const fakeServer = {
		registerTool(name: string, config: Recorded["config"]) {
			tools.push({ name, config });
		},
	};
	registerAdminTools(fakeServer as never);
	return tools;
}

describe("catalogue d'administration", () => {
	test("expose une surface explicite et marque les écritures", () => {
		const tools = collect();
		expect(tools.map((tool) => tool.name)).toEqual([
			"admin_databooks_deposit",
			"admin_bot_commands",
			"admin_bot_command_execute",
			"admin_services",
			"admin_service_action",
		]);
		for (const name of [
			"admin_databooks_deposit",
			"admin_bot_command_execute",
			"admin_service_action",
		]) {
			const annotations = tools.find((tool) => tool.name === name)?.config.annotations;
			expect(annotations?.readOnlyHint).toBe(false);
			expect(annotations?.destructiveHint).toBe(true);
		}
	});
});
