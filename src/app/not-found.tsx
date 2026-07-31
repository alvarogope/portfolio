import Link from "next/link";

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
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "var(--text-2xl)" }}>You died.</h1>
      <p style={{ color: "var(--color-mist)", maxWidth: "40ch" }}>
        This path leads nowhere. The moon offers no guidance here.
      </p>
      <Link
        href="/"
        className="mono"
        style={{
          color: "var(--color-lunar-gold)",
          border: "1px solid var(--color-lunar-gold)",
          padding: "0.75rem 1.5rem",
          fontSize: "var(--text-sm, 0.875rem)",
        }}
      >
        Respawn at Home →
      </Link>
    </main>
  );
}