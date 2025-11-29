"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import {
	computeBestCombination,
	type Card as CalculatorCard,
	type CardInput,
} from "@/lib/calculator";
import { Spade, Delete, X } from "lucide-react";
import Image from "next/image";
import PlayingCard from "./PlayingCard";
import PokerChipButton from "./PokerChipButton";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface CombinationResult {
	bull_group: CalculatorCard[];
	remainder: CalculatorCard[];
	hand_type: string;
	points: string | number;
	error?: string;
}

const NgauCalculator = () => {
	const { theme } = useTheme();
	const [hand, setHand] = useState<CardInput[]>([]);
	const [result, setResult] = useState<CombinationResult | null>(null);
	const [isPulsing, setIsPulsing] = useState(false);

	const handleCardClick = (card: CardInput) => {
		if (hand.length < 5) {
			setHand([...hand, card]);
			setResult(null);
		}
	};

	const handleCalculate = React.useCallback(() => {
		if (hand.length === 5) {
			const calculationResult = computeBestCombination(hand);
			setResult(calculationResult);
		} else {
			setResult({
				error: "Please select 5 cards.",
				bull_group: [],
				remainder: [],
				hand_type: "",
				points: 0,
			});
		}
	}, [hand]);

	const handleClear = () => {
		setHand([]);
		setResult(null);
	};

	const handleBackspace = () => {
		setHand((prevHand) => prevHand.slice(0, -1));
		setResult(null);
	};

	useEffect(() => {
		if (hand.length === 5) {
			handleCalculate();
		}
	}, [hand, handleCalculate]);

	// Trigger confetti for Ngau Tongku
	useEffect(() => {
		if (result?.hand_type === "Ngau Tongku") {
			setIsPulsing(true);

			const lightColors = [
				"#FFD400",
				"#FFB000",
				"#FF8400",
				"#FFCA6C",
				"#FDFF88",
			];
			const darkColors = [
				"#00FF9D",
				"#00CC7D",
				"#00FFCC",
				"#33FFB5",
				"#80FFCE",
			];
			const colors = theme === "dark" ? darkColors : lightColors;

			const defaults = {
				spread: 360,
				ticks: 100,
				gravity: 0.5,
				decay: 0.94,
				startVelocity: 20,
				colors: colors,
			};

			const shoot = () => {
				confetti({
					...defaults,
					particleCount: 40,
					scalar: 1.2,
					shapes: ["star"],
				});

				confetti({
					...defaults,
					particleCount: 10,
					scalar: 0.75,
					shapes: ["circle"],
				});
			};

			setTimeout(shoot, 0);
			setTimeout(shoot, 100);
			setTimeout(shoot, 200);

			setTimeout(() => {
				setIsPulsing(false);
			}, 2000);
		}
	}, [result]);

	// Helper function to get result display styles
	const getResultStyles = () => {
		if (result?.error) {
			return "bg-destructive/10 border-destructive text-destructive dark:text-red-400";
		}

		if (result && hand.length === 5) {
			if (result.hand_type === "Ngau Tongku") {
				const baseStyles =
					"bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 border-amber-500 dark:border-amber-600 text-white shadow-2xl shadow-amber-500/50";
				return isPulsing ? `${baseStyles} animate-pulse` : baseStyles;
			}

			if (result.hand_type === "Pair") {
				return "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 border-blue-500 dark:border-blue-600 text-white shadow-xl shadow-blue-500/40";
			}

			if (Number(result.points)) {
				const points = Number(result.points);
				if (points >= 7) {
					return "bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 border-emerald-500 dark:border-emerald-600 text-white shadow-xl shadow-emerald-500/40";
				} else if (points >= 4) {
					return "bg-gradient-to-br from-lime-400 to-lime-500 dark:from-lime-600 dark:to-lime-700 border-lime-500 dark:border-lime-600 text-gray-900 dark:text-white shadow-lg shadow-lime-500/30";
				} else {
					return "bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 border-slate-400 dark:border-slate-600 text-gray-900 dark:text-white shadow-md";
				}
			}

			if (result.points === 0) {
				return "bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 border-gray-500 dark:border-gray-600 text-white shadow-md";
			}
		}

		return "bg-card border-border dark:border-primary/40";
	};

	return (
		<div className="flex flex-col items-center w-full max-w-md md:max-w-2xl p-2 gap-4">
			{/* Header */}
			<div className="w-full relative p-3 md:p-4">
				{/* Vegas Lights Container */}
				<div className="absolute inset-0 rounded-3xl bg-amber-500/20 dark:bg-primary/20 border-4 border-amber-400/50 dark:border-primary/40 shadow-[0_0_30px_rgba(251,191,36,0.4)] dark:shadow-[0_0_30px_rgba(0,255,157,0.4)] z-0">
					{/* Lights */}
					<div className="absolute inset-0 rounded-3xl overflow-hidden">
						{/* Top Row */}
						<div className="absolute top-1 left-4 right-4 flex justify-evenly">
							{[...Array(12)].map((_, i) => (
								<div
									key={`top-${i}`}
									className={cn(
										"w-3 h-3 rounded-full bg-yellow-200 dark:bg-primary/60 shadow-yellow-400 dark:shadow-primary/40 text-yellow-400 dark:text-primary/60",
										i % 2 === 0
											? "animate-blink-1"
											: "animate-blink-2"
									)}
									style={{
										boxShadow: "0 0 10px currentColor",
									}}
								/>
							))}
						</div>
						{/* Bottom Row */}
						<div className="absolute bottom-1 left-4 right-4 flex justify-evenly">
							{[...Array(12)].map((_, i) => (
								<div
									key={`bottom-${i}`}
									className={cn(
										"w-3 h-3 rounded-full bg-yellow-200 dark:bg-primary/60 shadow-yellow-400 dark:shadow-primary/40 text-yellow-400 dark:text-primary/60",
										i % 2 === 0
											? "animate-blink-2"
											: "animate-blink-1"
									)}
									style={{
										boxShadow: "0 0 10px currentColor",
									}}
								/>
							))}
						</div>
						{/* Left Column */}
						<div className="absolute top-4 bottom-4 left-1 flex flex-col justify-between">
							{[...Array(4)].map((_, i) => (
								<div
									key={`left-${i}`}
									className={cn(
										"w-3 h-3 rounded-full bg-yellow-200 dark:bg-primary/60 shadow-yellow-400 dark:shadow-primary/40 text-yellow-400 dark:text-primary/60",
										i % 2 === 0
											? "animate-blink-2"
											: "animate-blink-1"
									)}
									style={{
										boxShadow: "0 0 10px currentColor",
									}}
								/>
							))}
						</div>
						{/* Right Column */}
						<div className="absolute top-4 bottom-4 right-1 flex flex-col justify-between">
							{[...Array(4)].map((_, i) => (
								<div
									key={`right-${i}`}
									className={cn(
										"w-3 h-3 rounded-full bg-yellow-200 dark:bg-primary/60 shadow-yellow-400 dark:shadow-primary/40 text-yellow-400 dark:text-primary/60",
										i % 2 === 0
											? "animate-blink-1"
											: "animate-blink-2"
									)}
									style={{
										boxShadow: "0 0 10px currentColor",
									}}
								/>
							))}
						</div>
					</div>
				</div>

				<div className="w-full relative overflow-hidden rounded-2xl border-4 border-primary/40 shadow-2xl z-10 bg-background">
					{/* Decorative corner accents */}
					<div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/60 rounded-tl-xl" />
					<div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary/60 rounded-tr-xl" />
					<div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary/60 rounded-bl-xl" />
					<div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/60 rounded-br-xl" />

					{/* Felt texture background */}
					<div className="relative bg-gradient-to-br from-secondary via-secondary/95 to-secondary/80 backdrop-blur-sm p-4 md:p-6">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-4">
								{/* Poker Chip Logo */}
								<div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary via-primary to-amber-600 shadow-lg shadow-primary/50 flex items-center justify-center border-4 border-white dark:border-gray-800">
									{/* Chip edge notches */}
									<div
										className="absolute inset-0 rounded-full"
										style={{
											background: `repeating-conic-gradient(
                                        from 0deg,
                                        transparent 0deg 8deg,
                                        rgba(255,255,255,0.3) 8deg 10deg
                                    )`,
										}}
									/>
									{/* Center circle */}
									<div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border-2 border-primary/30 select-none">
										<Image
											src={
												theme === "dark"
													? "/icon_dark.svg"
													: "/icon.svg"
											}
											alt="Ngau Calculator Icon"
											width={36}
											height={36}
											className="text-primary fill-current"
										/>
									</div>
								</div>

								{/* Title */}
								<div className="flex flex-col">
									<h1
										className="text-lg md:text-2xl font-black text-primary uppercase"
										style={{
											textShadow:
												"2px 2px 0px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.3)",
										}}
									>
										Ngau Calculator
									</h1>
									<p className="text-xs text-primary/70">
										Created by{" "}
										<a
											href="https://nlhq.vercel.app/"
											target="_blank"
											rel="noopener noreferrer"
											className="underline hover:text-primary transition-colors"
										>
											Nicholas
										</a>
									</p>
								</div>
							</div>

							{/* Theme Toggle as Poker Chip */}
							<ThemeToggle />
						</div>
					</div>
				</div>
			</div>

			{/* Result Display */}
			<Card
				className={cn(
					"w-full p-4 md:p-8 text-center transition-all duration-500 border-4 min-h-[4rem] flex items-center justify-center",
					getResultStyles()
				)}
			>
				<div className="text-2xl md:text-3xl font-black uppercase tracking-wider drop-shadow-lg">
					{result && hand.length === 5 ? (
						Number(result.points) ? (
							`${result.points} Points`
						) : (
							result.hand_type
						)
					) : (
						<span className="text-black dark:text-white">
							Select 5 Cards
						</span>
					)}
				</div>
			</Card>

			{/* Cards Area */}
			<div className="flex flex-col md:flex-row gap-8 w-full justify-center items-center min-h-[160px]">
				{/* Remainder / Left Cards */}
				<div className="flex gap-4 justify-center">
					{[0, 1].map((i) => {
						const cardVal =
							result &&
								hand.length === 5 &&
								!result.error &&
								result.points !== 0
								? result.remainder[i].display
								: hand[i];
						return (
							<PlayingCard
								key={`remainder-${i}`}
								card={cardVal || ""}
								faceUp={!!cardVal}
								className={cn(
									!cardVal &&
									"opacity-50 border-dashed border-2 border-muted-foreground/50 bg-transparent"
								)}
							/>
						);
					})}
				</div>

				{/* Divider for mobile/desktop */}
				<div className="hidden md:block w-px h-32 bg-muted-foreground/30" />

				{/* Bull Group / Right Cards */}
				<div className="flex gap-4 justify-center">
					{[0, 1, 2].map((i) => {
						const cardVal =
							result &&
								hand.length === 5 &&
								!result.error &&
								result.points !== 0
								? result.bull_group[i].display
								: hand[i + 2];
						return (
							<PlayingCard
								key={`bull-${i}`}
								card={cardVal || ""}
								faceUp={!!cardVal}
								className={cn(
									!cardVal &&
									"opacity-50 border-dashed border-2 border-muted-foreground/50 bg-transparent"
								)}
							/>
						);
					})}
				</div>
			</div>

			{/* Input Keypad */}
			<div className="w-full grid grid-cols-4 gap-4 md:gap-6 mt-4 justify-items-center">
				{[
					"AS",
					"A",
					"2",
					"3",
					"J",
					"4",
					"5",
					"6",
					"Q",
					"7",
					"8",
					"9",
					"K",
					"10",
				].map((card) => {
					// Count total Aces (both "A" and "AS")
					const totalAces = hand.filter(
						(c) => c === "A" || c === "AS"
					).length;

					return (
						<PokerChipButton
							key={card}
							onClick={() => handleCardClick(card)}
							disabled={
								hand.length === 5 ||
								(card === "AS" &&
									(hand.includes("AS") || totalAces >= 4)) ||
								(card === "A" &&
									hand.filter((c) => c === "A").length >=
									4) ||
								(card === "A" && totalAces >= 4) ||
								(card !== "AS" &&
									card !== "A" &&
									hand.filter((c) => c === card).length >= 4)
							}
							variant={
								card === "AS"
									? "red"
									: ["J", "Q", "K"].includes(card)
										? "default"
										: "neutral"
							}
							className="w-16 md:w-20 text-lg md:text-xl"
						>
							{card === "AS" ? (
								<Spade className="fill-current w-6 h-6" />
							) : (
								card
							)}
						</PokerChipButton>
					);
				})}
				<PokerChipButton
					variant="outline"
					onClick={handleBackspace}
					className="w-16 md:w-20"
				>
					<Delete className="w-6 h-6 text-zinc-200 dark:text-zinc-400" />
				</PokerChipButton>
				<PokerChipButton
					variant="outline"
					onClick={handleClear}
					className="w-16 md:w-20"
				>
					<X className="w-6 h-6 text-zinc-200 dark:text-zinc-400" />
				</PokerChipButton>
			</div>
		</div>
	);
};

export default NgauCalculator;
