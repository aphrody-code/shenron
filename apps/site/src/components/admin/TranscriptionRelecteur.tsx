"use client";

/**
 * Relecture planche par planche d'un databook transcrit.
 *
 * Le studio propose déjà un éditeur de pages (`DatabookPagesPanel`), mais il est
 * conçu pour *construire* une fiche : un bloc par planche, empilés, avec champ
 * image et champ texte. Sur un ouvrage de 362 planches c'est le mauvais outil
 * pour relire — on ne voit jamais la planche en grand à côté de son texte, et
 * chaque enregistrement réémet le tableau `pages` entier, donc écrase tout dépôt
 * de transcription arrivé entre-temps.
 *
 * Ici : une planche à la fois, scan à gauche, texte à droite, navigation au
 * clavier, et une écriture ciblée (`PATCH /api/databooks/:id/pages`) qui ne
 * touche que la planche affichée.
 *
 * Le texte transcrit est du markdown (1 357 planches commencent par un titre
 * `#`) — d'où l'onglet Aperçu, qui montre ce que le lecteur public verra.
 */
import { useMutation } from "@tanstack/react-query";
import {
	AlertTriangle,
	Check,
	ChevronLeft,
	ChevronRight,
	Eye,
	Loader2,
	Pencil,
	Save,
	Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TranscriptionTexte } from "@/components/databooks/TranscriptionTexte";
import { assetUrl } from "@/lib/assets";
import { aBesoinDeNettoyage, diagnostiquerPlanche, nettoyerOcr } from "@/lib/databooks-format";

export interface PlancheRelecture {
	numero: number;
	image: string | null;
	texte: string;
}

type Filtre = "toutes" | "a-transcrire" | "transcrites" | "suspectes";

const FILTRES: { cle: Filtre; libelle: string }[] = [
	{ cle: "toutes", libelle: "Toutes" },
	{ cle: "a-transcrire", libelle: "À transcrire" },
	{ cle: "transcrites", libelle: "Transcrites" },
	{ cle: "suspectes", libelle: "À vérifier" },
];

function estSuspecte(texte: string): boolean {
	return diagnostiquerPlanche(texte).some((a) => !a.reparable);
}

export function TranscriptionRelecteur({
	databookId,
	titre,
	planchesInitiales,
	filtreInitial = "toutes",
	plancheInitiale,
}: {
	databookId: number;
	titre: string;
	planchesInitiales: PlancheRelecture[];
	filtreInitial?: Filtre;
	plancheInitiale?: number;
}) {
	const [planches, setPlanches] = useState(planchesInitiales);
	const [filtre, setFiltre] = useState<Filtre>(filtreInitial);
	const [onglet, setOnglet] = useState<"editer" | "apercu">("editer");
	const [toast, setToast] = useState<string | null>(null);

	const visibles = useMemo(() => {
		if (filtre === "toutes") return planches;
		return planches.filter((p) =>
			filtre === "transcrites"
				? p.texte.trim().length > 0
				: filtre === "a-transcrire"
					? p.texte.trim().length === 0
					: estSuspecte(p.texte)
		);
	}, [planches, filtre]);

	const [numeroCourant, setNumeroCourant] = useState(
		() => plancheInitiale ?? planchesInitiales[0]?.numero ?? 0
	);

	// Le filtre peut faire disparaître la planche affichée : on retombe alors sur
	// la première du nouveau sous-ensemble plutôt que de laisser un écran vide.
	useEffect(() => {
		if (visibles.length === 0) return;
		if (!visibles.some((p) => p.numero === numeroCourant)) {
			setNumeroCourant(visibles[0].numero);
		}
	}, [visibles, numeroCourant]);

	const courante = planches.find((p) => p.numero === numeroCourant) ?? null;
	const indexVisible = visibles.findIndex((p) => p.numero === numeroCourant);

	// Brouillon local : le texte en cours de saisie n'est pas dans `planches`,
	// qui ne reçoit que ce qui a été effectivement écrit en base.
	const [brouillon, setBrouillon] = useState(courante?.texte ?? "");
	const [ancre, setAncre] = useState(numeroCourant);
	if (ancre !== numeroCourant) {
		// Changement de planche : on recharge le brouillon depuis l'état enregistré.
		setAncre(numeroCourant);
		setBrouillon(courante?.texte ?? "");
	}

	const modifie = (courante?.texte ?? "") !== brouillon;
	const anomalies = diagnostiquerPlanche(brouillon);
	const nettoyable = aBesoinDeNettoyage(brouillon);

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(null), 2600);
		return () => clearTimeout(t);
	}, [toast]);

	useEffect(() => {
		if (!modifie) return;
		const avant = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", avant);
		return () => window.removeEventListener("beforeunload", avant);
	}, [modifie]);

	const enregistrer = useMutation({
		mutationFn: async (texte: string) => {
			const r = await fetch(`/api/databooks/${databookId}/pages`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ number: numeroCourant, text: texte.trim() || null }),
			});
			if (!r.ok) {
				throw new Error((await r.json().catch(() => null))?.error ?? "Enregistrement impossible.");
			}
			return (await r.json()) as { number: number; text: string | null };
		},
		onSuccess: (rep) => {
			setPlanches((arr) =>
				arr.map((p) => (p.numero === rep.number ? { ...p, texte: rep.text ?? "" } : p))
			);
			setToast(`Planche n°${rep.number} enregistrée.`);
		},
		onError: (e: Error) => setToast(`Erreur : ${e.message}`),
	});

	const aller = useCallback(
		(delta: -1 | 1) => {
			if (visibles.length === 0) return;
			const i = visibles.findIndex((p) => p.numero === numeroCourant);
			const suivant = visibles[Math.min(visibles.length - 1, Math.max(0, i + delta))];
			if (suivant) setNumeroCourant(suivant.numero);
		},
		[visibles, numeroCourant]
	);

	// Raccourcis : Alt+flèches pour naviguer (les flèches nues doivent rester
	// disponibles dans le champ de saisie), Ctrl/Cmd+S pour enregistrer.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
				e.preventDefault();
				if (modifie && !enregistrer.isPending) enregistrer.mutate(brouillon);
				return;
			}
			if (!e.altKey) return;
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				aller(-1);
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				aller(1);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [aller, brouillon, modifie, enregistrer]);

	const transcrites = planches.filter((p) => p.texte.trim().length > 0).length;
	const compteurs: Record<Filtre, number> = {
		toutes: planches.length,
		"a-transcrire": planches.length - transcrites,
		transcrites,
		suspectes: planches.filter((p) => estSuspecte(p.texte)).length,
	};

	const imageUrl = courante?.image ? assetUrl(courante.image) : null;

	return (
		<div className="grid gap-4 lg:grid-cols-[220px_1fr]">
			{/* ── Index des planches ───────────────────────────────────────────── */}
			<aside className="dbz-panel flex max-h-[80vh] flex-col p-3">
				<div className="mb-2 flex flex-wrap gap-1">
					{FILTRES.map(({ cle, libelle }) => (
						<button
							key={cle}
							type="button"
							onClick={() => setFiltre(cle)}
							aria-pressed={filtre === cle}
							className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
								filtre === cle
									? "border-dbz-orange bg-dbz-orange/10 text-white"
									: "border-white/15 text-white/55 hover:border-white/35 hover:text-white"
							}`}
						>
							{libelle}
							<span className="ml-1 tabular-nums text-white/40">{compteurs[cle]}</span>
						</button>
					))}
				</div>

				{visibles.length === 0 ? (
					<p className="py-6 text-center text-xs text-white/40">
						Aucune planche pour ce filtre.
					</p>
				) : (
					<ol className="-mr-1 grid grid-cols-4 gap-1 overflow-y-auto pr-1">
						{visibles.map((p) => {
							const vide = p.texte.trim().length === 0;
							const alerte = !vide && estSuspecte(p.texte);
							const active = p.numero === numeroCourant;
							return (
								<li key={p.numero}>
									<button
										type="button"
										onClick={() => setNumeroCourant(p.numero)}
										aria-current={active ? "true" : undefined}
										title={
											vide
												? `Planche ${p.numero} — à transcrire`
												: alerte
													? `Planche ${p.numero} — à vérifier`
													: `Planche ${p.numero} — transcrite`
										}
										className={`w-full rounded border py-1 text-center font-mono text-[10px] tabular-nums transition-colors ${
											active
												? "border-dbz-orange bg-dbz-orange/20 text-white"
												: alerte
													? "border-amber-500/40 bg-amber-500/10 text-amber-200 hover:border-amber-400"
													: vide
														? "border-white/10 text-white/35 hover:border-white/30 hover:text-white/70"
														: "border-green-500/25 bg-green-500/5 text-green-200/80 hover:border-green-400/60"
										}`}
									>
										{p.numero}
									</button>
								</li>
							);
						})}
					</ol>
				)}
			</aside>

			{/* ── Planche courante ─────────────────────────────────────────────── */}
			<div className="dbz-panel flex min-w-0 flex-col p-4">
				{toast && (
					<div
						role="status"
						className="mb-3 rounded border border-dbz-orange/40 bg-dbz-orange/10 px-3 py-2 text-xs text-dbz-orange"
					>
						{toast}
					</div>
				)}

				<div className="mb-3 flex flex-wrap items-center gap-2">
					<button
						type="button"
						className="btn btn-ghost h-8 px-2"
						disabled={indexVisible <= 0}
						onClick={() => aller(-1)}
						aria-label="Planche précédente (Alt + flèche gauche)"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<span className="rounded bg-dbz-orange/15 px-2 py-1 font-mono text-xs font-bold tabular-nums text-dbz-orange">
						p. {numeroCourant}
					</span>
					<button
						type="button"
						className="btn btn-ghost h-8 px-2"
						disabled={indexVisible < 0 || indexVisible >= visibles.length - 1}
						onClick={() => aller(1)}
						aria-label="Planche suivante (Alt + flèche droite)"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
					<span className="text-[11px] text-white/40">
						{indexVisible >= 0 ? indexVisible + 1 : 0}/{visibles.length}
					</span>

					<div className="ml-auto flex items-center gap-1">
						{modifie && (
							<span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
								Non enregistré
							</span>
						)}
						<button
							type="button"
							onClick={() => setOnglet(onglet === "editer" ? "apercu" : "editer")}
							className="btn btn-ghost h-8 px-2 text-[11px]"
							title="Bascule entre la saisie et le rendu markdown public"
						>
							{onglet === "editer" ? (
								<>
									<Eye className="h-3.5 w-3.5" /> Aperçu
								</>
							) : (
								<>
									<Pencil className="h-3.5 w-3.5" /> Éditer
								</>
							)}
						</button>
						<button
							type="button"
							className="btn btn-primary h-8 px-3 text-[11px]"
							disabled={!modifie || enregistrer.isPending}
							onClick={() => enregistrer.mutate(brouillon)}
							title="Ctrl + S"
						>
							{enregistrer.isPending ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<Save className="h-3.5 w-3.5" />
							)}
							Enregistrer
						</button>
					</div>
				</div>

				{!courante ? (
					<p className="py-10 text-center text-sm text-white/50">Aucune planche à afficher.</p>
				) : (
					<div className="grid min-w-0 gap-4 xl:grid-cols-2">
						{/* Scan */}
						<div className="min-w-0">
							{imageUrl ? (
								<a
									href={imageUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="block"
									title="Ouvrir le scan en pleine résolution"
								>
									<Image
										src={imageUrl}
										alt={`Planche ${numeroCourant} de ${titre}`}
										width={900}
										height={1300}
										className="h-auto max-h-[70vh] w-full rounded border border-dbz-border/50 object-contain"
										unoptimized
									/>
								</a>
							) : (
								<div className="flex h-64 items-center justify-center rounded border border-dashed border-white/15 text-xs text-white/35">
									Aucun scan pour cette planche
								</div>
							)}
						</div>

						{/* Texte */}
						<div className="flex min-w-0 flex-col">
							{onglet === "editer" ? (
								<textarea
									value={brouillon}
									onChange={(e) => setBrouillon(e.target.value)}
									spellCheck={false}
									aria-label={`Transcription de la planche ${numeroCourant}`}
									placeholder="Transcription de la planche (markdown accepté)…"
									className="input font-jp min-h-[50vh] w-full flex-1 resize-y text-sm leading-relaxed"
								/>
							) : (
								<div className="min-h-[50vh] flex-1 overflow-y-auto rounded border border-dbz-border/50 bg-black/25 p-4">
									{brouillon.trim() ? (
										<TranscriptionTexte texte={brouillon} />
									) : (
										<p className="text-sm italic text-white/40">Aucun texte à prévisualiser.</p>
									)}
								</div>
							)}

							<div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
								<span className="tabular-nums">{brouillon.length} signes</span>
								{nettoyable && (
									<button
										type="button"
										onClick={() => setBrouillon((t) => nettoyerOcr(t))}
										className="inline-flex items-center gap-1 rounded border border-dbz-border/60 px-2 py-1 font-semibold text-dbz-blue-light transition-colors hover:border-dbz-orange hover:text-dbz-orange"
										title="Retire les espaces et sauts de ligne superflus, sans toucher au texte"
									>
										<Sparkles className="h-3 w-3" />
										Nettoyer la mise en forme
									</button>
								)}
								<span className="ml-auto text-white/30">
									Alt + ← / → pour naviguer · Ctrl + S pour enregistrer
								</span>
							</div>

							{anomalies.length > 0 && (
								<ul className="mt-2 space-y-1">
									{anomalies.map((a) => (
										<li
											key={a.code}
											className={`flex items-start gap-1.5 rounded border px-2 py-1 text-[11px] ${
												a.reparable
													? "border-white/10 bg-white/[0.03] text-white/55"
													: "border-amber-500/30 bg-amber-500/5 text-amber-200/90"
											}`}
										>
											{a.reparable ? (
												<Check className="mt-0.5 h-3 w-3 shrink-0" />
											) : (
												<AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
											)}
											{a.message}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
