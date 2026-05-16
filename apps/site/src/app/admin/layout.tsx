import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user) redirect("/api/auth/signin");

	const user = await db.query.users.findFirst({
		where: (u, { eq }) => eq(u.discordId, (session.user as any).id),
	});

	if (!user?.roleAdmin) redirect("/");

	return (
		<div className="flex flex-col md:flex-row min-h-screen bg-dbz-bg w-full">
			<aside className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-dbz-border p-6 space-y-8 bg-dbz-card relative z-20">
				<h2
					className="text-3xl font-saiyan text-dbz-yellow"
					style={{ textShadow: "2px 2px 0px rgba(229, 90, 0, 0.8)" }}
				>
					CAPSULE CORP CMS
				</h2>
				<nav className="flex flex-row md:flex-col gap-2 md:gap-2 overflow-x-auto pb-4 md:pb-0">
					{[
						{ href: "/admin/dashboard", label: "DASHBOARD" },
						{ href: "/admin/sync", label: "SYNC" },
						{ href: "/admin/events", label: "EVENTS" },
						{ href: "/admin/cron", label: "CRON" },
						{ href: "/admin/services", label: "SERVICES" },
						{ href: "/admin/database", label: "DATABASE" },
						{ href: "/admin/discord", label: "DISCORD" },
						{ href: "/admin/canvas", label: "CANVAS" },
						{ href: "/admin/economy", label: "ECONOMY" },
						{ href: "/admin/levels", label: "LEVELS" },
						{ href: "/admin/shop", label: "SHOP" },
						{ href: "/admin/moderation", label: "MOD" },
						{ href: "/admin/audit", label: "AUDIT" },
						{ href: "/admin/hierarchy", label: "HIERARCHY" },
						{ href: "/admin/giveaways", label: "GIVEAWAYS" },
						{ href: "/admin/tickets", label: "TICKETS" },
						{ href: "/admin/triggers", label: "TRIGGERS" },
						{ href: "/admin/messages", label: "MESSAGES" },
						{ href: "/admin/webhooks", label: "WEBHOOKS" },
						{ href: "/admin/settings", label: "SETTINGS" },
						{ href: "/admin/posts", label: "ARTICLES" },
						{ href: "/admin/wiki", label: "WIKI" },
					].map((l) => (
						<Link
							key={l.href}
							href={l.href}
							className="dbz-button whitespace-nowrap !text-base !px-3 !py-2 bg-dbz-blue-light border-dbz-blue hover:bg-dbz-orange hover:border-dbz-orange-dark"
						>
							{l.label}
						</Link>
					))}
					<div className="flex-1 md:hidden" />
					<Link
						href="/"
						className="font-saiyan text-base text-gray-500 hover:text-white transition-colors uppercase pt-2 md:pt-6 block"
					>
						← SITE
					</Link>
				</nav>
			</aside>
			<main className="flex-1 p-4 md:p-12 relative z-10 w-full overflow-hidden">
				{children}
			</main>
		</div>
	);
}
