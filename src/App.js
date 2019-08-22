import React, { useEffect, useState, useRef } from "react";

import "./App.css";

// const root = document.documentElement;
// let craziness = false;

// document.addEventListener("click", () => {
// 	craziness = !craziness;
// });

// const useMousePosition = (x, y, setCoords) => {
// 	console.log(x, y);
// 	// console.log(evt);
// 	// var x = evt.clientX,
// 	// 	y = evt.clientY;

// 	useEffect(() => {
// 		setCoords({ x, y });
// 		// const worker = new Worker("/worker.js");
// 		// worker.postMessage({ x, y });
// 		// worker.addEventListener("message", ({ data }) => {
// 		// 	// depending on type of data.
// 		// 	if (data.count) {
// 		// 		// setCount(data.count);
// 		// 	}
// 		// 	if (data.shadow) {
// 		// 		console.log(data.shadow);
// 		setCoords({ x, y });
// 		// 	}
// 		// });
// 	}, [setCoords, x, y]);

// 	// setCoords({ x, y });
// };
const workerPath = "/worker.js";
const useWorker = function(workerPath, coords, setCount) {
	const workerRef = useRef();
	useEffect(() => {
		const worker = new Worker(workerPath);
		workerRef.current = worker;
		worker.postMessage({ coords });

		worker.onmessage = message => {
			if (message.data.count) {
				setCount(message.data.progress);
			}
			if (message.data.shadow) {
				console.log(message.data.shadow);
			}
		};
		return () => {
			worker.terminate();
		};
	}, [coords, setCount, workerPath]);
	return [
		(...args) => {
			workerRef.current.postMessage(...args);
		}
	];
};

function App() {
	const [count, setCount] = useState(0);
	const [coords, setCoords] = useState({
		x: 0,
		y: 0,
		innerHeight: 0,
		innerWidth: 0
	});

	useWorker(workerPath, coords, setCount);

	const mouseMove = evt => {
		var x = evt.clientX,
			y = evt.clientY,
			innerHeight = window.innerHeight,
			innerWidth = window.innerWidth;

		setCoords({ x, y, innerHeight, innerWidth });
	};

	const { x, y } = coords;
	return (
		<div className="App" onMouseMove={mouseMove}>
			<h1>Hi {count}</h1>
			<p>
				x:{x}, y:{y}
			</p>
		</div>
	);
}

export default App;
