import { LiveEventsStream } from "./LiveEventsStream";

export const dynamic = "force-dynamic";

export default function AdminLivePage() {
	return (
		<div className="w-full max-w-4xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					LIVE // BOT EVENTS
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					Server-Sent Events temps réel — level-ups, mod actions, joins,
					commandes, cron ticks.
				</p>
			</header>
			<LiveEventsStream />
		</div>
	);
}
