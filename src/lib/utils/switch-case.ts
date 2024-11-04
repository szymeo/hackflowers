export const switchCase = (cases: Record<string, any>) => (key: string) => {
	if (key in cases) {
		return cases[key];
	}
	if (cases.default) {
		return cases.default;
	}
	return null;
};
