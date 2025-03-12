import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";

// styles
import "../styles/globals.css";
import { satoshi } from "@/styles/fonts";

// components
import { Toaster } from "@/components/ui/sonner";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "MegaShop",
  description: "Ecommerce store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={satoshi.className}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
