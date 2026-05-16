import { botAdmin } from "@/lib/bot-admin";
import { ThemeCreateForm, ThemeRowActions } from "./ThemeForms";

export const dynamic = "force-dynamic";

export default async function CanvasThemesPage() {
	const data = await botAdmin.canvas.themes().catch(() => ({ rows: [] }));

	return (
		<div className="w-full max-w-6xl mx-auto space-y-6">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					CANVAS · THÈMES CARTE
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{data.rows.length} thèmes en DB · ajouter/éditer/supprimer · le bot
					recharge dans les 60s
				</p>
			</header>

			<ThemeCreateForm />

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{data.rows.map((t) => (
					<div key={t.id} className="dbz-panel overflow-hidden">
						<div
							className="h-32 relative"
							style={{
								background: `linear-gradient(135deg, ${t.bgGrad1}, ${t.bgGrad2}, ${t.bgGrad3})`,
							}}
						>
							<div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent">
								<div>
									<div
										className="font-saiyan text-lg leading-none"
										style={{ color: t.accent, textShadow: t.textShadow }}
									>
										{t.name}
									</div>
									<code className="text-[10px] text-white/60 font-mono">
										{t.id}
									</code>
								</div>
								<div className="flex gap-1">
									<div
										className="w-4 h-4 rounded-full border border-white/30"
										style={{ background: t.accent }}
										title={`accent ${t.accent}`}
									/>
									<div
										className="w-4 h-4 rounded-full border border-white/30"
										style={{ background: t.aura }}
										title={`aura ${t.aura}`}
									/>
								</div>
							</div>
						</div>
						<div className="p-3 space-y-2">
							{t.bgFile && (
								<div className="text-[10px] text-white/50 font-mono truncate">
									📁 {t.bgFile}
								</div>
							)}
							<div className="flex items-center justify-between">
								<span
									className={`text-[10px] uppercase tracking-widest ${t.enabled ? "text-green-300" : "text-white/30"}`}
								>
									{t.enabled ? "● activé" : "○ off"}
								</span>
								<ThemeRowActions theme={t} />
							</div>
						</div>
					</div>
				))}
				{data.rows.length === 0 && (
					<div className="dbz-panel p-6 col-span-full text-center text-white/50">
						Aucun thème en DB · fallback CARDS hardcoded en cours
					</div>
				)}
			</div>
		</div>
	);
}
