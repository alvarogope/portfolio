import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/layout/Reveal";
import Particles from "@/components/effects/Particles";
import TiltedCard from "@/components/effects/TiltedCard";
import EngineTag from "@/components/project/EngineTag";
import { acts, toChips, type Act } from "@/components/home/acts";

export const metadata: Metadata = {
  title: "Álvaro Gómez | Technical Designer",
  description:
    "I design game systems and build them myself. Unreal Engine 5, Unity, C++, Python.",
};

/* ==================================================================
   The homepage runs on the site's own token system — no standalone
   palette or type of its own, so it sits flush against the global
   header and footer.

   Colour discipline: the page itself is entirely neutral (void,
   moonlight, mist, silver). The ONLY colour on it comes from the four
   projects, each announcing itself with its own accent from the acts
   data. That makes the homepage a cool neutral frame around four
   worlds rather than a fifth competing identity.
   ================================================================== */

/* Type scale. Display sizes are fluid; everything else sits on a
   fixed 17px-based ramp so body copy never drifts between bands. */
const T = {
  // The hero is type-only now, so the headline carries it alone and
  // runs a step larger than it did beside artwork.
  hero: "clamp(2.75rem, 1.7rem + 5.4vw, 7.5rem)",
  displayLg: "clamp(2.5rem, 1.8rem + 3.5vw, 4.75rem)",
  display: "clamp(2rem, 1.6rem + 2vw, 3.125rem)",
  quote: "clamp(1.75rem, 1.3rem + 2.2vw, 2.75rem)",
  lead: 20,
  bodyLg: 19,
  body: 17,
  link: 15,
};

/* The site's display face tops out at 700, so that is the heavy end
   here — asking for 800 would only get a synthesised weight. */
const DISPLAY_WEIGHT = 700;

/* Mono label roles, separated by tracking and colour rather than by
   size. The spec roles sit deliberately larger than a caption: engine
   and disciplines are the hard facts a reader scans for, so they are
   set to be read, not squinted at. */
const LABEL = {
  eyebrow: { fontSize: 12, letterSpacing: "0.26em" },
  act: { fontSize: 11, letterSpacing: "0.3em" },
  spec: { fontSize: 13, letterSpacing: "0.08em" },
  chip: { fontSize: 12, letterSpacing: "0.07em" },
} as const;

const CONTACT = "alvarogomezperez.work@gmail.com";

/* Each band gets the same raked stripe, tinted with its own accent.

   The alphas are deliberately low: the wash lifts the ground, and
   --color-mist body copy sits on it at only ~5:1 to begin with, so a
   heavier tint pushes the spec text below AA. These values are set
   from measured contrast — the accent still identifies the band
   through its label, rule, link and seam, which carry it far more
   than the wash does. */
function bandBackground(accent: string): string {
  return [
    `linear-gradient(100deg, ${accent}0a 0%, transparent 55%)`,
    `repeating-linear-gradient(118deg, transparent 0 20px, ${accent}07 20px 21px)`,
    "var(--color-void)",
  ].join(", ");
}

const mono: React.CSSProperties = { fontFamily: "var(--font-mono)" };

/* globals.css already points h1/h2/h3 at --font-display, but it also
   pins weight and letter-spacing there, so the display face is named
   explicitly alongside the overrides below. */
const display: React.CSSProperties = { fontFamily: "var(--font-display)" };

export default function Home() {
  return (
    <div
      className="hp-root"
      style={{
        background: "var(--color-void)",
        color: "var(--color-moonlight)",
        fontFamily: "var(--font-body)",
        /* Horizontal only. This used to be `overflow: hidden`, which also
           clipped the bottom edge — and the closer's field is meant to
           carry on past it and finish behind the footer. `clip` rather than
           `hidden` on one axis because hidden on x would force y to become
           a scroll container; clip leaves y genuinely visible. */
        overflowX: "clip",
      }}
    >
      {/* ---------------------------------------------------------- */}
      {/* HERO — no nav here: the global <header> in layout.tsx is    */}
      {/* the site's only navigation.                                */}
      {/* ---------------------------------------------------------- */}
      <section
        className="hp-hero"
        style={{
          position: "relative",
          height: "min(100vh, 820px)",
          minHeight: 580,
          display: "flex",
          flexDirection: "column",
          // Type-led and nothing else, so the block sits on the optical
          // centre rather than being bottom-anchored under artwork that
          // is no longer there.
          justifyContent: "center",
          background: "var(--color-void)",
          overflow: "hidden",
        }}
      >
        {/* The field is tinted with the four project accents, taken from the
            acts data rather than repeated as literals — so the hero always
            carries the same four colours the bands below it do, and adding
            or recolouring an act updates the hero with it. This is the one
            place colour enters the page above the bands, and it enters as
            the projects' own. */}
        <Particles
          className="hp-hero-particles"
          particleColors={acts.map((act) => act.accent)}
          particleCount={400}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          particleHoverFactor={1}
        />
        <div aria-hidden className="hp-hero-contrast" />
        <div className="hp-hero-copy">
          {/* The eyebrow sits tight to the headline — they are one
              unit, so they are spaced as one. */}
          <p
            style={{
              ...mono,
              ...LABEL.eyebrow,
              color: "var(--color-silver)",
            }}
          >
            TECHNICAL GAME DESIGNER
          </p>

          <h1
            style={{
              ...display,
              margin: "0 auto",
              fontWeight: DISPLAY_WEIGHT,
              fontSize: T.hero,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              maxWidth: 1000,
              textWrap: "balance",
            }}
          >
            I design game systems and build them myself.
          </h1>

          <p
            className="hp-hero-sub"
            style={{
              maxWidth: 620,
              fontSize: T.lead,
              lineHeight: 1.55,
              color: "var(--color-mist)",
            }}
          >
            Four worlds, four systems, one hand on both the design doc and the
            compiler. Scroll to enter them.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* FOUR WORLDS — every word below comes from @/content/games   */}
      {/* ---------------------------------------------------------- */}
      {acts.map((act) => (
        <Reveal key={act.project.slug}>
          <ActBand act={act} />
        </Reveal>
      ))}

      {/* ---------------------------------------------------------- */}
      {/* CLOSER                                                      */}
      {/* ---------------------------------------------------------- */}
      <Reveal>
        <section
          className="hp-closer"
          style={{
            borderTop: "1px solid var(--color-nightfall)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            // The field is meant to run past this box and finish behind the
            // footer, so it is deliberately NOT clipped here. See
            // .hp-closer-particles for how far it reaches and why.
            overflow: "visible",
            // Left-aligned to the same 48px gutter as the bands. The hero
            // is centred and deliberately stands apart from that axis;
            // everything below it shares this one.
            alignItems: "flex-start",
            textAlign: "left",
          }}
        >
          {/* The closer gets its own field, so the page opens and closes on
              the same sky. It is a separate instance rather than one
              page-wide canvas on purpose: each one is clipped to its own
              section, which is what keeps the stars out of the bands
              between them and out of the global header and footer. */}
          <Particles
            className="hp-closer-particles"
            particleColors={acts.map((act) => act.accent)}
            particleCount={400}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover
            particleHoverFactor={1}
          />

          {/* Set in the body serif rather than the display sans: Spectral
              ships a drawn italic, Bricolage has none at all, so this is
              a true italic instead of a synthesised slant — and a serif
              italic against the sans headings is the pairing this quote
              wants. Weight 600 is Spectral's heaviest loaded cut; asking
              for 700 would only re-introduce a synthesised bold.
              Tracking is eased back to 0 because a serif italic does not
              want the tight negative tracking the sans display carries. */}
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: T.quote,
              lineHeight: 1.18,
              letterSpacing: "0",
              maxWidth: 860,
              textWrap: "balance",
            }}
          >
            The player is the main piece of the story.
          </p>

          <p
            style={{
              margin: "24px 0 0",
              maxWidth: 560,
              fontSize: T.body,
              lineHeight: 1.6,
              color: "var(--color-mist)",
              textWrap: "pretty",
            }}
          >
            I make people feel things through mechanics, not cutscenes — and I
            build the mechanics myself.
          </p>

          <a
            className="hp-cta"
            href={`mailto:${CONTACT}`}
            style={{
              ...mono,
              ...LABEL.eyebrow,
              marginTop: 48,
              color: "var(--color-silver)",
              border: "1px solid var(--color-silver)",
              padding: "16px 30px",
            }}
          >
            GET IN TOUCH
          </a>
        </section>
      </Reveal>

      {/* Scoped to the homepage. Everything here is either responsive
          layout, an interaction state, or motion — all of it guarded
          by prefers-reduced-motion where it moves. */}
      <style>{`
        /* ---- hero ---- */
        .hp-hero-particles {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        /* The veil that protects the hero copy's contrast from the
           particles behind it.

           ⚠ CURRENTLY DISABLED, paired with the diagnostic values in
           Particles.tsx. With it off, particles run at full strength over
           the type and the subline does NOT meet AA.

           It is off because the version below was wrong: an ellipse of
           820x500 is a 1640x1000 area, larger than the hero itself
           (1440x820 at most), so instead of thinning the field toward the
           centre it smothered nearly all of it — 90-96% void across most of
           the visible hero, which is why the particles could not be seen.

           Restoring this needs the ellipse sized against the HERO, not just
           against the text: something near "ellipse 520px 210px" covers the
           copy block while leaving real unveiled area at the top, bottom
           and sides. Re-measure the three text roles against it before
           trusting it — the numbers that matter are eyebrow (silver),
           headline (moonlight) and subline (--color-mist, the tight one, at
           only 5.2:1 on bare void before any particle). */
        .hp-hero-contrast {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: none;
        }
        /* Centred hero. The block is centred as a whole and each line is
           centred within it, so the inline max-widths still bound the
           measure — they just need auto side margins to sit on the axis. */
        .hp-hero-copy {
          position: relative;
          z-index: 2;
          padding: 0 48px;
          text-align: center;
        }
        /* Relationship-based rhythm: the eyebrow belongs to the
           headline, so it hugs it; the subline is a separate thought
           and gets real air. With nothing but type in the hero these
           intervals are what give it presence, so they run generous.
           The headline's tight line-height makes its box shorter than
           its glyphs, so a modest margin here collapses to no visible
           gap at all — these are sized for the optical result. */
        .hp-hero-copy > p:first-of-type { margin: 0 auto 40px; }
        .hp-hero-sub { margin: 40px auto 0; }

        /* ---- closer ---- */
        .hp-closer { padding: 128px 48px; }
        /* The closer's field does not stop at the closer. It carries on
           past the section's bottom edge and finishes at the very bottom of
           the page, behind the footer, so the sky the page opened on is
           still there under "© Álvaro Gómez / source on GitHub" instead of
           ending on a hard horizontal seam above it.

           --hp-footer-reach is exactly the footer's outer height, and the
           footer is the last element in the document — so the canvas lands
           flush with the end of the page and adds no scrollable overflow.
           The parts are the ones set inline on <footer> in layout.tsx:
             4rem      margin-top
             1px       border-top
             3rem      padding-top
             1.275rem  one line of 0.75rem text at the body's 1.7
             3rem      padding-bottom
           If that footer changes, this is the one number to update. */
        .hp-closer {
          --hp-footer-reach: calc(4rem + 1px + 3rem + 1.275rem + 3rem);
        }
        /* The footer is a wrapping flex row, so below ~490px its two spans
           stack and it grows by one line plus the 1rem gap; below ~340px
           the second span wraps internally and it grows by one line again.
           Measured at 181 / 218 / 238px against the three rules here. */
        @media (max-width: 520px) {
          .hp-closer { --hp-footer-reach: calc(4rem + 1px + 3rem + 1rem + 2.55rem + 3rem); }
        }
        @media (max-width: 340px) {
          .hp-closer { --hp-footer-reach: calc(4rem + 1px + 3rem + 1rem + 3.825rem + 3rem); }
        }
        .hp-closer-particles {
          position: absolute;
          inset: 0 0 calc(-1 * var(--hp-footer-reach)) 0;
          z-index: 0;
          pointer-events: none;
        }
        /* The canvas is positioned and the footer is not, so without this
           the field would paint over the footer's text rather than behind
           it. Scoped to the homepage: this style block only exists while
           the homepage is mounted. */
        body > footer {
          position: relative;
          z-index: 1;
        }
        /* Lifts the quote, the line under it and the CTA above the field.
           Written as "everything that is not the canvas" so the closer's
           content can change without this needing to be revisited. */
        .hp-closer > *:not(.hp-closer-particles) {
          position: relative;
          z-index: 1;
        }

        /* ---- bands ---- */
        /* The whole band is the link, so a click anywhere on the card
           routes. It holds exactly one interactive element — the inner
           "See the systems" affordance is a span, not a nested anchor. */
        .hp-band {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          min-height: var(--band-min-height);
          border-top: 1px solid var(--color-nightfall);
          position: relative;
          color: inherit;
          text-decoration: none;
        }
        /* The card lighting up on hover, in the band's own accent. */
        .hp-band::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--accent);
          opacity: 0;
          pointer-events: none;
          transition: opacity 320ms ease;
        }
        .hp-band:hover::after { opacity: 0.055; }

        /* This is the TiltedCard wrapper itself, so the order rules below
           still address a direct grid child. overflow:hidden keeps the
           poster inside its own frame as it rotates. */
        .hp-band-media {
          position: relative;
          height: 100%;
          min-height: 260px;
          overflow: hidden;
          will-change: transform;
        }
        .hp-band-copy {
          display: flex;
          flex-direction: column;
          padding: 64px 48px;
          position: relative;
          z-index: 1;
        }

        /* Copy on the named side, poster on the other. */
        .hp-band[data-side="left"]  .hp-band-copy  { order: 1; }
        .hp-band[data-side="left"]  .hp-band-media { order: 2; }
        .hp-band[data-side="right"] .hp-band-media { order: 1; }
        .hp-band[data-side="right"] .hp-band-copy  { order: 2; }

        /* Metrics live here rather than inline so the narrow breakpoint
           can retune them; an inline value would outrank the media query. */
        .hp-act-label {
          font-size: ${LABEL.act.fontSize}px;
          letter-spacing: ${LABEL.act.letterSpacing};
          white-space: nowrap;
        }
        .hp-act-rule  { flex: 1; height: 1px; }

        .hp-band-scrim { position: absolute; inset: 0; }
        .hp-band[data-side="left"]  .hp-band-scrim {
          background: linear-gradient(90deg, var(--color-void) 0%, transparent 48%);
        }
        .hp-band[data-side="right"] .hp-band-scrim {
          background: linear-gradient(270deg, var(--color-void) 0%, transparent 48%);
        }

        /* The seam where poster meets copy, tinted with the project's
           own accent. It gives each band a constructed edge instead of
           two halves simply abutting, and brightens on hover. */
        .hp-band-seam {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(var(--accent-0), var(--accent-59), var(--accent-0));
          opacity: 0.75;
          transition: opacity 320ms ease;
        }
        .hp-band:hover .hp-band-seam { opacity: 1; }
        .hp-band[data-side="left"]  .hp-band-seam { left: 0; }
        .hp-band[data-side="right"] .hp-band-seam { right: 0; }

        /* ---- interaction ---- */
        .hp-band-media img {
          transition: transform 900ms cubic-bezier(0.2, 0.6, 0.2, 1);
        }
        .hp-band:hover .hp-band-media img { transform: scale(1.035); }

        .hp-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 3px;
          border-bottom: 1px solid currentColor;
        }
        .hp-link .hp-arrow { transition: transform 260ms ease; }
        .hp-band:hover .hp-arrow { transform: translateX(4px); }

        .hp-cta { transition: background-color 220ms ease, color 220ms ease; }
        .hp-cta:hover {
          background: var(--color-silver);
          color: var(--color-void);
        }

        /* A visible keyboard state everywhere, in the site's accent.
           The card's ring is inset because the band is full-bleed and
           an outward offset would be clipped at the viewport edge. */
        .hp-root a:focus-visible {
          outline: 2px solid var(--color-silver);
          outline-offset: 5px;
          border-radius: 1px;
        }
        .hp-root a.hp-band:focus-visible { outline-offset: -6px; }

        /* ---- responsive ---- */
        @media (max-width: 900px) {
          .hp-hero-copy { padding: 0 24px; }
          .hp-hero-copy > p:first-of-type { margin: 0 auto 26px; }
          .hp-hero-sub { margin: 30px auto 0; }
          .hp-closer { padding: 88px 24px; }

          /* Bands stack: poster above, copy full-width beneath. */
          .hp-band {
            grid-template-columns: 1fr;
            min-height: 0;
          }
          /* Same specificity as the side rules above, and later in the
             sheet, so the poster always stacks on top regardless of side. */
          .hp-band[data-side] .hp-band-media { height: 240px; min-height: 240px; order: 1; will-change: auto; }
          .hp-band[data-side] .hp-band-copy  { order: 2; padding: 40px 24px 48px; max-width: none !important; }

          /* Copy is underneath now, so the poster fades downward and the
             seam becomes the horizontal edge between the two. */
          .hp-band[data-side] .hp-band-scrim {
            background: linear-gradient(180deg, transparent 45%, var(--color-void) 100%);
          }
          .hp-band[data-side] .hp-band-seam {
            top: auto; bottom: 0; left: 0; right: 0;
            width: auto; height: 1px;
            background: linear-gradient(90deg, var(--accent-0), var(--accent-59), var(--accent-0));
          }

          /* The long flagship label cannot hold one line at this width:
             let it wrap and drop the leader rule rather than clip. */
          .hp-act-label { white-space: normal; letter-spacing: 0.18em; line-height: 1.6; }
          .hp-act-rule  { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hp-band-media img,
          .hp-band::after,
          .hp-band-seam,
          .hp-arrow,
          .hp-cta { transition: none; }
          .hp-band:hover .hp-band-media img { transform: none; }
          .hp-band:hover .hp-arrow { transform: none; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ActBand({ act }: { act: Act }) {
  const { project, label, accent, poster, side, flagship } = act;
  const engine = project.facts.engine;

  /* Which side the copy sits on is driven by `data-side` and CSS
     `order`, not by inline grid placement: the mobile media query has
     to be able to override it to stack the poster on top, and an inline
     grid-column would win over any stylesheet rule.

     The accent is handed to CSS as custom properties so the hover wash
     and the seam can use it without a second inline style. */
  return (
    <Link
      className="hp-band"
      data-side={side}
      href={`/${project.slug}`}
      aria-label={`${project.title} — ${project.routingVerb}`}
      style={
        {
          "--accent": accent,
          "--accent-0": `${accent}00`,
          "--accent-59": `${accent}59`,
          "--band-min-height": `${flagship ? 640 : 420}px`,
          background: bandBackground(accent),
        } as React.CSSProperties
      }
    >
      {/* Only the poster tilts. Wrapping the whole band meant the copy
          column rotated too, and at this width even a few degrees swung
          the far edge of a text line far enough back to lose it. The
          poster is a flat image, so it can take the rotation without
          costing anything legibility-wise.

          scaleOnHover is 1: the poster already has its own hover zoom on
          the <img> below, and a second scale here would both double that
          up and push the tilted frame out of its grid cell. */}
      <TiltedCard
        className="hp-band-media"
        rotateAmplitude={6}
        scaleOnHover={1}
        showMobileWarning={false}
        showTooltip={false}
      >
        <Image
          src={poster}
          alt={project.posterAlt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          priority={flagship}
        />
        {/* Fades the poster's inner edge into the band so it meets the
            copy without a hard seam. Direction lives in CSS keyed off
            data-side, so the mobile layout can swap it to a vertical
            fade once the copy sits underneath instead of beside. */}
        <div aria-hidden className="hp-band-scrim" />
        <div aria-hidden className="hp-band-seam" />
      </TiltedCard>

      <div className="hp-band-copy" style={{ maxWidth: flagship ? 620 : 560 }}>
        {/* Act label and title are one unit; the rule that follows the
            label measures the copy column, the way a spec sheet sets a
            heading against its field. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: flagship ? 24 : 20,
          }}
        >
          {/* nowrap lives in CSS, not inline, so the narrow breakpoint
              can let this long label wrap instead of clipping. */}
          <span className="hp-act-label" style={{ ...mono, color: accent }}>
            {label}
          </span>
          <span
            aria-hidden
            className="hp-act-rule"
            style={{
              background: `linear-gradient(90deg, ${accent}4d, transparent)`,
            }}
          />
        </div>

        <h2
          style={{
            ...display,
            margin: 0,
            fontWeight: DISPLAY_WEIGHT,
            lineHeight: flagship ? 0.92 : 0.98,
            letterSpacing: flagship ? "-0.035em" : "-0.03em",
            fontSize: flagship ? T.displayLg : T.display,
            textWrap: "balance",
          }}
        >
          {project.title}
        </h2>

        <p
          style={{
            margin: `${flagship ? 24 : 20}px 0 0`,
            fontSize: flagship ? T.bodyLg : T.body,
            lineHeight: 1.6,
            color: "var(--color-mist)",
            textWrap: "pretty",
          }}
        >
          {project.systemsHook}
        </p>

        {/* Spec: the engine leads, in the project's accent, because it
            is the first hard fact a reader looks for; the disciplines
            follow in the neutral. Both come from the real content. */}
        {flagship ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 28,
            }}
          >
            <EngineTag engine={engine} accent={accent} />
            {toChips(project.disciplines).map((chip) => (
              <span
                key={chip}
                style={{
                  ...mono,
                  ...LABEL.chip,
                  border: "1px solid color-mix(in srgb, var(--color-mist) 32%, transparent)",
                  padding: "8px 12px",
                  color: "var(--color-mist)",
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : (
          <div
            style={{
              marginTop: 22,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <EngineTag engine={engine} accent={accent} />
            <p
              style={{
                ...mono,
                ...LABEL.spec,
                margin: 0,
                color: "var(--color-mist)",
                lineHeight: 1.75,
              }}
            >
              {project.disciplines}
            </p>
          </div>
        )}

        {/* The affordance stays visible, but it is a span: the card
            itself is the link, and an anchor inside an anchor is
            invalid and unreachable by keyboard. */}
        <span
          className="hp-link"
          style={{
            marginTop: flagship ? 40 : 32,
            alignSelf: "flex-start",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: T.link,
            letterSpacing: "-0.01em",
            color: accent,
          }}
        >
          {project.routingVerb}
          <span aria-hidden className="hp-arrow">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
