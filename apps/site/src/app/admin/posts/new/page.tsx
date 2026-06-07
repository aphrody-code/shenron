import { requireAdmin } from "@/lib/session";
import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
	await requireAdmin();
	return (
		<div className="w-full">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-8 text-center">NOUVEL ARTICLE</h1>
			<PostForm />
		</div>
	);
}
