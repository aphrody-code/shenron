"use client";

import { useEffect, useState } from "react";

export type Me = {
	authenticated: boolean;
	username: string | null;
	avatar: string | null;
	isAdmin: boolean;
};

// Cache module-level + requête en vol partagée : la nav desktop ET la nav mobile
// consomment le même `/api/me` sans le fetcher deux fois.
let cache: Me | undefined;
let inflight: Promise<Me> | undefined;

const ANON: Me = {
	authenticated: false,
	username: null,
	avatar: null,
	isAdmin: false,
};

function fetchMe(): Promise<Me> {
	inflight ??= fetch("/api/me", { credentials: "include" })
		.then((r) => (r.ok ? (r.json() as Promise<Me>) : ANON))
		.then((m) => {
			cache = m;
			return m;
		})
		.catch(() => ANON);
	return inflight;
}

/** État d'auth client (nav). `undefined` tant que le 1er fetch n'a pas répondu. */
export function useMe(): Me | undefined {
	const [me, setMe] = useState<Me | undefined>(cache);
	useEffect(() => {
		if (cache) {
			setMe(cache);
			return;
		}
		let alive = true;
		void fetchMe().then((m) => {
			if (alive) setMe(m);
		});
		return () => {
			alive = false;
		};
	}, []);
	return me;
}
