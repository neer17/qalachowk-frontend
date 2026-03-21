import type { Metadata } from "next";
import Script from "next/script";
import {
  Playfair_Display,
  Cormorant_Garamond,
  DM_Sans,
  Tiro_Devanagari_Hindi,
  Noto_Serif_Devanagari,
} from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import Navbar from "@/components/navbar/Navbar";
import CartProvider from "@/context/CartContext";
import { AuthProvider } from "@/context/SupabaseAuthContext";
import { validateEnv } from "@/utils/schema";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/theme";

// Validate all the env variables
validateEnv();

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const tiroDevanagariHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-tiro-devanagari",
  display: "swap",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-serif-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qala Chowk",
  description: "Qala Chowk - Premium Indian E-commerce",
  other: {
    "google-signin-client_id": process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  },
};

import Footer from "@/components/footer/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <meta
          name="google-signin-client_id"
          content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${cormorantGaramond.variable} ${dmSans.variable} ${tiroDevanagariHindi.variable} ${notoSerifDevanagari.variable}`}
      >
        <MantineProvider theme={theme}>
          <AuthProvider>
            <CartProvider>
              <Notifications />
              <div>
                {/* //TODO: Not using sliding banner as of now */}
                {/* <SlidingBanner /> */}
                <Navbar />
              </div>
              <main
                style={{
                  paddingTop: "80px",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                }}
              >
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
