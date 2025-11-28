"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Spade } from "lucide-react";

interface PlayingCardProps {
	card: string | number;
	faceUp?: boolean;
	className?: string;
	onClick?: () => void;
	selected?: boolean;
}

const PlayingCard = ({
	card,
	faceUp = true,
	className,
	onClick,
	selected = false,
}: PlayingCardProps) => {
	// "AS" represents Ace of Spades (shows spade icon)
	// "A" represents any other Ace (shows just "A")

	return (
		<div
			onClick={onClick}
			className={cn(
				"relative w-20 h-28 md:w-24 md:h-36 perspective-1000 select-none transition-transform duration-200",
				selected && "-translate-y-4",
				className
			)}
		>
			<div
				className={cn(
					"w-full h-full transition-all duration-500 transform-style-3d border-2 rounded-xl shadow-md",
					faceUp ? "rotate-y-0" : "rotate-y-180",
					"bg-card text-card-foreground border-border"
				)}
			>
				{/* Front */}
				<div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center rounded-xl border-2 border-border dark:border-primary/50 overflow-hidden">
					{/* Top Left Corner */}
					<div className="absolute top-1 left-1 flex flex-col items-center">
						<span className="text-sm font-bold leading-none">
							{String(card) === "AS" ? "A" : card}
						</span>
						<div className="w-3 h-3">
							{String(card) === "AS" && (
								<Spade className="w-full h-full fill-current" />
							)}
						</div>
					</div>

					{/* Center */}
					<div className="text-4xl font-bold flex items-center justify-center">
						{String(card) === "AS" ? (
							<Spade className="w-12 h-12 fill-current" />
						) : (
							card
						)}
					</div>

					{/* Bottom Right Corner (Rotated) */}
					<div className="absolute bottom-1 right-1 flex flex-col items-center rotate-180">
						<span className="text-sm font-bold leading-none">
							{String(card) === "AS" ? "A" : card}
						</span>
						<div className="w-3 h-3">
							{String(card) === "AS" && (
								<Spade className="w-full h-full fill-current" />
							)}
						</div>
					</div>
				</div>

				{/* Back */}
				<div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl bg-red-600 dark:bg-emerald-700 text-white dark:text-black border-2 border-border dark:border-primary/50 flex items-center justify-center bg-pattern-grid">
					<div className="w-full h-full bg-opacity-20 bg-black rounded-xl" />
				</div>
			</div>
		</div>
	);
};

export default PlayingCard;
