"use client";

import NgauCalculator from "@/components/NgauCalculator";

export default function Home() {
	return (
		<div
			className="flex flex-col items-center justify-center bg-white md:bg-gray-300 h-screen w-screen"
		>
			<NgauCalculator />
		</div>
	);
}
