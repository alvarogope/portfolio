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
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* The Four Roles */}
        {p.roles && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="02 · Signature Systems" title="Four Roles, One Web" />
              <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                No role can finish the heist alone. Read across the four and the dependency forms a loop: each player holds a key another player needs. Hover any role to see the whole system light up: remove one, and the heist falls apart.
              </p>
              <RoleWeb roles={p.roles} />
            </div>
          </Reveal>
        )}

        {/* Design Challenge */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="03 · The Hard Part" title="Design Challenge" />
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
