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
