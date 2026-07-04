import { BillboardSkeleton } from "@/components/stream/StreamSkeleton";

export default function Loading() {
	return (
		<>
			<BillboardSkeleton />
			<div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10 lg:py-16">
				<div className="mb-6 h-28 w-full animate-pulse rounded-xl bg-dbz-card ring-1 ring-white/[0.06]" />
				<div className="space-y-2">
					{Array.from({ length: 10 }).map((_, i) => (
						<div
							key={i}
							className="h-16 w-full animate-pulse rounded-lg bg-dbz-card ring-1 ring-white/[0.06]"
						/>
					))}
				</div>
			</div>
		</>
	);
}
