import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { QueryProvider } from "@/components/admin/QueryProvider";
import type { Metadata } from "next";

// L'admin n'a aucun intérêt à être indexé (robots noindex strict)
export const metadata: Metadata = {
	title: "Admin · DBFR",
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
	await requireAdmin();

	return (
		<QueryProvider>
			<div className="flex flex-col md:flex-row min-h-screen bg-dbz-bg w-full">
				<AdminSidebar />
				<main className="flex-1 p-4 md:p-12 relative z-10 w-full overflow-hidden">
					{children}
				</main>
			</div>
		</QueryProvider>
	);
}
