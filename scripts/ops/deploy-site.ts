#!/usr/bin/env bun
/**
 * deploy-site.ts — déploiement BLEU/VERT du site dragonballfr.com.
 *
 * Problème résolu : `deploy-site.sh` construit dans le dépôt et écrase le `.next`
 * que le process en train de servir est justement en train de lire. Un build
 * raté ou lent = 500 pour les visiteurs, et le redémarrage coupe le service le
 * temps que Next reparte.
 *
 * Principe (repris de rose-griffon/rg, adapté à nos contraintes) :
 *   1. build dans le dépôt (Node — cf. scripts/deploy-site.sh pour le pourquoi) ;
 *   2. publication d'une VERSION FIGÉE sous ~/shenron-releases/site/releases/<v> ;
 *   3. démarrage du slot INACTIF sur son port, sondes HTTP ;
 *   4. bascule nginx (fichier d'amont généré) + attente du drainage des workers ;
 *   5. arrêt de l'ancien slot, purge des vieilles versions.
 *
 * Un échec avant l'étape 4 ne touche PAS la production : le trafic n'a pas bougé.
 *
 * Pas de `output: standalone` : son file tracing fait exploser la mémoire du
 * build sur ce VPS (cf. next.config.ts). La version copie donc `.next` et lie
 * `node_modules`/`public` au dépôt — suffisant pour isoler le process qui sert.
 *
 *   bun scripts/ops/deploy-site.ts              # build + publication + bascule
 *   bun scripts/ops/deploy-site.ts --no-build   # republie le .next déjà bâti
 *   bun scripts/ops/deploy-site.ts status       # état des slots et des versions
 *   bun scripts/ops/deploy-site.ts rollback     # rebascule sur la version d'avant
 *   bun scripts/ops/deploy-site.ts install      # crée l'arborescence + l'amont nginx
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const HOME = process.env.HOME ?? "/home/ubuntu";
const REPO = join(import.meta.dir, "..", "..");
const SITE_DIR = join(REPO, "apps", "site");
/**
 * Sortie du build, VOLONTAIREMENT distincte du `.next` servi par le slot actif :
 * on ne retire rien sous les pieds du process en service, et on repart d'un
 * répertoire vide donc d'un build à froid (~8,1 Gio contre ~10,5 en incrémental,
 * seuil de l'OOM killer sur ce VPS). Cf. `distDir` dans apps/site/next.config.ts.
 */
const BUILD_DIR_NAME = ".next-build";
const BUILD_DIR = join(SITE_DIR, BUILD_DIR_NAME);
const RELEASES_ROOT = join(HOME, "shenron-releases", "site");
const RELEASES_DIR = join(RELEASES_ROOT, "releases");
const STATE_FILE = join(RELEASES_ROOT, "state.json");

const UPSTREAM_DIR = "/etc/nginx/shenron-upstreams";
const UPSTREAM_FILE = join(UPSTREAM_DIR, "shenron_site.conf");

type SlotId = "a" | "b";
const SLOTS: Record<SlotId, { unit: string; port: number; link: string }> = {
	a: { unit: "shenron-site.service", port: 3000, link: join(RELEASES_ROOT, "slot-a") },
	b: { unit: "shenron-site-b.service", port: 3010, link: join(RELEASES_ROOT, "slot-b") },
};

/** Chemins sondés après démarrage d'un slot ; tout code < 500 vaut « vivant ». */
// Sondes : une par famille de rendu, pour qu'un slot cassé soit détecté AVANT
// la bascule. `/wiki/personnages` est fermée au public (307) — c'est justement
// ce qu'on veut vérifier ; `/favoris` couvre les pages client, `/actualites`
// la pagination segmentée, `/wiki/hasard` un route handler.
const PROBES = [
	"/",
	"/wiki/sagas",
	"/wiki/personnages",
	"/actualites",
	"/favoris",
	"/wiki/hasard",
	"/api/me",
	// Optimiseur d'images : une configuration `remotePatterns` ou `qualities`
	// invalide ne casse aucune page — elle casse SILENCIEUSEMENT toutes les
	// vignettes. On sonde donc une transformation réelle avant de basculer.
	`/_next/image?url=${encodeURIComponent("https://bot.dragonballfr.com/assets/ext/db_episodes/1.jpg")}&w=384&q=70`,
];
const PUBLIC_URL = "https://dragonballfr.com/";
const BOOT_TIMEOUT_MS = 180_000;
const KEEP_RELEASES = 3;
/** Pic mesuré du build ≈ 8,1 Gio → on exige un budget RAM+swap au-dessus. */
const MEMORY_NEED_MIB = 11_264;

interface DeployState {
	live: SlotId | null;
	release: string | null;
	previousRelease: string | null;
	updatedAt: string;
}

// ── utilitaires ─────────────────────────────────────────────────────────────

const stamp = () => new Date().toISOString().slice(11, 19);
const log = (line: string) => console.log(`[${stamp()}] ${line}`);
function fail(message: string): never {
	console.error(`✗ ${message}`);
	process.exit(1);
}

async function run(
	cmd: string[],
	options: { cwd?: string; env?: Record<string, string>; stdin?: string } = {}
): Promise<{ code: number; stdout: string; stderr: string }> {
	const proc = Bun.spawn(cmd, {
		cwd: options.cwd ?? REPO,
		env: { ...process.env, ...options.env },
		stdin: options.stdin ? new TextEncoder().encode(options.stdin) : "ignore",
		stdout: "pipe",
		stderr: "pipe",
	});
	const [stdout, stderr] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
	]);
	return { code: await proc.exited, stdout, stderr };
}

const sudo = (cmd: string[], stdin?: string) => run(["sudo", ...cmd], { stdin });

/** Écrit un fichier appartenant à root (nginx) sans passer par un shell. */
async function writeAsRoot(path: string, content: string): Promise<void> {
	await sudo(["mkdir", "-p", dirname(path)]);
	const res = await sudo(["tee", path], content);
	if (res.code !== 0) fail(`écriture impossible : ${path}\n${res.stderr}`);
}

async function readState(): Promise<DeployState> {
	try {
		return JSON.parse(await readFile(STATE_FILE, "utf8")) as DeployState;
	} catch {
		return { live: null, release: null, previousRelease: null, updatedAt: "" };
	}
}

async function writeState(next: Omit<DeployState, "updatedAt">): Promise<void> {
	await mkdir(RELEASES_ROOT, { recursive: true });
	await writeFile(
		STATE_FILE,
		`${JSON.stringify({ ...next, updatedAt: new Date().toISOString() }, null, "\t")}\n`
	);
}

// ── garde-fou mémoire ───────────────────────────────────────────────────────

async function checkMemory(allowLow: boolean): Promise<void> {
	const meminfo = await readFile("/proc/meminfo", "utf8");
	const field = (name: string) =>
		Math.round(Number(new RegExp(`^${name}:\\s+(\\d+)`, "m").exec(meminfo)?.[1] ?? 0) / 1024);
	const budget = field("MemAvailable") + field("SwapFree");
	log(`mémoire : ${budget} Mio disponibles (RAM + swap), besoin ~${MEMORY_NEED_MIB} Mio`);
	if (budget >= MEMORY_NEED_MIB) return;
	if (allowLow) {
		log("⚠ sous le seuil mais --allow-low-memory demandé — poursuite");
		return;
	}
	fail(
		`mémoire insuffisante pour le build (${budget} Mio < ${MEMORY_NEED_MIB} Mio). ` +
			`Libérer de la RAM, ajouter du swap, ou forcer avec --allow-low-memory.`
	);
}

// ── build ───────────────────────────────────────────────────────────────────

/**
 * Réglages noyau tenus le temps du build seulement.
 *
 * `vm.swappiness` — le build réclame ~10,5 Gio de mémoire ANONYME sur une
 * machine de 11 Gio : il ne survit que si le noyau accepte d'évacuer massivement
 * vers le swap. Mesuré le 2026-08-14 — swappiness 100 : passe ; swappiness 60 :
 * tué par l'OOM killer à 10,2-10,5 Gio, trois fois de suite.
 *
 * `vm.min_free_kbytes` et `vm.watermark_scale_factor` — ajoutés le 2026-08-21
 * après deux morts consécutives à 8,2 puis 9,4 Gio ALORS QUE le swap avait
 * encore 14 Gio de libre. Le journal noyau est explicite :
 *
 *     postgres invoked oom-killer: gfp_mask=…, order=1
 *     Out of memory: Killed process (next-build)
 *
 * `order=1`, c'est une allocation noyau de 8 Kio qui échoue — pas un manque de
 * mémoire globale, mais un manque de mémoire LIBRE À L'INSTANT T. Le build
 * grossit plus vite que kswapd ne récupère, les réserves passent sous le seuil
 * bas, et le noyau tue le plus gros consommateur. Relever la réserve minimale
 * (64 → 512 Mio) et déclencher la récupération bien plus tôt
 * (`watermark_scale_factor` 10 → 300, soit 3 % de la zone) fait travailler
 * kswapd en continu au lieu de le laisser courir derrière. Les deux réglages
 * coûteraient de la RAM utile en régime permanent : ils sont restaurés ensuite.
 */
const BUILD_VM_TUNABLES: ReadonlyArray<{ key: string; value: string }> = [
	{ key: "vm.swappiness", value: "100" },
	{ key: "vm.min_free_kbytes", value: "524288" },
	{ key: "vm.watermark_scale_factor", value: "300" },
];

async function withBuildVmTuning<T>(body: () => Promise<T>): Promise<T> {
	const previous: Array<{ key: string; value: string }> = [];
	for (const { key, value } of BUILD_VM_TUNABLES) {
		const path = `/proc/sys/${key.replace(/\./g, "/")}`;
		const before = (await readFile(path, "utf8")).trim();
		previous.push({ key, value: before });
		await sudo(["sysctl", "-w", `${key}=${value}`]);
		log(`${key} ${before} → ${value} (le temps du build)`);
	}
	// `fail()` sort par `process.exit`, qui ne déroule PAS le `finally` : un build
	// en échec laissait les réglages en place en permanence (dégradation de
	// latence de tous les services, constatée sur 3 jours). Le filet est un
	// gestionnaire `exit` qui restaure de façon SYNCHRONE — seule forme de
	// nettoyage qu'un handler de sortie puisse mener à terme.
	const restoreSync = () => {
		for (const { key, value } of previous) {
			Bun.spawnSync(["sudo", "sysctl", "-w", `${key}=${value}`]);
		}
	};
	process.on("exit", restoreSync);
	try {
		return await body();
	} finally {
		process.off("exit", restoreSync);
		for (const { key, value } of previous) {
			await sudo(["sysctl", "-w", `${key}=${value}`]);
		}
		log(`réglages noyau restaurés (${previous.map((p) => `${p.key}=${p.value}`).join(", ")})`);
	}
}

async function currentSha(): Promise<string> {
	const res = await run(["git", "rev-parse", "--short", "HEAD"]);
	return res.stdout.trim();
}

/**
 * Build dans le dépôt, sous **Bun**.
 *
 * Le build a tourné sous Node du 2026-08-14 au 2026-08-21, en supposant qu'il y
 * consommait moins de mémoire. La mesure a démenti : ~10,5 Gio de mémoire
 * anonyme **quel que soit le runtime**, et des morts par OOM sous Node comme
 * sous Bun. Le seul facteur qui décide est `vm.swappiness` — que
 * `withBuildVmTuning()` relève déjà le temps du build. Node n'apportait donc
 * rien et contredisait la règle Bun-only du dépôt.
 *
 * On passe le FICHIER `next` à bun (`bun <fichier> build`) : dans cette forme, Bun
 * est déjà le runtime et le shebang `#!/usr/bin/env node` n'est pas consulté.
 * Surtout, on n'utilise PAS `bun --bun` : ce drapeau se propage aux process
 * enfants via `NODE_OPTIONS`, et Turbopack lance un pool de process **Node** pour
 * évaluer PostCSS — lesquels refusent de démarrer avec
 * « node: --bun is not allowed in NODE_OPTIONS » (build échoué le 2026-08-21).
 *
 * Le succès se juge sur un BUILD_ID **frais**, pas sur le code retour.
 */
async function buildSite(sha: string): Promise<string> {
	const buildTmp = process.env.BUILD_TMP ?? join(HOME, ".shenron-build-tmp");
	await mkdir(buildTmp, { recursive: true });
	const bunBin = process.env.BUN_BIN ?? join(HOME, ".bun", "bin", "bun");
	if (!existsSync(bunBin)) fail(`bun introuvable (${bunBin}) — requis pour le build.`);
	// `next` n'est pas toujours hoisté à la racine : selon l'ordre des
	// `bun add`, bun peut le laisser dans le node_modules du workspace. On
	// cherche donc aux deux emplacements plutôt que de présumer du layout —
	// sinon un simple ajout de dépendance côté site casse le déploiement.
	const nextCandidates = [
		join(REPO, "node_modules", "next", "dist", "bin", "next"),
		join(SITE_DIR, "node_modules", "next", "dist", "bin", "next"),
	];
	const nextBin = nextCandidates.find((p) => existsSync(p));
	if (!nextBin) fail(`next introuvable (cherché : ${nextCandidates.join(", ")})`);

	// Build à froid : on jette la sortie précédente AVANT de lancer Next.
	await rm(BUILD_DIR, { recursive: true, force: true });
	const startedAt = Date.now();
	log(`build (Bun, à froid → ${BUILD_DIR_NAME}) · deploymentId=${sha}`);
	const res = await run([bunBin, nextBin, "build"], {
		cwd: SITE_DIR,
		env: {
			// `env` REMPLACE l'environnement : tout ce qui n'est pas listé ici
			// disparaît. PATH et HOME doivent donc être repassés explicitement.
			// Turbopack démarre un pool de process Node pour évaluer PostCSS sur
			// le CSS de dépendance (ex. swiper/swiper.css) et panique sans PATH
			// (« the PATH environment variable should always be set: NotPresent »,
			// turbopack-node/src/process_pool). Le build mourait alors APRÈS avoir
			// écrit BUILD_ID, ce qui le faisait passer pour un succès.
			// `env` REMPLACE l'environnement : bun doit rester dans le PATH, sinon le
			// pool de process de Turbopack ne sait plus se relancer.
			PATH: `${dirname(bunBin)}:${process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin"}`,
			HOME: process.env.HOME ?? "/home/ubuntu",
			TMPDIR: buildTmp,
			NODE_ENV: "production",
			NEXT_TELEMETRY_DISABLED: "1",
			NEXT_DEPLOYMENT_ID: sha,
			NEXT_DIST_DIR: BUILD_DIR_NAME,
		},
	});

	// Journal COMPLET conservé sur disque : la console ne montre que la queue de
	// stderr, or l'erreur utile d'un build Next (page qui casse au prerender) est
	// souvent des centaines de lignes plus haut, noyée dans la sortie des workers.
	// Sans ce fichier, diagnostiquer imposait de relancer un build de 10 minutes.
	const logFile = join(buildTmp, `build-${sha}.log`);
	await writeFile(logFile, `${res.stdout}\n${res.stderr}`);

	// Le code de sortie fait FOI. `BUILD_ID` est écrit AVANT la phase de
	// finalisation (prerender-manifest, images-manifest, export-marker) : un
	// build mort en finalisation laisse donc un BUILD_ID frais mais un `.next`
	// amputé. Ne se fier qu'à sa fraîcheur revenait à publier une version que
	// `next start` refuse d'ouvrir (ENOENT prerender-manifest.json), l'échec
	// n'apparaissant qu'au bout des 180s de sonde et sans le message d'erreur.
	if (res.code !== 0) {
		console.error(res.stderr.split("\n").slice(-30).join("\n"));
		fail(`build échoué (code ${res.code}) — journal complet : ${logFile}`);
	}
	const buildIdFile = join(BUILD_DIR, "BUILD_ID");
	const fresh = existsSync(buildIdFile) && (await stat(buildIdFile)).mtimeMs >= startedAt;
	if (!fresh) {
		console.error(res.stderr.split("\n").slice(-15).join("\n"));
		fail(`build échoué — BUILD_ID absent ou périmé (code ${res.code})`);
	}
	// Garde-fou de complétude : ces artefacts sont les derniers écrits par
	// `next build` et `next start` en dépend au démarrage. Leur absence signe
	// un build tronqué qu'il ne faut pas publier.
	for (const artefact of ["prerender-manifest.json", "routes-manifest.json"]) {
		if (!existsSync(join(BUILD_DIR, artefact))) {
			fail(`build incomplet — ${artefact} manquant dans ${BUILD_DIR_NAME}`);
		}
	}
	const buildId = (await Bun.file(buildIdFile).text()).trim();
	log(`✓ build en ${Math.round((Date.now() - startedAt) / 1000)}s · BUILD_ID=${buildId}`);
	return buildId;
}

// ── publication d'une version figée ─────────────────────────────────────────

/**
 * Copie `.next` (sans son cache de build) et pose les liens vers le dépôt.
 *
 * `public` (18 Gio) et `node_modules` (3 Gio) sont LIÉS, jamais copiés. Le lien
 * `apps/bot/public/db` reproduit l'arborescence attendue par la médiathèque
 * admin, qui remonte en `process.cwd()/../..`.
 */
async function publishRelease(version: string, previous: string | null): Promise<string> {
	const dest = join(RELEASES_DIR, version);
	const destSite = join(dest, "apps", "site");
	log(`publication de la version ${version}`);
	await rm(dest, { recursive: true, force: true });
	await mkdir(destSite, { recursive: true });

	// `.next` sans `cache/` : le cache ISR/fetch se régénère, et le cache de build
	// Turbopack (plusieurs centaines de Mo) n'a aucune utilité au runtime.
	const copy = await run([
		"rsync",
		"-a",
		"--exclude",
		"cache/",
		BUILD_DIR + "/",
		join(destSite, ".next") + "/",
	]);
	if (copy.code !== 0) fail(`copie de .next impossible :\n${copy.stderr}`);

	// Pool de chunks : on réinjecte le `static` de la version précédente pour que
	// les visiteurs restés sur l'ancienne page ne prennent pas un 404 sur leurs
	// chunks pendant le drainage nginx (Next sert `/_next/static/<buildId>/…`).
	if (previous) {
		const previousStatic = join(RELEASES_DIR, previous, "apps", "site", ".next", "static");
		if (existsSync(previousStatic)) {
			await run([
				"rsync",
				"-a",
				"--ignore-existing",
				previousStatic + "/",
				join(destSite, ".next", "static") + "/",
			]);
		}
	}

	// Cache d'images PARTAGÉ entre versions. `.next/cache` est volontairement exclu
	// de la copie ci-dessus (cache de build Turbopack inutile au runtime), mais
	// `cache/images` est différent : il contient les variantes AVIF/WebP déjà
	// calculées par l'optimiseur. Le laisser repartir de zéro à chaque mise en
	// ligne, c'est refaire quelques milliers de transformations sharp sur un VPS
	// déjà juste en mémoire — et servir les premières visites au ralenti. Les deux
	// slots pointent le même répertoire : ils servent les mêmes images.
	const cacheImages = join(RELEASES_ROOT, "image-cache");
	await mkdir(cacheImages, { recursive: true });
	await mkdir(join(destSite, ".next", "cache"), { recursive: true });
	await symlink(cacheImages, join(destSite, ".next", "cache", "images"));

	await Bun.write(join(destSite, "package.json"), Bun.file(join(SITE_DIR, "package.json")));
	await Bun.write(join(destSite, "next.config.ts"), Bun.file(join(SITE_DIR, "next.config.ts")));
	await symlink(join(REPO, "node_modules"), join(dest, "node_modules"));
	await symlink(join(SITE_DIR, "public"), join(destSite, "public"));
	await mkdir(join(dest, "apps", "bot", "public"), { recursive: true });
	await symlink(
		join(REPO, "apps", "bot", "public", "db"),
		join(dest, "apps", "bot", "public", "db")
	);

	// Ressources japonaises (dictionnaire kuromoji + index JMdict, ~25 Mio) :
	// liées, pas copiées. Elles sont gitignorées, donc absentes d'une version
	// figée — sans ce lien, l'analyse des transcriptions répondait « 0 anomalie »
	// en production alors qu'elle en trouve 1 217 en local. Le lien est
	// conditionnel : un hôte qui n'a pas lancé `ja-preparer.ts` doit pouvoir
	// déployer le site quand même, l'analyse se contentant de se taire.
	const jaData = join(SITE_DIR, ".ja-data");
	if (existsSync(jaData)) {
		await symlink(jaData, join(destSite, ".ja-data"));
	} else {
		log("· .ja-data absent — l'analyse japonaise sera inactive (cf. scripts/ja-preparer.ts)");
	}

	const size = (await run(["du", "-sh", dest])).stdout.split("\t")[0];
	log(`✓ version publiée (${size?.trim()})`);
	return dest;
}

async function pointSlot(slot: SlotId, releasePath: string): Promise<void> {
	const res = await run(["ln", "-sfnT", releasePath, SLOTS[slot].link]);
	if (res.code !== 0) fail(`lien du slot ${slot} impossible :\n${res.stderr}`);
}

/**
 * Drop-in d'env par slot : le serveur qui tourne doit connaître SON deploymentId,
 * sinon le contrôle de version skew compare des assets `?dpl=<sha>` à un runtime
 * qui n'en a pas (doc Next : deploymentId doit être partagé par toutes les
 * instances d'un même déploiement).
 */
async function writeSlotEnv(slot: SlotId, sha: string): Promise<void> {
	const dir = `/etc/systemd/system/${SLOTS[slot].unit}.d`;
	await writeAsRoot(
		join(dir, "deployment-id.conf"),
		`# Généré par scripts/ops/deploy-site.ts — NE PAS ÉDITER À LA MAIN.\n[Service]\nEnvironment=NEXT_DEPLOYMENT_ID=${sha}\n`
	);
	await sudo(["systemctl", "daemon-reload"]);
}

// ── slots ───────────────────────────────────────────────────────────────────

async function restartSlot(slot: SlotId): Promise<void> {
	const res = await sudo(["systemctl", "restart", SLOTS[slot].unit]);
	if (res.code !== 0) fail(`démarrage du slot ${slot} impossible :\n${res.stderr}`);
}

async function stopSlot(slot: SlotId): Promise<void> {
	await sudo(["systemctl", "stop", SLOTS[slot].unit]);
}

async function probeSlot(slot: SlotId): Promise<boolean> {
	const { port } = SLOTS[slot];
	const deadline = Date.now() + BOOT_TIMEOUT_MS;
	let lastError = "";
	while (Date.now() < deadline) {
		try {
			const codes: number[] = [];
			for (const path of PROBES) {
				const res = await fetch(`http://127.0.0.1:${port}${path}`, {
					redirect: "manual",
					signal: AbortSignal.timeout(20_000),
				});
				codes.push(res.status);
				if (res.status >= 500) throw new Error(`${path} → ${res.status}`);
			}
			log(
				`✓ slot ${slot} (:${port}) répond — ${PROBES.map((p, i) => `${p} ${codes[i]}`).join(", ")}`
			);
			return true;
		} catch (error) {
			lastError = error instanceof Error ? error.message : String(error);
			await Bun.sleep(2_000);
		}
	}
	log(`✗ slot ${slot} muet après ${BOOT_TIMEOUT_MS / 1000}s : ${lastError}`);
	return false;
}

// ── nginx ───────────────────────────────────────────────────────────────────

function upstreamContent(port: number): string {
	return [
		"# Généré par scripts/ops/deploy-site.ts — NE PAS ÉDITER À LA MAIN.",
		"# Seul endroit où nginx apprend quel slot sert le trafic (bascule bleu/vert).",
		`server 127.0.0.1:${port} max_fails=3 fail_timeout=10s;`,
		"",
	].join("\n");
}

async function livePortFromNginx(): Promise<number | null> {
	if (!existsSync(UPSTREAM_FILE)) return null;
	const content = await readFile(UPSTREAM_FILE, "utf8");
	const port = /server\s+127\.0\.0\.1:(\d+)/.exec(content)?.[1];
	return port ? Number(port) : null;
}

async function nginxWorkerPids(): Promise<number[]> {
	const res = await run(["pgrep", "-f", "^nginx: worker process"]);
	return res.stdout
		.split("\n")
		.map((line) => Number(line.trim()))
		.filter((pid) => Number.isFinite(pid) && pid > 0);
}

/** Recharge nginx puis attend que les anciens workers aient fini de drainer. */
async function reloadNginxAndDrain(maxMs = 90_000): Promise<void> {
	const before = await nginxWorkerPids();
	const test = await sudo(["nginx", "-t"]);
	if (test.code !== 0) fail(`nginx refuse la configuration :\n${test.stderr || test.stdout}`);
	const reload = await sudo(["systemctl", "reload", "nginx"]);
	if (reload.code !== 0) fail(`rechargement nginx échoué :\n${reload.stderr}`);

	const startedAt = Date.now();
	while (Date.now() - startedAt < maxMs) {
		const now = new Set(await nginxWorkerPids());
		if (before.filter((pid) => now.has(pid)).length === 0) {
			log(`✓ workers nginx drainés en ${Date.now() - startedAt} ms`);
			return;
		}
		await Bun.sleep(250);
	}
	log("⚠ des workers nginx drainent encore — bascule effective malgré tout");
}

async function switchTraffic(slot: SlotId): Promise<void> {
	await writeAsRoot(UPSTREAM_FILE, upstreamContent(SLOTS[slot].port));
	await reloadNginxAndDrain();
	log(`✓ trafic basculé sur le slot ${slot} (:${SLOTS[slot].port})`);
}

async function verifyPublic(): Promise<number> {
	try {
		const res = await fetch(PUBLIC_URL, {
			redirect: "manual",
			signal: AbortSignal.timeout(20_000),
			headers: { "user-agent": "shenron-deploy/1.0" },
		});
		log(`${res.status < 400 ? "✓" : "✗"} ${PUBLIC_URL} → ${res.status}`);
		return res.status;
	} catch (error) {
		log(`✗ ${PUBLIC_URL} injoignable : ${error instanceof Error ? error.message : String(error)}`);
		return 0;
	}
}

// ── purge ───────────────────────────────────────────────────────────────────

async function listReleases(): Promise<string[]> {
	if (!existsSync(RELEASES_DIR)) return [];
	return (await readdir(RELEASES_DIR)).sort().reverse();
}

async function pruneReleases(keep: number): Promise<void> {
	const releases = await listReleases();
	const pinned = new Set<string>();
	for (const slot of Object.values(SLOTS)) {
		try {
			pinned.add((await run(["readlink", "-f", slot.link])).stdout.trim().split("/").pop() ?? "");
		} catch {
			/* slot jamais pointé */
		}
	}
	const doomed = releases.slice(keep).filter((release) => !pinned.has(release));
	for (const release of doomed) {
		await rm(join(RELEASES_DIR, release), { recursive: true, force: true });
		log(`  · version purgée : ${release}`);
	}
}

// ── commandes ───────────────────────────────────────────────────────────────

async function commandInstall(): Promise<void> {
	await mkdir(RELEASES_DIR, { recursive: true });
	if (!existsSync(UPSTREAM_FILE)) {
		// Défaut = slot A, pour que le vhost soit valide avant le 1er déploiement.
		await writeAsRoot(UPSTREAM_FILE, upstreamContent(SLOTS.a.port));
		log(`✓ amont nginx initialisé (${UPSTREAM_FILE} → :${SLOTS.a.port})`);
	}
	log(`✓ arborescence prête : ${RELEASES_ROOT}`);
}

async function commandStatus(): Promise<void> {
	const state = await readState();
	const livePort = await livePortFromNginx();
	console.log(`amont nginx  : ${livePort ? `127.0.0.1:${livePort}` : "(aucun fichier généré)"}`);
	console.log(`état          : live=${state.live ?? "?"} version=${state.release ?? "?"}`);
	for (const [id, slot] of Object.entries(SLOTS)) {
		const active = (await run(["systemctl", "is-active", slot.unit])).stdout.trim();
		const target = (await run(["readlink", "-f", slot.link])).stdout.trim() || "(non pointé)";
		const live = livePort === slot.port ? "← trafic" : "        ";
		console.log(
			`slot ${id} :${slot.port}  ${live}  ${active.padEnd(10)} ${target.split("/").pop()}`
		);
	}
	const releases = await listReleases();
	console.log(`versions      : ${releases.slice(0, 5).join(", ") || "(aucune)"}`);
}

async function commandDeploy(flags: { build: boolean; allowLowMemory: boolean }): Promise<void> {
	await commandInstall();
	const state = await readState();
	const sha = await currentSha();

	if (flags.build) {
		await checkMemory(flags.allowLowMemory);
		await withBuildVmTuning(() => buildSite(sha));
	} else if (!existsSync(join(BUILD_DIR, "BUILD_ID"))) {
		fail(`--no-build demandé mais aucun build valide dans apps/site/${BUILD_DIR_NAME}`);
	}

	// Slot cible = celui qui ne sert PAS. Au premier passage, l'amont pointe le
	// slot A (legacy, servi depuis le dépôt) → on publie donc sur B.
	const livePort = await livePortFromNginx();
	const liveSlot: SlotId = livePort === SLOTS.b.port ? "b" : "a";
	const target: SlotId = liveSlot === "a" ? "b" : "a";
	log(`slot servant : ${liveSlot} (:${SLOTS[liveSlot].port}) → publication sur ${target}`);

	const version = `${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}-${sha}`;
	const releasePath = await publishRelease(version, state.release);
	await pointSlot(target, releasePath);
	await writeSlotEnv(target, sha);
	await restartSlot(target);

	if (!(await probeSlot(target))) {
		log("↩ sondes en échec — le trafic n'a PAS bougé, arrêt du slot candidat");
		await stopSlot(target);
		fail(`déploiement abandonné (version ${version} publiée mais non basculée)`);
	}

	await switchTraffic(target);
	const publicStatus = await verifyPublic();
	if (publicStatus >= 400 || publicStatus === 0) {
		log("↩ vérification publique en échec — retour sur le slot précédent");
		await switchTraffic(liveSlot);
		await stopSlot(target);
		fail("bascule annulée (rollback nginx effectué)");
	}

	await stopSlot(liveSlot);
	await writeState({ live: target, release: version, previousRelease: state.release });
	await pruneReleases(KEEP_RELEASES);
	log(`✓ site déployé sans coupure · slot ${target} · version ${version}`);
}

async function commandRollback(): Promise<void> {
	const state = await readState();
	if (!state.previousRelease) fail("aucune version précédente connue dans state.json");
	const livePort = await livePortFromNginx();
	const liveSlot: SlotId = livePort === SLOTS.b.port ? "b" : "a";
	const target: SlotId = liveSlot === "a" ? "b" : "a";
	const releasePath = join(RELEASES_DIR, state.previousRelease);
	if (!existsSync(releasePath)) fail(`version ${state.previousRelease} absente du disque`);

	log(`retour sur ${state.previousRelease} via le slot ${target}`);
	await pointSlot(target, releasePath);
	await restartSlot(target);
	if (!(await probeSlot(target))) {
		await stopSlot(target);
		fail("la version précédente ne répond pas — rien n'a bougé");
	}
	await switchTraffic(target);
	await stopSlot(liveSlot);
	await writeState({
		live: target,
		release: state.previousRelease,
		previousRelease: state.release,
	});
	log(`✓ rollback effectué · slot ${target} · version ${state.previousRelease}`);
}

// ── entrée ──────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const command = argv.find((arg) => !arg.startsWith("--")) ?? "deploy";
const flags = {
	build: !argv.includes("--no-build"),
	allowLowMemory: argv.includes("--allow-low-memory"),
};

switch (command) {
	case "deploy":
		await commandDeploy(flags);
		break;
	case "status":
		await commandStatus();
		break;
	case "rollback":
		await commandRollback();
		break;
	case "install":
		await commandInstall();
		break;
	default:
		fail(`commande inconnue : ${command} (deploy | status | rollback | install)`);
}
