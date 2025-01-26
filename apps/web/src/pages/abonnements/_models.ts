export type Formula = "mini" | "maxi" | "medium";

interface Subscription {
  id: Formula;
  title: string;
  subtitle: string;
  price: number;
  numberOfGifts: number;
  colorsRange: string[];
  gradient: string;
}

export const SUBSCRIPTIONS: Record<string, Subscription> = {
  // 🤏 MINI
  mini: {
    id: "mini",
    title: "MINI",
    subtitle: "Petit soutien, grosse confiance",
    price: 5,
    numberOfGifts: 1,
    colorsRange: ["#09009f", "#00ff95"],
    gradient: "from-[#09009f] to-[#00ff95]",
  },
  // 💪 MEDIUM
  medium: {
    id: "medium",
    title: "MEDIUM",
    subtitle: "Le bon centrisme",
    numberOfGifts: 2,
    price: 9,
    colorsRange: ["#c21500", "#ffc500"],
    gradient: "from-[#c21500] to-[#ffc500]",
  },
  // 💥 MAXI
  maxi: {
    id: "maxi",
    title: "MAX",
    subtitle: "Un véritable mécène !",
    numberOfGifts: 3,
    price: 15,
    colorsRange: ["#C04848", "#480048"],
    gradient: "from-[#C04848] to-[#480048]",
  },
};
