///////////////////////////////////////////////////////////////////////////
// Core Logic
///////////////////////////////////////////////////////////////////////////

const defaultPixelCount = 16;
const defaultPixelColor = "#443f40";
let currentPixelColor = defaultPixelColor;
let currentPixelCount = defaultPixelCount;
let currentShader;
let rainbowMode = false;

const buttonSetResolution = document.querySelector(".set-resolution");
const buttonPickPenColor = document.querySelector(".pick-color");
const buttonRainbowMode = document.querySelector(".rainbow-mode");
const buttonLighten = document.querySelector(".lighten");
const buttonDarken = document.querySelector(".darken");
const buttonEraser = document.querySelector(".eraser");
const buttonClearGrid = document.querySelector(".clear-grid");

// addGridShader(shadePixel, -10);
createGrid();
setDarken();
buttonSetResolution.addEventListener("click", setResolution);
buttonPickPenColor.addEventListener("change", setColor);
buttonRainbowMode.addEventListener("click", setRainbowMode);
buttonClearGrid.addEventListener("click", clearGrid);
buttonDarken.addEventListener("click", setDarken);
buttonLighten.addEventListener("click", setLighten);

///////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////

function setResolution() {
	let resolution = currentPixelCount;
	let isValidSelection = false;

	do {
		resolution = +prompt(
			"Please pick a resolution (in square pixels) between 1 and 100",
		);

		const isInt = Number.isInteger(resolution);
		isValidSelection = isInt && resolution > 0 && resolution <= 100;
		if (!isValidSelection) alert("Please insert an integer between 1 and 100!");
	} while (!isValidSelection);

	createGrid(resolution ?? currentPixelCount);
	currentPixelCount = resolution;
	// addGridShader(shadePixel, -10);
	setDarken();
}

function setColor() {
	const colorInput = document.querySelector(".pick-color").value;
	currentPixelColor = colorInput;
}

function setDarken() {
	addGridShader(shadePixel, -10, rainbowMode);
	disableButton(buttonDarken);
	enableButton(buttonLighten);
}

function setLighten() {
	addGridShader(shadePixel, 10, rainbowMode);
	disableButton(buttonLighten);
	enableButton(buttonDarken);
}

function setEraser() {}

function setRainbowMode() {
	addGridShader(shadePixel, -10, !rainbowMode);
	rainbowMode = !rainbowMode;
	if (rainbowMode) {
		buttonRainbowMode.textContent = "Rainbow! 🌈";
		buttonRainbowMode.classList.add("red");
		buttonRainbowMode.classList.remove("white");
	} else {
		buttonRainbowMode.textContent = "Color Mode";
		buttonRainbowMode.classList.add("white");
		buttonRainbowMode.classList.remove("red");
	}
}

function enableButton(button) {
	button.classList.remove("disabled");
	button.removeAttribute("disabled");
}

function disableButton(button) {
	button.classList.add("disabled");
	button.setAttribute("disabled", true);
}

function clearGrid() {
	createGrid(currentPixelCount);
	addGridShader();
}

function addGridShader(shader, ...args) {
	const pixels = document.querySelectorAll(".pixel");
	currentShader = !shader
		? currentShader
		: (event) => shader(event.target, ...args);
	pixels.forEach((pixel) => {
		pixel.removeEventListener("mouseenter", pixel.fn);
		pixel.addEventListener("mouseenter", currentShader);
		pixel.fn = currentShader;
	});
	return currentShader;
}

function shadePixel(pixel, increment, colorRandom = false) {
	if (!pixel.classList.contains("pixel-draw")) {
		pixel.classList.add("pixel-draw");
		pixel.classList.add("brightness-100");
		pixel.style.backgroundColor = colorRandom
			? getRandomColor()
			: currentPixelColor;
	} else {
		pixel.classList.forEach((className) => {
			if (className.includes("brightness")) {
				const currentBrightness = +className.replace("brightness-", "");
				if (currentBrightness === 0) return;
				const updatedBrightness = changeBrightness(
					currentBrightness,
					increment,
				);

				pixel.classList.remove(className);
				pixel.classList.add(`brightness-${updatedBrightness}`);
				pixel.style.filter = `brightness(${updatedBrightness}%)`;
			}
		});
	}
}

function getRandomColor() {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
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
	return Math.max(0, currentBrightness + increment);
}
