import type { Metadata } from "next";
import { seedsOfTomorrow as p } from "@/content/games/seeds-of-tomorrow";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import SeedsAudio from "@/components/project/SeedsAudio";
import SeedsLevelDesign from "@/components/project/SeedsLevelDesign";
import WeatherSystem from "@/components/project/WeatherSystem";
import ProjectNav from "@/components/layout/ProjectNav";
import { contributionHomes } from "@/content/seeds-levels";
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
          <div id="score" style={{ marginTop: "5rem", scrollMarginTop: "6rem" }}>
            <SectionHeading kicker="02 · Original Score" title="Plant a Sound" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              I composed and recorded eleven original tracks for the game. The main theme plays as you explore this page; the seeds below are moments from the score. Plant one to hear it.
            </p>
            <SeedsAudio />
          </div>
        </Reveal>

        {/* Level design — the credited "Level Designer" half of the role, which
            had no section until now: the pacing loop lived inside the weather
            component as its third band. It owns the loop; the weather section
            below owns what the sky does. See docs/section-ownership-map.md G1. */}
        <Reveal>
          <div id="level-design" style={{ marginTop: "5rem", scrollMarginTop: "6rem" }}>
            <SectionHeading kicker="03 · Level Design" title="Fight, Then Mend" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              I designed the levels and the puzzles, and the rhythm they run on. Every place in the
              game is paced the same way: a burst of tension, then the quieter work of putting it
              back — and the sky over it answering at the end.
            </p>
            <SeedsLevelDesign />
          </div>
        </Reveal>

        {/* Weather System */}
        {p.designChallenge && (
          <Reveal>
            <div id="weather" style={{ marginTop: "5rem", scrollMarginTop: "6rem" }}>
              <SectionHeading kicker="04 · The Hard Part" title="A World That Heals" />
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

        {/* My role. Every one of the four credited contributions now has a
            section that shows it, so this routes to the owner rather than
            restating it a second time — keys, not copy. A contribution with no
            entry in `contributionHomes` still prints its description, so adding
            one can never silently lose it. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="05 · My Role" title="My Contribution" />
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1.5rem" }}>
              {p.facts.role} · {p.facts.team} · each one shown above, not just claimed
            </p>
            <ul className="sot-roles">
              {p.contributions.map((c) => {
                const home = contributionHomes[c.label];
                return (
                  <li key={c.label} className="sot-role">
                    <span className="mono sot-role-label">{c.label}</span>
                    {home ? (
                      <>
                        <p className="sot-role-shown">{home.shown}</p>
                        <a className="mono sot-role-link" href={home.href}>
                          {home.section} &uarr;
                        </a>
                      </>
                    ) : (
                      <p className="sot-role-shown">{c.description}</p>
                    )}
                  </li>
                );
              })}
            </ul>
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

        .sot-roles {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
          gap: 1px;
          background: color-mix(in srgb, var(--color-mist) 34%, transparent);
          border: 1px solid color-mix(in srgb, var(--color-mist) 34%, transparent);
          border-radius: 12px;
          overflow: hidden;
        }
        .sot-role {
          background: var(--color-void);
          padding: 1rem 1.1rem 1.1rem;
          display: grid;
          gap: 0.4rem;
          align-content: start;
          min-width: 0;
        }
        .sot-role-label {
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: var(--color-moonlight);
        }
        .sot-role-shown {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.55;
          color: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
        }
        .sot-role-link {
          font-size: 0.66rem;
          letter-spacing: 0.12em;
          color: color-mix(in srgb, var(--color-silver) 72%, var(--color-moonlight));
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>
    </>
  );
}
