"use client";

import { useState, useTransition } from "react";
import {
	createShopItem,
	updateShopItem,
	deleteShopItem,
	toggleShopItem,
	type ShopItemInput,
} from "./_actions";

const TYPES: ShopItemInput["type"][] = [
	"card",
	"badge",
	"color",
	"title",
	"banner",
];

function Input({
	name,
	label,
	type = "text",
	...rest
}: {
	name: string;
	label: string;
	type?: string;
	required?: boolean;
	pattern?: string;
	placeholder?: string;
	min?: number;
}) {
	return (
		<label className="block">
			<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
				{label}
			</span>
			<input
				name={name}
				type={type}
				{...rest}
				className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
			/>
		</label>
	);
}

function Select({
	name,
	label,
	options,
	required,
}: {
	name: string;
	label: string;
	options: readonly string[];
	required?: boolean;
}) {
	return (
		<label className="block">
			<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
				{label}
			</span>
			<select
				name={name}
				required={required}
				className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
			>
				{options.map((o) => (
					<option key={o} value={o}>
						{o}
					</option>
				))}
			</select>
		</label>
	);
}

export function ShopCreateForm() {
	const [pending, start] = useTransition();
	const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(
		null,
	);

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const input: ShopItemInput = {
			key: String(fd.get("key") ?? "").trim(),
			type: String(fd.get("type") ?? "card") as ShopItemInput["type"],
			name: String(fd.get("name") ?? "").trim(),
			description: (fd.get("description") as string) || null,
			price: Number(fd.get("price") ?? 0),
			role_id: (fd.get("role_id") as string) || null,
			meta: (fd.get("meta") as string) || null,
			enabled: fd.get("enabled") === "on",
		};
		start(async () => {
			const r = await createShopItem(input);
			setResult(r);
			if (r.ok) (e.target as HTMLFormElement).reset();
		});
	}

	return (
		<form onSubmit={onSubmit} className="dbz-panel p-5 space-y-3 mb-6">
			<h3 className="font-saiyan text-xl text-fuchsia-300 mb-2">
				+ Créer un item
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
				<Input name="key" label="Clé (unique)" required pattern="[a-z0-9_-]+" />
				<Select name="type" label="Type" required options={TYPES} />
				<Input name="name" label="Nom affiché" required />
				<Input
					name="price"
					label="Prix (zénis)"
					type="number"
					min={0}
					required
				/>
				<Input name="description" label="Description" />
				<Input
					name="role_id"
					label="Role ID (color uniquement)"
					pattern="\d{17,20}"
				/>
				<Input name="meta" label="Meta JSON" placeholder='{"key":"value"}' />
				<label className="flex items-center gap-2 pt-5">
					<input
						type="checkbox"
						name="enabled"
						defaultChecked
						className="w-4 h-4"
					/>
					<span className="font-scouter tracking-widest text-cyan-300">
						ACTIVÉ
					</span>
				</label>
			</div>
			<div className="flex items-center gap-3 pt-2">
				<button
					type="submit"
					disabled={pending}
					className="dbz-button !text-xs disabled:opacity-40"
				>
					{pending ? "Création…" : "Créer item"}
				</button>
				{result && (
					<span
						className={`text-xs ${result.ok ? "text-green-300" : "text-red-400"}`}
					>
						{result.ok ? "✓ Item créé" : `✗ ${result.error}`}
					</span>
				)}
			</div>
		</form>
	);
}

export function ShopRowActions({
	itemKey,
	enabled,
}: {
	itemKey: string;
	enabled: boolean;
}) {
	const [pending, start] = useTransition();
	return (
		<div className="flex gap-2 items-center justify-end">
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await toggleShopItem(itemKey);
					})
				}
				className={`px-2 py-1 text-[10px] uppercase tracking-widest border rounded ${
					enabled
						? "border-green-400/50 text-green-300 hover:bg-green-500/10"
						: "border-white/20 text-white/40 hover:bg-white/5"
				}`}
			>
				{enabled ? "ON" : "OFF"}
			</button>
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						if (!confirm(`Supprimer "${itemKey}" ?`)) return;
						await deleteShopItem(itemKey);
					})
				}
				className="px-2 py-1 text-[10px] uppercase tracking-widest border border-red-400/50 text-red-300 hover:bg-red-500/10 rounded"
			>
				✗ Suppr
			</button>
		</div>
	);
}

export function ShopPriceCell({
	itemKey,
	initial,
}: {
	itemKey: string;
	initial: number;
}) {
	const [editing, setEditing] = useState(false);
	const [val, setVal] = useState(String(initial));
	const [pending, start] = useTransition();
	if (!editing) {
		return (
			<button
				type="button"
				onClick={() => setEditing(true)}
				className="text-fuchsia-200 hover:text-fuchsia-100 underline decoration-dotted"
			>
				{initial} z
			</button>
		);
	}
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const price = Number(val);
				if (!Number.isFinite(price) || price < 0) return;
				start(async () => {
					await updateShopItem(itemKey, { price });
					setEditing(false);
				});
			}}
			className="flex gap-1"
		>
			<input
				type="number"
				value={val}
				onChange={(e) => setVal(e.target.value)}
				autoFocus
				min={0}
				className="w-20 px-1 bg-dbz-bg border border-fuchsia-400 text-fuchsia-200"
			/>
			<button
				type="submit"
				disabled={pending}
				className="text-green-300 text-xs"
			>
				✓
			</button>
			<button
				type="button"
				onClick={() => setEditing(false)}
				className="text-white/40 text-xs"
			>
				✗
			</button>
		</form>
	);
}
