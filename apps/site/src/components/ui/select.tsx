import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Anatomie base-ui (≠ radix) :
 * Root > Trigger > (Value, Icon) — Portal > Positioner > Popup > Item > (ItemIndicator, ItemText).
 * `Root` ne rend aucun élément DOM et est générique sur la valeur : on le
 * ré-exporte tel quel pour préserver l'inférence `<Select<Value> …>`.
 */
const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

function SelectTrigger({
	className,
	children,
	...props
}: Omit<SelectPrimitive.Trigger.Props, "key">) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			className={cn(
				"flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border bg-background bg-clip-padding px-3 py-2 text-sm whitespace-nowrap text-foreground shadow-xs transition-[color,box-shadow] outline-none select-none",
				"hover:bg-muted data-[open]:bg-muted",
				"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon
				render={<ChevronDownIcon className="size-4 opacity-60" />}
			/>
		</SelectPrimitive.Trigger>
	);
}

function SelectValue({ className, ...props }: Omit<SelectPrimitive.Value.Props, "key">) {
	return (
		<SelectPrimitive.Value
			data-slot="select-value"
			className={cn("truncate text-left data-[placeholder]:text-muted-foreground", className)}
			{...props}
		/>
	);
}

function SelectContent({
	className,
	sideOffset = 4,
	align = "start",
	alignItemWithTrigger = false,
	positionerClassName,
	...props
}: Omit<SelectPrimitive.Popup.Props, "key"> & {
	sideOffset?: SelectPrimitive.Positioner.Props["sideOffset"];
	align?: SelectPrimitive.Positioner.Props["align"];
	alignItemWithTrigger?: SelectPrimitive.Positioner.Props["alignItemWithTrigger"];
	positionerClassName?: string;
}) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				data-slot="select-positioner"
				sideOffset={sideOffset}
				align={align}
				alignItemWithTrigger={alignItemWithTrigger}
				className={cn("z-50 outline-none", positionerClassName)}
			>
				<SelectPrimitive.Popup
					data-slot="select-content"
					className={cn(
						"max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover bg-clip-padding p-1 text-popover-foreground shadow-lg outline-none",
						"transition-[transform,opacity] duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:scale-95",
						className
					)}
					{...props}
				/>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

function SelectItem({
	className,
	children,
	...props
}: Omit<SelectPrimitive.Item.Props, "key">) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				"relative flex w-full cursor-default items-center gap-2 rounded-[min(var(--radius-md),12px)] py-1.5 pr-8 pl-2 text-sm outline-none select-none",
				"data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator className="absolute right-2 flex size-3.5 items-center justify-center">
				<CheckIcon className="size-4" />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
}

function SelectGroupLabel({
	className,
	...props
}: Omit<SelectPrimitive.GroupLabel.Props, "key">) {
	return (
		<SelectPrimitive.GroupLabel
			data-slot="select-group-label"
			className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
			{...props}
		/>
	);
}

function SelectSeparator({
	className,
	...props
}: Omit<SelectPrimitive.Separator.Props, "key">) {
	return (
		<SelectPrimitive.Separator
			data-slot="select-separator"
			className={cn("-mx-1 my-1 h-px bg-border", className)}
			{...props}
		/>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectGroupLabel,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
