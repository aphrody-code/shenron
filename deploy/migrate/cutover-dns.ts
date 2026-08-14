#!/usr/bin/env bun
/**
 * cutover-dns.ts — bascule les enregistrements DNS OVH de dragonballfr.com vers
 * la nouvelle IP (apex @, www, bot, mcp), A + AAAA, puis refresh la zone.
 *
 *   OVH_CONF=~/.config/ovh/dbfr.conf IP4=51.255.162.6 IP6=2001:41d0:305:2100::a461 \
 *     bun deploy/migrate/cutover-dns.ts [--dry-run]
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const ZONE = "dragonballfr.com";
const IP4 = process.env.IP4 || "51.255.162.6";
const IP6 = process.env.IP6 || "2001:41d0:305:2100::a461";
const SUBS = new Set(["", "www", "bot", "mcp"]); // sous-domaines servis par le nouveau VPS
const DRY = process.argv.includes("--dry-run");

const raw = readFileSync(process.env.OVH_CONF || `${homedir()}/.config/ovh/dbfr.conf`, "utf8");
const g = (k: string) => raw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+)\\s*$`, "m"))?.[1]?.trim();
const conf = {
	base: "https://eu.api.ovh.com/1.0",
	ak: g("application_key")!,
	as: g("application_secret")!,
	ck: g("consumer_key")!,
};

async function call(method: string, path: string, body?: unknown) {
	const url = `${conf.base}${path}`;
	const bodyStr = body === undefined ? "" : JSON.stringify(body);
	const ts = Number(await (await fetch(`${conf.base}/auth/time`)).text());
	const sig =
		"$1$" +
		createHash("sha1")
			.update(`${conf.as}+${conf.ck}+${method}+${url}+${bodyStr}+${ts}`)
			.digest("hex");
	const headers: Record<string, string> = {
		"X-Ovh-Application": conf.ak,
		"X-Ovh-Consumer": conf.ck,
		"X-Ovh-Timestamp": String(ts),
		"X-Ovh-Signature": sig,
	};
	if (bodyStr) headers["Content-Type"] = "application/json";
	const r = await fetch(url, { method, headers, body: bodyStr || undefined });
	const t = await r.text();
	if (!r.ok) throw new Error(`OVH ${method} ${path} -> ${r.status}: ${t}`);
	return t ? JSON.parse(t) : null;
}

for (const [ft, ip] of [
	["A", IP4],
	["AAAA", IP6],
] as const) {
	const ids = (await call("GET", `/domain/zone/${ZONE}/record?fieldType=${ft}`)) as number[];
	for (const id of ids) {
		const rec = (await call("GET", `/domain/zone/${ZONE}/record/${id}`)) as {
			subDomain: string;
			target: string;
		};
		if (!SUBS.has(rec.subDomain)) continue;
		const label = rec.subDomain || "@";
		if (rec.target === ip) {
			console.log(`= ${label} ${ft} déjà ${ip}`);
			continue;
		}
		console.log(`${DRY ? "[dry] " : ""}→ ${label} ${ft} ${rec.target} => ${ip}`);
		if (!DRY) await call("PUT", `/domain/zone/${ZONE}/record/${id}`, { target: ip });
	}
}
if (!DRY) {
	await call("POST", `/domain/zone/${ZONE}/refresh`);
	console.log("zone rafraîchie");
}
