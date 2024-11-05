type Primitive = string | number | symbol;

export const switchCase = (cases: Record<Primitive, any>) => (key: Primitive) => {
	if (key in cases) {
		return cases[key];
	}
	if (cases.default) {
		return cases.default;
	}
	return null;
};
