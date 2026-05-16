"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export type PostTeaser = {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	cover: string | null;
	createdAt: Date;
	author: { username: string; avatar: string | null };
};

export function BlogTeaser({ posts }: { posts: PostTeaser[] }) {
	if (posts.length === 0) return null;
	return (
		<section className="relative py-24 md:py-32 border-b border-white/[0.06] bg-[#080808]">
			<div className="mx-auto max-w-[1280px] px-6 lg:px-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
					className="flex items-end justify-between flex-wrap gap-6 mb-12"
				>
					<div>
						<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
							Actualités
						</p>
						<h2 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white">
							Dernières dépêches Dragon Ball
						</h2>
					</div>
					<Link
						href="/actualites"
						className="font-display font-semibold text-[13px] tracking-[0.12em] uppercase text-white hover:text-dbz-orange transition-colors border-b border-white/30 hover:border-dbz-orange pb-1"
					>
						Toutes les actualités
					</Link>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{posts.slice(0, 3).map((p, i) => (
						<motion.article
							key={p.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:border-dbz-orange/60 transition-colors overflow-hidden group flex flex-col"
						>
							{p.cover && (
								<Link
									href={`/post/${p.slug}`}
									className="block aspect-[16/9] relative bg-black overflow-hidden"
								>
									<Image
										src={p.cover}
										alt={p.title}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
										className="object-cover group-hover:scale-105 transition-transform duration-700"
									/>
								</Link>
							)}
							<div className="p-6 flex-1 flex flex-col">
								<time
									dateTime={p.createdAt.toISOString()}
									className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-dbz-orange mb-3"
								>
									{format(p.createdAt, "d MMM yyyy", { locale: fr })}
								</time>
								<h3 className="font-display font-bold text-[19px] text-white leading-tight mb-3 group-hover:text-dbz-orange transition-colors">
									<Link href={`/post/${p.slug}`}>{p.title}</Link>
								</h3>
								<p className="text-[14px] text-white/65 leading-relaxed flex-1 mb-4 line-clamp-3">
									{p.excerpt}
								</p>
								<div className="flex items-center gap-2.5 pt-4 border-t border-white/[0.06]">
									{p.author.avatar && (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={p.author.avatar}
											alt=""
											width={22}
											height={22}
											className="w-[22px] h-[22px] rounded-full"
										/>
									)}
									<span className="text-[12px] font-display font-medium text-white/75">
										{p.author.username}
									</span>
								</div>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
