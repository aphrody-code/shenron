import { requireUser } from "@/lib/session";
import AccountSettings from "./AccountSettings";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
	const me = await requireUser("/parametres");
	return <AccountSettings initial={{ name: me.user?.username ?? "", image: me.user?.avatar ?? "", discordId: me.discordId }} />;
}
