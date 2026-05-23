import { adminFetch, assetCdnUrl } from "../_lib";
import { AdminHeader } from "../_Header";
import { DbAddButton, DbRowActions } from "@/components/admin/DbCrud";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TABLE = "db_assets";

type Asset = {
	id: number;
	path: string;
	source_id: string;
	attribution: string | null;
	license_key: string;
	role: string | null;
};

const BUCKETS: { key: string; label: string }[] = [
	{ key: "characters", label: "Personnages" },
	{ key: "planets", label: "Planètes" },
	{ key: "transformations", label: "Transformations" },
	{ key: "anime-posters", label: "Affiches anime" },
	{ key: "kitsu", label: "Kitsu" },
	{ key: "fandom-fr-proper", label: "Fandom FR" },
	{ key: "bandai", label: "Bandai" },
	{ key: "dbofficial", label: "DB Officiel" },
	{ key: "toei", label: "Toei" },
	{ key: "shueisha", label: "Shueisha" },
	{ key: "shonenjump", label: "Shonen Jump" },
	{ key: "viz", label: "Viz" },
	{ key: "kanzenshuu", label: "Kanzenshuu" },
];

export default async function AdminAssetsPage({
	searchParams,
}: {
	searchParams: Promise<{ bucket?: string; limit?: string }>;
}) {
	const sp = await searchParams;
	const bucket = sp.bucket ?? "characters";
	const limit = Math.min(200, Math.max(20, Number(sp.limit) || 60));

	const data = await adminFetch<{ assets: Asset[] }>(
		`/api/public/assets?bucket=${encodeURIComponent(bucket)}&limit=${limit}`,
	);
	const assets = data?.assets ?? [];
	const bucketLabel = BUCKETS.find((b) => b.key === bucket)?.label ?? bucket;

	return (
		<div className="w-full max-w-7xl mx-auto">
			<AdminHeader
				title="Médias & images"
				subtitle={
					assets.length > 0
						? `${bucketLabel} · ${assets.length} fichier${assets.length > 1 ? "s" : ""} (limite ${limit})`
						: bucketLabel
				}
			/>

			<p className="text-sm text-white/50 mb-5">
				Galerie des images de l&apos;encyclopédie, organisées par catégorie
				source. Cliquez sur une image pour l&apos;ouvrir en pleine taille.
				Survolez pour voir l&apos;attribution et la licence. Modifiez ou
				supprimez un média via les boutons sous chaque image.
			</p>

			<div className="flex justify-end mb-4">
				<DbAddButton table={TABLE} label="Ajouter un média" />
			</div>

			{/* Navigation catégories */}
			<nav
				className="mb-6 flex flex-wrap gap-2"
				aria-label="Catégorie d'assets"
			>
				{BUCKETS.map((b) => (
					<Link
						key={b.key}
						href={`/admin/db-universe/assets?bucket=${b.key}`}
						className={`px-3 py-1.5 border-2 font-saiyan tracking-widest text-xs uppercase transition-colors ${
							b.key === bucket
								? "border-dbz-orange bg-dbz-orange/15 text-dbz-orange"
								: "border-dbz-blue-light/30 text-white/70 hover:border-dbz-orange/60 hover:text-white"
						}`}
					>
						{b.label}
					</Link>
				))}
			</nav>

			{assets.length === 0 ? (
				<div className="dbz-panel p-12 text-center">
					<p className="font-saiyan text-xl uppercase text-white/30 mb-1">
						Aucun média dans cette catégorie
					</p>
					<p className="text-white/40 text-sm">
						La catégorie{" "}
						<strong className="text-white/60">{bucketLabel}</strong> ne contient
						pas encore d&apos;images.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
					{assets.map((a) => (
						<div key={a.id} className="group">
							<a
								href={assetCdnUrl(a.path)}
								target="_blank"
								rel="noopener noreferrer"
								className="block"
								title={[a.attribution ?? a.source_id, a.license_key, a.role]
									.filter(Boolean)
									.join(" · ")}
							>
								<div className="relative aspect-square bg-dbz-bg border-2 border-dbz-border group-hover:border-dbz-orange transition-colors overflow-hidden">
									<Image
										src={assetCdnUrl(a.path)}
										alt={a.role ?? a.path}
										fill
										sizes="(max-width: 768px) 25vw, 12vw"
										className="object-cover"
										unoptimized
									/>
								</div>
							</a>
							<div className="mt-1.5 flex items-center justify-between gap-1">
								<span className="text-[10px] text-white/55 font-mono truncate">
									#{a.id}
									{a.role ? ` · ${a.role}` : ""}
								</span>
								<DbRowActions table={TABLE} id={a.id} />
							</div>
						</div>
					))}
				</div>
			)}

			{assets.length === limit && (
				<div className="mt-8 text-center">
					<Link
						href={`/admin/db-universe/assets?bucket=${bucket}&limit=${limit + 60}`}
						className="dbz-button-ghost !text-xs"
					>
						Charger {60} images supplémentaires
					</Link>
				</div>
			)}
		</div>
	);
}
