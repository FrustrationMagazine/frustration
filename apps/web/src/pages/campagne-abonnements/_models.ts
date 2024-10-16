export const ALL_FORMULAS = ["mini", "maxi", "medium"] as const;
export type FormulaType = (typeof ALL_FORMULAS)[number];

export const SUBSCRIPTION_CARDS_DATA = [
  // 🤏 MINI
  {
    id: "mini",
    title: "MINI",
    subtitle: "Petit abonnement, grosse confiance",
    price: 5,
    numberOfGifts: 1,
    colorsRange: ["#09009f", "#00ff95"],
  },
  // 💪 MEDIUM
  {
    id: "medium",
    title: "MEDIUM",
    subtitle: "L'art de la synthèse",
    numberOfGifts: 2,
    price: 9,
    colorsRange: ["#c21500", "#ffc500"],
  },
  // 💥 MAXI
  {
    id: "maxi",
    title: "MAX",
    subtitle: "Un véritable mécène !",
    numberOfGifts: 3,
    price: 15,
    colorsRange: ["#C04848", "#480048"],
  },
];
