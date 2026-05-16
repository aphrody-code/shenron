"use client";

import { useState, useTransition } from "react";
import { sfx } from "@/lib/sfx";

type Cell = "." | "X" | "O";
type Outcome =
	| { kind: "playing" }
	| { kind: "won"; mark: "X" | "O"; line: number[] }
	| { kind: "draw" };

type ApiState = {
	board: Cell[];
	sig: string;
	ts: number;
	stake: number;
	outcome: Outcome;
	botCell?: number | null;
	delta?: number;
	balance?: number;
};

type ApiError = { error: string };

const OUTCOME_LABEL: Record<string, { label: string; color: string }> = {
	"won-X": { label: "VICTOIRE", color: "text-green-400" },
	"won-O": { label: "DÉFAITE", color: "text-red-400" },
	draw: { label: "ÉGALITÉ", color: "text-dbz-yellow" },
};

function CellButton({
	value,
	highlighted,
	disabled,
	onClick,
}: {
	value: Cell;
	highlighted: boolean;
	disabled: boolean;
	onClick: () => void;
}) {
	const empty = value === ".";
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled || !empty}
			className={`aspect-square flex items-center justify-center text-5xl font-saiyan border-2 transition-colors ${
				highlighted
					? "border-green-400 bg-green-400/10 text-green-400"
					: empty
						? "border-dbz-border hover:border-dbz-orange hover:bg-dbz-orange/10 text-dbz-orange"
						: value === "X"
							? "border-dbz-blue-light bg-dbz-blue-light/10 text-dbz-blue-light"
							: "border-dbz-orange/60 bg-dbz-orange/10 text-dbz-orange"
			} disabled:cursor-not-allowed`}
		>
			{empty ? "" : value}
		</button>
	);
}

export function MorpionGame() {
	const [state, setState] = useState<ApiState | null>(null);
	const [stake, setStake] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, startTransition] = useTransition();

	async function call(payload: {
		cell?: number;
		state?: { board: string; sig: string; ts: number };
		stake?: number;
	}): Promise<ApiState | null> {
		const res = await fetch("/api/bot-user/games/morpion/move", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
		});
		const data = (await res.json()) as ApiState | ApiError;
		if ("error" in data) {
			setError(data.error);
			return null;
		}
		setError(null);
		return data;
	}

	function startNew() {
		const parsedStake = stake ? Number(stake) : undefined;
		if (
			parsedStake !== undefined &&
			(!Number.isFinite(parsedStake) || parsedStake < 1)
		) {
			setError("Mise invalide");
			return;
		}
		startTransition(async () => {
			const next = await call({ stake: parsedStake });
			if (next) setState(next);
		});
	}

	function play(cell: number) {
		if (!state) return;
		if (state.outcome.kind !== "playing") return;
		sfx.click();
		startTransition(async () => {
			const next = await call({
				cell,
				state: { board: state.board.join(""), sig: state.sig, ts: state.ts },
				stake: state.stake || undefined,
			});
			if (next) {
				setState(next);
				if (next.outcome.kind === "won") {
					if (next.outcome.mark === "X") sfx.win();
					else sfx.lose();
				} else if (next.outcome.kind === "draw") sfx.draw();
			}
		});
	}

	const winLine = state?.outcome.kind === "won" ? state.outcome.line : [];
	const finishedKey =
		state?.outcome.kind === "won"
			? `won-${state.outcome.mark}`
			: state?.outcome.kind === "draw"
				? "draw"
				: null;

	return (
		<div className="space-y-6">
			{!state && (
				<div className="dbz-panel p-6 space-y-4">
					<label className="block">
						<span className="font-saiyan uppercase tracking-widest text-sm text-dbz-yellow">
							Mise (optionnelle, en zénis)
						</span>
						<input
							type="number"
							min={1}
							max={1_000_000}
							value={stake}
							onChange={(e) => setStake(e.target.value)}
							placeholder="défaut : 100 z win / 50 z loss"
							className="mt-2 w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 font-mono"
							disabled={pending}
						/>
					</label>
					<button
						type="button"
						onClick={startNew}
						disabled={pending}
						className="dbz-button w-full disabled:opacity-40"
					>
						{pending ? "…" : "NOUVELLE PARTIE"}
					</button>
				</div>
			)}

			{state && (
				<>
					<div className="dbz-panel p-6">
						<div className="grid grid-cols-3 gap-2">
							{state.board.map((v, i) => (
								<CellButton
									key={i}
									value={v}
									highlighted={winLine.includes(i)}
									disabled={pending || state.outcome.kind !== "playing"}
									onClick={() => play(i)}
								/>
							))}
						</div>
					</div>

					{finishedKey && (
						<div className="dbz-panel p-5 border-l-8 border-dbz-yellow">
							<div className="flex items-baseline justify-between mb-2">
								<span
									className={`font-saiyan text-3xl ${OUTCOME_LABEL[finishedKey].color}`}
								>
									{OUTCOME_LABEL[finishedKey].label}
								</span>
								{state.balance !== undefined && (
									<span className="font-scouter text-xs tracking-widest text-dbz-blue-light">
										Solde : {state.balance} z
									</span>
								)}
							</div>
							{state.delta !== undefined && state.delta !== 0 && (
								<p
									className={`font-saiyan text-xl ${state.delta > 0 ? "text-green-400" : "text-red-400"}`}
								>
									{state.delta > 0 ? "+" : ""}
									{state.delta} z
								</p>
							)}
							<button
								type="button"
								onClick={() => setState(null)}
								className="dbz-button mt-4 !text-sm"
							>
								REJOUER
							</button>
						</div>
					)}
				</>
			)}

			{error && (
				<div className="dbz-panel p-4 border-l-8 border-red-400">
					<span className="font-scouter text-xs tracking-widest text-red-400">
						✗ {error}
					</span>
				</div>
			)}
		</div>
	);
}
