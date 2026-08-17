import type { Metadata } from "next";
import { shatteredSkies as p } from "@/content/games/shattered-skies";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import TransmissionCard from "@/components/project/TransmissionCard";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

export default function ShatteredSkiesPage() {
  return (
    <>
      <ProjectHero project={p} posterSrc="/images/shattered-skies/poster.png" />

      <Section>
        {/* Vision */}
        <Reveal>
          <div style={{ maxWidth: "42rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* The Planetary System */}
        {p.worlds && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="02 · World Design" title="A System of Five Worlds" />
              <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                A miniature solar system where the physics is the puzzle. Each planet has its own hazard, its own secret, and its own rule for getting through.
              </p>
              <div style={{ display: "grid", gap: "1rem" }}>
                {p.worlds.map((w, i) => (
                  <Reveal key={w.name} delay={i * 60}>
                    <div
                      className="panel"
                      style={{
                        border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
                        padding: "1.1rem 1.4rem",
                        display: "flex",
                        gap: "1.25rem",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontFamily: "var(--font-hero)", minWidth: "8rem", color: "var(--color-silver)" }}>
                        {w.name}
                      </h3>
                      <p style={{ margin: 0, color: "var(--color-mist)", flex: 1, minWidth: "16rem" }}>{w.descriptor}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Communication Design */}
        {p.communication && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="03 · The Core Mechanic" title="Communication Is the Game" />
              <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                Two enemies who cannot understand each other must cooperate to survive. Every channel of communication is deliberately broken, and clarity is the rarest resource in the game.
              </p>
              <div className="grid-4">
                {p.communication.map((c, i) => (
                  <TransmissionCard key={c.label} label={c.label} body={c.body} delay={i * 300} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Design Challenge */}
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

        {/* Three Endings */}
        {p.endings && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="05 · Consequence" title="Three Endings" />
              <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                What players say in their rare seconds of clear speech, and whether they choose truth or deception, decides which of these they reach.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                {p.endings.map((e, i) => (
                  <TransmissionCard key={e.name} label={e.name} body={e.outcome} delay={i * 400} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="06 · My Role" title="My Contribution" />
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
        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>
    </>
  );
}
