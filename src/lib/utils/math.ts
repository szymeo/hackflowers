export function calculateScalePercentage(dto: {
	imageWidth: number;
	imageHeight: number;
	screenWidth: number;
	screenHeight: number;
}): { xScale: number; yScale: number } | null {
	if (dto.imageWidth <= 0 || dto.imageHeight <= 0) {
		return null;
	}

	console.log('calc', dto.screenHeight, dto.imageHeight);

	const xScale = (dto.screenWidth / dto.imageWidth) * 100;
	const yScale = (dto.screenHeight / dto.imageHeight) * 100;
	return { xScale, yScale };
}
