import { SendDiscordForm } from "./SendDiscordForm";

export const dynamic = "force-dynamic";

export default function AdminSendPage() {
	return (
		<div className="w-full max-w-3xl mx-auto space-y-6">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">ENVOYER UN MESSAGE</h1>
				<p className="text-sm text-white/60 mb-1">
					Postez un message dans un salon Discord via l&apos;un des 6 bots.
				</p>
				<p className="text-xs text-white/30 uppercase tracking-widest">
					Le message sera envoyé immédiatement · Markdown Discord supporté
				</p>
			</header>
			<SendDiscordForm />
		</div>
	);
}
