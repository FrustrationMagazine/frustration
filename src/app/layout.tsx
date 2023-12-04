import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./Header";
import { Sidenav } from "./Sidenav";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

export const metadata: Metadata = {
  title: "Frustration Dahsboard",
  description: "Tableau de bord pour Frustration"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);

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
