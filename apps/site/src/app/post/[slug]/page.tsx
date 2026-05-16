import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/auth";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) notFound();

  const session = await auth();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-6">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-400">
           {post.author.avatar && (
            <img src={post.author.avatar} alt={post.author.username} className="w-8 h-8 rounded-full" />
          )}
          <span>{post.author.username}</span>
          <span>•</span>
          <time>{format(post.createdAt, "d MMMM yyyy", { locale: fr })}</time>
        </div>
      </header>

      {post.cover && (
        <img src={post.cover} alt={post.title} className="w-full aspect-video object-cover rounded-3xl mb-12 shadow-2xl" />
      )}

      <div className="prose prose-invert max-w-none mb-16">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>

      <section className="border-t border-[#1a0d2e] pt-12">
        <h2 className="text-2xl font-bold mb-8">Commentaires ({post.comments.length})</h2>
        
        <div className="space-y-6 mb-12">
          {post.comments.map((comment: any) => (
            <div key={comment.id} className="p-4 rounded-xl bg-[#1a0d2e]/30 border border-[#1a0d2e]">
              <div className="flex items-center gap-3 mb-2">
                {comment.author.avatar && (
                  <img src={comment.author.avatar} alt={comment.author.username} className="w-6 h-6 rounded-full" />
                )}
                <span className="font-semibold text-sm">{comment.author.username}</span>
                <span className="text-xs text-gray-500">{format(comment.createdAt, "d MMM", { locale: fr })}</span>
              </div>
              <p className="text-gray-300">{comment.body}</p>
            </div>
          ))}
        </div>

        {session ? (
          <form className="space-y-4">
            <textarea 
              className="w-full p-4 rounded-xl bg-[#0a0a14] border border-[#1a0d2e] focus:border-[#4a5cff] outline-none transition-colors h-32"
              placeholder="Votre commentaire..."
            />
            <button className="px-6 py-3 rounded-full bg-gradient-galactic font-bold hover:scale-105 transition-transform">
              Publier
            </button>
          </form>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#1a0d2e]">
            <p className="text-gray-400">Connectez-vous avec Discord pour commenter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
export const dynamic = "force-dynamic"
