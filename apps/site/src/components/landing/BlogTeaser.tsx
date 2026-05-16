"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
		<section className="relative py-24 md:py-32 border-b border-dbz-border">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
					className="flex items-end justify-between flex-wrap gap-4 mb-12"
				>
					<div>
						<p className="font-scouter text-xs tracking-[0.5em] text-dbz-blue-light mb-3">
							ACTUALITÉS
						</p>
						<h2 className="title-jagged text-4xl md:text-6xl leading-tight">
							Dernières dépêches
						</h2>
					</div>
					<Link href="/actualites" className="dbz-button-ghost !text-xs">
						Toutes les actualités
					</Link>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
					{posts.slice(0, 3).map((p, i) => (
						<motion.article
							key={p.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="dbz-panel p-0 overflow-hidden group flex flex-col"
						>
							{p.cover && (
								<Link
									href={`/post/${p.slug}`}
									className="block aspect-[16/9] overflow-hidden border-b border-dbz-border"
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={p.cover}
										alt={p.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									/>
								</Link>
							)}
							<div className="p-5 flex-1 flex flex-col">
								<time className="font-scouter text-[10px] tracking-[0.3em] text-dbz-yellow mb-2 uppercase">
									{format(p.createdAt, "d MMM yyyy", { locale: fr })}
								</time>
								<h3 className="font-saiyan text-xl text-white leading-tight mb-2 group-hover:text-dbz-200 transition-colors">
									<Link href={`/post/${p.slug}`}>{p.title}</Link>
								</h3>
								<p className="text-sm text-white/55 leading-relaxed flex-1 mb-4 line-clamp-3">
									{p.excerpt}
								</p>
								<div className="flex items-center gap-2 text-xs text-white/40">
									{p.author.avatar && (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={p.author.avatar}
											alt={p.author.username}
											className="w-5 h-5 rounded-full border border-dbz-border"
										/>
									)}
									<span>{p.author.username}</span>
								</div>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
