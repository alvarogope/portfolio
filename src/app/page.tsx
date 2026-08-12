import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/layout/Reveal";
import { homeDisplay, homeMono } from "@/components/home/fonts";
import { acts, toChips, type Act } from "@/components/home/acts";

export const metadata: Metadata = {
  title: "Álvaro Gómez | Technical Designer",
  description:
    "I design game systems and build them myself. Unreal Engine 5, Unity, C++, Python.",
};

/* ==================================================================
   TOKENS

   Colour: one warm ramp, all of it biased toward the oxide accent so
   the neutrals read as chosen rather than inherited greys. Oxide is
   reserved for three jobs only — the opening eyebrow, the closing
   call to action, and focus rings — so the accent brackets the page
   instead of being sprinkled through it. The per-project accents are
   a separate, semantic set: they identify a world, they are not the
   brand colour.
   ================================================================== */

const INK = "#0a0908"; // ground
const PAPER = "#f0ece4"; // primary text
const WARM_2 = "#b3aa9d"; // secondary text
const WARM_3 = "#8b8175"; // labels, meta — lifted to clear 4.5:1 on ink
const OXIDE = "#d6784b"; // accent — eyebrow, CTA, focus
const HAIRLINE = "#241f1b";
const CHIP_EDGE = "#332e28";

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

/* Mono label roles. These are separated by tracking and colour rather
   than by size — four labels one pixel apart would read as one thing
   doing four jobs. */
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
   first: the raked oxide stripe that ties the hero to the bands; a
   left-side fall-off that buys contrast for the copy in the bottom
   corner; a vertical fall-off that resolves to the page ground at the
   very bottom so the hero hands off to the first band without a seam;
   and a warm highlight that keeps the brand temperature in the sky. */
/* The art carries the upper two thirds; the lower third is a title
   plate. The vertical stop values are set from measured contrast, not
   by eye — the oxide eyebrow is the most demanding text on the page and
   needs its backdrop at roughly rgb(35,35,35) or darker to clear 4.5:1,
   which is what the 0.88 stop at 62% buys. */
const HERO_VEIL = [
  "repeating-linear-gradient(118deg, transparent 0 22px, rgba(214,120,75,0.05) 22px 23px)",
  "linear-gradient(90deg, rgba(10,9,8,0.90) 0%, rgba(10,9,8,0.55) 38%, rgba(10,9,8,0) 78%)",
  "linear-gradient(180deg, rgba(10,9,8,0.28) 0%, rgba(10,9,8,0.04) 20%, rgba(10,9,8,0.35) 42%, rgba(10,9,8,0.88) 62%, rgba(10,9,8,0.985) 78%, #0a0908 100%)",
  "radial-gradient(120% 70% at 50% 0%, rgba(214,120,75,0.14), transparent 60%)",
].join(", ");

/* Each band gets the same raked stripe, tinted with its own accent. */
function bandBackground(accent: string): string {
  return [
    `linear-gradient(100deg, ${accent}14 0%, transparent 55%)`,
    `repeating-linear-gradient(118deg, transparent 0 20px, ${accent}0d 20px 21px)`,
    INK,
  ].join(", ");
}

const mono: React.CSSProperties = { fontFamily: "var(--font-home-mono)" };

/* globals.css sets `h1,h2,h3 { font-family: var(--font-display) }`, and
   that element rule outranks inheritance from the wrapper — so the
   homepage face has to be named on every heading. */
const display: React.CSSProperties = { fontFamily: "var(--font-home-display)" };

export default function Home() {
  return (
    <div
      className={`${homeDisplay.variable} ${homeMono.variable} hp-root`}
      style={{
        background: INK,
        color: PAPER,
        fontFamily: "var(--font-home-display)",
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
          background: INK,
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
              color: OXIDE,
            }}
          >
            TECHNICAL GAME DESIGNER
          </p>

          <h1
            style={{
              ...display,
              margin: 0,
              fontWeight: 800,
              fontSize: T.hero,
              lineHeight: 0.88,
              letterSpacing: "-0.05em",
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
              color: WARM_2,
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
              color: WARM_3,
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
            borderTop: `1px solid ${HAIRLINE}`,
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
              fontWeight: 800,
              fontSize: T.quote,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
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
              color: WARM_2,
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
              color: OXIDE,
              border: `1px solid ${OXIDE}`,
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
           always lands on a backdrop of at least 0.92 ink. */
        .hp-hero-copy {
          position: relative;
          z-index: 1;
          padding: 88px 48px 72px;
          background: linear-gradient(
            180deg,
            rgba(10, 9, 8, 0) 0px,
            rgba(10, 9, 8, 0.92) 88px,
            rgba(10, 9, 8, 0.97) 100%
          );
        }
        /* Relationship-based rhythm: the eyebrow belongs to the
           headline, so it hugs it; the subline is a separate thought
           and gets real air; the cue is further still.
           The headline's line-height of 0.88 makes its box shorter than
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
          border-top: 1px solid ${HAIRLINE};
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
          background: linear-gradient(90deg, ${INK} 0%, transparent 48%);
        }
        .hp-band[data-side="right"] .hp-band-scrim {
          background: linear-gradient(270deg, ${INK} 0%, transparent 48%);
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
          transition: gap 260ms ease;
        }
        .hp-link .hp-arrow { transition: transform 260ms ease; }
        .hp-band:hover .hp-link .hp-arrow,
        .hp-link:hover .hp-arrow { transform: translateX(4px); }

        .hp-cta { transition: background-color 220ms ease, color 220ms ease; }
        .hp-cta:hover { background: ${OXIDE}; color: ${INK}; }

        /* A visible keyboard state everywhere, in the brand accent. */
        .hp-root a:focus-visible {
          outline: 2px solid ${OXIDE};
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
              rgba(10, 9, 8, 0) 0px,
              rgba(10, 9, 8, 0.92) 64px,
              rgba(10, 9, 8, 0.97) 100%
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
            background: linear-gradient(180deg, transparent 45%, ${INK} 100%);
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
          .hp-link,
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

      <div
        className="hp-band-copy"
        style={{ maxWidth: flagship ? 620 : 560 }}
      >
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
            fontWeight: 800,
            lineHeight: flagship ? 0.9 : 0.95,
            letterSpacing: flagship ? "-0.042em" : "-0.035em",
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
            color: WARM_2,
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
                  border: `1px solid ${CHIP_EDGE}`,
                  padding: "7px 11px",
                  color: WARM_3,
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
              color: WARM_3,
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
