import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-md border border-transparent bg-clip-padding px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/80",
				secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
				outline:
					"border-border bg-background text-foreground [a&]:hover:bg-muted [a&]:hover:text-foreground",
				destructive:
					"border-destructive/20 bg-destructive/10 text-destructive [a&]:hover:bg-destructive/20 dark:bg-destructive/20 dark:[a&]:hover:bg-destructive/30",
				success:
					"border-success/20 bg-success/10 text-success [a&]:hover:bg-success/20 dark:bg-success/20 dark:[a&]:hover:bg-success/30",
				warning:
					"border-warning/20 bg-warning/10 text-warning [a&]:hover:bg-warning/20 dark:bg-warning/20 dark:[a&]:hover:bg-warning/30",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

function Badge({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return (
		<span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
	);
}

export { Badge, badgeVariants };
