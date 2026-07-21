import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { PaymentSupport } from "@/components/PaymentSupport";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

import { DEFAULT_THEME, buildCssVars } from "@/lib/theme";
import dbConnect from "@/lib/dbConnect";
import { SiteTheme } from "@/models";

export const metadata: Metadata = {
  title: "K Business Academy",
  description: "All-in-one educational and business-building platform.",
  icons: {
    icon: "/icon.svg?v=3",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let theme = DEFAULT_THEME;
  try {
    await dbConnect();
    const doc = await SiteTheme.findOne({ isDefault: true }).lean() as any;
    if (doc) {
      theme = { ...DEFAULT_THEME, ...doc };
    }
  } catch (error) {
    console.error("Failed to load theme:", error);
  }

  const cssVars = buildCssVars(theme);

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="scroll-smooth dark">
        <head>
          <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} antialiased`}
          suppressHydrationWarning
        >
          <SocketProvider>
            {children}
            <ConfettiProvider />
            <Toaster />
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
