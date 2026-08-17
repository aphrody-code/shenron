import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";

/**
 * base-ui n'a pas de primitive « dropdown-menu » : c'est `@base-ui/react/menu`
 * (Root > Trigger — Portal > Positioner > Popup > Item / Group / GroupLabel /
 * Separator). `Root` ne rend pas d'élément DOM et est générique sur le payload :
 * on le ré-exporte tel quel.
 */
const DropdownMenu = MenuPrimitive.Root;

const DropdownMenuGroup = MenuPrimitive.Group;

function DropdownMenuTrigger({ className, ...props }: Omit<MenuPrimitive.Trigger.Props, "key">) {
	return (
		<MenuPrimitive.Trigger
			data-slot="dropdown-menu-trigger"
			className={cn("outline-none", className)}
			{...props}
		/>
	);
}

function DropdownMenuContent({
	className,
	sideOffset = 4,
	align = "start",
	positionerClassName,
	...props
}: Omit<MenuPrimitive.Popup.Props, "key"> & {
	sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"];
	align?: MenuPrimitive.Positioner.Props["align"];
	positionerClassName?: string;
}) {
	return (
		<MenuPrimitive.Portal>
			<MenuPrimitive.Positioner
				data-slot="dropdown-menu-positioner"
				sideOffset={sideOffset}
				align={align}
				className={cn("z-50 outline-none", positionerClassName)}
			>
				<MenuPrimitive.Popup
					data-slot="dropdown-menu-content"
					className={cn(
						"max-h-[var(--available-height)] min-w-32 origin-[var(--transform-origin)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover bg-clip-padding p-1 text-popover-foreground shadow-lg outline-none",
						"transition-[transform,opacity] duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:scale-95",
						className
					)}
					{...props}
				/>
			</MenuPrimitive.Positioner>
		</MenuPrimitive.Portal>
	);
}

function DropdownMenuItem({
	className,
	variant = "default",
	...props
}: Omit<MenuPrimitive.Item.Props, "key"> & { variant?: "default" | "destructive" }) {
	return (
		<MenuPrimitive.Item
			data-slot="dropdown-menu-item"
			data-variant={variant}
			className={cn(
				"relative flex cursor-default items-center gap-2 rounded-[min(var(--radius-md),12px)] px-2 py-1.5 text-sm outline-none select-none",
				"data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				"data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[variant=destructive]:data-[highlighted]:text-destructive",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		/>
	);
}

function DropdownMenuLabel({ className, ...props }: Omit<MenuPrimitive.GroupLabel.Props, "key">) {
	return (
		<MenuPrimitive.GroupLabel
			data-slot="dropdown-menu-label"
			className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
			{...props}
		/>
	);
}

function DropdownMenuSeparator({
	className,
	...props
}: Omit<MenuPrimitive.Separator.Props, "key">) {
	return (
		<MenuPrimitive.Separator
			data-slot="dropdown-menu-separator"
			className={cn("-mx-1 my-1 h-px bg-border", className)}
			{...props}
		/>
	);
}

export {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
};
