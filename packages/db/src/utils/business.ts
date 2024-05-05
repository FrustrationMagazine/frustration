type SubscriptionType = "mini" | "medium" | "maxi";

type Subscription = {
  subscription_type: SubscriptionType;
  stickers: boolean;
  magazine: boolean;
  book: boolean;
};

enum SubscriptionAmountEnum {
  MINI = 5,
  MEDIUM = 9,
  MAXI = 15
}

function determineSubscription(amount: number): Subscription | null {
  if (amount >= SubscriptionAmountEnum.MINI && amount < SubscriptionAmountEnum.MEDIUM) {
    return {
      subscription_type: "mini",
      stickers: true,
      magazine: false,
      book: false
    };
  }
  if (amount >= SubscriptionAmountEnum.MEDIUM && amount < SubscriptionAmountEnum.MAXI) {
    return {
      subscription_type: "medium",
      stickers: true,
      magazine: true,
      book: false
    };
  }
  if (amount >= SubscriptionAmountEnum.MAXI) {
    return {
      subscription_type: "maxi",
      stickers: true,
      magazine: true,
      book: true
    };
  }

  return null;
}

module.exports = {
  determineSubscription
};
