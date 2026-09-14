import type { Metadata } from "next";
import { Cinzel, UnifrakturCook, Spectral, JetBrains_Mono, Rajdhani, Fraunces, Archivo, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ScrollToTop from "@/components/layout/ScrollToTop";
import PreserveScrollOnResize from "@/components/layout/PreserveScrollOnResize";

/* ============================================
   FONTS
   ============================================ */

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const unifraktur = UnifrakturCook({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-unifraktur",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const brand = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
});

/* ============================================
   DATA
   ============================================ */

export const metadata: Metadata = {
  title: "Álvaro Gómez Pérez | Technical Designer",
  description:
    "Technical game designer. I design game systems and build them myself — Unreal Engine 5, Unity, C++, Python.",
};

/* ============================================
   LAYOUT
   ============================================ */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
        className={`${cinzel.variable} ${unifraktur.variable} ${spectral.variable} ${jetbrains.variable} ${rajdhani.variable} ${fraunces.variable} ${archivo.variable} ${brand.variable}`}
    >
      <body>
        <ScrollToTop />
        {/* Reflow on resize moves the reader up to 28% of the page away from
            what they were reading. This puts them back. See the component. */}
        <PreserveScrollOnResize />

        {/* Placeholder nav */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-nightfall)",
            position: "sticky",
            top: 0,
            background: "color-mix(in srgb, var(--color-void) 85%, transparent)",
            backdropFilter: "blur(8px)",
            zIndex: 50,
          }}
        >
          <Link href="/" style={{ fontFamily: "var(--font-hero)", letterSpacing: "0.04em" }}>
            Álvaro Gómez
          </Link>
          <nav className="mono" style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem" }}>
            <Link href="/">Projects</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>

        {children}

        {/* Placeholder footer */}
        <footer
          className="mono"
          style={{
            padding: "3rem 1.5rem",
            marginTop: "4rem",
            borderTop: "1px solid var(--color-nightfall)",
            color: "var(--color-mist)",
            fontSize: "0.75rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
          }}
        >
          <span>© {new Date().getFullYear()} Álvaro Gómez Pérez</span>
          <span>Next.js + Tailwind · {" "}
            <a href="https://github.com/alvarogope/portfolio" style={{ borderBottom: "1px solid color-mix(in srgb, var(--color-silver) 50%, transparent)" }}>
              source on GitHub
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}