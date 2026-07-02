import { DragonBallLoader } from "@/components/DragonBall";

export default function Loading() {
	return (
		<div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh]">
			<DragonBallLoader size={72} stars={4} />
			<p className="mt-8 font-scouter text-xs tracking-[0.5em] text-dbz-orange/90 ki-pulse">
				❯ CHARGEMENT ❮
			</p>
		</div>
	);
}
