import { CardListSkeleton, HeroSkeleton } from "@/components/wiki/WikiSkeleton";

export default function Loading() {
	return (
		<div>
			<HeroSkeleton />
			<div className="mx-auto max-w-[1400px] space-y-16 px-6 py-14 lg:px-10 lg:py-20">
				<CardListSkeleton count={8} />
				<CardListSkeleton count={4} />
			</div>
		</div>
	);
}
