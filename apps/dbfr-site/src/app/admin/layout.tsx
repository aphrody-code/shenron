import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) redirect("/api/auth/signin");
  
  const user = await db.user.findUnique({
    where: { discordId: (session.user as any).id }
  });

  if (!user?.roleAdmin) redirect("/");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dbz-bg w-full">
      <aside className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-dbz-border p-6 space-y-8 bg-dbz-card relative z-20">
        <h2 className="text-3xl font-saiyan text-dbz-yellow" style={{ textShadow: "2px 2px 0px rgba(229, 90, 0, 0.8)" }}>
          CAPSULE CORP CMS
        </h2>
        <nav className="flex flex-row md:flex-col gap-4 md:space-y-4 md:gap-0 overflow-x-auto pb-4 md:pb-0">
          <Link href="/admin/posts" className="dbz-button whitespace-nowrap !text-xl !px-4 !py-2 bg-dbz-blue-light border-dbz-blue hover:bg-dbz-orange hover:border-dbz-orange-dark">
            ARTICLES
          </Link>
          <Link href="/admin/wiki" className="dbz-button whitespace-nowrap !text-xl !px-4 !py-2 bg-dbz-blue-light border-dbz-blue hover:bg-dbz-orange hover:border-dbz-orange-dark">
            WIKI DBFR
          </Link>
          <Link href="/admin/bot" className="dbz-button whitespace-nowrap !text-xl !px-4 !py-2 bg-dbz-blue-light border-dbz-blue hover:bg-dbz-orange hover:border-dbz-orange-dark">
            BOT STATUS
          </Link>
          <div className="flex-1 md:hidden"></div>
          <Link href="/" className="font-saiyan text-xl text-gray-500 hover:text-white transition-colors uppercase pt-2 md:pt-8 block">
            ← RETOUR
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-12 relative z-10 w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
