// 🧱 Components
import { Toaster } from "@components/Toaster";
import { Badge } from "@components/Badge";
import { cn } from "@libs/tailwind";

// 👨‍🎨 Global style
import "./globals.css";

// 🔧 Libs
import Link from "next/link";

// 🧰 Config
import type { Metadata } from "next";

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
      className="absolute right-3 top-3 text-lg font-bold"
    >
      🚧 Dev mode 🚧
    </Badge>
  ) : null;

const Header = () => (
  <header className="flex h-fit w-full items-center justify-center bg-black py-2">
    <Link href="/">
      <h1 className="text-yellow font-bebas text-7xl uppercase">Dashboard</h1>
    </Link>
    {DevelopmentBadge}
  </header>
);

const Main = ({ children }: { children: React.ReactNode }) => (
  <main className="flex flex-grow overflow-auto">{children}</main>
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
      <body
        className={cn(
          "flex h-screen flex-col font-inter antialiased",
          "bg-yellow bg-[url('/static/background.svg')] bg-cover bg-fixed",
        )}
      >
        <Header />
        <Main>{children}</Main>
        <Toaster />
      </body>
    </html>
  );
}
