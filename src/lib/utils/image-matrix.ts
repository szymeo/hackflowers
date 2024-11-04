export function createImageMatrix(images: string[], x: number, y: number): string[][] {
	const totalCells = x * y;
	const imageCount = images.length;

	const repetitions = Math.floor(totalCells / imageCount);
	const remaining = totalCells % imageCount;

	const imagePool = Array(repetitions).fill(images).flat();
	imagePool.push(...images.slice(0, remaining));

	const matrix: string[][] = Array.from({ length: y }, () => Array(x).fill(''));

	function isValidPlacement(
		matrix: string[][],
		row: number,
		col: number,
		image: string
	): boolean {
		const directions = [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0]
		];

		for (const [dx, dy] of directions) {
			const newRow = row + dx;
			const newCol = col + dy;
			if (
				newRow >= 0 &&
				newRow < y &&
				newCol >= 0 &&
				newCol < x &&
				matrix[newRow][newCol] === image
			) {
				return false;
			}
		}
		return true;
	}

	const middleRow = Math.floor(y / 2);
	const middleCol = Math.floor(x / 2);
	matrix[middleRow][middleCol] = images[0];
	imagePool.splice(imagePool.indexOf(images[0]), 1);

	for (let i = 0; i < y; i++) {
		for (let j = 0; j < x; j++) {
			if (matrix[i][j] === '') {
				for (let k = 0; k < imagePool.length; k++) {
					if (isValidPlacement(matrix, i, j, imagePool[k])) {
						matrix[i][j] = imagePool.splice(k, 1)[0];
						break;
					}
				}
			}
		}
	}

	return matrix;
}
