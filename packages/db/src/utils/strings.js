// Normalize name
function normalizeName(str) {
	if (str) {
		str = str
			.trim()
			.split(/\s+/)
			.map((x) => {
				x = x.toLowerCase();
				x = x[0].toUpperCase() + x.slice(1);
				return x;
			})
			.join(" ");
	}

	return str;
}

module.exports = {
	normalizeName
};
