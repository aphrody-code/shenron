"use client";

import { useEffect } from "react";

export function FirebaseInitializer() {
	useEffect(() => {
		import("@/lib/firebase")
			.then(({ firebaseApp }) => {
				if (firebaseApp) {
					console.log("🔥 Firebase App dynamically initialized.");
				}
			})
			.catch((err) => {
				console.error("Failed to dynamically initialize Firebase:", err);
			});
	}, []);

	return null;
}
