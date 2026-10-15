import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/layout/Reveal";
import Particles from "@/components/effects/Particles";
import { logoFor } from "@/components/project/EngineTag";
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
  displayLg: "clamp(2.25rem, 1.6rem + 3vw, 4.2rem)",
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
} as const;

const CONTACT ="alvarogomezperez.work@gmail.com";

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
            I am a technical game designer specialised in systems, combat, UI/UX and level design, world-building, audio and programming.
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
        /* The field ends with the closer and fades out over its last
           third, so it is gone by the time the footer comes into view
           rather than stopping on a hard edge. */
        .hp-closer-particles {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          -webkit-mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
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
        /* The overlays bleed 2px past the media box (which clips them) so
           that while Reveal slides the band in, GPU rounding can't leave a
           sliver of unshaded image along the edges. */
        .hp-band-shade,
        .hp-band-scrim { position: absolute; inset: -2px; }

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

        /* ---- band facts ---- */
        /* Engine | disciplines, split by one white rule. Plain type with
           no boxes: none of it is interactive (the whole band is the
           link), so nothing here should read as a button. */
        .hp-facts {
          display: grid;
          grid-template-columns: auto 2px minmax(0, 1fr);
          align-items: start;
          column-gap: 28px;
          max-width: 640px;
        }
        .hp-facts-engine {
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 19px;
          font-weight: 600;
          letter-spacing: 0.12em;
          line-height: 1;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .hp-facts-logo {
          display: block;
          width: 26px;
          height: 26px;
          flex: none;
          filter: brightness(0) invert(1);
        }
        .hp-facts-rule {
          align-self: stretch;
          background: var(--color-moonlight);
        }
        /* One discipline per line: the stack itself is the separator. */
        .hp-facts-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 17px;
          letter-spacing: 0.04em;
          line-height: 1.4;
          color: var(--color-silver);
        }

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
          .hp-hero-copy > p:first-of-type { margin: 0 0 26px; }
          .hp-hero-sub { margin: 30px 0 0; }
          .hp-closer { padding: 88px 24px; }

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

        /* Phone: too narrow for engine and list side by side at this
           size, so the engine goes on top and the white rule moves down
           to run beside the list. */
        @media (max-width: 600px) {
          .hp-facts {
            grid-template-columns: 2px minmax(0, 1fr);
            column-gap: 18px;
            row-gap: 18px;
          }
          .hp-facts-engine { grid-column: 1 / -1; font-size: 17px; gap: 10px; }
          .hp-facts-logo { width: 22px; height: 22px; }
          .hp-facts-list { font-size: 16px; }
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
  const { project, accent, image, side, flagship } = act;
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
          background: "var(--color-void)",
        } as React.CSSProperties
      }
    >
      <div className="hp-band-media">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          loading={flagship ? "eager" : undefined}
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

        <h2
          style={{
            ...display,
            margin: 0,
            fontWeight: DISPLAY_WEIGHT,
            lineHeight: flagship ? 0.92 : 0.98,
            letterSpacing: "-0.015em",
            fontSize: flagship ? T.displayLg : T.bandTitle,
            textTransform: "uppercase",
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

        <BandFacts engine={engine} disciplines={toChips(project.disciplines)} accent={accent} flagship={flagship} />

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
function BandFacts({
  engine,
  disciplines,
  accent,
  flagship,
}: {
  engine: string;
  disciplines: string[];
  accent: string;
  flagship: boolean;
}) {
  const logo = logoFor(engine);

  return (
    <div className="hp-facts" style={{ marginTop: flagship ? 36 : 28 }}>
      <p className="hp-facts-engine" style={{ ...mono, color: accent }}>
        {logo && (
          <Image
            src={logo}
            alt=""
            width={26}
            height={26}
            unoptimized
            aria-hidden
            className="hp-facts-logo"
          />
        )}
        {engine}
      </p>
      <span aria-hidden className="hp-facts-rule" />
      <ul className="hp-facts-list" style={mono}>
        {disciplines.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  );
}