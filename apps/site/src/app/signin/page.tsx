"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function SignInPage() {
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const callbackURL = params.get("callbackURL") ?? "/profil/me";
		authClient.signIn
			.social({ provider: "discord", callbackURL })
			.catch((e: unknown) => {
				setError(e instanceof Error ? e.message : "Erreur de connexion");
			});
	}, []);

	return (
		<div className="container mx-auto px-4 py-24 max-w-md text-center">
			<h1 className="font-saiyan text-4xl text-dbz-yellow mb-4">
				Connexion en cours…
			</h1>
			<p className="text-dbz-blue-light/70 text-sm">
				Redirection vers Discord. Si rien ne se passe, autorise les popups et
				réessaie.
			</p>
			{error && <p className="text-red-400 text-sm mt-6">{error}</p>}
		</div>
	);
}
