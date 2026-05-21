import { GamePageLayout } from "@/components/GamePageLayout";
import { BingoGame } from "./BingoGame";

export const dynamic = "force-dynamic";

export default function BingoPlayPage() {
	return (
		<GamePageLayout
			path="/jeux/bingo"
			title="BINGO"
			subtitle={(u) => `${u} ❯ Devine 1-100 en 10 essais`}
		>
			<BingoGame />
		</GamePageLayout>
	);
}
