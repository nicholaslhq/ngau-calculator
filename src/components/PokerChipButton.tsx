"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PokerChipButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "neutral" | "red";
}

const PokerChipButton = React.forwardRef<
	HTMLButtonElement,
	PokerChipButtonProps
>(({ className, variant = "default", children, disabled, ...props }, ref) => {
	return (
		<button
			ref={ref}
			disabled={disabled}
			className={cn(
				"relative flex items-center justify-center rounded-full aspect-square font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md hover:shadow-lg select-none",
				// Base chip style - dashed border for the "spots"
				"border-[6px] border-dashed",

				// Variants
				variant === "neutral" &&
					"bg-white dark:bg-zinc-700 border-zinc-300 dark:border-zinc-500 text-zinc-900 dark:text-zinc-300",
				variant === "default" &&
					"bg-blue-600 dark:bg-blue-900 border-blue-400 dark:border-blue-700 text-white dark:text-zinc-300",
				variant === "red" &&
					"bg-red-600 dark:bg-red-900 border-red-400 dark:border-red-700 text-white dark:text-zinc-300",
				variant === "outline" &&
					"bg-transparent border-zinc-400 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400",

				className
			)}
			{...props}
		>
			{/* Inner circle for depth effect */}
			<div
				className={cn(
					"absolute inset-1 rounded-full border-2 pointer-events-none",
					variant === "neutral" &&
						"border-zinc-300 dark:border-zinc-600",
					variant === "default" &&
						"border-blue-400 dark:border-blue-700",
					variant === "red" && "border-red-400 dark:border-red-700",
					variant === "outline" &&
						"border-zinc-400 dark:border-zinc-700"
				)}
			/>

			{/* Content */}
			<span className="relative z-10 text-xl md:text-2xl drop-shadow-sm">
				{children}
			</span>
		</button>
	);
});

PokerChipButton.displayName = "PokerChipButton";

export default PokerChipButton;
