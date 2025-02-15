"use client";

import { useEffect, useState } from "react";
import NgauCalculator from "@/components/NgauCalculator";

export default function Home() {
	const [windowHeight, setWindowHeight] = useState(0);

	useEffect(() => {
		// Function to update the window height
		const updateHeight = () => {
			setWindowHeight(window.innerHeight); // Get the viewport height excluding the nav bar
		};

		// Set initial height
		updateHeight();

		// Add resize event listener to update height on window resize
		window.addEventListener("resize", updateHeight);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener("resize", updateHeight);
		};
	}, []);

	return (
		<div
			className="flex flex-col items-center justify-center bg-white md:bg-gray-300"
			style={{ height: windowHeight }}
		>
			<NgauCalculator />
		</div>
	);
}
