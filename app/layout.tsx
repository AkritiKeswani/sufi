import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cinzel, Cormorant_Garamond, Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

// Cormorant Garamond — the verse and meaning (serif, italic).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Cinzel — headings and navigation: a classical, inscription-like serif that
// sits beside the italic Cormorant wordmark.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

// Inter — UI chrome (header, labels, buttons).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Noto Nastaliq Urdu — shayari and vocabulary in Urdu script.
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
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
          className={`${cormorant.variable} ${cinzel.variable} ${inter.variable} ${nastaliq.variable}`}
        >
          <div aria-hidden className="site-bg" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
