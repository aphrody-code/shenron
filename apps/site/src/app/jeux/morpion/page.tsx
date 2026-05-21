import { GamePageLayout } from "@/components/GamePageLayout";
import { MorpionGame } from "./MorpionGame";

export const dynamic = "force-dynamic";

export default function MorpionPlayPage() {
	return (
		<GamePageLayout
			path="/jeux/morpion"
			title="MORPION"
			subtitle={(u) => `${u} (X) ❯ VS BOT (O)`}
		>
			<MorpionGame />
		</GamePageLayout>
	);
}
