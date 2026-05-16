import { botAdmin } from "@/lib/bot-admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDatabase() {
	const { tables } = await botAdmin.tables().catch(() => ({ tables: [] }));

	return (
		<div className="w-full max-w-6xl mx-auto">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-8">DATABASE</h1>

			<div className="dbz-panel p-6">
				<p className="text-xs uppercase text-dbz-blue-light tracking-widest mb-4">
					{tables.length} tables · SQLite WAL · drizzle ORM
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
					{tables.map((t) => (
						<Link
							key={t}
							href={`/admin/database/${t}`}
							className="dbz-button text-center !text-sm !py-2"
						>
							{t}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
