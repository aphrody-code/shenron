import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

/**
 * base-ui expose `data-checked` / `data-unchecked` sur la Root ET le Thumb
 * (cf. `switch/stateAttributesMapping.js`) — pas de `data-state="checked"`
 * façon radix. Le Thumb est rendu par `Switch` (il est aussi exporté seul pour
 * les compositions sur mesure via `SwitchPrimitive.Root`).
 */
function Switch({
	className,
	thumbClassName,
	...props
}: Omit<SwitchPrimitive.Root.Props, "key"> & { thumbClassName?: string }) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				"peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-clip-padding p-px transition-all outline-none",
				"bg-input data-[unchecked]:bg-input dark:data-[unchecked]:bg-muted",
				"data-[checked]:bg-primary",
				"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
				className
			)}
			{...props}
		>
			<SwitchThumb className={thumbClassName} />
		</SwitchPrimitive.Root>
	);
}

function SwitchThumb({ className, ...props }: Omit<SwitchPrimitive.Thumb.Props, "key">) {
	return (
		<SwitchPrimitive.Thumb
			data-slot="switch-thumb"
			className={cn(
				"pointer-events-none block size-4 rounded-full bg-background shadow-sm ring-0 transition-transform",
				"data-[unchecked]:translate-x-0 data-[checked]:translate-x-4",
				className
			)}
			{...props}
		/>
	);
}

export { Switch, SwitchThumb };
