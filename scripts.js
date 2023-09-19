///////////////////////////////////////////////////////////////////////////
// Core Logic
///////////////////////////////////////////////////////////////////////////

const defaultPixelCount = 16;

createGrid(defaultPixelCount);

addGridShader(darkenPixel);

const buttonSetResolution = document.querySelector(".set-resolution");
const buttonPickPenColor = document.querySelector(".pick-color");
const buttonLighten = document.querySelector(".lighten");
const buttonDarken = document.querySelector(".darken");
const buttonEraser = document.querySelector(".eraser");
const buttonClearGrid = document.querySelector(".clear-grid");

buttonSetResolution.addEventListener("click", setResolution);

///////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////

function setResolution() {
	let resolution = defaultPixelCount;
	let isValidSelection = false;

	do {
		resolution = +prompt(
			"Please pick a resolution (in square pixels) between 1 and 100",
		);

		const isInt = Number.isInteger(resolution);
		isValidSelection = isInt && resolution > 0 && resolution <= 100;
		if (!isValidSelection) alert("Please insert an integer between 1 and 100!");
	} while (!isValidSelection);

	createGrid(resolution ?? defaultPixelCount);
	addGridShader(darkenPixel);
}

function addGridShader(shader) {
	const pixels = document.querySelectorAll(".pixel");
	pixels.forEach((pixel) => {
		pixel.addEventListener("mouseenter", shader);
	});
}

function darkenPixel() {
	if (!this.classList.contains("pixel-draw")) {
		this.classList.add("pixel-draw");
		this.classList.add("brightness-100");
	} else {
		this.classList.forEach((className) => {
			if (className.includes("brightness")) {
				const currentBrightness = +className.replace("brightness-", "");
				if (currentBrightness === 0) return;
				const updatedBrightness = changeBrightness(currentBrightness, -10);

				this.classList.remove(className);
				this.classList.add(`brightness-${updatedBrightness}`);
				this.style.filter = `brightness(${updatedBrightness}%)`;
			}
		});
	}
}

function lightenPixel() {
	if (!this.classList.contains("pixel-draw")) {
		this.classList.add("pixel-draw");
		this.classList.add("brightness-100");
	} else {
		this.classList.forEach((className) => {
			if (className.includes("brightness")) {
				const currentBrightness = +className.replace("brightness-", "");
				if (currentBrightness === 0) return;
				const updatedBrightness = changeBrightness(currentBrightness, 10);

				this.classList.remove(className);
				this.classList.add(`brightness-${updatedBrightness}`);
				this.style.filter = `brightness(${updatedBrightness}%)`;
			}
		});
	}
}

function createGrid(pixelCount = defaultPixelCount) {
	const grid = document.querySelector(".grid");
	grid.innerHTML = "";

	const resolutionButton = document.querySelector(".set-resolution");
	resolutionButton.textContent = `Current: ${pixelCount} Sq. Pixels`;

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
}

function changeBrightness(currentBrightness, increment) {
	// only return values between 0 and 100
	return Math.min(200, Math.max(0, currentBrightness + increment));
}
