"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export type CharacterTeaser = {
	id: number;
	name: string;
	nameJa: string | null;
	race: string | null;
	image: string | null;
};

export function CharactersTeaser({
	characters,
}: {
	characters: CharacterTeaser[];
}) {
	if (characters.length === 0) return null;

	return (
		<section className="relative py-24 md:py-32 border-b border-white/[0.06] bg-[#080808]">
			<div className="mx-auto max-w-[1280px] px-6 lg:px-10">
				<div className="flex items-end justify-between flex-wrap gap-6 mb-12">
					<div>
						<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
							Personnages mythiques
						</p>
						<h2 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white max-w-2xl">
							Les guerriers qui ont marqué la saga.
						</h2>
					</div>
					<Link
						href="/wiki/dragon-ball"
						className="font-display font-semibold text-[13px] tracking-[0.12em] uppercase text-white hover:text-dbz-orange transition-colors border-b border-white/30 hover:border-dbz-orange pb-1"
					>
						Voir les 58 personnages
					</Link>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
					{characters.map((c, i) => (
						<motion.div
							key={c.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.45, delay: i * 0.04 }}
						>
							<Link
								href={`/wiki/dragon-ball/character/${c.id}`}
								className="group block relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/[0.08] hover:border-dbz-orange transition-all"
							>
								{c.image ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={`https://shenron.rpbey.fr/${c.image.replace(/^\.\//, "")}`}
										alt={c.name}
										className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
										loading="lazy"
									/>
								) : (
									<div className="absolute inset-0 grid place-items-center font-display font-bold text-[48px] text-dbz-orange/20">
										{c.name[0]}
									</div>
								)}
								<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-12 pb-4 px-4">
									<p className="font-display font-bold text-[15px] text-white leading-tight">
										{c.name}
									</p>
									{c.nameJa && (
										<p className="font-jp text-[11px] text-dbz-orange/85 mt-0.5">
											{c.nameJa}
										</p>
									)}
									{c.race && (
										<p className="font-display text-[10px] tracking-[0.14em] uppercase text-white/55 mt-1">
											{c.race}
										</p>
									)}
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
