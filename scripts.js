///////////////////////////////////////////////////////////////////////////
// Core Logic
///////////////////////////////////////////////////////////////////////////

const defaultPixelCount = 16;
const defaultPixelColor = "#443f40";
const defaultErasedColor = "#bcb8b9";

const currentPixelColor = defaultPixelColor;
let currentPixelCount = defaultPixelCount;
let currentShader;
const eventHandlers = {};
let currentIncrement = -10;

let rainbowMode = false;
let drawMode = true;

const buttonSetResolution = document.querySelector(".set-resolution");
const buttonPickPenColor = document.querySelector(".pick-color");
const buttonRainbowMode = document.querySelector(".rainbow-mode");
const buttonLighten = document.querySelector(".lighten");
const buttonDarken = document.querySelector(".darken");
const buttonEraser = document.querySelector(".eraser");
const buttonClearGrid = document.querySelector(".clear-grid");
const buttonDraw = document.querySelector(".draw");

buttonSetResolution.addEventListener("change", setResolution);
buttonSetResolution.addEventListener("input", setResolutionSetting);
buttonPickPenColor.addEventListener("change", setColor);
buttonRainbowMode.addEventListener("click", setRainbowMode);
buttonClearGrid.addEventListener("click", clearGrid);
buttonDarken.addEventListener("click", setDarken);
buttonLighten.addEventListener("click", setLighten);
buttonEraser.addEventListener("click", setEraser);
buttonDraw.addEventListener("click", setDraw);

createGrid();
setDarken();

///////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Set functions -- various functions that allow user to set different options

async function setResolution() {
	const resolution = buttonSetResolution.value ?? currentPixelCount;
	const loader = document.querySelector(".loader");
	// loader.style.visiblity = "visible";
	// const resolutionSetting = document.querySelector(".current-resolution");

	buttonSetResolution.value = resolution;

	// let isValidSelection = false;

	// do {
	// 	resolution = +prompt(
	// 		"Please pick a resolution (in square pixels) between 1 and 100",
	// 	);
	//
	// 	const isInt = Number.isInteger(resolution);
	// 	isValidSelection = isInt && resolution > 0 && resolution <= 100;
	// 	if (!isValidSelection) alert("Please insert an integer between 1 and 100!");
	// } while (!isValidSelection);
	//

	// resolutionSetting.innerHTML = `Current: ${resolution} x ${resolution} Pixels`;
	// buttonSetResolution.oninput = function () {
	// 	resolutionSetting.innerHTML = `Current: ${this.value} x ${this.value} Pixels`;
	// };
	//
	// buttonSetResolution.onchange = function () {
	// 	resolutionSetting.innerHTML = `Current: ${this.value} x ${this.value} Pixels`;
	// };
	//
	// createGrid(buttonSetResolution.value ?? currentPixelCount);
	console.log("creating grid...");

	loader.style.visibility = "visible";
	// const creatGridWrapper = async () => {
	// 	const createdGrid = async () => {
	// 		createGrid(resolution);
	// 	};
	// 	await createdGrid();
	// 	loader.style.visiblity = "hidden";
	// };
	//
	// creatGridWrapper();
	await createGrid(resolution);
	currentPixelCount = resolution;
	await setDarken();
	loader.style.visibility = "hidden";
}

function setResolutionSetting() {
	const resolutionSetting = document.querySelector(".current-resolution");
	const loader = document.querySelector(".loader");
	loader.style.visiblity = "visible";
	const input = () => {
		resolutionSetting.innerHTML = `Current: ${this.value} x ${this.value} Pixels`;
	};
	if (!("input" in eventHandlers)) eventHandlers.input = [];

	if ("input" in eventHandlers && eventHandlers.input[buttonSetResolution])
		removeListeners("input", buttonSetResolution);
	buttonSetResolution.addEventListener("input", input);
	eventHandlers.input.push({ node: buttonSetResolution, handler: input });
}

function setColor() {
	const colorInput = document.querySelector(".pick-color").value;

	rainbowMode = false;
	addGridShader("mouseenter", shadePixel, currentIncrement, rainbowMode);
	enableButton(buttonRainbowMode);
	buttonPickPenColor.classList.add("disabled");
	enableDrawMode();
}

async function setDarken() {
	currentIncrement = -10;
	addGridShader("mouseenter", shadePixel, currentIncrement, rainbowMode);
	disableButton(buttonDarken);
	enableButton(buttonLighten);
	enableButton(buttonEraser);
	enableDrawMode();
}

function setLighten() {
	currentIncrement = 10;
	addGridShader("mouseenter", shadePixel, currentIncrement, rainbowMode);
	disableButton(buttonLighten);
	enableButton(buttonDarken);
	enableButton(buttonEraser);
	enableDrawMode();
}

function setEraser() {
	addGridShader("mouseenter", erasePixel);
	disableButton(buttonEraser);
	enableButton(buttonLighten);
	enableButton(buttonDarken);
	enableDrawMode();
}

function setRainbowMode() {
	rainbowMode = !rainbowMode;
	addGridShader("mouseenter", shadePixel, currentIncrement, rainbowMode);
	enableDrawMode();
	if (rainbowMode) {
		disableButton(buttonRainbowMode);
		buttonPickPenColor.classList.remove("disabled");
	} else {
		buttonPickPenColor.classList.add("disabled");
		enableButton(buttonRainbowMode);
	}
}

function setDraw() {
	drawMode = !drawMode;
	if (drawMode) {
		enableDrawMode();
	} else {
		disableDrawMode();
	}
}

function enableDrawMode() {
	addGridShader("mouseenter", currentShader);
	buttonDraw.classList.add("disabled");
}

function disableDrawMode() {
	const pixels = document.querySelectorAll(".pixel");
	pixels.forEach((pixel) => removeListeners("mouseenter", pixel));
	buttonDraw.classList.remove("disabled");
}

///////////////////////////////////////////////////////////////////////////
// Shader event handler - add and remove shaders to / from pixels

async function addGridShader(event, shader, ...args) {
	const pixels = document.querySelectorAll(".pixel");
	// if no shader supplied, user the current shader
	// if the shader supplied is the current shader, use the current shader
	// otherwise, wrap the supplied shader and args in an anonynous callback
	// to add as a listener
	currentShader =
		!shader || currentShader === shader
			? currentShader
			: (evt) => shader(evt.target, ...args);

	pixels.forEach((pixel) => {
		// remove the 'draw-pixel' class from all pixels whenever we change shaders
		// this way, shader knows the difference between pixels it drew and pixels
		// it didn't
		pixel.classList.remove("pixel-draw");

		// remove any existing shaders, we only want one active at a time
		if (event in eventHandlers) {
			removeListeners(event, pixel);
		} else {
			eventHandlers[event] = [];
		}

		// add the new shader to the dictionary
		eventHandlers[event].push({
			node: pixel,
			handler: currentShader,
		});

		// finally, add the shader to the pixel
		pixel.addEventListener(event, currentShader);
	});
	return currentShader;
}

function removeListeners(event, eventTarget) {
	// find all listeners for this pixel in the dictionary
	// related to the event, and remove those listeners
	eventHandlers[event]
		.filter(({ node }) => node === eventTarget)
		.forEach(({ node, handler }) => node.removeEventListener(event, handler));

	// remove those listeners from the dictionary as well
	eventHandlers[event] = eventHandlers[event].filter(
		({ node }) => node !== eventTarget,
	);
}

///////////////////////////////////////////////////////////////////////////
// Shader functions - color / darken / brighten / erase pixel colors

function shadePixel(pixel, increment, colorRandom = false) {
	// color is either the current color set by the user via the color input
	// or it's a color chosen at random if in Rainbow mode
	const color = colorRandom ? getRandomColor() : currentPixelColor;

	// we want to treat pixels drawn with the current shader as different
	// from the others, since we'll apply shading to them
	const isDrawnPixel = pixel.classList.contains("pixel-draw");
	// we also want to treat pixels that are the same color as the current
	// pixel color as different, as long as we're not in Rainbow mode
	const isCurrentPixelColor =
		pixel.style.backgroundColor === hexToRgb(currentPixelColor) && !colorRandom;

	// if the pixel has been previously drawn, or it's the same color as
	// the current input, change it's brightness according to the shader settings
	if (isDrawnPixel || isCurrentPixelColor) {
		pixel.classList.forEach((className) => {
			if (className.includes("brightness")) {
				const currentBrightness = +className.replace("brightness-", "");
				const updatedBrightness = changeBrightness(
					currentBrightness,
					increment,
				);

				pixel.classList.remove(className);
				pixel.classList.add(`brightness-${updatedBrightness}`);
				pixel.style.filter = `brightness(${updatedBrightness}%)`;
			}
		});
		// otherwise, treat the pixel as brand new, give it a fresh
		// coat of paint, so to speak
	} else {
		pixel.style.backgroundColor = color;
		pixel.classList.add("pixel-draw");
		pixel.classList.forEach((cls) => {
			if (cls.includes("brightness")) {
				pixel.classList.remove(cls);
			}
		});
		pixel.classList.add("brightness-100");
		pixel.style.filter = "brightness(100%)";
	}
}

function erasePixel(pixel) {
	pixel.className = "pixel brightness-100";
	pixel.style.backgroundColor = defaultErasedColor;
	pixel.style.filter = "brightness(100%)";
}

///////////////////////////////////////////////////////////////////////////
// Grid functions - create and clear grid

async function createGrid(pixelCount = defaultPixelCount) {
	// to start, we empty out the .grid div
	const grid = document.querySelector(".grid");
	grid.innerHTML = "";

	// const resolutionSetting = document.querySelector(".current-resolution");
	// resolutionSetting.textContent = `Current: ${pixelCount} Sq. Pixels`;

	// the outer loop creates the columns, and the inner loop
	// creates the rows , or 'pixels'
	for (let i = 0; i < pixelCount; i++) {
		const column = document.createElement("div");
		column.classList.add("column");
		for (let j = 0; j < pixelCount; j++) {
			const pixel = document.createElement("div");
			pixel.classList.add("pixel");
			column.appendChild(pixel);
		}
		// append a column of pixels to the grid once filled
		grid.appendChild(column);
	}
	// add special formatting to the corner pixels to preserve rounded corners
	// console.log(grid.firstElementChild.firstElementChild);
	grid.firstElementChild.firstElementChild.classList.add("pixel-top-left");
	grid.firstElementChild.lastElementChild.classList.add("pixel-bottom-left");
	grid.lastElementChild.firstElementChild.classList.add("pixel-top-right");
	grid.lastElementChild.lastElementChild.classList.add("pixel-bottom-right");
}

function clearGrid() {
	createGrid(currentPixelCount);
	addGridShader();
}

///////////////////////////////////////////////////////////////////////////
// Various helper functions

function changeBrightness(currentBrightness, increment) {
	// only return values between 0 and 100
	return Math.max(0, currentBrightness + increment);
}

function enableButton(button) {
	button.classList.remove("disabled");
	button.removeAttribute("disabled");
}

function disableButton(button) {
	button.classList.add("disabled");
	button.setAttribute("disabled", true);
}

function getRandomColor() {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return result ? `rgb(${r}, ${g}, ${b})` : null;
}



































