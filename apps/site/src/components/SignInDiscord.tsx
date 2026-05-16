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
			onClick={async () => {
				setLoading(true);
				await authClient.signIn.social({
					provider: "discord",
					callbackURL: callbackURL ?? "/profil/me",
				});
			}}
			className={className}
		>
			{children}
		</button>
	);
}
