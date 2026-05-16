import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilMePage() {
	const session = await auth();
	if (!session?.user) redirect("/api/auth/signin?callbackUrl=/profil/me");
	const discordId =
		(session.user as { id?: string; discordId?: string }).discordId ??
		(session.user as { id?: string }).id;
	if (!discordId) redirect("/");
	redirect(`/profil/${discordId}`);
}
