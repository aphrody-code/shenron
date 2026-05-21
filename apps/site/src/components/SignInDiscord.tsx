"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function SignInDiscord({
	callbackURL,
	className,
	children,
}: {
	callbackURL?: string;
	className?: string;
	children: React.ReactNode;
}) {
	const [loading, setLoading] = useState(false);
	return (
		<button
			type="button"
			disabled={loading}
			aria-busy={loading}
			onClick={async () => {
				if (loading) return;
				setLoading(true);
				try {
					// signIn.social retourne {data, error} en v1.6+ et ne throw pas.
					// errorCallbackURL casse la boucle si Discord refuse ; on bascule
					// vers /signin (message lisible) en cas d'erreur silencieuse.
					const res = await authClient.signIn.social({
						provider: "discord",
						callbackURL: callbackURL ?? "/profil/me",
						errorCallbackURL: "/signin?error=oauth_failed",
					});
					if (res?.error) {
						window.location.href = `/signin?error=${res.error.code ?? "server_error"}`;
					}
				} catch {
					setLoading(false);
					window.location.href = "/signin?error=server_error";
				}
			}}
			className={className}
		>
			{children}
		</button>
	);
}
