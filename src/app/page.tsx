import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/layout/Reveal";
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

/* Literal of --color-void, for the gradient stops that need an alpha
   channel. Kept next to the token so the two can't drift. */
const VOID_RGB = "11, 14, 20";
const rgba = (alpha: number) => `rgba(${VOID_RGB}, ${alpha})`;

/* Type scale. Display sizes are fluid; everything else sits on a
   fixed 17px-based ramp so body copy never drifts between bands. */
const T = {
  hero: "clamp(2.5rem, 1.6rem + 5vw, 7rem)",
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
   size — four labels one pixel apart would read as one thing doing
   four jobs. */
const LABEL = {
  eyebrow: { fontSize: 12, letterSpacing: "0.26em" },
  act: { fontSize: 11, letterSpacing: "0.3em" },
  meta: { fontSize: 11, letterSpacing: "0.14em" },
  chip: { fontSize: 10, letterSpacing: "0.1em" },
  note: { fontSize: 10, letterSpacing: "0.2em" },
} as const;

const CONTACT = "alvarogomezperez.work@gmail.com";

const HERO_ART = "/images/moon-knight/poster.png";

/* The veil that sits over the key art. Four layers, listed topmost
   first: a faint raked stripe that ties the hero to the bands; a
   left-side fall-off that buys contrast for the copy in the bottom
   corner; a vertical fall-off that resolves to the page ground at the
   very bottom so the hero hands off to the first band without a seam;
   and a cool moonlight highlight in the sky. */
const HERO_VEIL = [
  "repeating-linear-gradient(118deg, transparent 0 22px, rgba(184,196,212,0.04) 22px 23px)",
  `linear-gradient(90deg, ${rgba(0.9)} 0%, ${rgba(0.55)} 38%, ${rgba(0)} 78%)`,
  `linear-gradient(180deg, ${rgba(0.28)} 0%, ${rgba(0.04)} 20%, ${rgba(0.35)} 42%, ${rgba(0.88)} 62%, ${rgba(0.985)} 78%, var(--color-void) 100%)`,
  "radial-gradient(120% 70% at 50% 0%, rgba(184,196,212,0.10), transparent 60%)",
].join(", ");

/* Each band gets the same raked stripe, tinted with its own accent.

   The alphas are deliberately low: the wash lifts the ground, and
   --color-mist body copy sits on it at only ~5:1 to begin with, so a
   heavier tint pushes the hook text below AA. These values are set
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
        overflow: "hidden",
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
          height: "min(100vh, 780px)",
          minHeight: 560,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "var(--color-void)",
          overflow: "hidden",
        }}
      >
        {/* Moon-Knight's key art, full bleed. Decorative here: the same
            poster is presented with its real alt text in the band below,
            so announcing it twice would only add noise. Both this and
            the veil are absolutely positioned, so neither takes part in
            the section's flex layout. */}
        <Image
          src={HERO_ART}
          alt=""
          fill
          priority
          sizes="100vw"
          /* Cropped to 70% so the frame lands on the helmet and the
             raised sword rather than the poster's own baked-in title
             lettering, which sits across the top of the artwork and
             would compete with the headline. */
          style={{ objectFit: "cover", objectPosition: "center 70%" }}
        />
        <div aria-hidden className="hp-hero-veil" style={{ background: HERO_VEIL }} />

        <div />

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
              margin: 0,
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

          <span
            className="hp-enter"
            style={{
              ...mono,
              ...LABEL.note,
              color: "var(--color-mist)",
            }}
          >
            ↓ ENTER
          </span>
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
            // Left-aligned to the same 48px gutter as the hero and the
            // bands, so the page holds one axis from top to bottom.
            alignItems: "flex-start",
            textAlign: "left",
          }}
        >
          <p
            style={{
              ...display,
              margin: 0,
              fontStyle: "italic",
              fontWeight: DISPLAY_WEIGHT,
              fontSize: T.quote,
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
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
        .hp-hero-veil { position: absolute; inset: 0; }
        /* Lifts the copy above the art, and carries its own plate so
           legibility never depends on where the flex layout happens to
           place the block — the headline wraps to more lines on narrow
           screens, which pushes the copy up into brighter art. The fade
           length is tied to padding-top, so the first line of text
           always lands on a backdrop of at least 0.92 void. */
        .hp-hero-copy {
          position: relative;
          z-index: 1;
          padding: 88px 48px 72px;
          background: linear-gradient(
            180deg,
            ${rgba(0)} 0px,
            ${rgba(0.92)} 88px,
            ${rgba(0.97)} 100%
          );
        }
        /* Relationship-based rhythm: the eyebrow belongs to the
           headline, so it hugs it; the subline is a separate thought
           and gets real air; the cue is further still.
           The headline's tight line-height makes its box shorter than
           its glyphs, so a modest margin here collapses to no visible
           gap at all — this is sized for the optical result. */
        .hp-hero-copy > p:first-child { margin: 0 0 34px; }
        .hp-hero-sub { margin: 32px 0 0; }
        .hp-enter { margin-top: 40px; }

        /* ---- closer ---- */
        .hp-closer { padding: 128px 48px; }

        /* ---- bands ---- */
        .hp-band {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          border-top: 1px solid var(--color-nightfall);
          position: relative;
        }
        .hp-band-media {
          position: relative;
          height: 100%;
          min-height: 260px;
          overflow: hidden;
        }
        .hp-band-copy { display: flex; flex-direction: column; padding: 64px 48px; }

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
           two halves simply abutting. */
        .hp-band-seam { position: absolute; top: 0; bottom: 0; width: 1px; }
        .hp-band[data-side="left"]  .hp-band-seam { left: 0; }
        .hp-band[data-side="right"] .hp-band-seam { right: 0; }

        /* ---- interaction ---- */
        .hp-band-media img {
          transition: transform 900ms cubic-bezier(0.2, 0.6, 0.2, 1);
        }
        .hp-band:hover .hp-band-media img { transform: scale(1.035); }

        .hp-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 3px;
          border-bottom: 1px solid currentColor;
        }
        .hp-link .hp-arrow { transition: transform 260ms ease; }
        .hp-band:hover .hp-link .hp-arrow,
        .hp-link:hover .hp-arrow { transform: translateX(4px); }

        .hp-cta { transition: background-color 220ms ease, color 220ms ease; }
        .hp-cta:hover {
          background: var(--color-silver);
          color: var(--color-void);
        }

        /* A visible keyboard state everywhere, in the site's accent. */
        .hp-root a:focus-visible {
          outline: 2px solid var(--color-silver);
          outline-offset: 5px;
          border-radius: 1px;
        }

        @keyframes hp-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }
        .hp-enter {
          display: inline-block;
          animation: hp-bob 2.2s ease-in-out infinite;
        }

        /* ---- responsive ---- */
        @media (max-width: 900px) {
          .hp-hero-copy {
            padding: 64px 24px 56px;
            background: linear-gradient(
              180deg,
              ${rgba(0)} 0px,
              ${rgba(0.92)} 64px,
              ${rgba(0.97)} 100%
            );
          }
          .hp-hero-copy > p:first-child { margin: 0 0 22px; }
          .hp-hero-sub { margin: 24px 0 0; }
          .hp-enter { margin-top: 32px; }
          .hp-closer { padding: 88px 24px; }

          /* Bands stack: poster above, copy full-width beneath. */
          .hp-band {
            grid-template-columns: 1fr;
            min-height: 0 !important;
          }
          /* Same specificity as the side rules above, and later in the
             sheet, so the poster always stacks on top regardless of side. */
          .hp-band[data-side] .hp-band-media { height: 240px; min-height: 240px; order: 1; }
          .hp-band[data-side] .hp-band-copy  { order: 2; padding: 40px 24px 48px; max-width: none !important; }

          /* Copy is underneath now, so the poster fades downward and the
             seam becomes the horizontal edge between the two. */
          .hp-band[data-side] .hp-band-scrim {
            background: linear-gradient(180deg, transparent 45%, var(--color-void) 100%);
          }
          .hp-band[data-side] .hp-band-seam {
            top: auto; bottom: 0; left: 0; right: 0;
            width: auto; height: 1px;
          }

          /* The long flagship label cannot hold one line at this width:
             let it wrap and drop the leader rule rather than clip. */
          .hp-act-label { white-space: normal; letter-spacing: 0.18em; line-height: 1.6; }
          .hp-act-rule  { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hp-enter { animation: none; }
          .hp-band-media img,
          .hp-link .hp-arrow,
          .hp-cta { transition: none; }
          .hp-band:hover .hp-band-media img { transform: none; }
          .hp-band:hover .hp-link .hp-arrow,
          .hp-link:hover .hp-arrow { transform: none; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ActBand({ act }: { act: Act }) {
  const { project, label, accent, poster, side, flagship } = act;

  /* Which side the copy sits on is driven by `data-side` and CSS
     `order`, not by inline grid placement: the mobile media query has
     to be able to override it to stack the poster on top, and an inline
     grid-column would win over any stylesheet rule. */
  return (
    <section
      className="hp-band"
      data-side={side}
      style={{
        minHeight: flagship ? 640 : 420,
        background: bandBackground(accent),
      }}
    >
      <div className="hp-band-media">
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
        <div
          aria-hidden
          className="hp-band-seam"
          style={{ background: `linear-gradient(${accent}00, ${accent}59, ${accent}00)` }}
        />
      </div>

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

        {flagship ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 28,
            }}
          >
            {toChips(project.disciplines).map((chip) => (
              <span
                key={chip}
                style={{
                  ...mono,
                  ...LABEL.chip,
                  border: "1px solid color-mix(in srgb, var(--color-mist) 32%, transparent)",
                  padding: "7px 11px",
                  color: "var(--color-mist)",
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : (
          <p
            style={{
              ...mono,
              ...LABEL.meta,
              margin: "22px 0 0",
              color: "var(--color-mist)",
              lineHeight: 1.7,
            }}
          >
            {project.disciplines}
          </p>
        )}

        {/* The link gets the largest break in the block: it is the one
            thing in the band you are meant to act on. */}
        <Link
          className="hp-link"
          href={`/${project.slug}`}
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
        </Link>
      </div>
    </section>
  );
}
