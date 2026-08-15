import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

/**
 * `@base-ui/react/separator` exporte le composant directement (pas de namespace
 * `Separator.Root` comme les autres primitives) : il rend un `<div>` avec
 * `role="separator"` + `data-orientation`.
 */
function Separator({
	className,
	orientation = "horizontal",
	...props
}: Omit<SeparatorPrimitive.Props, "key">) {
	return (
		<SeparatorPrimitive
			data-slot="separator"
			orientation={orientation}
			className={cn(
				"shrink-0 bg-border",
				"data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
				"data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
				className
			)}
			{...props}
		/>
	);
}

export { Separator };
