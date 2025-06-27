import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, BackgroundAnimation, Footer } from "@/components/shared";
import DBInitializer from "@/components/shared/DBInitializer";
import { DatasetProvider } from "@/contexts/DatasetContext";
import { Toaster } from "react-hot-toast";

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
      <body className={`${inter.variable} antialiased`}>
        <DatasetProvider>
          <DBInitializer />
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            <Navbar />

            <BackgroundAnimation />
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 relative z-10">
              {children}

              <Footer />
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(15, 23, 42, 0.9)",
                color: "#f8fafc",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </DatasetProvider>
      </body>
    </html>
  );
}
