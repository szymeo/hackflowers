export function createImageMatrix<T>(items: T[], width: number, height: number): T[][] {
	const totalCells = width * height;
	const imageCount = items.length;

	const repetitions = Math.floor(totalCells / imageCount);
	const remaining = totalCells % imageCount;

	const imagePool = Array(repetitions).fill(items).flat();
	imagePool.push(...items.slice(0, remaining));

	const matrix: T[][] = Array.from({ length: height }, () =>
		Array(width).fill(null as unknown as T)
	);

	function isValidPlacement(matrix: T[][], row: number, col: number, image: T): boolean {
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
				newRow < height &&
				newCol >= 0 &&
				newCol < width &&
				matrix[newRow][newCol] === image
			) {
				return false;
			}
		}
		return true;
	}

	const middleRow = Math.floor(height / 2);
	const middleCol = Math.floor(width / 2);
	matrix[middleRow][middleCol] = items[0];
	imagePool.splice(imagePool.indexOf(items[0]), 1);

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (matrix[i][j] === null) {
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
