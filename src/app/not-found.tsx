import Link from "next/link";
import LostKnight from "@/components/layout/LostKnight";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "1.5rem",
        padding: "4rem 1.5rem",
      }}
    >
      <LostKnight />

      <p
        className="mono"
        style={{
          margin: 0,
          fontSize: "0.72rem",
          color: "var(--color-silver)",
          letterSpacing: "0.18em",
        }}
      >
        404 - No Route Found
      </p>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          letterSpacing: "-0.01em",
          margin: 0,
          maxWidth: "18ch",
        }}
      >
        This path is broken.
      </h1>

      <p
        style={{
          margin: 0,
          maxWidth: "46ch",
          color: "var(--color-mist)",
          lineHeight: 1.7,
        }}
      >
        The road ends here. Whatever you were looking for has drifted out of the
        map or was never charted at all. Nothing left to stand on but the way
        back.
      </p>

      <Link
        href="/"
        className="mono"
        style={{
          marginTop: "0.5rem",
          fontSize: "0.8rem",
          color: "var(--color-gold)",
          border: "1px solid color-mix(in srgb, var(--color-gold) 72%, transparent)",
          padding: "0.85rem 1.75rem",
          borderRadius: "3px",
        }}
      >
        Return Home →
      </Link>
    </main>
  );
}
