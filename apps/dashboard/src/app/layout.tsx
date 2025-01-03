// 🧱 Components
import { Toaster } from "@dashboard/components/Toaster";
import { Badge } from "@dashboard/components/Badge";

// 👨‍🎨 Global style
import "./globals.css";

// 🔧 Libs
import Link from "next/link";

// 🧰 Config
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 🖋️ Fonts
import { Bebas_Neue, Poppins, Inter } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const poppins = Poppins({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

// 💽 Data
export const metadata: Metadata = {
  title: "Frustration — Dashboard",
  description: "Tableau de bord pour Frustration",
};

// 🧱 Components
const DevelopmentBadge =
  process.env.NODE_ENV === "development" ? (
    <Badge
      variant="secondary"
      className="absolute right-3 top-3 text-xl font-bold"
    >
      🚧 Dev mode 🚧
    </Badge>
  ) : null;

const Header = () => (
  <header className="flex h-fit w-full items-center justify-center bg-black py-2">
    <Link href="/">
      <h1 className="font-bebas text-7xl uppercase text-frustration-yellow">
        Dashboard
      </h1>
    </Link>
    {DevelopmentBadge}
  </header>
);

/* ======================= */
/*         🚀 UI           */
/* ======================= */

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${bebasNeue.variable} ${poppins.variable}`}
    >
      <body className="font-inter flex h-screen flex-col bg-frustration-yellow bg-[url('/dashboard-background.svg')] bg-cover bg-fixed antialiased">
        <Header />
        <main className="flex flex-grow overflow-auto">{children}</main>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
