import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { QueryProvider } from "@/components/admin/QueryProvider";
import type { Metadata } from "next";

// L'espace admin n'est pas indexable par les moteurs de recherche
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: {
		default: "Administration · Dragon Ball France",
		template: "%s · Admin DBFR",
	},
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: { index: false, follow: false, noimageindex: true },
	},
};

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Vérifie que l'utilisateur est bien admin — redirige sinon
	await requireAdmin();

	return (
		<QueryProvider>
			<div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-dbz-bg w-full">
				<AdminSidebar />
				{/* Zone de contenu principale — min-w-0 pour autoriser le shrink flex
				    (sinon les tableaux larges débordent et chevauchent la sidebar) */}
				<main
					className="flex-1 min-w-0 p-4 md:p-10 relative z-10"
					id="admin-content"
				>
					{children}
				</main>
			</div>
		</QueryProvider>
	);
}
