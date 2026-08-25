import type { Metadata } from "next";
import { seedsOfTomorrow as p } from "@/content/games/seeds-of-tomorrow";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import SeedsAudio from "@/components/project/SeedsAudio";
import WeatherSystem from "@/components/project/WeatherSystem";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";
import SideRays from "@/components/effects/SideRays";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

export default function SeedsOfTomorrowPage() {
  return (
    <>
      {/* Hero. */}
      <div className="sot-hero">
        <SideRays
          className="sot-hero-rays"

          origin="top-left"

          rayColor1="#E0A845"
          rayColor2="#5F9B6B"

          blend={0.4}
          spread={1.6}

          tilt={-13}
          saturation={2.8}

          falloff={1.5}
          speed={2.7}

          intensity={2.5}
          opacity={0.28}
        />
        <div className="sot-hero-content">
          <ProjectHero project={p} posterSrc="/images/seeds-of-tomorrow/poster.png" />
        </div>
      </div>

      <Section>
        {/* Vision */}
        <Reveal>
          <div style={{ maxWidth: "42rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* The Music Score */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · Original Score" title="Plant a Sound" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              I composed and recorded eleven original tracks for the game. The main theme plays as you explore this page; the seeds below are moments from the score. Plant one to hear it.
            </p>
            <SeedsAudio />
          </div>
        </Reveal>

        {/* Weather System */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="03 · The Hard Part" title="A World That Heals" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
              {/* The claim above, drawn: the sky as the progress readout. */}
              <div style={{ marginTop: "2.5rem" }}>
                <WeatherSystem />
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
        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

      {/* Two layers: the rays and the hero on top. */}
      <style>{`
        .sot-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .sot-hero-rays {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .sot-hero-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}
