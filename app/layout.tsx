import type { Metadata } from "next";
import { Playfair_Display, Inter, Space_Grotesk } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

/* ── Headings: Playfair Display (Italian restaurant editorial feel) ── */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

/* ── Body: Inter (clean, legible, modern) ── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* ── Prices / Buttons / UI labels: Space Grotesk ── */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cinco Pizza — Une passion, une pizza.",
  description:
    "Cinco Pizza — Pizzas artisanales, pâte maison, ingrédients frais. Livraison à domicile. Pizza · Paninis · Salades.",
  keywords: ["pizza", "cinco pizza", "livraison pizza", "pizza artisanale", "panini"],
  openGraph: {
    title: "Cinco Pizza — Une passion, une pizza.",
    description: "Pizzas artisanales avec pâte maison et ingrédients de qualité.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-[#F5EBDD] text-[#24221F]">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
