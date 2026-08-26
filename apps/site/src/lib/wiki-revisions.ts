/**
 * wiki-revisions — versioning CMS du wiki éditorial (schéma `public`).
 *
 * Chaque écriture passant par `/api/wiki-admin` (create/update/delete + bascule
 * de visibilité) enregistre ici un snapshot AVANT/APRÈS borné aux colonnes
 * mutables, l'auteur figé et l'horodatage. Fournit :
 *   - `recordRevision`  : trace best-effort (n'échoue jamais l'écriture appelante) ;
 *   - `listRevisions`   : flux d'activité (global ou par entité) ;
 *   - `getRevision`     : une révision brute ;
 *   - `revertRevision`  : retour arrière (restaure le snapshot `before`), qui
 *                         enregistre lui-même une nouvelle révision `revert`
 *                         → historique append-only, jamais destructif.
 *
 * Server-only : Drizzle/Postgres + réutilise le CRUD de `wiki-admin.ts`.
 */
import "server-only";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { wikiRevisions, type WikiRevision } from "@/db/schema";
import { WIKI_TABLE_SPECS } from "@/lib/wiki-tables";
import {
	deleteWiki,
	getWikiRow,
	hasVisibility,
	insertWiki,
	restoreWikiVisibility,
	setAllWikiVisibility,
	setWikiVisibility,
	updateWiki,
	type VisibilityState,
} from "@/lib/wiki-admin";

export type RevisionActor = { id: string | null; name: string | null } | null;
export type RevisionAction =
	| "create"
	| "update"
	| "delete"
	| "visibility"
	/** Bascule « tout afficher / tout masquer » sur une table entière. */
	| "visibility-all"
	| "revert";

type Row = Record<string, unknown>;

/** Colonnes lisibles servant de libellé d'entité. */
function deriveLabel(row: Row | null | undefined): string | null {
	if (!row) return null;
	for (const k of ["name", "title", "label"]) {
		const v = row[k];
		if (typeof v === "string" && v.trim()) return v.trim().slice(0, 200);
	}
	return null;
}

/**
 * Réduit une ligne aux colonnes mutables (surface éditable) et retire les blobs
 * jsonb objets (non édités ici, ex. `frames`) → snapshot léger et diffable.
 */
function snapshot(table: string, row: Row | null | undefined): Row | null {
	if (!row) return null;
	const spec = WIKI_TABLE_SPECS[table];
	// `visible` n'est pas une colonne mutable (bascule dédiée) mais on la capture :
	// elle documente l'état publié/masqué et permet le revert d'une visibilité.
	const cols = new Set([...(spec?.mutableColumns ?? Object.keys(row)), "visible"]);
	const out: Row = {};
	for (const c of cols) {
		if (!(c in row)) continue;
		const v = row[c];
		if (v !== null && typeof v === "object") continue; // ignore jsonb objets lourds
		out[c] = v;
	}
	return out;
}

/** Id lisible de la ligne (pk simple, ou composite jointe par ":"). */
export function rowIdOf(table: string, row: Row): string {
	const spec = WIKI_TABLE_SPECS[table];
	const pks = spec ? (Array.isArray(spec.pk) ? spec.pk : [spec.pk]) : ["id"];
	return pks
		.map((snake) => {
			const camel = snake.replace(/_([a-z])/g, (_, c) => (c as string).toUpperCase());
			return String(row[camel] ?? row[snake] ?? "");
		})
		.join(":");
}

/** Clés dont la valeur diffère entre deux snapshots (union des deux côtés). */
function diffKeys(before: Row | null, after: Row | null): string[] {
	const keys = new Set<string>([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
	const changed: string[] = [];
	for (const k of keys) {
		const a = before?.[k];
		const b = after?.[k];
		const av = a == null ? "" : String(a);
		const bv = b == null ? "" : String(b);
		if (av !== bv) changed.push(k);
	}
	return changed;
}

/**
 * Enregistre une révision. Best-effort : loggue et avale toute erreur pour ne
 * JAMAIS faire échouer l'écriture éditoriale qui l'a déclenchée.
 *
 * Renvoie l'id de la révision créée (ou `null` si l'écriture a échoué) — c'est
 * ce que la modération des contributions garde pour offrir « annuler » en un
 * clic sur une proposition acceptée.
 */
export async function recordRevision(input: {
	table: string;
	id?: string;
	action: RevisionAction;
	before?: Row | null;
	after?: Row | null;
	actor?: RevisionActor;
}): Promise<string | null> {
	try {
		const before = snapshot(input.table, input.before);
		const after = snapshot(input.table, input.after);
		const rowId =
			input.id ??
			(input.after
				? rowIdOf(input.table, input.after)
				: input.before
					? rowIdOf(input.table, input.before)
					: "");
		const label = deriveLabel(input.after) ?? deriveLabel(input.before);
		const [inserted] = await db
			.insert(wikiRevisions)
			.values({
				tableName: input.table,
				rowId: String(rowId),
				action: input.action,
				label,
				before,
				after,
				editorId: input.actor?.id ?? null,
				editorName: input.actor?.name ?? null,
			})
			.returning({ id: wikiRevisions.id });
		return inserted?.id ?? null;
	} catch (err) {
		console.error("[wiki-revisions] record failed:", err);
		return null;
	}
}

/**
 * Trace une bascule de visibilité de MASSE, avec l'état ligne à ligne d'avant.
 *
 * Ne passe pas par `recordRevision` : `snapshot()` y réduit la charge aux
 * colonnes mutables d'UNE ligne et écarte les objets, ce qui détruirait
 * précisément la liste qu'on veut conserver. On écrit donc directement, avec une
 * forme dédiée que `revertRevision` sait rejouer.
 *
 * Contrairement à `recordRevision`, cette fonction **propage** ses erreurs :
 * une bascule de masse non tracée est irréversible, l'appelant doit le savoir.
 */
export async function recordBulkVisibilityRevision(input: {
	table: string;
	visible: boolean;
	/** État de chaque ligne AVANT la bascule (vide si au-delà du plafond). */
	previous: VisibilityState[];
	updated: number;
	actor?: RevisionActor;
}): Promise<void> {
	await db.insert(wikiRevisions).values({
		tableName: input.table,
		// `*` = la table entière ; aucune pk réelle ne peut valoir ça.
		rowId: BULK_ROW_ID,
		action: "visibility-all",
		label: `${input.visible ? "Tout afficher" : "Tout masquer"} · ${input.updated} lignes`,
		before: { rows: input.previous, truncated: input.previous.length === 0 },
		after: { visible: input.visible, updated: input.updated },
		editorId: input.actor?.id ?? null,
		editorName: input.actor?.name ?? null,
	});
}

/** `rowId` conventionnel d'une révision portant sur une table entière. */
export const BULK_ROW_ID = "*";

export interface RevisionView {
	id: string;
	tableName: string;
	rowId: string;
	action: string;
	label: string | null;
	editorName: string | null;
	createdAt: string;
	before: Row | null;
	after: Row | null;
	changedKeys: string[];
}

function toView(r: WikiRevision): RevisionView {
	const before = (r.before as Row | null) ?? null;
	const after = (r.after as Row | null) ?? null;
	return {
		id: r.id,
		tableName: r.tableName,
		rowId: r.rowId,
		action: r.action,
		label: r.label ?? null,
		editorName: r.editorName ?? null,
		createdAt: (r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt)).toISOString(),
		before,
		after,
		changedKeys: diffKeys(before, after),
	};
}

/**
 * Liste les révisions. Sans `table`/`rowId` → flux global récent ; avec les deux
 * → historique d'une entité (le studio). `action` filtre le type d'opération.
 */
export async function listRevisions({
	table,
	rowId,
	action,
	limit = 50,
	offset = 0,
}: {
	table?: string;
	rowId?: string;
	action?: string;
	limit?: number;
	offset?: number;
} = {}): Promise<{ rows: RevisionView[]; total: number; limit: number; offset: number }> {
	const lim = Math.min(200, Math.max(1, limit));
	const off = Math.max(0, offset);
	const conds = [
		table ? eq(wikiRevisions.tableName, table) : null,
		rowId ? eq(wikiRevisions.rowId, rowId) : null,
		action ? eq(wikiRevisions.action, action) : null,
	].filter(Boolean) as ReturnType<typeof eq>[];
	const where = conds.length ? and(...conds) : undefined;
	const rows = await db
		.select()
		.from(wikiRevisions)
		.where(where)
		.orderBy(desc(wikiRevisions.createdAt))
		.limit(lim)
		.offset(off);
	const [{ value: total = 0 } = { value: 0 }] = await db
		.select({ value: count() })
		.from(wikiRevisions)
		.where(where);
	return { rows: rows.map(toView), total: Number(total), limit: lim, offset: off };
}

export async function getRevision(id: string): Promise<WikiRevision | null> {
	const [row] = await db.select().from(wikiRevisions).where(eq(wikiRevisions.id, id)).limit(1);
	return row ?? null;
}

/** Nombre de révisions d'une entité (badge « historique » du studio). */
export async function countRevisions(table: string, rowId: string): Promise<number> {
	const [{ value = 0 } = { value: 0 }] = await db
		.select({ value: count() })
		.from(wikiRevisions)
		.where(and(eq(wikiRevisions.tableName, table), eq(wikiRevisions.rowId, rowId)));
	return Number(value);
}

/**
 * Retour arrière : restaure l'état `before` de la révision `id`. Enregistre une
 * nouvelle révision `revert` (append-only). Renvoie le mode appliqué.
 *   - before vide (la ligne avait été CRÉÉE) → suppression ;
 *   - la ligne existe → restauration des colonnes du snapshot ;
 *   - la ligne avait été SUPPRIMÉE → ré-insertion avec sa pk d'origine.
 */
export async function revertRevision(
	id: string,
	actor: RevisionActor
): Promise<{
	table: string;
	rowId: string;
	mode: "restore" | "reinsert" | "delete";
	row: Row | null;
}> {
	const rev = await getRevision(id);
	if (!rev) throw new Error("Révision introuvable");
	const table = rev.tableName;
	const spec = WIKI_TABLE_SPECS[table];
	if (!spec) throw new Error(`Table non réversible : ${table}`);
	const rowId = rev.rowId;
	const before = (rev.before as Row | null) ?? null;
	const current = await getWikiRow(table, rowId).catch(() => null);

	// Revert d'une bascule de MASSE : on réapplique l'instantané ligne à ligne.
	// Sans instantané (table au-delà du plafond de capture), on bascule la table
	// à l'inverse de ce qui avait été demandé — le mieux qu'on puisse garantir.
	if (rev.action === "visibility-all" && hasVisibility(table)) {
		const before = (rev.before as { rows?: VisibilityState[] } | null) ?? null;
		const after = (rev.after as { visible?: boolean } | null) ?? null;
		const rows = Array.isArray(before?.rows) ? before.rows : [];
		let restored: number;
		if (rows.length > 0) {
			restored = await restoreWikiVisibility(table, rows);
		} else {
			const res = await setAllWikiVisibility(table, after?.visible !== true);
			restored = res.updated;
		}
		await recordRevision({
			table,
			id: rowId,
			action: "revert",
			before: null,
			after: null,
			actor,
		});
		return { table, rowId, mode: "restore", row: { restored } };
	}

	// Revert d'une bascule de visibilité → restauration via le chemin dédié
	// (la colonne `visible` n'est pas mutable côté éditeur).
	if (rev.action === "visibility" && hasVisibility(table)) {
		const want = before && typeof before.visible === "boolean" ? before.visible : true;
		await setWikiVisibility(table, rowId, want);
		await recordRevision({
			table,
			id: rowId,
			action: "revert",
			before: current,
			after: { ...current, visible: want },
			actor,
		});
		return { table, rowId, mode: "restore", row: current };
	}

	let mode: "restore" | "reinsert" | "delete";
	let resultRow: Row | null = null;

	if (before == null) {
		// La ligne a été créée par cette révision → revert = suppression.
		if (current) await deleteWiki(table, rowId);
		mode = "delete";
	} else if (current) {
		// La ligne existe → restaure les colonnes mutables du snapshot `before`.
		resultRow = await updateWiki(table, rowId, before);
		mode = "restore";
	} else {
		// La ligne avait été supprimée → ré-insertion. Pour une pk simple (les
		// tables wiki n'ont pas de default sequence), on réinjecte l'id d'origine ;
		// pour une pk composite (tables de jointure), les colonnes fk sont déjà
		// dans le snapshot mutable.
		const payload: Row = { ...before };
		if (!Array.isArray(spec.pk) && !(spec.pk in payload)) {
			payload[spec.pk] = rowId;
		}
		resultRow = await insertWiki(table, payload);
		mode = "reinsert";
	}

	await recordRevision({
		table,
		id: rowId,
		action: "revert",
		before: current,
		after: mode === "delete" ? null : before,
		actor,
	});

	return { table, rowId, mode, row: resultRow ?? current };
}
