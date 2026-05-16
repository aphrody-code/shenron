export default function Loading() {
	return (
		<div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh]">
			<div className="relative w-24 h-24 mb-8">
				<div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/30 animate-ping" />
				<div className="absolute inset-2 rounded-full border-2 border-cyan-400/40 animate-ping [animation-delay:0.3s]" />
				<div
					className="absolute inset-0 rounded-full"
					style={{
						background:
							"radial-gradient(circle, rgba(255,107,26,0.5), transparent 70%)",
					}}
				/>
			</div>
			<p className="font-scouter text-xs tracking-[0.5em] text-fuchsia-300 ki-pulse">
				❯ CHARGEMENT ❮
			</p>
		</div>
	);
}
