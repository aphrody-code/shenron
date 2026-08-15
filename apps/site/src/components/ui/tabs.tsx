import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

/**
 * base-ui nomme les parts `Tabs.Root` / `Tabs.List` / `Tabs.Tab` / `Tabs.Panel`
 * (pas `Trigger` / `Content` comme radix) et expose l'onglet actif via
 * `data-active` (pas `data-state="active"`).
 */
function Tabs({ className, ...props }: Omit<TabsPrimitive.Root.Props, "key">) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn(
				"flex gap-2 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
				className
			)}
			{...props}
		/>
	);
}

function TabsList({ className, ...props }: Omit<TabsPrimitive.List.Props, "key">) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				"inline-flex w-fit items-center justify-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground",
				"data-[orientation=vertical]:h-fit data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
				className
			)}
			{...props}
		/>
	);
}

function TabsTrigger({ className, ...props }: Omit<TabsPrimitive.Tab.Props, "key">) {
	return (
		<TabsPrimitive.Tab
			data-slot="tabs-trigger"
			className={cn(
				"inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-[min(var(--radius-md),12px)] border border-transparent bg-clip-padding px-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none select-none",
				"text-muted-foreground hover:text-foreground",
				"data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-sm",
				"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		/>
	);
}

function TabsContent({ className, ...props }: Omit<TabsPrimitive.Panel.Props, "key">) {
	return (
		<TabsPrimitive.Panel
			data-slot="tabs-content"
			className={cn("flex-1 outline-none", className)}
			{...props}
		/>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
