import type { Metadata } from "next";
import { seedsOfTomorrow as p } from "@/content/games/seeds-of-tomorrow";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

export default function SeedsOfTomorrowPage() {
  return (
    <>
      <ProjectHero project={p} posterSrc="/images/seeds-of-tomorrow/poster.png" />

      <Section>
        {/* Vision */}
        <Reveal>
          <div style={{ maxWidth: "42rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* The Score — signature section */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · Original Score" title="Eleven Tracks" />
            <div
              className="panel"
              style={{
                marginTop: "1.5rem",
                border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
                borderLeft: "3px solid var(--color-gold)",
                padding: "clamp(1.5rem, 4vw, 2.5rem)",
                maxWidth: "48rem",
              }}
            >
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                I composed and recorded the full soundtrack: eleven original tracks scoring the journey
                from a poisoned world to a restored one. The music carries the emotional arc the fiction
                promises, from the weight of a dying Earth to the quiet hope of life returning.
              </p>
              <p className="mono" style={{ marginTop: "1.25rem", fontSize: "0.7rem", color: "var(--color-mist)" }}>
                Playable excerpts coming to this page.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Design Challenge — the weather system */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="03 · The Hard Part" title="A World That Heals" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
            </div>
          </Reveal>
        )}

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="04 · My Role" title="My Contribution" />
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {p.contributions.map((c) => (
                <div key={c.label}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-silver)" }}>
                    {c.label}
                  </span>
                  <p style={{ marginTop: "0.4rem", maxWidth: "42rem" }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}