const grid = document.querySelector(".grid");
const pixelCount = 16;
drawPixelHSL = [0, 0, 72];

for (let i = 0; i < pixelCount; i++) {
	const column = document.createElement("div");
	column.classList.add("column");
	for (let j = 0; j < pixelCount; j++) {
		const pixel = document.createElement("div");
		pixel.classList.add("pixel");
		column.appendChild(pixel);
	}
	grid.appendChild(column);
}

// add special formatting to the corner pixels to preserve rounded corners
// console.log(grid.firstElementChild.firstElementChild);
grid.firstElementChild.firstElementChild.classList.add("pixel-top-left");
grid.firstElementChild.lastElementChild.classList.add("pixel-bottom-left");
grid.lastElementChild.firstElementChild.classList.add("pixel-top-right");
grid.lastElementChild.lastElementChild.classList.add("pixel-bottom-right");

const pixels = document.querySelectorAll(".pixel");
pixels.forEach((pixel) => {
	pixel.addEventListener("mouseenter", (event) => {
		const style = window.getComputedStyle(pixel).filter;
		if (!pixel.classList.contains("pixel-draw")) {
			pixel.classList.add("pixel-draw");
			pixel.classList.add("brightness-100");
		} else {
			pixel.classList.forEach((className) => {
				if (className.includes("brightness")) {
					const currentBrightness = +className.replace("brightness-", "");
					if (currentBrightness === 0) return;
					const updatedBrightness = changeBrightness(currentBrightness, -10);

					pixel.classList.remove(className);
					pixel.classList.add(`brightness-${updatedBrightness}`);
					pixel.style.filter = `brightness(${updatedBrightness}%)`;
				}
			});
		}
	});
});

///////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////

function getHslString(hsl) {}

function changeBrightness(currentBrightness, increment) {
	return Math.max(0, currentBrightness + increment);
}

function changeLuminosity(baseHsl, currentHsl, incrementPct) {
	const baseL = baseHsl[2];
	const currentL = currentHsl[2];
	const percentageL = incrementPct < 0 ? (100 - baseL) / 100 : baseL / 100;
	const updatedL = baseL + incrementPct * percentageL;

	return [baseHsl[0], baseHsl[1], baseL + incrementPct * percentageL];
}

// Function to darken colors:
// https://www.sitepoint.com/javascript-generate-lighter-darker-color/

function ColorLuminance(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, "");
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	let rgb = "#";
	let c;
	let i;

	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substring(i * 2, 2), 16);
		c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
		rgb += ("00" + c).substring(c.length);
	}

	return rgb;
}
