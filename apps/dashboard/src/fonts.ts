import { Bebas_Neue, Poppins, Inter } from "next/font/google";

/* Bebas Neue */
export const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] });

/* Poppins */
export const poppins = Poppins({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

/* Inter */
export const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
