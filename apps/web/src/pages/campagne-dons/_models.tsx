export enum FREQUENCY {
  ONETIME = "onetime",
  RECURRING = "recurring",
}

export enum GIFTS {
  MAGAZINE = "magazine",
  BOOK = "book",
}

export const DONATION_FREQUENCIES = [
  {
    value: FREQUENCY.ONETIME,
    text: "Don unique",
  },
  {
    value: FREQUENCY.RECURRING,
    text: "Don mensuel",
  },
];

export const DONATION_AMOUNTS = [
  {
    value: 1500,
    emoji: "😄",
    gifts: [GIFTS.MAGAZINE],
  },
  {
    value: 3000,
    emoji: "😃",
    gifts: [GIFTS.MAGAZINE],
  },
  {
    value: 5000,
    emoji: "😙",
    gifts: [GIFTS.MAGAZINE, GIFTS.BOOK],
  },
  {
    value: 10000,
    emoji: "😘",
    gifts: [GIFTS.MAGAZINE, GIFTS.BOOK],
  },
  {
    value: 20000,
    emoji: "🥰",
    gifts: [GIFTS.MAGAZINE, GIFTS.BOOK],
  },
  {
    value: 50000,
    emoji: "🤩",
    gifts: [GIFTS.MAGAZINE, GIFTS.BOOK],
  },
];
