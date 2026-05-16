import { requireUser } from "@/lib/session";
import { BingoGame } from "./BingoGame";

export const dynamic = "force-dynamic";

export default async function BingoPlayPage() {
	const me = await requireUser("/jeux/bingo");
	return (
		<div className="container mx-auto px-4 py-12 max-w-xl">
			<header className="text-center mb-8">
				<h1
					className="text-5xl text-dbz-yellow mb-2"
					style={{ textShadow: "4px 4px 0px rgba(168, 85, 247, 0.55), 0 0 20px rgba(56, 189, 248, 0.3)" }}
				>
					BINGO
				</h1>
				<p className="font-scouter text-xs tracking-[0.3em] text-dbz-blue-light">
					{me.user?.username ?? "Saiyan"} // Devine 1-100 en 10 essais
				</p>
			</header>
			<BingoGame />
		</div>
	);
}
