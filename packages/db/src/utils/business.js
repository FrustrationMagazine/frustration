// Determine subscription
function determineSubscription(amount) {
	if (amount >= 5 && amount < 9) {
		return {
			subscription_type: "mini",
			stickers: true,
			magazine: false,
			book: false
		};
	}
	if (amount >= 9 && amount < 15) {
		return {
			subscription_type: "medium",
			stickers: true,
			magazine: true,
			book: false
		};
	}
	if (amount >= 15) {
		return {
			subscription_type: "maxi",
			stickers: true,
			magazine: true,
			book: true
		};
	}
}

module.exports = {
	determineSubscription
};
