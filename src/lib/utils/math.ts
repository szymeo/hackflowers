export function calculateScalePercentage(dto: {
	imageWidth: number;
	imageHeight: number;
	screenWidth: number;
	screenHeight: number;
}): { xScale: number; yScale: number } | null {
	if (dto.imageWidth <= 0 || dto.imageHeight <= 0) {
		return null;
	}

	const xScale = (dto.screenWidth / dto.imageWidth) * 90;
	const yScale = (dto.screenHeight / dto.imageHeight) * 90;
	return { xScale, yScale };
}
