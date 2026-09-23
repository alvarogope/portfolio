import type { Metadata } from "next";
import { quantumToolkit as q } from "@/content/moon-knight-engineering-quantum";
import Section from "@/components/layout/Section";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CtaPanel from "@/components/project/CtaPanel";
import SectionHeading from "@/components/layout/SectionHeading";
import CodeBlock from "@/components/project/CodeBlock";
import Reveal from "@/components/layout/Reveal";
import ProjectNav from "@/components/layout/ProjectNav";
import { moonKnightNavItems } from "@/content/games";

export const metadata: Metadata = {
  title: "The Quantum Toolkit | Álvaro Gómez",
  description: q.tagline,
};

export default function QuantumToolkitPage() {
  return (
    <Section>

      <Breadcrumb
        items={[
          { label: "Moon-Knight", href: "/moon-knight" },
          { label: "Game engineering", href: "/moon-knight/engineering" },
          { label: "Quantum toolkit" },
        ]}
      />

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

      <Reveal>
        <div
          style={{
            marginTop: "5rem",
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
            alignItems: "start",
          }}
        >
          <CtaPanel
            kicker="Back one level"
            title="Programming Moon-Knight"
            body="The engineering side of the project. The limitations of Blueprints translated into C++ and the main code choices. The combat state machine, the data-driven layer and the quantum C++ engine limits."
            href="/moon-knight/engineering"
            linkLabel="Back to the engineering write-up"
            accent="silver"
          />
          <CtaPanel
            kicker="Back to the design project"
            title="Moon-Knight"
            body="The design project: video gameplays, the five quantum abilities, the type of enemies, the control scheme, the world of Kaelum and the beat chart the game was planned with."
            href="/moon-knight"
            linkLabel="Back to Moon-Knight"
            accent="silver"
          />
        </div>
      </Reveal>

      <Reveal>
        <ProjectNav
          items={moonKnightNavItems}
          currentSlug="moon-knight-quantum"
          kicker="Where to next"
        />
      </Reveal>
    </Section>
  );
}