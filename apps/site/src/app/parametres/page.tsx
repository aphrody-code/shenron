import { requireUser } from "@/lib/session";
import AccountSettings from "./AccountSettings";
import { UserNav } from "@/components/user/UserNav";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
	const me = await requireUser("/parametres");
	return (
		<main className="min-h-screen bg-[#0e0d0b] text-white">
			<div className="mx-auto max-w-4xl px-4 py-8 pb-28 md:px-8 md:py-12">
				<UserNav />
				<AccountSettings
					initial={{
						name: me.user?.username ?? "",
						image: me.user?.avatar ?? "",
						discordId: me.discordId,
					}}
				/>
			</div>
		</main>
	);
}
