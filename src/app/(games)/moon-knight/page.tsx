import type { Metadata } from "next";
import { moonKnight as p } from "@/content/games/moon-knight";
import Section from "@/components/layout/Section";
import AbilityCard from "@/components/project/AbilityCard";
import ProjectHero from "@/components/project/ProjectHero";
import SectionHeading from "@/components/layout/SectionHeading";
import Gallery from "@/components/project/Gallery";
import EngineeringNote from "@/components/project/EngineeringNote";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import Link from "next/link";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez Pérez`,
  description: p.systemsHook,
};

export default function MoonKnightPage() {
  return (
    <>
      {/* Hero — poster + title + facts, full width, at the top */}
      <ProjectHero project={p} posterSrc="/images/moon-knight/poster.png" />

      <Section>
        {/* Vision */}
        <Reveal>
          <div style={{ maxWidth: "42rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · My Role" title="My Contribution" />
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {p.contributions.map((c) => (
                <div key={c.label}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-lunar-gold)" }}>
                    {c.label}
                  </span>
                  <p style={{ marginTop: "0.4rem", maxWidth: "42rem" }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Abilities — the signature section */}
        {p.abilities && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="03 · Signature Systems" title="The Power of the Gods" />
              <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Five optional abilities, each built on a real quantum computing principle. One equipped at a time, high risk, high reward.
              </p>
              <div style={{ display: "grid", gap: "1rem" }}>
                {p.abilities.map((a, i) => (
                  <Reveal key={a.name} delay={i * 70}>
                    <AbilityCard ability={a} />
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        )}
        {/* Challenge Quote */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="04 · The Hard Part" title="Design Challenge" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
            </div>
          </Reveal>
        )}
        {/* Design to Engineering */}
        {/* Design to Engineering */}
        {p.engineeringNote && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="05 · From Design to Engineering" title="Building the Quantum" />
              <div style={{ marginTop: "1.5rem" }}>
                <EngineeringNote note={p.engineeringNote} />
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <Link
                  href="/moon-knight/engineering"
                  className="mono"
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--color-gold)",
                    borderBottom: "1px solid color-mix(in srgb, var(--color-gold) 50%, transparent)",
                    paddingBottom: "2px",
                  }}
                >
                  Read the engineering deep-dive: the C++ quantum toolkit →
                </Link>
              </div>
            </div>
          </Reveal>
        )}
        {/* Gallery */}
        {p.gallery && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="06 · From the Game" title="Gallery" />
              <div style={{ marginTop: "1.5rem" }}>
                <Gallery items={p.gallery} />
              </div>
            </div>
          </Reveal>
        )}
        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>
    </>
  );
}
