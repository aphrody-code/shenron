import { GamePageLayout } from "@/components/GamePageLayout";
import { PfcGame } from "./PfcGame";

export const dynamic = "force-dynamic";

export default function PfcPlayPage() {
	return (
		<GamePageLayout
			path="/jeux/pfc"
			title="PIERRE · FEUILLE · CISEAUX"
			maxWidth="max-w-2xl"
			subtitle={(u) => `${u} ❯ VS BOT ❯ MÊMES RÈGLES /pfc`}
		>
			<PfcGame />
		</GamePageLayout>
	);
}
