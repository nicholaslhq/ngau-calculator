"use client";

import NgauCalculator from "@/components/NgauCalculator";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full bg-background transition-colors duration-300">
			<NgauCalculator />
		</div>
	);
}
