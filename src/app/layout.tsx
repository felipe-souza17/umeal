import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ClientThemeProvider } from "@/components/client-theme-provider";

import {
  Geist_Mono,
  Geist_Mono as V0_Font_Geist_Mono,
  Geist,
} from "next/font/google";
import { CartProvider } from "@/context/cart-context";

const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark">
      <body
        className={`font-sans antialiased ${geist.className} ${geistMono.className}`}
      >
        <ClientThemeProvider>
          <CartProvider>{children}</CartProvider>
        </ClientThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.app",
};
