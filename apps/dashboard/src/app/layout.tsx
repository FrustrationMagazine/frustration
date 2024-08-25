// 🧱 Components
import Header from "./Header";
import { Toaster } from "@/ui/components/toaster";
import { Badge } from "@/ui/components/badge";

// 🖼️ Assets
import "./globals.css";
import { inter } from "../utils/fonts";

// 🧰 Config
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Frustration — Dashboard",
  description: "Tableau de bord pour Frustration",
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
  return (
    <html lang='fr'>
      <body className={`${inter.className} flex h-screen flex-col antialiased`}>
        {isDevelopmentEnvironment ? (
          <Badge variant='secondary' className='absolute right-3 top-3 font-bold'>
            🚧 Branche développement
          </Badge>
        ) : null}
        <Header />
        <main className='flex flex-grow overflow-auto'>{children}</main>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
