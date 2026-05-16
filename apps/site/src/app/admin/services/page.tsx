import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

export default async function AdminServices() {
	const { services } = await botAdmin
		.services()
		.catch(() => ({ services: [] }));

	return (
		<div className="w-full max-w-5xl mx-auto">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">SERVICES</h1>
			<p className="text-xs text-dbz-blue-light uppercase tracking-widest mb-8">
				{services.length} services tsyringe @singleton exposés via API
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{services.map((s) => (
					<div key={s} className="dbz-panel p-4">
						<div className="font-saiyan text-xl text-dbz-yellow mb-2">{s}</div>
						<div className="text-xs text-gray-500 font-mono uppercase">
							POST /api/services/{s}/:action
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
