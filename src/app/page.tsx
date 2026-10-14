import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/layout/Reveal";
import Particles from "@/components/effects/Particles";
import EngineTag from "@/components/project/EngineTag";
import HeroBackdrop from "@/components/home/HeroBackdrop";
import { heroSlides } from "@/components/home/hero-slides";
import { acts, toChips, type Act } from "@/components/home/acts";

export const metadata: Metadata = {
  title: "Álvaro Gómez | Video Game Portfolio",
  description:
    "I design game systems and build them myself. Unreal Engine 5, Unity, C++, Python.",
};

const T = {
  hero: "clamp(2.75rem, 1.7rem + 5.4vw, 7.5rem)",
  displayLg: "clamp(2.5rem, 1.8rem + 3.5vw, 4.75rem)",
  bandTitle: "clamp(2.25rem, 1.6rem + 2.8vw, 4rem)",
  quote: "clamp(1.75rem, 1.3rem + 2.2vw, 2.75rem)",
  lead: 20,
  bodyLg: 19,
  body: 17,
  link: 15,
};

const DISPLAY_WEIGHT = 700;

const LABEL = {
  eyebrow: { fontSize: 12, letterSpacing: "0.26em" },
  act: { fontSize: 11, letterSpacing: "0.3em" },
  chip: { fontSize: 12, letterSpacing: "0.07em" },
} as const;

const CONTACT = "alvarogomezperez.work@gmail.com";

function bandBackground(accent: string): string {
  return [
    `linear-gradient(100deg, ${accent}0a 0%, transparent 55%)`,
    `repeating-linear-gradient(118deg, transparent 0 20px, ${accent}07 20px 21px)`,
    "var(--color-void)",
  ].join(", ");
}

const mono: React.CSSProperties = { fontFamily: "var(--font-mono)" };

const display: React.CSSProperties = { fontFamily: "var(--font-display)" };

export default function Home() {
  return (
    <div
      className="hp-root"
      style={{
        background: "var(--color-void)",
        color: "var(--color-moonlight)",
        fontFamily: "var(--font-body)",
        overflowX: "clip",
      }}
    >
      {/* Hero */}
      <section
        className="hp-hero"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-void)",
          overflow: "hidden",
        }}
      >
        <HeroBackdrop slides={heroSlides} />
        <div className="hp-hero-copy">
          <p
            style={{
              ...mono,
              ...LABEL.eyebrow,
              color: "var(--color-silver)",
            }}
          >
            I DESIGN & BUILD GAME SYSTEMS
          </p>

          <h1
            style={{
              ...display,
              margin: 0,
              fontWeight: DISPLAY_WEIGHT,
              fontSize: T.hero,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              maxWidth: 1000,
              textWrap: "balance",
            }}
          >
            Álvaro Gómez
          </h1>

          <p
            className="hp-hero-sub"
            style={{
              maxWidth: 620,
              fontSize: T.lead,
              lineHeight: 1.55,
            }}
          >
            I am a technical game designer specialised in systems and level design, world-building, audio and programming.
          </p>
        </div>
      </section>

      {/* Four Project Grid */}
      {acts.map((act) => (
        <Reveal key={act.project.slug}>
          <ActBand act={act} />
        </Reveal>
      ))}

      {/* Page Closer */}
      <Reveal>
        <section
          className="hp-closer"
          style={{
            borderTop: "1px solid var(--color-nightfall)",
            display: "flex",
            flexDirection: "column",
            position: "relative",

            overflow: "visible",

            alignItems: "flex-start",
            textAlign: "left",
          }}
        >
          <Particles
            className="hp-closer-particles"
            particleColors={acts.map((act) => act.accent)}
            particleCount={900}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover
            particleHoverFactor={1}
          />

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
             For me, the player is the main piece of the story.
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
            The main focus of my work is to make people feel through the game systems and mechanics 
            and I build them myself.
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

      {/* Responsive and Interactions */}
      <style>{`
        /* ---- hero ---- */
        /* One screen below the sticky header, bounded so a very tall
           window does not turn it into a wall. The flex alignment lives
           here rather than inline so the narrow breakpoint can move the
           copy to the bottom. */
        .hp-hero {
          height: calc(100svh - var(--header-h));
          min-height: 560px;
          max-height: 980px;
          justify-content: center;
        }
        /* Left-aligned over the image, on a scrim that HeroBackdrop
           anchors to the left edge in pixels. The shadow is not the
           contrast — the scrim is — it only softens single bright pixels
           (stars, engine glow) that would otherwise sit right on a stroke. */
        .hp-hero-copy {
          position: relative;
          z-index: 2;
          padding: 0 clamp(24px, 6vw, 112px);
          max-width: 1100px;
          text-align: left;
          text-shadow: 0 1px 28px color-mix(in srgb, var(--color-void) 70%, transparent);
        }
        /* Relationship-based rhythm: the eyebrow belongs to the
           headline, so it hugs it; the subline is a separate thought
           and gets real air. The headline's tight line-height makes its
           box shorter than its glyphs, so a modest margin here collapses
           to no visible gap at all — these are sized for the optical
           result. */
        .hp-hero-copy > p:first-of-type { margin: 0 0 32px; }
        /* Lifted off --color-mist: mist is 5.2:1 on bare void, and over a
           photograph the ground is never bare void. */
        .hp-hero-sub {
          margin: 36px 0 0;
          color: var(--color-silver);
        }

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
        /* Each project is one full-bleed still with its copy laid over the
           foot of the frame, in the hero's language: a void scrim anchored
           in pixels from the copy's side, a floor, and the same saturation
           pull toward the cool palette. The whole band is the link, so a
           click anywhere on it routes. It holds exactly one interactive
           element — the inner affordance is a span, not a nested anchor. */
        .hp-band {
          --band-h: clamp(540px, 80svh, 820px);
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: flex-end;
          min-height: var(--band-h);
          border-top: 1px solid var(--color-nightfall);
          overflow: hidden;
          color: inherit;
          text-decoration: none;
        }
        .hp-band[data-flagship] { --band-h: clamp(620px, 92svh, 960px); }
        .hp-band[data-side="right"] { justify-content: flex-end; }

        .hp-band-media {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .hp-band-media img {
          filter: saturate(0.82) brightness(0.94);
          transition:
            transform 1400ms cubic-bezier(0.2, 0.6, 0.2, 1),
            filter 600ms ease;
        }
        .hp-band-shade,
        .hp-band-scrim { position: absolute; inset: 0; }

        /* Side + floor + lid. The side stops are the hero's own, so the
           copy column is shaded exactly as the hero's is; the floor then
           deepens it toward the foot of the frame. The lid hands each frame
           off from the band above it, as the hero's floor does. */
        .hp-band[data-side="left"] .hp-band-scrim {
          background:
            linear-gradient(90deg,
              color-mix(in srgb, var(--color-void) 92%, transparent) 0px,
              color-mix(in srgb, var(--color-void) 84%, transparent) 540px,
              color-mix(in srgb, var(--color-void) 50%, transparent) 860px,
              color-mix(in srgb, var(--color-void) 12%, transparent) 1240px,
              transparent 100%),
            linear-gradient(0deg,
              var(--color-void) 0%,
              color-mix(in srgb, var(--color-void) 72%, transparent) 24%,
              transparent 66%),
            linear-gradient(180deg, var(--color-void) 0%, transparent 16%);
        }
        .hp-band[data-side="right"] .hp-band-scrim {
          background:
            linear-gradient(270deg,
              color-mix(in srgb, var(--color-void) 92%, transparent) 0px,
              color-mix(in srgb, var(--color-void) 84%, transparent) 540px,
              color-mix(in srgb, var(--color-void) 50%, transparent) 860px,
              color-mix(in srgb, var(--color-void) 12%, transparent) 1240px,
              transparent 100%),
            linear-gradient(0deg,
              var(--color-void) 0%,
              color-mix(in srgb, var(--color-void) 72%, transparent) 24%,
              transparent 66%),
            linear-gradient(180deg, var(--color-void) 0%, transparent 16%);
        }

        /* The band lighting up on hover, in its own accent. */
        .hp-band::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background: var(--accent);
          opacity: 0;
          pointer-events: none;
          transition: opacity 320ms ease;
        }

        /* The top edge, tinted with the project's accent and strongest on
           the copy's side. It gives each band a constructed edge against
           the one above instead of two images simply abutting. */
        .hp-band-seam {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          height: 1px;
          opacity: 0.75;
          transition: opacity 320ms ease;
        }
        .hp-band[data-side="left"]  .hp-band-seam {
          background: linear-gradient(90deg, var(--accent-59), var(--accent-0) 70%);
        }
        .hp-band[data-side="right"] .hp-band-seam {
          background: linear-gradient(270deg, var(--accent-59), var(--accent-0) 70%);
        }

        /* Same side padding as the hero's copy, so the bands' text and the
           name above them hang off one vertical line. The shadow is not
           the contrast — the scrim is — it only softens single bright
           pixels under a stroke, as in the hero. */
        .hp-band-copy {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          width: min(100%, 780px);
          padding: 120px clamp(24px, 6vw, 112px) clamp(56px, 9svh, 104px);
          text-shadow: 0 1px 24px color-mix(in srgb, var(--color-void) 70%, transparent);
        }

        /* Metrics live here rather than inline so the narrow breakpoint
           can retune them; an inline value would outrank the media query. */
        .hp-act-label {
          font-size: ${LABEL.act.fontSize}px;
          letter-spacing: ${LABEL.act.letterSpacing};
          white-space: nowrap;
        }
        .hp-act-rule  { flex: 1; max-width: 240px; height: 1px; }

        /* ---- interaction ---- */
        /* Keyboard focus gets the same lift as the pointer. The zoom is
           pointer-only so a tap on a phone does not leave it stuck. */
        .hp-band:is(:hover, :focus-visible)::after { opacity: 0.05; }
        .hp-band:is(:hover, :focus-visible) .hp-band-seam { opacity: 1; }
        .hp-band:is(:hover, :focus-visible) .hp-band-media img {
          filter: saturate(0.9) brightness(1.04);
        }
        @media (hover: hover) {
          .hp-band:hover .hp-band-media img { transform: scale(1.04); }
        }

        .hp-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 3px;
          border-bottom: 1px solid currentColor;
        }
        .hp-link .hp-arrow { transition: transform 260ms ease; }
        .hp-band:is(:hover, :focus-visible) .hp-arrow { transform: translateX(4px); }

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

        /* ---- av note ---- */
        /* Sits between the last band and the closer, so it inherits the
           same 1px nightfall seam the bands use to divide from each other
           — it reads as one more rule in that stack rather than a new
           region. Vertical padding is deliberately about half the closer's:
           enough air to be its own thought, too little to be a section. */
        .hp-avnote {
          border-top: 1px solid var(--color-nightfall);
          padding: 64px 48px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        /* One step below the bands' body copy (17px) so the hierarchy is
           legible before anyone reads a word. --color-mist is 5.2:1 on
           void, which clears AA at this size. */
        .hp-avnote-line {
          margin: 0;
          max-width: 620px;
          font-size: 15px;
          line-height: 1.65;
          color: var(--color-mist);
          text-wrap: pretty;
        }

        /* ---- responsive ---- */
        @media (max-width: 900px) {
          .hp-hero-copy > p:first-of-type { margin: 0 0 26px; }
          .hp-hero-sub { margin: 30px 0 0; }
          .hp-closer { padding: 88px 24px; }
          .hp-avnote { padding: 48px 24px; }

          /* Bands stack: the still keeps the top of the band to itself,
             and the copy starts just over its foot, where the floor is
             darkest, then continues on void. */
          .hp-band {
            display: block;
            min-height: 0;
          }
          .hp-band-media {
            position: relative;
            inset: auto;
            height: clamp(300px, 90vw, 560px);
          }
          .hp-band[data-side] .hp-band-scrim {
            background:
              linear-gradient(0deg,
                var(--color-void) 0%,
                color-mix(in srgb, var(--color-void) 90%, transparent) 22%,
                transparent 64%),
              linear-gradient(180deg,
                color-mix(in srgb, var(--color-void) 80%, transparent) 0%,
                transparent 18%);
          }
          .hp-band-copy {
            width: auto;
            margin-top: -56px;
            padding: 0 24px 56px;
          }

          /* The long flagship label cannot hold one line at this width:
             let it wrap and drop the leader rule rather than clip. */
          .hp-act-label { white-space: normal; letter-spacing: 0.18em; line-height: 1.6; }
          .hp-act-rule  { display: none; }
        }

        /* Narrow: the copy drops to the bottom of the frame, where
           HeroBackdrop's scrim turns vertical and is darkest, and the
           image keeps the top of the screen to itself. */
        @media (max-width: 720px) {
          .hp-hero {
            justify-content: flex-end;
            padding-bottom: 56px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hp-band-media img,
          .hp-band::after,
          .hp-band-seam,
          .hp-arrow,
          .hp-cta { transition: none; }
          .hp-band:hover .hp-band-media img { transform: none; }
          .hp-band:is(:hover, :focus-visible) .hp-arrow { transform: none; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ActBand({ act }: { act: Act }) {
  const { project, label, accent, image, side, flagship } = act;
  const engine = project.facts.engine;

  return (
    <Link
      className="hp-band"
      data-side={side}
      data-flagship={flagship ? "" : undefined}
      href={`/${project.slug}`}
      aria-label={`${project.title} — ${project.routingVerb}`}
      style={
        {
          "--accent": accent,
          "--accent-0": `${accent}00`,
          "--accent-59": `${accent}59`,
          background: bandBackground(accent),
        } as React.CSSProperties
      }
    >
      <div className="hp-band-media">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: image.position }}
        />
        {image.shade > 0 && (
          <div
            aria-hidden
            className="hp-band-shade"
            style={{
              background: `color-mix(in srgb, var(--color-void) ${Math.round(image.shade * 100)}%, transparent)`,
            }}
          />
        )}
        <div aria-hidden className="hp-band-scrim" />
      </div>
      <div aria-hidden className="hp-band-seam" />

      <div className="hp-band-copy">

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: flagship ? 24 : 20,
          }}
        >
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
            fontSize: flagship ? T.displayLg : T.bandTitle,
            textWrap: "balance",
          }}
        >
          {project.title}
        </h2>

        <p
          style={{
            margin: `${flagship ? 24 : 20}px 0 0`,
            maxWidth: flagship ? 600 : 560,
            fontSize: flagship ? T.bodyLg : T.body,
            lineHeight: 1.6,
            color: "var(--color-silver)",
            textWrap: "pretty",
          }}
        >
          {project.systemsHook}
        </p>

        {/* GRID */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: flagship ? 28 : 22,
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
                background: "color-mix(in srgb, var(--color-void) 72%, transparent)",
                color: "color-mix(in srgb, var(--color-mist) 66%, var(--color-silver))",
                whiteSpace: "nowrap",
              }}
            >
              {chip}
            </span>
          ))}
        </div>

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
          Click here to {project.routingVerb}
          <span aria-hidden className="hp-arrow">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}