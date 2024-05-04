import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Sidenav } from "@/components/Sidenav";
import Link from "next/link";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Frustration Dahsboard",
  description: "Tableau de bord pour Frustration"
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const session = null;

  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <Header />
        {!session ? (
          <article className="flex flex-grow">
            <Sidenav />
            <main className="flex grow">{children}</main>
          </article>
        ) : (
          <Link href="/api/auth/signin">
            <span>Se connecter</span>
          </Link>
        )}
      </body>
    </html>
  );
}
