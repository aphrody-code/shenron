"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { SignOut } from "@/components/SignOut";

type Props = { initial: { name: string; image: string; discordId: string } };

export default function AccountSettings({ initial }: Props) {
	const router = useRouter();
	const [name, setName] = useState(initial.name);
	const [image, setImage] = useState(initial.image);
	const [message, setMessage] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	async function save(event: FormEvent) {
		event.preventDefault();
		setBusy(true); setMessage(null);
		const result = await authClient.updateUser({ name: name.trim(), image: image.trim() || undefined });
		setBusy(false);
		if (result.error) setMessage("Impossible d'enregistrer ces informations.");
		else { setMessage("Profil enregistré."); router.refresh(); }
	}

	async function revokeOthers() {
		setBusy(true); setMessage(null);
		const result = await authClient.revokeOtherSessions();
		setBusy(false);
		setMessage(result.error ? "Impossible de fermer les autres sessions." : "Toutes les autres sessions ont été fermées.");
	}

	async function deleteAccount() {
		if (!window.confirm("Supprimer définitivement votre compte DBFR et vos sessions ?")) return;
		setBusy(true); setMessage(null);
		const result = await authClient.deleteUser({ callbackURL: "/" });
		setBusy(false);
		if (result.error) setMessage("La suppression n'a pas pu être lancée. Vérifiez votre e-mail ou réessayez.");
	}

	return <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
		<div className="mb-8"><p className="font-scouter text-xs uppercase tracking-[.2em] text-dbz-orange">Compte membre</p><h1 className="mt-2 font-saiyan text-4xl text-white md:text-6xl">Paramètres</h1><p className="mt-3 max-w-xl text-white/60">Gérez votre identité publique, vos sessions et vos données DBFR.</p></div>
		{message && <p role="status" className="mb-5 border border-dbz-orange/40 bg-dbz-orange/10 p-3 text-sm text-white">{message}</p>}
		<section className="dbz-panel p-5 md:p-8"><h2 className="font-saiyan text-2xl text-dbz-orange">Identité publique</h2><p className="mt-1 text-sm text-white/55">Ces informations apparaissent sur votre profil. Discord reste la source de votre identifiant.</p>
			<form onSubmit={save} className="mt-6 space-y-5"><label className="block text-sm text-white/75">Pseudo<input required minLength={2} maxLength={48} value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded border border-white/15 bg-black/30 px-3 py-3 text-white outline-none focus:border-dbz-orange" /></label><label className="block text-sm text-white/75">URL de l’avatar<input type="url" maxLength={500} value={image} onChange={e => setImage(e.target.value)} placeholder="https://…" className="mt-2 w-full rounded border border-white/15 bg-black/30 px-3 py-3 text-white outline-none focus:border-dbz-orange" /></label><p className="font-mono text-xs text-white/40">Discord ID : {initial.discordId}</p><button disabled={busy} className="rounded bg-dbz-orange px-5 py-3 font-bold text-black disabled:opacity-50">{busy ? "Enregistrement…" : "Enregistrer"}</button></form>
		</section>
		<section className="dbz-panel mt-5 p-5 md:p-8"><h2 className="font-saiyan text-2xl text-dbz-orange">Sécurité</h2><p className="mt-1 text-sm text-white/55">Fermez les sessions ouvertes sur les autres appareils.</p><button onClick={revokeOthers} disabled={busy} className="mt-5 rounded border border-white/20 px-4 py-3 text-sm text-white hover:border-dbz-orange disabled:opacity-50">Fermer les autres sessions</button></section>
		<section className="mt-5 border border-red-500/30 bg-red-950/10 p-5 md:p-8"><h2 className="font-saiyan text-2xl text-red-300">Zone sensible</h2><p className="mt-1 text-sm text-white/60">La suppression est définitive. Better Auth peut demander une confirmation par e-mail.</p><button onClick={deleteAccount} disabled={busy} className="mt-5 rounded border border-red-400/50 px-4 py-3 text-sm text-red-200 hover:bg-red-500/10 disabled:opacity-50">Supprimer mon compte</button></section>
		<div className="mt-6 flex items-center gap-4"><SignOut className="rounded border border-white/15 px-4 py-3 text-sm text-white/70 hover:text-white">Se déconnecter</SignOut><Link href="/profil/me" className="text-sm text-dbz-blue-light hover:text-dbz-orange">Retour au profil</Link></div>
	</main>;
}
