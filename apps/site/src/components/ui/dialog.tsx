import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Anatomie base-ui : Root > Trigger — Portal > Backdrop + Popup > (Title,
 * Description, Close). `Root` ne rend pas d'élément DOM et est générique sur le
 * payload : on le ré-exporte tel quel. Les transitions passent par
 * `data-starting-style` / `data-ending-style` (pas `data-state`).
 */
const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

function DialogContent({
	className,
	children,
	showCloseButton = true,
	backdropClassName,
	...props
}: Omit<DialogPrimitive.Popup.Props, "key"> & {
	showCloseButton?: boolean;
	backdropClassName?: string;
}) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Backdrop
				data-slot="dialog-backdrop"
				className={cn(
					"fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-150",
					"data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
					backdropClassName
				)}
			/>
			<DialogPrimitive.Popup
				data-slot="dialog-content"
				className={cn(
					"fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-popover bg-clip-padding p-6 text-popover-foreground shadow-lg outline-none sm:max-w-lg",
					"transition-[transform,opacity] duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:scale-95",
					className
				)}
				{...props}
			>
				{children}
				{showCloseButton ? (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						aria-label="Fermer"
						className="absolute top-4 right-4 inline-flex size-7 items-center justify-center rounded-[min(var(--radius-md),12px)] text-muted-foreground opacity-70 transition-all outline-none hover:bg-muted hover:text-foreground hover:opacity-100 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
					>
						<XIcon />
					</DialogPrimitive.Close>
				) : null}
			</DialogPrimitive.Popup>
		</DialogPrimitive.Portal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className
			)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: Omit<DialogPrimitive.Title.Props, "key">) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("text-lg leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: Omit<DialogPrimitive.Description.Props, "key">) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function DialogClose({ className, ...props }: Omit<DialogPrimitive.Close.Props, "key">) {
	return (
		<DialogPrimitive.Close data-slot="dialog-close" className={cn(className)} {...props} />
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
};
