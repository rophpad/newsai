import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "NewsAI",
  description:
    "AI-powered news reading with translations, summaries, Q&A, and audio narration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${newsreader.variable}`}>
        {children}
      </body>
    </html>
  );
}
