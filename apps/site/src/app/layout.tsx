import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { DiscordInviteFAB } from "@/components/DiscordInviteFAB";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const saiyanSans = localFont({
  src: "../../public/fonts/SaiyanSans.ttf",
  variable: "--font-saiyan",
  display: "swap",
});

const dbScouter = localFont({
  src: "../../public/fonts/DBSScouter.ttf",
  variable: "--font-scouter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DBFR - Dragon Ball FR",
  description: "Le Hub Communautaire Dragon Ball Z Numéro 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${saiyanSans.variable} ${dbScouter.variable} antialiased min-h-screen relative flex flex-col font-sans bg-dbz-bg text-white`}>
        {/* Pixel pattern overlay */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjM2IzYjNiIi8+PC9zdmc+')] mix-blend-overlay"></div>
        <main className="relative z-10 flex-1 w-full flex flex-col">
          {children}
        </main>
        <DiscordInviteFAB />
      </body>
    </html>
  );
}
