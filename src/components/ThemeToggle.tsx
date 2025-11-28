"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<button
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className="relative w-12 h-12 md:w-14 md:h-14  rounded-full bg-gradient-to-br from-primary via-primary to-amber-600 shadow-lg shadow-primary/50 flex items-center justify-center border-4 border-white dark:border-gray-800 hover:scale-105 active:scale-95 transition-transform duration-200 group"
		>
			{/* Chip edge notches */}
			<div
				className="absolute inset-0 rounded-full pointer-events-none"
				style={{
					background: `repeating-conic-gradient(
                    from 0deg,
                    transparent 0deg 8deg,
                    rgba(255,255,255,0.3) 8deg 10deg
                )`,
				}}
			/>

			{/* Center circle */}
			<div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border-2 border-primary/30 transition-colors">
				<Sun className="w-6 h-6 text-primary rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute w-6 h-6 text-primary rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			</div>

			<span className="sr-only">Toggle theme</span>
		</button>
	);
}
