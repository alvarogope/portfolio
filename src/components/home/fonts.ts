import { Archivo, Space_Mono } from "next/font/google";

/* Fonts for the homepage only.

   These are deliberately NOT merged into the root layout's font set:
   the homepage has its own typographic identity, and the site-wide
   semantic slots (--font-display / --font-hero / --font-body) stay
   exactly as they are. Both .variable classes go on the homepage root
   wrapper, so the custom properties below only exist inside it. */

export const homeDisplay = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  style: ["normal", "italic"],
  variable: "--font-home-display",
  display: "swap",
});

export const homeMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-home-mono",
  display: "swap",
});
