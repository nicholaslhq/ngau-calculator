type Card = number | "J" | "Q" | "K" | "A";

interface CombinationResult {
	bull_group: Card[];
	remainder: Card[];
	hand_type: string;
	points: string | number;
}

function possibleAssignmentsForCard(card: Card): [number, Card][] {
	if (typeof card === "number") {
		if (card === 3 || card === 6) {
			return [
				[3, 3],
				[6, 6],
			];
		} else {
			return [[card, card]];
		}
	} else if (typeof card === "string") {
		if (card === "A") {
			return [[1, "A"]];
		} else if (card === "J" || card === "Q" || card === "K") {
			return [[10, card]];
		} else {
			try {
				const cardNum = parseInt(card);
				if (cardNum === 3 || cardNum === 6) {
					return [
						[3, 3],
						[6, 6],
					];
				} else {
					return [[cardNum, cardNum]];
				}
			} catch {
				return [];
			}
		}
	}
	return [];
}

function bestOutcomeForTwoCards(
	cards: Card[]
): {
	outcome_type: string;
	outcome_points: number;
	remainder_assignment: [number, Card][];
} | null {
	const outcomesList: {
		priority: number;
		pts: number;
		assignment: [number, Card][];
		outcome_type: string;
	}[] = [];

	const possibleAssignments = cartesianProduct(
		...cards.map((card) => possibleAssignmentsForCard(card))
	);

	for (const assignment of possibleAssignments) {
		const v1 = assignment[0][0];
		const r1 = assignment[0][1];
		const v2 = assignment[1][0];
		const r2 = assignment[1][1];

		let outcome_type: string;
		let priority: number;
		let pts: number | undefined;

		if (
			(r1 === "A" && (r2 === "J" || r2 === "Q" || r2 === "K")) ||
			(r2 === "A" && (r1 === "J" || r1 === "Q" || r1 === "K"))
		) {
			outcome_type = "Ngau";
			priority = 3;
			pts = undefined;
		} else if (r1 === r2) {
			outcome_type = "Double";
			priority = 2;
			pts = undefined;
		} else {
			outcome_type = "Normal";
			priority = 1;
			const sum = v1 + v2;
			if (sum <= 10) {
				pts = sum;
			} else {
				pts = sum - 10;
			}
		}

		outcomesList.push({
			priority,
			pts: pts ?? 0,
			assignment,
			outcome_type,
		});
	}

	if (outcomesList.length === 0) {
		return null;
	}

	const bestOutcome = outcomesList.reduce((prev, current) => {
		if (current.priority > prev.priority) {
			return current;
		} else if (
			current.priority === prev.priority &&
			current.pts > prev.pts
		) {
			return current;
		}
		return prev;
	});

	return {
		outcome_type: bestOutcome.outcome_type,
		outcome_points: bestOutcome.pts,
		remainder_assignment: bestOutcome.assignment,
	};
}

function computeBestCombination(hand: Card[]): CombinationResult {
	let bestCandidate: number[] | undefined = undefined;
	let bestRank: [number, number] = [-1, -1];
	let bestBullGroup: Card[] | undefined = undefined;
	let bestRemainderCards: Card[] | undefined = undefined;

	const totalCards = hand.length;
	const indices = Array.from({ length: totalCards }, (_, i) => i);

	for (const bullIndices of combinations(indices, 3)) {
		const bullGroup = bullIndices.map((i) => hand[i]);
		const remainderIndices = indices.filter(
			(i) => !bullIndices.includes(i)
		);
		const remainderCards = remainderIndices.map((i) => hand[i]);

		let validBull = false;
		const bullAssignments = cartesianProduct(
			...bullGroup.map((card) => possibleAssignmentsForCard(card))
		);

		for (const assignment of bullAssignments) {
			let totalSum = 0;
			for (const [v] of assignment) {
				totalSum += v;
			}
			if (totalSum % 10 === 0) {
				validBull = true;
				break;
			}
		}

		if (!validBull) {
			continue;
		}

		const outcome = bestOutcomeForTwoCards(remainderCards);
		if (!outcome) {
			continue;
		}

		const { outcome_type, outcome_points } = outcome;

		let candidateRank: [number, number];
		if (outcome_type === "Ngau") {
			candidateRank = [3, 0];
		} else if (outcome_type === "Double") {
			candidateRank = [2, 0];
		} else {
			candidateRank = [1, outcome_points];
		}

		if (
			candidateRank[0] > bestRank[0] ||
			(candidateRank[0] === bestRank[0] && candidateRank[1] > bestRank[1])
		) {
			bestRank = candidateRank;
			bestCandidate = bullIndices;
			bestBullGroup = bullGroup;
			bestRemainderCards = remainderCards;
		}
	}

	if (bestCandidate === undefined) {
		return {
			bull_group: [],
			remainder: [],
			hand_type: "No Valid Ngau Combination",
			points: 0,
		};
	} else {
		let hand_type: string;
		let points: string | number;

		if (bestRank[0] === 3) {
			hand_type = "Ngau Tongku";
			points = "Ngau Tongku";
		} else if (bestRank[0] === 2) {
			hand_type = "Pair";
			points = "Pair";
		} else {
			hand_type = "Normal";
			points = bestRank[1];
		}

		return {
			bull_group: bestBullGroup!,
			remainder: bestRemainderCards!,
			hand_type: hand_type,
			points: points,
		};
	}
}

// Helper function to generate combinations
function* combinations<T>(
	array: T[],
	k: number,
	start: number = 0,
	current: T[] = []
): Generator<T[]> {
	if (k === 0) {
		yield [...current];
		return;
	}
	for (let i = start; i <= array.length - k; ++i) {
		current.push(array[i]);
		yield* combinations(array, k - 1, i + 1, current);
		current.pop();
	}
}

// Helper function for cartesian product
function cartesianProduct<T>(...args: T[][]): T[][] {
	const result: T[][] = [[]];
	for (const arr of args) {
		const temp: T[][] = [];
		for (const x of result) {
			for (const y of arr) {
				temp.push([...x, y]);
			}
		}
		result.length = 0;
		result.push(...temp);
	}
	return result;
}

export { computeBestCombination };
