console.log("hi from worker.js");

let count = 0;
setInterval(() => {
	self.postMessage({ count });
	count++;
}, 500);

onmessage = function(e) {
	// console.log("Message received from main script", );
	const { x, y, innerHeight, innerWidth } = e.data.coords;
	// var workerResult = "Result: " + e.data[0] * e.data[1];
	// console.log("Posting message back to main script");

	const { angle, top, left, x: mouseX, y: mouseY, shadow } = calculateProps(
		x,
		y,
		innerHeight,
		innerWidth
	);

	postMessage({
		shadow: {
			bearing: angle,
			top: top,
			left: left,
			"mouse-x": mouseX,
			"mouse-y": mouseY,
			shadow: shadow
		}
	});
};

function getAngleFromOppositeAdjacent(top, left) {
	return (Math.atan(top / left) * 180) / Math.PI;
}

const calculateProps = (x, y, innerHeight, innerWidth) => {
	// distance from the center to the mouse cursor

	const center = {
		top: innerHeight / 2,
		left: innerWidth / 2
	};

	const actual = {
		left: x - center.left,
		top: y - center.top
	};

	// get the angle from the opposite/adjacent. Trigonometry!
	let angle = getAngleFromOppositeAdjacent(actual.top, actual.left);

	angle += actual.left >= 0 ? 90 : 270;

	// convert positive to negative, and vice versa.
	actual.top *= -1;
	actual.left *= -1;

	let color = `hsla(${angle.toFixed(0)}, 100%, 50%, 0.5)`;

	// get maximal value of either top or left so can do that many loops
	let maximumValue = Math.max(
		Math.abs(Math.floor(actual.top / 10)),
		Math.abs(Math.floor(actual.left / 10))
	);

	let shadow = "";
	while (maximumValue--) {
		// if (craziness) {
		color = `hsla(${angle.toFixed(0) * maximumValue}, 100%, 50%, 0.5)`;
		// }
		shadow += `${(Math.floor(actual.left / 10) * maximumValue) /
			10}px ${(Math.floor(actual.top / 10) * maximumValue) /
			10}px 0 ${color}, `;
	}

	const { top, left } = actual;

	return { shadow, x, y, top, left, angle };
};
