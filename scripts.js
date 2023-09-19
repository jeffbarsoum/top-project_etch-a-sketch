const defaultPixelCount = 16;

createGrid(defaultPixelCount);

addGridShader(shadePixel);

///////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////

function addGridShader(shader) {
	const pixels = document.querySelectorAll(".pixel");
	pixels.forEach((pixel) => {
		pixel.addEventListener("mouseenter", shader);
	});
}

function shadePixel(event) {
	// console.log(this);
	// console.log(event);
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

function createGrid(pixelCount) {
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
	return Math.min(100, Math.max(0, currentBrightness + increment));
}
