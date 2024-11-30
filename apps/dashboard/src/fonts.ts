import { Bebas_Neue, Poppins, Inter, Bakbak_One } from "next/font/google";

/* Bebas Neue */
export const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] });

/* Bakbak One */
export const bakbakOne = Bakbak_One({ weight: "400", subsets: ["latin"] });

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
