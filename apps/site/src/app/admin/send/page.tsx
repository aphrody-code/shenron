import { SendDiscordForm } from "./SendDiscordForm";

export const dynamic = "force-dynamic";

export default function AdminSendPage() {
	return (
		<div className="w-full max-w-3xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					DISCORD · ENVOI DIRECT
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					Poste un message dans un salon via une des 6 personas.
				</p>
			</header>
			<SendDiscordForm />
		</div>
	);
}
