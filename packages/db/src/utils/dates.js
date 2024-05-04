// Convert date from UTC
function convertDateUTC(dateUTC) {
	return new Date(+dateUTC * 1000);
}

// Simplify date format YYYY-MM
function simplifyDate(date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

function setUTCTimezone(dateString, timezone = "Europe/Paris") {
	const targetTimezone = "Europe/Paris";
	const utcDate = new Date(dateString);
	const dateStringModified = utcDate.toLocaleString("fr", { timeZone: targetTimezone });
	return dateStringModified;
}

module.exports = {
	convertDateUTC,
	simplifyDate,
	setUTCTimezone
};
