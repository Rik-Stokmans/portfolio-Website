import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DotGrid from "@/components/DotGrid";
import Cursor from "@/components/Cursor";
import LiquidGlassFilter from "@/components/LiquidGlassFilter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Software developer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <LiquidGlassFilter />
        <DotGrid />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
        <Cursor />
      </body>
    </html>
  );
}
