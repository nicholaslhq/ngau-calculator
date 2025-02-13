"use client";

import NgauCalculator from "@/components/NgauCalculator";

export default function Home() {
	return (
		<div className="flex items-top md:items-center justify-center min-h-screen bg-white md:bg-gray-200">
			<NgauCalculator />
		</div>
	);
}
