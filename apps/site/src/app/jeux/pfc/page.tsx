import { requireUser } from "@/lib/session";
import { PfcGame } from "./PfcGame";

export const dynamic = "force-dynamic";

export default async function PfcPlayPage() {
	const me = await requireUser("/jeux/pfc");
	return (
		<div className="container mx-auto px-4 py-12 max-w-2xl">
			<header className="text-center mb-8">
				<h1
					className="text-5xl text-dbz-yellow mb-2"
					style={{ textShadow: "4px 4px 0px rgba(255, 107, 26, 0.55), 0 0 20px rgba(75, 168, 255, 0.3)" }}
				>
					PIERRE · FEUILLE · CISEAUX
				</h1>
				<p className="font-scouter text-xs tracking-[0.3em] text-dbz-blue-light">
					{me.user?.username} ❯ VS BOT ❯ MÊMES RÈGLES /pfc
				</p>
			</header>
			<PfcGame />
		</div>
	);
}
