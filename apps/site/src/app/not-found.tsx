import Link from "next/link";

export default function NotFound() {
	return (
		<div className="container mx-auto px-4 py-24 max-w-2xl text-center">
			<div className="dbz-panel p-12 relative overflow-hidden">
				<div className="absolute inset-0 starfield opacity-30 pointer-events-none" />
				<div className="relative">
					<p className="font-scouter text-xs tracking-[0.5em] text-fuchsia-300 mb-4">
						❯ SECTEUR INCONNU ❮
					</p>
					<h1 className="title-jagged text-7xl md:text-9xl leading-none mb-6">404</h1>
					<p className="text-white/70 mb-2">Cette page s'est perdue dans le néant cosmique.</p>
					<p className="text-white/40 text-sm mb-8">Le scouter ne capte aucun signal de vie ici.</p>
					<div className="flex flex-wrap items-center justify-center gap-3">
						<Link href="/" className="dbz-button !text-xs">
							Retour à la base
						</Link>
						<Link href="/wiki/manga" className="dbz-button-ghost !text-xs">
							Lire le manga
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
