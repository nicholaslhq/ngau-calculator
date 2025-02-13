"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { computeBestCombination } from "@/lib/calculator";
import { Spade, Delete, X } from "lucide-react";

interface CombinationResult {
	bull_group: (string | number)[];
	remainder: (string | number)[];
	hand_type: string;
	points: string | number;
	error?: string;
}

const NgauCalculator = () => {
	const [hand, setHand] = useState<string[]>([]);
	const [result, setResult] = useState<CombinationResult | null>(null);

	const handleCardClick = (card: string) => {
		if (hand.length < 5) {
			setHand([...hand, card]);
			setResult(null);
		}
	};

	const handleCalculate = React.useCallback(() => {
		if (hand.length === 5) {
			// Convert hand to the correct type for computeBestCombination
			const typedHand = hand.map((card) => {
				if (["J", "Q", "K", "A"].includes(card)) {
					return card;
				} else {
					const parsedCard = parseInt(card);
					return isNaN(parsedCard) ? card : parsedCard;
				}
			}) as (number | "J" | "Q" | "K" | "A")[];
			const calculationResult = computeBestCombination(typedHand);
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
	}, [hand, setResult]);

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

	return (
		<Card className="w-full max-w-md h-full p-4 md:p-8 bg-white shadow-none border-0 md:border-2 md:border-border md:shadow-light">
			<div className="text-center text-lg font-semibold mb-4">
				<Card className={`shadow-none p-5 ${
									result?.error
										? "bg-red-500"
										: result && hand.length === 5
										? Number(result.points)
											? Number(result.points) >= 1 && Number(result.points) <= 10
												? "bg-emerald-300"
												: "bg-white"
											: result.hand_type === "Pair"
											? "bg-cyan-300"
											: result.hand_type === "Ngau Tongku"
											? "bg-yellow-300"
											: "bg-red-300"
										: "bg-white"
								}`}>
									{result && hand.length === 5
										? Number(result.points)
											? result.points + " Points"
											: result.hand_type
										: "Ngau Calculator"}
								</Card>
			</div>
			<div className="flex flex-col gap-5 my-8 md:my-10">
				<div className="flex justify-evenly">
					{[...Array(2)].map((_, index) => (
						<Card
							key={index}
							className="w-24 h-36 flex items-center justify-center bg-white"
						>
							<span className="text-xl font-bold">
								{result &&
								hand.length === 5 &&
								!result.error &&
								!(Number(result.points) == 0) ? (
									result.remainder[index] === "A" ? (
										<Spade />
									) : (
										result.remainder[index] || ""
									)
								) : hand[index] === "A" ? (
									<Spade />
								) : (
									hand[index] || ""
								)}
							</span>
						</Card>
					))}
				</div>
				<div className="flex justify-evenly">
					{[...Array(3)].map((_, index) => (
						<Card
							key={index + 2}
							className="w-24 h-36 flex items-center justify-center bg-white"
						>
							<span className="text-xl font-bold">
								{result &&
								hand.length === 5 &&
								!result.error &&
								!(Number(result.points) == 0) ? (
									result.bull_group[index] === "A" ? (
										<Spade />
									) : (
										result.bull_group[index] || ""
									)
								) : hand[index + 2] === "A" ? (
									<Spade />
								) : (
									hand[index + 2] || ""
								)}
							</span>
						</Card>
					))}
				</div>
			</div>
			<div className="grid grid-cols-4 gap-2">
				{[
					"A",
					"1",
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
				].map((card) => (
					<Button
						key={card}
						onClick={() => handleCardClick(card)}
						className="p-8"
						disabled={
							hand.length === 5 ||
							(card === "A" && hand.includes("A")) ||
							(card !== "A" && hand.filter((c) => c === card).length >= 4)
						}
					>
						<span className="text-xl [&_svg]:size-6">
							{card === "A" ? <Spade /> : card}
						</span>
					</Button>
				))}
				<Button
					variant="neutral"
					onClick={handleClear}
					className="p-8 [&_svg]:size-6"
				>
					<X />
				</Button>
				<Button
					variant="neutral"
					onClick={handleBackspace}
					className="p-8 [&_svg]:size-6"
				>
					<Delete />
				</Button>
			</div>
		</Card>
	);
};

export default NgauCalculator;
