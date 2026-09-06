import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("..", import.meta.url));
const sidebar = await Bun.file(
	new URL("../src/components/admin/AdminSidebar.tsx", import.meta.url)
).text();
const adminIndex = await Bun.file(new URL("../src/app/admin/page.tsx", import.meta.url)).text();
const links = [...sidebar.matchAll(/href:\s*"(\/admin[^"]+)"/g)].map((match) => match[1]!);
const pages = [...new Bun.Glob("src/app/admin/**/page.tsx").scanSync(siteRoot)].map(
	(file) =>
		`/${file
			.replaceAll("\\", "/")
			.replace(/^src\/app\//, "")
			.replace(/\/page\.tsx$/, "")}`
);

describe("navigation administrateur", () => {
	test("ne contient aucun raccourci dupliqué", () => {
		expect(new Set(links).size).toBe(links.length);
	});

	test("rend chaque page admin atteignable depuis une rubrique", () => {
		const missing = pages.filter(
			(page) =>
				page !== "/admin" && !links.some((href) => page === href || page.startsWith(`${href}/`))
		);
		expect(missing).toEqual([]);
	});

	test("redirige la racine admin vers le tableau de bord canonique", () => {
		expect(adminIndex).toContain('redirect("/admin/dashboard")');
	});
});
