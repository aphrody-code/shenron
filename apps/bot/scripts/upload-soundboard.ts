/**
 * upload-soundboard.ts — ajoute les sons Dragon Ball Xenoverse 2 (Kamehameha + voix
 * Beerus / Whis / Shenron, extraits du jeu) au SOUNDBOARD du serveur Discord via l'API
 * native. Jouables nativement en vocal. Idempotent (saute les sons déjà présents).
 *
 * Pré-requis : le bot (DISCORD_TOKEN) doit avoir la permission CREATE_GUILD_EXPRESSIONS
 * sur le serveur GUILD_ID. Fichiers : apps/bot/assets/audio/*.ogg (≤5,2 s, ≤512 Ko).
 * Usage : cd apps/bot && bun scripts/upload-soundboard.ts
 */
const TOKEN = process.env.DISCORD_TOKEN;
const GUILD = process.env.GUILD_ID;
if (!TOKEN || !GUILD) {
	console.error("✗ DISCORD_TOKEN + GUILD_ID requis (apps/bot/.env)");
	process.exit(1);
}

const SOUNDS = [
	{ name: "Goku", file: "kamehameha.ogg", emoji: "💥" },
	{ name: "Beerus", file: "beerus.ogg", emoji: "😼" },
	{ name: "Whis", file: "whis.ogg", emoji: "🌀" },
	{ name: "Shenron", file: "shenron.ogg", emoji: "🐉" },
];

const API = "https://discord.com/api/v10";
const headers = { Authorization: `Bot ${TOKEN}`, "content-type": "application/json" };
const HERE = new URL("..", import.meta.url).pathname; // apps/bot/

// Sons existants (name → sound_id) — on REMPLACE (l'opus-in-ogg n'était pas lu par Discord).
const existing = await fetch(`${API}/guilds/${GUILD}/soundboard-sounds`, { headers })
	.then((r) => (r.ok ? r.json() : { items: [] }))
	.then(
		(d: { items?: { name: string; sound_id: string }[] }) =>
			new Map((d.items ?? []).map((s) => [s.name, s.sound_id] as const))
	)
	.catch(() => new Map<string, string>());

let ok = 0;
for (const s of SOUNDS) {
	const oldId = existing.get(s.name);
	if (oldId) {
		await fetch(`${API}/guilds/${GUILD}/soundboard-sounds/${oldId}`, { method: "DELETE", headers });
	}
	const buf = await Bun.file(`${HERE}assets/audio/${s.file}`).arrayBuffer();
	const res = await fetch(`${API}/guilds/${GUILD}/soundboard-sounds`, {
		method: "POST",
		headers,
		body: JSON.stringify({
			name: s.name,
			sound: `data:audio/ogg;base64,${Buffer.from(buf).toString("base64")}`,
			volume: 1,
			emoji_name: s.emoji,
		}),
	});
	if (res.ok) {
		console.log(`✓ ${s.name} ${oldId ? "remplacé" : "ajouté"} (mp3)`);
		ok++;
	} else {
		const body = await res.text();
		console.error(`✗ ${s.name} : ${res.status} ${body.slice(0, 200)}`);
		if (res.status === 403) {
			console.error("  → le bot manque la permission CREATE_GUILD_EXPRESSIONS (à accorder sur le serveur).");
		}
	}
}
console.log(`\n${ok}/${SOUNDS.length} son(s) dans le soundboard.`);
