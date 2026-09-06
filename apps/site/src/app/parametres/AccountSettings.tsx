"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Download,
	ExternalLink,
	Laptop,
	LoaderCircle,
	LogOut,
	ShieldCheck,
	Trash2,
	X,
} from "lucide-react";
import { SignOut } from "@/components/SignOut";
import { authClient } from "@/lib/auth-client";

type Props = { initial: { name: string; image: string; discordId: string } };

type AccountSession = {
	id: string;
	token: string;
	createdAt: Date | string;
	updatedAt: Date | string;
	expiresAt: Date | string;
	ipAddress?: string | null;
	userAgent?: string | null;
};

const sessionDate = new Intl.DateTimeFormat("fr-FR", {
	dateStyle: "medium",
	timeStyle: "short",
});

function describeDevice(userAgent?: string | null) {
	if (!userAgent) return "Appareil inconnu";
	const os = /Android/i.test(userAgent)
		? "Android"
		: /iPhone|iPad|iPod/i.test(userAgent)
			? "iOS"
			: /Windows/i.test(userAgent)
				? "Windows"
				: /Mac OS X|Macintosh/i.test(userAgent)
					? "macOS"
					: /Linux/i.test(userAgent)
						? "Linux"
						: "Appareil inconnu";
	const browser = /Edg\//i.test(userAgent)
		? "Edge"
		: /Firefox\//i.test(userAgent)
			? "Firefox"
			: /Chrome\//i.test(userAgent)
				? "Chrome"
				: /Safari\//i.test(userAgent)
					? "Safari"
					: null;
	return browser ? `${browser} · ${os}` : os;
}

export default function AccountSettings({ initial }: Props) {
	const router = useRouter();
	const deletionDialog = useRef<HTMLDialogElement>(null);
	const [name, setName] = useState(initial.name);
	const [image, setImage] = useState(initial.image);
	const [message, setMessage] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [sessions, setSessions] = useState<AccountSession[] | null>(null);
	const [currentToken, setCurrentToken] = useState<string | null>(null);
	const [sessionsError, setSessionsError] = useState(false);
	const [revokingToken, setRevokingToken] = useState<string | null>(null);

	const loadSessions = useCallback(async () => {
		setSessionsError(false);
		const [sessionsResult, currentResult] = await Promise.all([
			authClient.listSessions(),
			authClient.getSession(),
		]);
		if (sessionsResult.error) {
			setSessionsError(true);
			setSessions([]);
			return;
		}
		setSessions(sessionsResult.data ?? []);
		setCurrentToken(currentResult.data?.session.token ?? null);
	}, []);

	useEffect(() => {
		void loadSessions();
	}, [loadSessions]);

	async function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const avatar = image.trim();
		if (avatar) {
			try {
				if (new URL(avatar).protocol !== "https:") throw new Error("not https");
			} catch {
				setMessage("L’avatar doit utiliser une URL HTTPS valide.");
				return;
			}
		}
		setBusy(true);
		setMessage(null);
		const result = await authClient.updateUser({
			name: name.trim(),
			image: avatar || undefined,
		});
		setBusy(false);
		if (result.error) setMessage("Impossible d’enregistrer ces informations.");
		else {
			setMessage("Profil enregistré.");
			router.refresh();
		}
	}

	async function revokeOthers() {
		setBusy(true);
		setMessage(null);
		const result = await authClient.revokeOtherSessions();
		setBusy(false);
		if (result.error) {
			setMessage("Impossible de fermer les autres sessions.");
			return;
		}
		setMessage("Toutes les autres sessions ont été fermées.");
		await loadSessions();
	}

	async function revokeOne(token: string) {
		setRevokingToken(token);
		setMessage(null);
		const result = await authClient.revokeSession({ token });
		setRevokingToken(null);
		if (result.error) {
			setMessage("Impossible de fermer cette session.");
			return;
		}
		setSessions((current) => current?.filter((session) => session.token !== token) ?? []);
		setMessage("La session a été fermée.");
	}

	async function deleteAccount() {
		setBusy(true);
		setMessage(null);
		const result = await authClient.deleteUser({ callbackURL: "/" });
		setBusy(false);
		if (result.error) {
			deletionDialog.current?.close();
			setMessage("La suppression n’a pas pu être effectuée. Réessayez après vous être reconnecté.");
			return;
		}
		router.replace("/");
		router.refresh();
	}

	return (
		<div>
			<header className="mb-8">
				<p className="text-sm font-semibold text-dbz-orange">Compte membre</p>
				<h1 className="mt-2 font-saiyan text-5xl leading-none md:text-6xl">Paramètres</h1>
				<p className="mt-3 max-w-2xl text-white/55">
					Contrôlez votre identité publique, vos sessions et les données conservées par DBFR.
				</p>
			</header>
			{message && (
				<p
					role="status"
					className="mb-5 rounded-xl border border-dbz-orange/40 bg-dbz-orange/10 p-4 text-sm text-white"
				>
					{message}
				</p>
			)}
			<div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
				<section className="rounded-2xl border border-white/10 bg-[#171512] p-5 md:p-7">
					<h2 className="text-lg font-semibold">Identité publique</h2>
					<p className="mt-1 text-sm text-white/45">
						Le pseudo et l’avatar s’affichent sur votre profil DBFR. Votre identifiant Discord reste
						inchangé.
					</p>
					<form onSubmit={save} className="mt-6 space-y-5">
						<label className="block text-sm font-medium text-white/75">
							Pseudo
							<input
								autoComplete="nickname"
								required
								minLength={2}
								maxLength={48}
								value={name}
								onChange={(event) => setName(event.target.value)}
								className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 text-white outline-none focus:border-dbz-orange focus:ring-2 focus:ring-dbz-orange/20"
							/>
						</label>
						<label className="block text-sm font-medium text-white/75">
							URL de l’avatar
							<input
								type="url"
								inputMode="url"
								autoComplete="url"
								maxLength={500}
								value={image}
								onChange={(event) => setImage(event.target.value)}
								placeholder="https://…"
								className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 text-white outline-none focus:border-dbz-orange focus:ring-2 focus:ring-dbz-orange/20"
							/>
						</label>
						<p className="text-xs text-white/35">Identifiant Discord : {initial.discordId}</p>
						<button
							disabled={busy || name.trim().length < 2}
							className="min-h-11 rounded-full bg-dbz-orange px-5 text-sm font-bold text-black hover:bg-yellow-300 disabled:opacity-50"
						>
							{busy ? "Enregistrement…" : "Enregistrer les modifications"}
						</button>
					</form>
				</section>
				<div className="space-y-5">
					<section className="rounded-2xl border border-white/10 bg-[#171512] p-5">
						<ShieldCheck className="h-5 w-5 text-dbz-orange" aria-hidden />
						<h2 className="mt-4 font-semibold">Sécurité des sessions</h2>
						<p className="mt-1 text-sm text-white/45">
							Contrôlez les connexions ouvertes sur vos appareils.
						</p>
						{sessions === null ? (
							<div className="mt-5 flex items-center gap-2 text-sm text-white/45" role="status">
								<LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
								Chargement des sessions…
							</div>
						) : sessionsError ? (
							<div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/5 p-3">
								<p className="text-sm text-red-100/70">Les sessions sont indisponibles.</p>
								<button
									type="button"
									onClick={() => void loadSessions()}
									className="mt-2 text-xs font-semibold text-dbz-orange hover:text-yellow-200"
								>
									Réessayer
								</button>
							</div>
						) : (
							<>
								{sessions.length === 0 && (
									<p className="mt-5 text-sm text-white/45">Aucune session active à afficher.</p>
								)}
								<ul className="mt-5 space-y-2">
									{sessions.map((session) => {
										const isCurrent = session.token === currentToken;
										return (
											<li
												key={session.id}
												className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3"
											>
												<Laptop className="mt-0.5 h-4 w-4 shrink-0 text-white/45" aria-hidden />
												<div className="min-w-0 flex-1">
													<div className="flex flex-wrap items-center gap-2">
														<p className="text-sm font-medium text-white/80">
															{describeDevice(session.userAgent)}
														</p>
														{isCurrent && (
															<span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
																Cette session
															</span>
														)}
													</div>
													<p className="mt-1 truncate text-xs text-white/35">
														{session.ipAddress || "Adresse IP inconnue"} · Activité le{" "}
														{sessionDate.format(new Date(session.updatedAt))}
													</p>
												</div>
												{!isCurrent && (
													<button
														type="button"
														onClick={() => void revokeOne(session.token)}
														disabled={revokingToken !== null || busy}
														aria-label={`Fermer la session ${describeDevice(session.userAgent)}`}
														className="rounded-lg p-1.5 text-white/35 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-40"
													>
														{revokingToken === session.token ? (
															<LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
														) : (
															<X className="h-4 w-4" aria-hidden />
														)}
													</button>
												)}
											</li>
										);
									})}
								</ul>
							</>
						)}
						<button
							type="button"
							onClick={revokeOthers}
							disabled={busy || revokingToken !== null || (sessions?.length ?? 0) < 2}
							className="mt-5 min-h-11 w-full rounded-xl border border-white/15 px-4 text-sm font-semibold text-white/70 hover:border-dbz-orange hover:text-white disabled:opacity-50"
						>
							Fermer les autres sessions
						</button>
					</section>
					<section className="rounded-2xl border border-white/10 bg-[#171512] p-5">
						<Download className="h-5 w-5 text-dbz-blue-light" aria-hidden />
						<h2 className="mt-4 font-semibold">Vos données</h2>
						<p className="mt-1 text-sm text-white/45">
							Téléchargez une copie JSON de votre compte, vos préférences et votre progression.
						</p>
						<a
							href="/api/account/export"
							download
							className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-white/70 hover:border-dbz-blue-light hover:text-white"
						>
							Télécharger mes données <Download className="h-4 w-4" />
						</a>
					</section>
				</div>
			</div>
			<section className="mt-5 rounded-2xl border border-red-400/20 bg-red-950/10 p-5 md:p-7">
				<h2 className="font-semibold text-red-200">Supprimer le compte</h2>
				<p className="mt-1 max-w-2xl text-sm text-white/45">
					Cette action supprime immédiatement le compte d’authentification DBFR et ferme ses
					sessions. Les données communautaires Discord gérées par le bot suivent leur propre
					politique.
				</p>
				<button
					type="button"
					onClick={() => deletionDialog.current?.showModal()}
					disabled={busy}
					className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-red-400/40 px-5 text-sm font-semibold text-red-200 hover:bg-red-500/10"
				>
					<Trash2 className="h-4 w-4" />
					Supprimer mon compte
				</button>
			</section>
			<div className="mt-6 flex flex-wrap items-center gap-4">
				<SignOut className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-white/65 hover:text-white">
					<LogOut className="h-4 w-4" />
					Se déconnecter
				</SignOut>
				<Link
					href="/profil/me"
					className="inline-flex items-center gap-1 text-sm text-dbz-blue-light hover:text-dbz-orange"
				>
					Voir le profil public <ExternalLink className="h-3.5 w-3.5" />
				</Link>
			</div>
			<dialog
				ref={deletionDialog}
				aria-labelledby="delete-title"
				className="m-auto max-w-md rounded-2xl border border-red-400/30 bg-[#181311] p-0 text-white shadow-2xl backdrop:bg-black/75"
			>
				<div className="p-6">
					<Trash2 className="h-6 w-6 text-red-300" aria-hidden />
					<h2 id="delete-title" className="mt-4 text-xl font-semibold">
						Supprimer définitivement le compte ?
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-white/55">
						Cette action est irréversible. Vous serez déconnecté de DBFR sur tous vos appareils.
					</p>
					<div className="mt-6 flex justify-end gap-3">
						<button
							type="button"
							onClick={() => deletionDialog.current?.close()}
							className="min-h-11 rounded-full px-4 text-sm text-white/65 hover:bg-white/5"
						>
							Annuler
						</button>
						<button
							type="button"
							onClick={deleteAccount}
							disabled={busy}
							className="min-h-11 rounded-full bg-red-500 px-5 text-sm font-bold text-white hover:bg-red-400 disabled:opacity-50"
						>
							{busy ? "Suppression…" : "Supprimer le compte"}
						</button>
					</div>
				</div>
			</dialog>
		</div>
	);
}
