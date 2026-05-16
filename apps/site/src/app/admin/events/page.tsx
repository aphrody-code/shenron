import { EventsStream } from "./events-stream";

export default function AdminEventsPage() {
	return (
		<div className="w-full max-w-5xl mx-auto">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">EVENTS LIVE</h1>
			<p className="text-xs text-dbz-blue-light uppercase tracking-widest mb-6">
				Flux SSE temps réel · /api/a2a/events · level-up · achievement · fusion
				· moderation
			</p>
			<EventsStream />
		</div>
	);
}
