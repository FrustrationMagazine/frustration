import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./Header";
import { Sidenav } from "./Sidenav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frustration Dahsboard",
  description: "Tableau de bord pour Frustration"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex grow main-background">
          <Sidenav />
          {children}
        </main>
      </body>
    </html>
  );
}
