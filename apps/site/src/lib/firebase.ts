import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";
import { env } from "./env";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

const firebaseConfig = {
	apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Vérifie si la configuration minimale est présente
const hasFirebaseConfig = !!env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (typeof window !== "undefined" && hasFirebaseConfig) {
	try {
		app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
		db = getFirestore(app);

		// Initialisation asynchrone d'Analytics (si supporté par le navigateur)
		isSupported().then((supported) => {
			if (supported && app) {
				analytics = getAnalytics(app);
			}
		});
	} catch (error) {
		console.error("Firebase initialization failed:", error);
	}
}

export { app as firebaseApp, db as firestore, analytics as firebaseAnalytics };
