import type { Metadata } from "next";
import { CommandRunner } from "./CommandRunner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Exécuter une commande",
	robots: { index: false },
};

export default function AdminCommandesPage() {
	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<header>
				<h1 className="mb-2 font-saiyan text-4xl text-dbz-orange">EXÉCUTER UNE COMMANDE</h1>
				<p className="mb-1 text-sm text-white/60">
					Lancez une commande du bot à distance, sans passer par Discord : XP, zénis, races, rôles,
					message d&apos;un persona.
				</p>
				<p className="text-xs uppercase tracking-widest text-white/30">
					Opérations réelles en production · effet immédiat
				</p>
			</header>
			<CommandRunner />
		</div>
	);
}
