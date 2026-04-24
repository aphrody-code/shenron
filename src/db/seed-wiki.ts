import "reflect-metadata";
import { container } from "tsyringe";
import { existsSync } from "node:fs";
import { DatabaseService } from "~/db/index";
import { dbCharacters, dbPlanets, dbTransformations } from "~/db/schema";

const BASE = "https://dragonball-api.com/api";
const LOCAL_IMG_ROOT = "./assets/dbz";

interface RemoteChar {
	id: number;
	name: string;
	ki: string;
	maxKi: string;
	race: string;
	gender: string;
	description: string;
	image: string;
	affiliation: string;
	originPlanet?: { id: number };
	transformations?: Array<{
		id: number;
		name: string;
		ki: string;
		image: string;
	}>;
}

interface RemotePlanet {
	id: number;
	name: string;
	isDestroyed: boolean;
	description: string;
	image: string;
}

function remapImage(
	remoteUrl: string,
	subdir: "characters" | "planetas" | "transformaciones",
): string {
	// Extrait le nom de fichier depuis l'URL live API (ex: goku_normal.webp)
	const m = remoteUrl.match(/\/([^/]+\.(?:webp|png|jpg))(?:\?.*)?$/i);
	if (!m) return remoteUrl;
	const filename = decodeURIComponent(m[1]!);
	const localPath = `${LOCAL_IMG_ROOT}/${subdir}/${filename}`;
	if (existsSync(localPath)) return localPath;
	return remoteUrl; // URL distante gardée comme secours
}

async function fetchJson<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`);
	if (!res.ok) throw new Error(`${path} → ${res.status}`);
	return (await res.json()) as T;
}

async function fetchAll<T>(path: string): Promise<T[]> {
	const first = await fetchJson<{ items: T[]; meta: { totalPages: number } }>(
		`${path}?limit=100`,
	);
	const all = [...first.items];
	for (let p = 2; p <= first.meta.totalPages; p++) {
		const next = await fetchJson<{ items: T[] }>(`${path}?limit=100&page=${p}`);
		all.push(...next.items);
	}
	return all;
}

async function main() {
	const dbs = container.resolve(DatabaseService);
	const db = dbs.db;

	console.log("→ Fetching planets…");
	const planets = await fetchAll<RemotePlanet>("/planets");
	console.log(`  ${planets.length} planets`);

	console.log("→ Fetching characters (list)…");
	const chars = await fetchAll<RemoteChar>("/characters");
	console.log(`  ${chars.length} characters`);

	// Purge
	await db.delete(dbTransformations);
	await db.delete(dbCharacters);
	await db.delete(dbPlanets);

	// Planets
	for (const p of planets) {
		await db.insert(dbPlanets).values({
			id: p.id,
			name: p.name,
			image: remapImage(p.image, "planetas"),
			isDestroyed: p.isDestroyed,
			description: p.description,
		});
	}
	console.log(`✓ ${planets.length} planets inserted`);

	// Characters + fetch individuel pour récupérer transformations
	let totalTransfos = 0;
	let imgMapped = 0;
	let imgMissing = 0;

	for (const c of chars) {
		const full = await fetchJson<RemoteChar>(`/characters/${c.id}`);
		const localImg = remapImage(full.image, "characters");
		if (localImg.startsWith(LOCAL_IMG_ROOT)) imgMapped++;
		else imgMissing++;

		await db.insert(dbCharacters).values({
			id: full.id,
			name: full.name,
			image: localImg,
			ki: full.ki,
			maxKi: full.maxKi,
			race: full.race,
			gender: full.gender,
			affiliation: full.affiliation,
			description: full.description,
			originPlanetId: full.originPlanet?.id ?? null,
		});

		for (const t of full.transformations ?? []) {
			const tImg = remapImage(t.image, "transformaciones");
			if (tImg.startsWith(LOCAL_IMG_ROOT)) imgMapped++;
			else imgMissing++;
			await db.insert(dbTransformations).values({
				id: t.id,
				name: t.name,
				image: tImg,
				ki: t.ki,
				characterId: full.id,
			});
			totalTransfos++;
		}
	}

	console.log(
		`✓ ${chars.length} characters + ${totalTransfos} transformations inserted`,
	);
	console.log(
		`  Images mapped locally: ${imgMapped}, fallback network: ${imgMissing}`,
	);

	dbs.close();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
