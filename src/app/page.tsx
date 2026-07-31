export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: "4rem" }}>
      <h1>Moon-Knight</h1>
      <p className="mono" style={{ color: "var(--color-lunar-gold)" }}>
        Token test — this should be gold and uppercase
      </p>
      <p style={{ color: "var(--color-mist)" }}>
        This should be muted blue-grey on a blue-black background.
      </p>
    </main>
  );
}