import type { Metadata, Viewport } from "next";
import { Literata, Source_Sans_3 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./folio.css";

const interfaceFont = Source_Sans_3({
  variable: "--font-interface",
  subsets: ["latin"],
});

const literaryFont = Literata({
  variable: "--font-literary",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost Writer",
  description: "Generate AI-powered combat quips and catchphrases for your D&D characters",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interfaceFont.variable} ${literaryFont.variable} antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster
          mobileOffset={{
            bottom: "calc(80px + env(safe-area-inset-bottom))",
            left: 16,
            right: 16,
            top: 16,
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
