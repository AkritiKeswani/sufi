import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";

// Fonts ship with the app (app/fonts) rather than being fetched from Google at
// build time, so a flaky download can never fail a deploy.

// Cormorant Garamond — body text, and the italic shayari and wordmark.
const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

// Cinzel — headings and navigation.
const cinzel = localFont({
  src: [
    { path: "./fonts/cinzel-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cinzel-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cinzel-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-cinzel",
  display: "swap",
});

// Noto Nastaliq Urdu — shayari and vocabulary in Urdu script.
const nastaliq = localFont({
  src: [
    { path: "./fonts/noto-nastaliq-urdu-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/noto-nastaliq-urdu-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/noto-nastaliq-urdu-arabic-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/noto-nastaliq-urdu-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sufi — Learn the art of shayari",
  description:
    "Scroll through shayari and listen as each verse is recited, then learn the Urdu the poets write in, word by word.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#c9a464" } }}>
      <html lang="en">
        <body
          className={`${cormorant.variable} ${cinzel.variable} ${nastaliq.variable}`}
        >
          <div aria-hidden className="site-bg" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
