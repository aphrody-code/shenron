import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function WikiPage({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}) {
	const { slug } = await params;
	const pageSlug = slug[slug.length - 1];

	const page = await db.query.wikiPages.findFirst({
		where: (p, { eq }) => eq(p.slug, pageSlug),
		with: { category: { with: { parent: true } } },
	});

	if (!page) notFound();

	return (
		<div>
			<nav className="flex gap-2 text-xs text-gray-500 mb-8 uppercase tracking-widest">
				<Link href="/wiki">WIKI</Link>
				<span>/</span>
				{page.category.parent && (
					<>
						<span>{page.category.parent.name}</span>
						<span>/</span>
					</>
				)}
				<span>{page.category.name}</span>
			</nav>
			<h1 className="text-4xl font-black mb-8">{page.title}</h1>
			<div className="prose prose-invert max-w-none">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{page.body}</ReactMarkdown>
			</div>
			<div className="mt-16 pt-8 border-t border-dbz-border text-xs text-gray-500">
				Dernière mise à jour le{" "}
				{new Date(page.updatedAt).toLocaleDateString("fr-FR")}
			</div>
		</div>
	);
}

function Link({
	href,
	children,
	className,
}: {
	href: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<a href={href} className={className}>
			{children}
		</a>
	);
}
export const dynamic = "force-dynamic";
