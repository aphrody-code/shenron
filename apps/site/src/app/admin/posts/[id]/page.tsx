import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
	await requireAdmin();
	const { id } = await params;
	const post = await db.query.posts.findFirst({
		where: (p, { eq }) => eq(p.id, id),
	});
	if (!post) notFound();

	return (
		<div className="w-full">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-8 text-center">
				MODIFIER L&apos;ARTICLE
			</h1>
			<PostForm
				post={{
					id: post.id,
					slug: post.slug,
					title: post.title,
					cover: post.cover,
					excerpt: post.excerpt,
					body: post.body,
					published: post.published,
				}}
			/>
		</div>
	);
}
