import Link from "next/link";

export function CtaFinal() {
	const inviteUrl =
		process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "https://discord.gg/dbfr";
	return (
		<section className="relative py-32 md:py-40 overflow-hidden">
			{/* Nébuleuse radiale finale */}
			<div className="absolute inset-0 pointer-events-none">
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse 80% 70% at 50% 50%, rgba(255,107,26,0.3), transparent 60%), radial-gradient(ellipse 60% 50% at 30% 30%, rgba(255,210,63,0.2), transparent 65%), radial-gradient(ellipse 50% 50% at 70% 70%, rgba(217,33,33,0.15), transparent 60%)",
					}}
				/>
				<div className="absolute inset-0 starfield opacity-50" />
				<div className="absolute inset-0 speed-lines opacity-15" />
			</div>

			<div className="container mx-auto px-4 relative text-center max-w-3xl">
				<p
					className="font-scouter text-xs tracking-[0.5em] text-dbz-yellow mb-4 ki-pulse"
				>
					REJOINS-NOUS
				</p>
				<h2
					className="title-jagged text-5xl md:text-7xl leading-[0.95] mb-6"
				>
					Sept étoiles. Un vœu.
				</h2>
				<p
					className="text-white/70 text-lg mb-10 max-w-xl mx-auto"
				>
					Rejoins le serveur Discord, lie ton compte et commence ton ascension.
					Du niveau 1 au sommet, un seul univers t'attend.
				</p>
				<div
					className="flex flex-wrap items-center justify-center gap-4"
				>
					<a
						href={inviteUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="dbz-button !text-base !px-8 !py-4 glow-violet"
					>
						Rejoindre Shenron sur Discord
					</a>
					<Link href="/wiki" className="dbz-button-ghost !text-sm">
						Explorer le wiki
					</Link>
				</div>
				<p
					className="font-scouter text-[10px] tracking-[0.4em] text-white/30 mt-10"
				>
					DBFR · DRAGON BALL FRANCE · DEPUIS 2026
				</p>
			</div>
		</section>
	);
}
