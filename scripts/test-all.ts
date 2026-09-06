#!/usr/bin/env bun
// SPDX-License-Identifier: Apache-2.0
//
// test-all.ts — custom Bun test runner that covers EVERY workspace scope.
//
// Why this exists: `turbo run test` only runs scopes that declare a `test`
// script, so any package without one is SILENTLY skipped — coverage looks green
// while whole scopes are never exercised. This runner instead enumerates every
// member from the `workspaces` globs, runs `bun test` per scope in its OWN cwd
// (so each scope's `bunfig.toml [test].preload` applies — reflect-metadata, the
// canvas shim, the test DB setup), classifies special scopes EXPLICITLY (no
// silent skips), prints a full scope matrix, and fails on any unexplained gap.
//
// Usage:
//   bun scripts/test-all.ts                 # default offline tier (unit scopes)
//   bun scripts/test-all.ts --live          # also run live-network tiers (site no-404 crawler)
//   bun scripts/test-all.ts --strict        # zero-test scopes FAIL the run (gap = error)
//   bun scripts/test-all.ts --coverage      # per-scope lcov into coverage/<scope>/
//   bun scripts/test-all.ts --junit         # per-scope JUnit xml into test-results/<scope>.xml
//   bun scripts/test-all.ts --filter bot    # only scopes whose name/path contains "bot"
//   bun scripts/test-all.ts --bail          # stop a scope's suite after first failure
//   bun scripts/test-all.ts --jobs 4        # run up to 4 independent scopes in parallel
//   bun scripts/test-all.ts --json          # machine-readable summary on stdout
//
// Exit code: 0 iff every selected runnable scope passed and (in --strict) no gap.

import { Glob } from "bun";
import { existsSync } from "node:fs";
import { cpus } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");

// ── CLI ───────────────────────────────────────────────────────────────────────
const argv = new Set(Bun.argv.slice(2));
const flag = (n: string) => argv.has(n);
const opt = (n: string): string | undefined => {
	const args = Bun.argv.slice(2);
	for (let i = 0; i < args.length; i++) {
		if (args[i].startsWith(`${n}=`)) return args[i].slice(n.length + 1);
		if (args[i] === n && i + 1 < args.length && !args[i + 1].startsWith("--")) return args[i + 1];
	}
	return undefined;
};
const RUN_LIVE = flag("--live") || flag("--all");
const RUN_VENDORED = flag("--vendored") || flag("--all");
const STRICT = flag("--strict");
const COVERAGE = flag("--coverage");
const JUNIT = flag("--junit");
const BAIL = flag("--bail");
const JSON_OUT = flag("--json");
const FILTER = opt("--filter");
const jobsOpt = opt("--jobs") ?? "1";
const autoJobs = Math.min(8, Math.max(1, (cpus().length || 1) - 1));
const JOBS = jobsOpt.toLowerCase() === "auto"
	? autoJobs
	: Math.max(1, Math.floor(Number(jobsOpt)) || 1);

// Flags forwarded verbatim to every per-scope `bun test` invocation. These make
// the runner a real flake/order-dependence harness, not just a launcher:
//   --randomize / --seed=N   surface tests that rely on shared state or order
//                            (critical here: @singleton DI + a shared test DB)
//   --rerun-each=N           run each test N times to catch non-determinism
//   --retry=N                retry failed tests N times (report pass-on-retry)
//   --concurrent / --max-concurrency=N   parallelism within a file
//   -t / --test-name-pattern REGEX       narrow to matching test names
const PASSTHROUGH: string[] = (() => {
	const out: string[] = [];
	const bools = ["--randomize", "--concurrent"];
	const vals = [
		"--seed",
		"--rerun-each",
		"--retry",
		"--max-concurrency",
		"--test-name-pattern",
		"-t",
	];
	for (const b of bools) if (flag(b)) out.push(b);
	for (const v of vals) {
		const val = opt(v);
		if (val !== undefined) out.push(v, val);
	}
	return out;
})();

// Artifact / non-source trees that must never be scanned for tests.
const PRUNE = ["node_modules", ".next", "dist", "build", "coverage", ".turbo", ".git"];

// ── Scope policy ──────────────────────────────────────────────────────────────
// mode:
//   unit     run `bun test` here; 0 test files => GAP (fails in --strict)
//   live     network/prod-hitting suite; skipped unless --live
//   vendored third-party fork; skipped unless --vendored
//   skip     never run (broken/irrelevant); always reported with a reason
type Mode = "unit" | "live" | "vendored" | "skip";
interface Policy {
	mode?: Mode;
	reason?: string;
	testDir?: string; // subdir to pass to `bun test` (default: auto)
	perFile?: boolean; // run each *.test.ts in its own process (fixture isolation)
	preload?: string[]; // extra --preload modules
	prep?: string[][]; // commands to run in cwd before testing (must succeed)
	env?: Record<string, string>;
	timeoutMs?: number; // per-test timeout
}

// Keyed by package name. Unknown scopes default to { mode: "unit" }.
const POLICY: Record<string, Policy> = {
	// First-party Bun bot: needs the generated command-entry barrel + its own
	// bunfig preload (reflect-metadata + canvas shim + fresh ./data/test.db).
	"@shenron/bot": {
		mode: "unit",
		testDir: "tests",
		prep: [["bun", "run", "gen:entries"]],
		timeoutMs: 30_000,
	},
	// Next.js site: its only suite (no-404) is a LIVE crawler against prod
	// dragonballfr.com — network-bound and flaky, kept out of the default tier.
	"@shenron/site": {
		mode: "live",
		reason: "no-404 suite fetches live prod (dragonballfr.com); opt-in via --live",
		testDir: "tests",
		timeoutMs: 120_000,
	},
	// Vendored discordx fork (re-scoped @rpbey/*), but with real pure surfaces —
	// run them as unit (they now carry their own suites). discordy fixtures do
	// not survive a shared process, so isolate per file (mirrors its own script).
	"@rpbey/discordy": {
		mode: "unit",
		testDir: "tests",
		perFile: true,
		preload: ["reflect-metadata"],
	},
	"@rpbey/di": { mode: "unit", testDir: "tests", preload: ["reflect-metadata"] },
	"@rpbey/importer": { mode: "unit", testDir: "tests" },
	"@rpbey/internal": { mode: "unit", testDir: "tests" },
	"@rpbey/pagination": { mode: "unit", testDir: "tests" },
};

// ── Workspace discovery ───────────────────────────────────────────────────────
interface Member {
	name: string;
	dir: string; // absolute
	rel: string; // relative to ROOT
	policy: Policy;
}

async function discoverMembers(): Promise<Member[]> {
	const rootPkg = (await Bun.file(join(ROOT, "package.json")).json()) as {
		workspaces?: string[] | { packages?: string[] };
	};
	const ws = rootPkg.workspaces;
	const globs = Array.isArray(ws) ? ws : (ws?.packages ?? []);
	const seen = new Set<string>();
	const members: Member[] = [];
	for (const g of globs) {
		// workspace globs point at member dirs; the package.json sits inside each.
		const glob = new Glob(`${g}/package.json`);
		for await (const rel of glob.scan({ cwd: ROOT, onlyFiles: true, followSymlinks: false })) {
			if (PRUNE.some((p) => rel.split("/").includes(p))) continue;
			const dir = resolve(ROOT, rel, "..");
			if (seen.has(dir)) continue;
			seen.add(dir);
			let name = rel;
			try {
				name = ((await Bun.file(resolve(ROOT, rel)).json()) as { name?: string }).name ?? rel;
			} catch {
				/* keep rel as name */
			}
			members.push({
				name,
				dir,
				rel: resolve(ROOT, rel, "..").slice(ROOT.length + 1),
				policy: POLICY[name] ?? { mode: "unit" },
			});
		}
	}
	members.sort((a, b) => a.rel.localeCompare(b.rel));
	return members;
}

// Count test files in a member dir, pruning artifact trees.
async function countTests(dir: string, testDir?: string): Promise<string[]> {
	const base = testDir ? join(dir, testDir) : dir;
	if (!existsSync(base)) return [];
	const glob = new Glob("**/*.{test,spec}.{ts,tsx,js,jsx}");
	const out: string[] = [];
	for await (const rel of glob.scan({ cwd: base, onlyFiles: true, followSymlinks: false })) {
		if (PRUNE.some((p) => rel.split("/").includes(p))) continue;
		out.push(join(base, rel));
	}
	return out;
}

// ── Execution ─────────────────────────────────────────────────────────────────
type Status = "PASS" | "FAIL" | "NO-TESTS" | "SKIP" | "PREP-FAIL";
interface Result {
	member: Member;
	status: Status;
	tests: number;
	durationMs: number;
	note?: string;
}

function safeName(name: string): string {
	return name.replace(/[@/]/g, "_").replace(/^_+/, "");
}

async function runCmd(cmd: string[], cwd: string, env: Record<string, string>): Promise<number> {
	const proc = Bun.spawn(cmd, {
		cwd,
		env: { ...process.env, ...env },
		stdout: "inherit",
		stderr: "inherit",
	});
	return await proc.exited;
}

async function runScope(m: Member, files: string[]): Promise<Result> {
	const t0 = Bun.nanoseconds();
	const env: Record<string, string> = {
		NODE_ENV: "test",
		FORCE_COLOR: "1",
		...m.policy.env,
	};

	// Prep steps (e.g. gen:entries) — must succeed or the scope is PREP-FAIL.
	for (const cmd of m.policy.prep ?? []) {
		const code = await runCmd(cmd, m.dir, env);
		if (code !== 0) {
			return {
				member: m,
				status: "PREP-FAIL",
				tests: files.length,
				durationMs: (Bun.nanoseconds() - t0) / 1e6,
				note: `prep failed: ${cmd.join(" ")}`,
			};
		}
	}

	// Pass the explicitly-discovered, artifact-pruned files (absolute paths, so
	// Bun treats them as paths not name-filters). Bun's own recursive discovery
	// does NOT prune .next/dist/build, so it would double-run build-output copies
	// of test files — passing exact paths avoids that entirely.
	const baseArgs = ["test", ...files];
	for (const p of m.policy.preload ?? []) baseArgs.push("--preload", p);
	if (m.policy.timeoutMs) baseArgs.push("--timeout", String(m.policy.timeoutMs));
	if (BAIL) baseArgs.push("--bail");
	if (COVERAGE)
		baseArgs.push(
			"--coverage",
			"--coverage-reporter=lcov",
			`--coverage-dir=${join(ROOT, "coverage", safeName(m.name))}`
		);
	if (JUNIT) {
		baseArgs.push(
			"--reporter=junit",
			"--reporter-outfile",
			join(ROOT, "test-results", `${safeName(m.name)}.xml`)
		);
	}
	baseArgs.push(...PASSTHROUGH);

	let failed = false;
	if (m.policy.perFile) {
		// Isolate each file in its own `bun test` process (fixture isolation).
		for (const f of files) {
			const args = ["test", f];
			for (const p of m.policy.preload ?? []) args.push("--preload", p);
			if (m.policy.timeoutMs) args.push("--timeout", String(m.policy.timeoutMs));
			args.push(...PASSTHROUGH);
			const code = await runCmd(["bun", ...args], m.dir, env);
			if (code !== 0) failed = true;
		}
	} else {
		const code = await runCmd(["bun", ...baseArgs], m.dir, env);
		if (code !== 0) failed = true;
	}

	return {
		member: m,
		status: failed ? "FAIL" : "PASS",
		tests: files.length,
		durationMs: (Bun.nanoseconds() - t0) / 1e6,
	};
}

// ── Main ──────────────────────────────────────────────────────────────────────
const members = await discoverMembers();
const selected = members.filter(
	(m) => !FILTER || m.name.includes(FILTER) || m.rel.includes(FILTER)
);

console.log(
	`\x1b[1mtest-all\x1b[0m — ${selected.length}/${members.length} scopes selected` +
		(FILTER ? ` (filter: ${FILTER})` : "")
);
console.log(
	`tiers: unit=on  live=${RUN_LIVE ? "on" : "off"}  vendored=${RUN_VENDORED ? "on" : "off"}  strict=${STRICT ? "on" : "off"}  coverage=${COVERAGE ? "on" : "off"}\n`
);

const runnable: Array<{ member: Member; files: string[]; resultIndex: number }> = [];
const results: Result[] = [];
for (const m of selected) {
	const mode = m.policy.mode ?? "unit";
	const files = await countTests(m.dir, m.policy.testDir);

	if (mode === "skip") {
		results.push({
			member: m,
			status: "SKIP",
			tests: files.length,
			durationMs: 0,
			note: m.policy.reason ?? "policy: skip",
		});
		continue;
	}
	if (mode === "live" && !RUN_LIVE) {
		results.push({
			member: m,
			status: "SKIP",
			tests: files.length,
			durationMs: 0,
			note: m.policy.reason ?? "live tier (use --live)",
		});
		continue;
	}
	if (mode === "vendored" && !RUN_VENDORED) {
		results.push({
			member: m,
			status: "SKIP",
			tests: files.length,
			durationMs: 0,
			note: m.policy.reason ?? "vendored (use --vendored)",
		});
		continue;
	}
	if (files.length === 0) {
		results.push({
			member: m,
			status: "NO-TESTS",
			tests: 0,
			durationMs: 0,
			note: "scope has zero test files",
		});
		continue;
	}
	const resultIndex = results.length;
	// Reserve the slot now; workers complete out of order.
	results.push(undefined as unknown as Result);
	runnable.push({ member: m, files, resultIndex });
}

// Scope processes are isolated by cwd and Bun process, so independent scopes
// can use the machine's spare CPU/RAM. Keep the default at one job because
// some external/integration fixtures intentionally assume serial execution.
if (JOBS > 1) console.log(`parallel scopes: up to ${JOBS} jobs`);
let next = 0;
const worker = async () => {
	while (next < runnable.length) {
		const index = next++;
		const { member, files, resultIndex } = runnable[index];
		console.log(`\x1b[36m▶ ${member.name}\x1b[0m (${member.rel}) — ${files.length} file(s)`);
		results[resultIndex] = await runScope(member, files);
		console.log("");
	}
};
await Promise.all(Array.from({ length: Math.min(JOBS, runnable.length) }, worker));

// ── Report ────────────────────────────────────────────────────────────────────
const colour: Record<Status, string> = {
	PASS: "\x1b[32mPASS\x1b[0m",
	FAIL: "\x1b[31mFAIL\x1b[0m",
	"NO-TESTS": "\x1b[33mNO-TESTS\x1b[0m",
	SKIP: "\x1b[90mSKIP\x1b[0m",
	"PREP-FAIL": "\x1b[31mPREP-FAIL\x1b[0m",
};
const pad = (s: string, n: number) => s + " ".repeat(Math.max(0, n - s.length));
const nameW = Math.max(...results.map((r) => r.member.name.length), 12);

console.log("\x1b[1m── scope matrix ───────────────────────────────────────────────\x1b[0m");
for (const r of results) {
	const dur = r.durationMs ? `${(r.durationMs / 1000).toFixed(2)}s` : "";
	console.log(
		`  ${colour[r.status]}  ${pad(r.member.name, nameW)}  ${pad(String(r.tests) + "f", 5)} ${pad(dur, 8)} ${r.note ?? ""}`
	);
}

const pass = results.filter((r) => r.status === "PASS");
const fail = results.filter((r) => r.status === "FAIL" || r.status === "PREP-FAIL");
const gaps = results.filter((r) => r.status === "NO-TESTS");
const skipped = results.filter((r) => r.status === "SKIP");
const totalTests = results.reduce(
	(n, r) => n + (r.status === "PASS" || r.status === "FAIL" ? r.tests : 0),
	0
);

console.log("\x1b[1m───────────────────────────────────────────────────────────────\x1b[0m");
console.log(
	`scopes: ${selected.length}  |  \x1b[32m${pass.length} pass\x1b[0m  \x1b[31m${fail.length} fail\x1b[0m  ` +
		`\x1b[33m${gaps.length} no-tests\x1b[0m  \x1b[90m${skipped.length} skip\x1b[0m  |  ${totalTests} test files run`
);
if (gaps.length) console.log(`gaps (no tests): ${gaps.map((g) => g.member.name).join(", ")}`);

if (JSON_OUT) {
	console.log(
		JSON.stringify(
			{
				scopes: results.map((r) => ({
					name: r.member.name,
					rel: r.member.rel,
					status: r.status,
					tests: r.tests,
					ms: Math.round(r.durationMs),
					note: r.note,
				})),
			},
			null,
			2
		)
	);
}

const failed = fail.length > 0 || (STRICT && gaps.length > 0);
if (STRICT && gaps.length)
	console.log("\x1b[31m✗ strict mode: zero-test scopes are failures\x1b[0m");
process.exit(failed ? 1 : 0);
