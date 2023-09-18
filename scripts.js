const grid = document.querySelector(".grid");
const pixelCount = 16;

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
console.log(grid.firstElementChild.firstElementChild);
grid.firstElementChild.firstElementChild.classList.add("pixel-top-left");
grid.firstElementChild.lastElementChild.classList.add("pixel-bottom-left");
grid.lastElementChild.firstElementChild.classList.add("pixel-top-right");
grid.lastElementChild.lastElementChild.classList.add("pixel-bottom-right");

const pixels = document.querySelectorAll(".pixel");
pixels.forEach((pixel) => {
	pixel.addEventListener("mouseenter", (event) => {
		pixel.classList.add("pixel-draw");
	});
});
