import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

// Cormorant Garamond — the verse and meaning (serif, italic).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Inter — UI chrome (header, labels, buttons).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Noto Nastaliq Urdu — for AI-composed shayari rendered in Urdu script.
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sufi — A verse a day",
  description:
    "A verse a day from Rumi, Faiz Ahmad Faiz, Bulleh Shah, and Javed Akhtar. Reveal its meaning, or listen as it's recited aloud.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#b8862b" } }}>
      <html lang="en">
        <body
          className={`${cormorant.variable} ${inter.variable} ${nastaliq.variable} font-sans`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
