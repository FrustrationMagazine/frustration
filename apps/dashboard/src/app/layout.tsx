import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import { inter } from "../utils/fonts";
import { Toaster } from "@/ui/components/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Frustration — Dashboard",
  description: "Tableau de bord pour Frustration",
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang='fr'>
      <body className={`${inter.className} flex min-h-screen flex-col antialiased`}>
        <Header />
        <main className='flex flex-grow'>{children}</main>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
