import { db } from "@/lib/db";
import Link from "next/link";

export default async function WikiLayout({ children }: { children: React.ReactNode }) {
  const categories = await db.wikiCategory.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: { pages: true }
      },
      pages: true
    },
    orderBy: { order: "asc" }
  });

  return (
    <div className="container mx-auto px-4 py-12 flex gap-8">
      <aside className="w-64 flex-shrink-0">
        <nav className="sticky top-12 space-y-6">
          <Link href="/wiki" className="text-xl font-bold hover:text-[#4a5cff] transition-colors">Wiki DBFR</Link>
          {categories.map(cat => (
            <div key={cat.id}>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{cat.name}</h3>
              <ul className="space-y-1">
                {cat.pages.map(page => (
                  <li key={page.id}>
                    <Link href={`/wiki/${cat.slug}/${page.slug}`} className="text-sm text-gray-300 hover:text-white transition-colors block py-1">{page.title}</Link>
                  </li>
                ))}
                {cat.children.map(subCat => (
                  <li key={subCat.id} className="pl-3">
                    <span className="text-xs text-gray-500 block mb-1">{subCat.name}</span>
                    <ul className="space-y-1 border-l border-[#1a0d2e] pl-3">
                      {subCat.pages.map(page => (
                        <li key={page.id}>
                          <Link href={`/wiki/${cat.slug}/${subCat.slug}/${page.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors block py-1">{page.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 max-w-3xl">
        {children}
      </main>
    </div>
  );
}
export const dynamic = "force-dynamic"
