import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameOVerse",
  description:
    "GameOverse is a module in NepLoom that provides a gamified learning experience for Loomers. It includes interactive tools such as quizzes, flashcards, Blast, Match, and more. These tools are designed to make learning enjoyable, immersive, and engaging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
