import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GenerationProvider } from "@/context/GenerationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Concept Card Generator",
  description: "Generate beautiful concept cards with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GenerationProvider>
          {children}
        </GenerationProvider>
      </body>
    </html>
  );
}
