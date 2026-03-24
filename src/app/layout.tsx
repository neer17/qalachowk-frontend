import type { Metadata } from "next";
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
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

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
};

import Footer from "@/components/footer/Footer";
import MainWrapper from "@/components/MainWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="en">
      <head></head>
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
              <MainWrapper>{children}</MainWrapper>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </MantineProvider>

        {/* Microsoft Clarity */}
        {clarityId && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
          </Script>
        )}

        {/* Meta Pixel */}
        {metaPixelId && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </body>
      {/* Google Analytics */}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
