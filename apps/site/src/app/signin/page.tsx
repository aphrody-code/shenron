"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SignInPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [callbackURL, setCallbackURL] = useState("/profil/me");

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const cb = params.get("callbackURL");
		if (cb) setCallbackURL(cb);
	}, []);

	async function handleSignIn() {
		setError(null);
		setLoading(true);
		try {
			await authClient.signIn.social({ provider: "discord", callbackURL });
		} catch (e) {
			setError(e instanceof Error ? e.message : "Connexion impossible.");
			setLoading(false);
		}
	}

	return (
		<section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16 px-4">
			<div className="absolute inset-0 pointer-events-none">
				<div
					className="absolute inset-0 opacity-40"
					style={{
						background:
							"radial-gradient(ellipse 60% 60% at 50% 40%, rgba(255,107,26,0.25), transparent 65%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(255,210,63,0.18), transparent 70%), radial-gradient(ellipse 50% 50% at 20% 70%, rgba(75,168,255,0.15), transparent 70%)",
					}}
				/>
				<div className="absolute inset-0 starfield opacity-40" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.96 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
				className="dbz-panel relative w-full max-w-md p-8 md:p-10 text-center hud-frame"
			>
				<div className="mb-6">
					<p className="font-scouter text-[10px] tracking-[0.5em] text-dbz-yellow mb-3 ki-pulse">
						INVOCATION
					</p>
					<h1 className="title-jagged text-4xl md:text-5xl leading-tight mb-3">
						Connexion
					</h1>
					<p className="text-white/65 text-sm">
						Lie ton compte Discord pour rejoindre DBFR, suivre ta progression et
						accéder à ton profil de guerrier.
					</p>
				</div>

				<button
					type="button"
					onClick={handleSignIn}
					disabled={loading}
					className="dbz-button w-full !text-base !py-4 disabled:opacity-60 disabled:cursor-wait"
				>
					{loading ? "Redirection en cours…" : "Se connecter avec Discord"}
				</button>

				{error && (
					<p className="mt-5 text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded px-3 py-2">
						{error}
					</p>
				)}

				<div className="mt-8 pt-6 border-t border-dbz-border/60 text-[11px] text-white/45 leading-relaxed">
					En te connectant tu acceptes le règlement de la communauté. Aucun mot
					de passe stocké — l'authentification passe par Discord.
				</div>

				<Link
					href="/"
					className="block mt-6 text-xs text-dbz-blue-light hover:text-dbz-orange transition-colors"
				>
					Retour à l'accueil
				</Link>
			</motion.div>
		</section>
	);
}
