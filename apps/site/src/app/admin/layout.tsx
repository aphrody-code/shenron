import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await requireAdmin();

	return (
		<div className="flex flex-col md:flex-row min-h-screen bg-dbz-bg w-full">
			<AdminSidebar />
			<main className="flex-1 p-4 md:p-12 relative z-10 w-full overflow-hidden">
				{children}
			</main>
		</div>
	);
}
