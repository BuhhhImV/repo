import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#2D6A4F",
};

export const metadata: Metadata = {
  title: "Comn | Shared space. Zero drama.",
  description: "Smart inventory and maintenance management for shared living spaces.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-[var(--background)] text-[var(--foreground)] font-sans sm:flex-row flex-col">
        <Sidebar />
        <main className="flex-1 pb-16 sm:pb-0 overflow-y-auto">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
