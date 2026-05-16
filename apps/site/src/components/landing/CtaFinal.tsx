"use client";

import { motion } from "framer-motion";
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
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.6 }}
					className="font-scouter text-xs tracking-[0.5em] text-dbz-yellow mb-4 ki-pulse"
				>
					REJOINS-NOUS
				</motion.p>
				<motion.h2
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
					className="title-jagged text-5xl md:text-7xl leading-[0.95] mb-6"
				>
					Sept étoiles. Un vœu.
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-white/70 text-lg mb-10 max-w-xl mx-auto"
				>
					Rejoins le serveur Discord, lie ton compte et commence ton ascension.
					Du niveau 1 au sommet, un seul univers t'attend.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.35 }}
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
				</motion.div>
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="font-scouter text-[10px] tracking-[0.4em] text-white/30 mt-10"
				>
					DBFR · DRAGON BALL FRANCE · DEPUIS 2026
				</motion.p>
			</div>
		</section>
	);
}
