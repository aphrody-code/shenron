import { adminFetch, assetCdnUrl } from "../_lib";
import { AdminHeader } from "../_Header";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Asset = {
	id: number;
	path: string;
	source_id: string;
	attribution: string | null;
	license_key: string;
	role: string | null;
};

const BUCKETS = [
	"characters",
	"planets",
	"transformations",
	"anime-posters",
	"kitsu",
	"fandom-fr-proper",
	"bandai",
	"dbofficial",
	"toei",
	"shueisha",
	"shonenjump",
	"viz",
	"kanzenshuu",
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

	return (
		<div className="w-full max-w-7xl mx-auto">
			<AdminHeader
				title="DB Universe // Assets"
				subtitle={`${bucket} · ${assets.length} fichiers (limit ${limit})`}
			/>

			<nav className="mb-6 flex flex-wrap gap-2">
				{BUCKETS.map((b) => (
					<Link
						key={b}
						href={`/admin/db-universe/assets?bucket=${b}`}
						className={`px-3 py-1.5 border-2 font-saiyan tracking-widest text-xs uppercase transition-colors ${
							b === bucket
								? "border-dbz-orange bg-dbz-orange/15 text-dbz-orange"
								: "border-dbz-blue-light/30 text-white/70 hover:border-dbz-orange/60 hover:text-white"
						}`}
					>
						{b}
					</Link>
				))}
			</nav>

			<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
				{assets.map((a) => (
					<a
						key={a.id}
						href={assetCdnUrl(a.path)}
						target="_blank"
						rel="noopener noreferrer"
						className="block group"
						title={`${a.attribution ?? a.source_id} · ${a.license_key}`}
					>
						<div className="relative aspect-square bg-dbz-bg border-2 border-dbz-border group-hover:border-dbz-orange transition-colors overflow-hidden">
							<Image
								src={assetCdnUrl(a.path)}
								alt={a.path}
								fill
								sizes="(max-width: 768px) 25vw, 12vw"
								className="object-cover"
								unoptimized
							/>
						</div>
						<div className="mt-1.5 text-[10px] text-white/55 font-mono truncate">
							#{a.id} {a.role ?? ""}
						</div>
					</a>
				))}
			</div>

			{assets.length === limit && (
				<div className="mt-8 text-center">
					<Link
						href={`/admin/db-universe/assets?bucket=${bucket}&limit=${limit + 60}`}
						className="dbz-button-ghost !text-xs"
					>
						Charger plus
					</Link>
				</div>
			)}
		</div>
	);
}
