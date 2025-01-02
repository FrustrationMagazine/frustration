// 🔩 Base
import React from "react";

// 🧱 Components
import { Toaster } from "@dashboard/components/toaster";
import { Badge } from "@/ui/components/badge";

// 🖼️ Assets
import "./globals.css";
import { bebasNeue, inter } from "@dashboard/fonts";

// 🔧 Libs
import Link from "next/link";

// 🧰 Config
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 💽 Data
export const metadata: Metadata = {
  title: "Frustration — Dashboard",
  description: "Tableau de bord pour Frustration",
};

// 🧱 Components
const Header = () => (
  <header className="flex h-fit w-full items-center justify-center bg-black py-2">
    <Link href="/dashboard">
      <h1
        className={`text-7xl uppercase text-frustration-yellow ${bebasNeue.className}`}
      >
        Dashboard
      </h1>
    </Link>
  </header>
);

const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
const DevelopmentBadge = isDevelopmentEnvironment ? (
  <Badge variant="secondary" className="absolute right-3 top-3 font-bold">
    🚧 Dev mode
  </Badge>
) : null;

/* ======================= */
/*         📄 UI           */
/* ======================= */

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className} flex h-screen flex-col bg-black bg-[url('/dashboard-background.svg')] bg-cover bg-fixed antialiased`}
      >
        {DevelopmentBadge}
        <Header />
        <main className="flex flex-grow overflow-auto bg-frustration-yellow">
          {children}
        </main>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
