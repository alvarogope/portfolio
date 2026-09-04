import type { Metadata } from "next";
import Link from "next/link";
import { quantumToolkit as q } from "@/content/moon-knight-engineering-quantum";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import CodeBlock from "@/components/project/CodeBlock";
import Reveal from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "The Quantum Toolkit | Álvaro Gómez",
  description: q.tagline,
};

export default function QuantumToolkitPage() {
  return (
    <Section>
      {/* Breadcrumb. This page is the research branch of the engineering
          page, so the trail runs project → game engineering → here. */}
      <nav
        aria-label="Breadcrumb"
        className="mono"
        style={{ fontSize: "0.72rem", color: "var(--color-mist)", marginTop: "1rem" }}
      >
        <ol
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link href="/moon-knight" style={{ color: "var(--color-mist)" }}>
              Moon-Knight
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/moon-knight/engineering" style={{ color: "var(--color-mist)" }}>
              Game engineering
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" style={{ color: "var(--color-silver)" }}>
            Quantum toolkit
          </li>
        </ol>
      </nav>

      {/* Header */}
      <Reveal>
        <div style={{ marginTop: "1.5rem", maxWidth: "38rem" }}>
          <p className="mono" style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1rem" }}>
            ENGINEERING DEEP-DIVE · C++17 · QUANTUM++ / EIGEN
          </p>
          <h1 style={{ fontSize: "var(--text-hero)", margin: 0, lineHeight: 1.05, fontFamily: "var(--font-hero)" }}>
            {q.title}
          </h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--color-mist)", marginTop: "1rem" }}>
            {q.tagline}
          </p>
          <p style={{ marginTop: "1.5rem", lineHeight: 1.75 }}>{q.intro}</p>
        </div>
      </Reveal>

      {/* Architecture decision */}
      <Reveal>
        <div
          className="panel"
          style={{
            marginTop: "3.5rem",
            border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
            borderLeft: "3px solid var(--color-silver)",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            maxWidth: "38rem",
          }}
        >
          <span className="mono" style={{ fontSize: "0.71rem", color: "var(--color-silver)", letterSpacing: "0.12em" }}>
            Architecture
          </span>
          <h2 style={{ fontSize: "var(--text-xl)", margin: "0.75rem 0 1rem" }}>{q.architecture.title}</h2>
          <p style={{ margin: 0, lineHeight: 1.75 }}>{q.architecture.body}</p>
        </div>
      </Reveal>

      {/* Code sections */}
      {q.sections.map((s, i) => (
        <Reveal key={s.title}>
          <div style={{ marginTop: "4rem" }}>
            <SectionHeading kicker={`${String(i + 1).padStart(2, "0")} · ${s.kicker}`} title={s.title} />
            <p style={{ marginTop: "1rem", maxWidth: "38rem", lineHeight: 1.75 }}>{s.body}</p>
            <div style={{ marginTop: "1.5rem" }}>
              <CodeBlock filename={s.code.filename} language={s.code.language} code={s.code.body} />
            </div>
          </div>
        </Reveal>
      ))}

      {/* Honest status */}
      <Reveal>
        <div style={{ marginTop: "4rem" }}>
          <SectionHeading kicker="Status" title={q.status.title} />
          <p style={{ marginTop: "1rem", maxWidth: "38rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
            {q.status.body}
          </p>
          <div
            className="panel"
            style={{
              border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
              overflow: "hidden",
            }}
          >
            {q.status.rows.map((r, i) => (
              <div
                key={r.component + r.ability}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.5fr) minmax(0, 1.5fr)",
                  gap: "1rem",
                  padding: "0.9rem 1.25rem",
                  borderTop: i === 0 ? "none" : "1px solid color-mix(in srgb, var(--color-mist) 15%, transparent)",
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{r.component}</span>
                <span style={{ fontSize: "0.85rem", color: "var(--color-mist)" }}>{r.ability}</span>
                <span
                  className="mono"
                  style={{
                    fontSize: "0.68rem",
                    color: r.state.includes("Complete")
                      ? "var(--color-emerald)"
                      : r.state.includes("progress")
                      ? "var(--color-gold)"
                      : "var(--color-mist)",
                  }}
                >
                  {r.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* No repo link. The toolkit is not published yet, and the data carried
          a repoUrl of "#" that this block guarded against — so the link never
          rendered and the field was a dead value pretending to be one. To
          bring it back: add repoUrl to moonKnightQuantum and restore this
          block. Same treatment as the unmounted screenshot band on the game
          engineering page. */}
    </Section>
  );
}