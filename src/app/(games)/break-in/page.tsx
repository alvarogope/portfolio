import type { Metadata } from "next";
import { breakIn as p } from "@/content/games/break-in";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import RoleWeb from "@/components/project/RoleWeb";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";
import Prism from "@/components/effects/Prism";
import RoleTerms from "@/components/project/RoleTerms";
import RoleGraph from "@/components/project/RoleGraph";
import LevelFlow from "@/components/project/LevelFlow";
import HeistLoop from "@/components/project/HeistLoop";
import BalanceNote from "@/components/project/BalanceNote";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

export default function BreakInPage() {
  return (
    <>
      {/* Hero */}
      <div className="bi-hero">
        <Prism
          className="bi-hero-prism"
          animationType="rotate"

          rotation={{ roll: Math.PI }}

          offset={{ y: 80 }}
          timeScale={0.35}
          hueShift={3.45}
          colorFrequency={1.0}
          saturation={1.5}
          glow={0.22}
          bloom={1}
          noise={0.03}
          scale={4.5}
          suspendWhenOffscreen
          opacity={1}
        />
        <div className="bi-hero-content">
          <ProjectHero project={p} posterSrc="/images/break-in/poster.png" />
        </div>
      </div>

      <Section>
        {/* Vision */}
        <Reveal>
          <div style={{ maxWidth: "42rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>
              <RoleTerms text={p.vision} />
            </p>
          </div>
        </Reveal>

        {/* The run itself — four phases on an eight-minute clock, and how it ends.
            Deliberately placed BEFORE the role graph and the floor plan: both of
            those assume the reader already knows what a run is trying to do. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · The Run" title="Eight minutes, four phases" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="One run is eight minutes long and reads in four phases: get in, take the vault, take the servers, and get out separately. Two of those phases happen at the same time. Below is the run drawn on its own clock — where the pressure sits, what each player is doing in each window, and the two ways it ends." />
            </p>
            <HeistLoop />
          </div>
        </Reveal>

        {/* Nobody wins alone — the dependency web */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="03 · Signature Systems" title="Nobody wins alone" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="Four cameras, four roles, and seven dependencies wired between them. Every line is something one player can only get from another: an ability switched on, a window opened, a trap taken off the board. Cut any one wire and the run ends." />
            </p>
            <RoleGraph />
          </div>
        </Reveal>

        {/* The Four Roles */}
        {p.roles && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="04 · The Cast" title="Four Roles, One Web" />
              <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                <RoleTerms text="No role can finish the heist alone. Read across the four and the dependency forms a loop: each player holds a key another player needs. Hover any role to see the whole system light up: remove one, and the heist falls apart." />
              </p>
              <RoleWeb roles={p.roles} />
            </div>
          </Reveal>
        )}

        {/* Level design — the route and the pacing */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="05 · Level Design" title="The Route" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="The phase clock above was the run in time. This is the same run in space: the bank is one level with two places the team has to split up and two places it has to be back together. Below: the route through it, the tension curve the five stages are tuned to, and what each stage is actually made of. The quiet stage in the middle is deliberate — it is what the vault is measured against." />
            </p>
            <LevelFlow />
          </div>
        </Reveal>

        {/* The balancing philosophy — the design note under all of it */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="06 · Balance" title="Tuned so nobody can carry" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="Four asymmetric roles only stay interesting if all four stay necessary. Three rules held that line: no role can reach past its quarter of the run, difficulty answers the team's performance instead of sitting still, and the payout is shared before it is individual." />
            </p>
            <BalanceNote />
          </div>
        </Reveal>

        {/* Design Challenge */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="07 · The Hard Part" title="Design Challenge" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote
                  challenge={p.designChallenge}
                  renderProse={(text) => <RoleTerms text={text} />}
                />
              </div>
            </div>
          </Reveal>
        )}

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="08 · My Role" title="My Contribution" />
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {p.contributions.map((c) => (
                <div key={c.label}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-silver)" }}>
                    {c.label}
                  </span>
                  <p style={{ marginTop: "0.4rem", maxWidth: "42rem" }}>
                    <RoleTerms text={c.description} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

      {/* Two layers */}
      <style>{`
        /* The route layout paints --color-void on a wrapper div, but the
           site header and footer are rendered OUTSIDE that wrapper by the
           root layout, so they keep the ROOT --color-void (#0B0E14) and
           the page ends on a visible seam against this route's #0A0B0D.
           This lifts the route's void onto body for as long as this page
           is mounted, which is what makes the whole page one colour. */
        body { background: #0A0B0D; }

        /* Role cross-references in prose. Colour only — no background, no
           box — so it reads as a linked term rather than a highlighter pen.
           #E5B54D on this page's #0A0B0D is 10.36:1, on .panel 9.35:1. The
           glow is a whisper of the same amber the role cards use on hover. */
        .role-term {
          color: var(--color-silver);
          font-weight: 500;
          text-shadow: 0 0 12px color-mix(in srgb, var(--color-silver) 22%, transparent);
        }
        .bi-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        /* No mask. Earlier versions clipped the prism into a thin band to
           protect text contrast, and that is precisely what stopped it
           reading as a 3D form -- all that survived was a flat glow. The
           reference is the whole shape, so the whole shape is drawn.
           See the contrast note on .bi-hero-content. */
        .bi-hero-prism {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        /* ------------------------------------------------------------
           CONTRAST, stated plainly rather than engineered around.

           --color-mist (#767B84) sits at 4.63:1 on bare --color-void
           against a 4.5 bar, so the background may reach 1.46x the page
           and no further. The reference prism is far brighter than that
           wherever it crosses the text column: measured worst case behind
           the copy is #8eb9e5, about 138x the page, which takes mist to
           roughly 2.1:1 and the h1 to 1.1:1. The hero does NOT meet AA
           over the prism.

           Every alternative was measured and each one costs the reference
           silhouette: capping the whole hero at 1.46x peaks 4/255 above
           the page and is invisible; masking it into a band leaves a flat
           glow; pushing it below the content (offsetY -420) drops the
           bright base out of frame and reads as two separate beams.

           The bottom band below keeps the base edge clear of the copy,
           which is the most that can be done without losing the form.
           The real fix is the palette: --color-mist is the tightest of
           the four game routes (Moon-Knight 5.24:1, Seeds 6.05, Shattered
           Skies 4.90, here 4.63). Lifting it toward #9AA0AA would buy the
           headroom this hero needs.
           ------------------------------------------------------------ */
        .bi-hero-content {
          position: relative;
          z-index: 1;
          /* Room under the copy so the bright base edge lands in clear
             space rather than through the fact block. */
        }
      `}</style>
    </>
  );
}
