import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import { engineering as e } from "@/content/engineering/engineering";

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "Full-stack and quantum computing work",
};

const ACCENT = "#8b7fd6"; // quantum purple-cyan

export default function EngineeringPage() {
  return (
    <div style={{ ["--eng-accent" as string]: ACCENT }}>
      <Section>
        <Reveal>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--eng-accent)",
              margin: "0 0 1rem",
            }}
          >
            {e.intro.kicker}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 1.4rem + 3vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 1.5rem",
              maxWidth: "20ch",
            }}
          >
            {e.intro.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "var(--color-mist)",
              maxWidth: "60ch",
            }}
          >
            {e.intro.lead}
          </p>
        </Reveal>
      </Section>

      {/* Quantum-inspired game design cross-link */}
      <Section>
        <Reveal>
          <div
            className="panel"
            style={{
              borderLeft: "3px solid var(--eng-accent)",
              padding: "clamp(1.5rem, 4vw, 2.25rem)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                margin: "0 0 0.75rem",
              }}
            >
              {e.quantumNote.title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                lineHeight: 1.7,
                color: "var(--color-mist)",
                margin: "0 0 1rem",
                maxWidth: "60ch",
              }}
            >
              {e.quantumNote.body}
            </p>
            <Link
              href={e.quantumNote.href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "var(--eng-accent)",
                textDecoration: "none",
                borderBottom: "1px solid var(--eng-accent)",
                paddingBottom: "2px",
              }}
            >
              Click here for {e.quantumNote.linkLabel} →
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* Projects */}
      <Section>
        <SectionHeading kicker="Selected work" title="Full-stack quantum applications" />
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
          {e.projects.map((proj) => (
            <Reveal key={proj.name}>
              <article
                className="panel"
                style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "baseline",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.5rem, 1.2rem + 1.5vw, 2rem)",
                      margin: 0,
                    }}
                  >
                    {proj.name}
                  </h3>
                  <div style={{ display: "flex", gap: "1rem", marginLeft: "auto" }}>
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--eng-accent)",
                        textDecoration: "none",
                        border: "1px solid var(--eng-accent)",
                        padding: "6px 12px",
                        borderRadius: "3px",
                      }}
                    >
                      Live demo →
                    </a>
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--color-mist)",
                        textDecoration: "none",
                        border: "1px solid color-mix(in srgb, var(--color-mist) 40%, transparent)",
                        padding: "6px 12px",
                        borderRadius: "3px",
                      }}
                    >
                      GitHub
                    </a>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.05rem",
                    lineHeight: 1.7,
                    margin: "0 0 1.25rem",
                    maxWidth: "65ch",
                  }}
                >
                  {proj.tagline}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {proj.stack.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.06em",
                        color: "var(--color-silver)",
                        border: "1px solid color-mix(in srgb, var(--color-mist) 30%, transparent)",
                        padding: "4px 9px",
                        borderRadius: "3px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    color: "var(--color-mist)",
                    margin: "0 0 1.25rem",
                    maxWidth: "65ch",
                    paddingLeft: "1rem",
                    borderLeft: "2px solid color-mix(in srgb, var(--eng-accent) 50%, transparent)",
                  }}
                >
                  {proj.quantum}
                </p>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  {proj.points.map((pt, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--font-body)",
                        lineHeight: 1.65,
                        color: "var(--color-moonlight)",
                        maxWidth: "65ch",
                      }}
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Stack */}
      <Section>
        <Reveal>
          <SectionHeading kicker={e.stack.kicker} title="Tools I build with" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.5rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--color-mist)", margin: "0 0 0.6rem" }}>
                WEB
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {e.stack.web.map((t) => (
                  <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-silver)", border: "1px solid color-mix(in srgb, var(--color-mist) 30%, transparent)", padding: "5px 10px", borderRadius: "3px" }}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--eng-accent)", margin: "0 0 0.6rem" }}>
                QUANTUM
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {e.stack.quantum.map((t) => (
                  <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--eng-accent)", border: "1px solid color-mix(in srgb, var(--eng-accent) 40%, transparent)", padding: "5px 10px", borderRadius: "3px" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}