import {
  castAnchor,
  castEncounters,
  castMirror,
  castPlayer,
  mirrorTruth,
  type EncounterMember,
  type MirrorMember,
} from "@/content/moon-knight-cast";
import { CastEmblem, CastSprite } from "./CastEmblems";

/**
 * Moon-Knight — Dramatis Personae, the cast.
 *
 * Reads `src/content/moon-knight-cast.ts`. Every card answers two questions in
 * this order: who is this, and WHY DO THEY EXIST. The second is the reason the
 * section is on a portfolio at all, so "Design purpose" is a labelled block on
 * every card rather than a trailing sentence.
 *
 * Three bands, and each band's shape is an argument:
 *
 *   1. THE PLAYER, given the full width. The Moon-Knight's contrast — silent
 *      warrior, heals by playing an instrument — is rendered as two cells with
 *      an axis between them, so the opposition is visible before it is read.
 *   2. WHO FINDS YOU. Death and Orpheus, two ordinary cards side by side.
 *   3. THE MIRROR. The Witch and the Druid are NOT two cards that happen to be
 *      adjacent: the truth they share is printed once above them as a
 *      keystone, and the pair hangs off it facing each other across a centre
 *      axis — she right-aligned, he left-aligned, emblems flanking the line.
 *      Under the breakpoint the axis rotates flat and both cards return to
 *      left-aligned, which keeps the pairing without asking a phone to render
 *      a diptych.
 *
 * Server component. The only motion is a hover lift, off under reduced motion.
 */

export default function Cast({ kicker }: { kicker?: string }) {
  const [witch, druid] = castMirror;

  return (
    <section className="mkc" aria-labelledby="mkc-title">
      <CastSprite />

      <header className="mkc__head">
        {kicker && <p className="mono mkc__kicker">{kicker}</p>}
        <div className="mkc__title-row">
          <span className="mkc__rule mkc__rule--l" aria-hidden />
          <h2 id="mkc-title" className="mkc__title">
            The Cast
          </h2>
          <span className="mkc__rule mkc__rule--r" aria-hidden />
        </div>
        <p className="mono mkc__subtitle">Dramatis Personae · Moon-Knight</p>
      </header>

      {/* ---- band 1: the player ---- */}
      <div className="mkc__band">
        <h3 className="mono mkc__band-name">The One You Play</h3>
        <span className="mkc__band-rule" aria-hidden />
        <p className="mono mkc__band-note">Silence, by design</p>
      </div>

      <article
        id={castAnchor(castPlayer.id)}
        className="mkc__card mkc__hero"
        style={{ "--mkc-accent": castPlayer.accent } as React.CSSProperties}
      >
        <div className="mkc__hero-plate">
          <div className="mkc__plate mkc__plate--hero">
            <CastEmblem id={castPlayer.id} />
          </div>
          <p className="mono mkc__title-label mkc__title-label--hero">{castPlayer.title}</p>
        </div>

        <div className="mkc__hero-body">
          <h4 className="mkc__name mkc__name--hero">{castPlayer.name}</h4>
          <p className="mkc__role">{castPlayer.role}</p>

          {/* the headline decision, set as an opposition */}
          <div className="mkc__contrast">
            <div className="mkc__contrast-cell">
              <p className="mono mkc__contrast-label">{castPlayer.contrast[0].label}</p>
              <p className="mkc__contrast-note">{castPlayer.contrast[0].note}</p>
            </div>
            <div className="mkc__contrast-axis" aria-hidden>
              <span className="mkc__contrast-diamond" />
            </div>
            <div className="mkc__contrast-cell">
              <p className="mono mkc__contrast-label mkc__contrast-label--gold">
                {castPlayer.contrast[1].label}
              </p>
              <p className="mkc__contrast-note">{castPlayer.contrast[1].note}</p>
            </div>
          </div>

          <Purpose text={castPlayer.designPurpose} />
        </div>
      </article>

      {/* ---- band 2: the encounters ---- */}
      <div className="mkc__band">
        <h3 className="mono mkc__band-name">Who Finds You</h3>
        <span className="mkc__band-rule" aria-hidden />
        <p className="mono mkc__band-note">One gives, one is taken</p>
      </div>

      <div className="mkc__encounters">
        {castEncounters.map((member) => (
          <EncounterCard key={member.id} member={member} />
        ))}
      </div>

      {/* ---- band 3: the mirror ---- */}
      <div className="mkc__band">
        <h3 className="mono mkc__band-name">Two Answers, One Truth</h3>
        <span className="mkc__band-rule" aria-hidden />
        <p className="mono mkc__band-note">The Witch · The Druid</p>
      </div>

      <div className="mkc__keystone">
        <p className="mono mkc__keystone-label">{mirrorTruth.label}</p>
        <p className="mkc__keystone-line">{mirrorTruth.line}</p>
        <p className="mono mkc__keystone-note">{mirrorTruth.note}</p>
        <span className="mkc__keystone-stem" aria-hidden />
      </div>

      <div className="mkc__mirror">
        <MirrorCard member={witch} side="left" />
        <div className="mkc__axis" aria-hidden>
          <span className="mkc__axis-line" />
          <span className="mkc__axis-mark">
            <svg viewBox="0 0 24 24" aria-hidden focusable="false">
              <path d="M12 2 L15 12 L12 22 L9 12 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M4 12 H9M15 12 H20" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <span className="mkc__axis-line" />
        </div>
        <MirrorCard member={druid} side="right" />
      </div>

      <CastStyles />
    </section>
  );
}

/* ------------------------------------------------------------------ cards -- */

/** The block that carries this section's actual value. Same on every card. */
function Purpose({ text }: { text: string }) {
  return (
    <div className="mkc__purpose">
      <p className="mono mkc__purpose-label">Design purpose</p>
      <p className="mkc__purpose-text">{text}</p>
    </div>
  );
}

function EncounterCard({ member }: { member: EncounterMember }) {
  return (
    <article
      id={castAnchor(member.id)}
      className="mkc__card mkc__encounter"
      style={{ "--mkc-accent": member.accent } as React.CSSProperties}
    >
      <div className="mkc__encounter-head">
        <div className="mkc__plate">
          <CastEmblem id={member.id} />
        </div>
        <p className="mono mkc__title-label">{member.title}</p>
        <h4 className="mkc__name">{member.name}</h4>
      </div>
      <p className="mkc__role">{member.role}</p>
      <Purpose text={member.designPurpose} />
    </article>
  );
}

/**
 * One half of the diptych. `side` says which way it faces: the left card packs
 * itself against the centre axis (text right-aligned, emblem last) and the
 * right card mirrors it. Both fall back to plain left-aligned cards under the
 * breakpoint — see `.mkc__mirror` in the stylesheet.
 */
function MirrorCard({ member, side }: { member: MirrorMember; side: "left" | "right" }) {
  return (
    <article
      id={castAnchor(member.id)}
      className={"mkc__card mkc__mirror-card mkc__mirror-card--" + side}
      style={{ "--mkc-accent": member.accent } as React.CSSProperties}
    >
      <div className="mkc__mirror-head">
        <div className="mkc__plate mkc__plate--mirror">
          <CastEmblem id={member.id} />
        </div>
        <div className="mkc__mirror-ident">
          <p className="mono mkc__title-label">{member.title}</p>
          <h4 className="mkc__name">{member.name}</h4>
          <p className="mkc__stance">{member.stance}</p>
        </div>
      </div>

      <p className="mkc__role">{member.role}</p>

      <blockquote className="mkc__answer">
        <p className="mkc__answer-text">{member.answer}</p>
      </blockquote>

      <Purpose text={member.designPurpose} />
    </article>
  );
}

/* ----------------------------------------------------------------- styles -- */

function CastStyles() {
  return (
    <style>{`
      .mkc {
        --mkc-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
        --mkc-panel: #0F141E;
        --mkc-prose: #A9B4C4;
        --mkc-quiet: #93A0B3;
      }

      /* ---- illuminated header (shares its shape with the bestiary) ---- */
      .mkc__head { text-align: center; }
      .mkc__kicker {
        font-size: 0.7rem;
        color: var(--color-gold);
        margin: 0 0 1.4rem;
      }
      .mkc__title-row {
        display: flex;
        align-items: center;
        gap: clamp(0.9rem, 3vw, 2rem);
      }
      .mkc__rule {
        flex: 1 1 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--color-gold));
        position: relative;
      }
      .mkc__rule--r { background: linear-gradient(270deg, transparent, var(--color-gold)); }
      .mkc__rule::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 6px;
        height: 6px;
        background: var(--color-gold);
        transform: translateY(-50%) rotate(45deg);
      }
      .mkc__rule--l::after { right: -2px; }
      .mkc__rule--r::after { left: -2px; }
      .mkc__title {
        font-family: var(--font-unifraktur), var(--font-display), serif;
        font-size: clamp(2.4rem, 1.5rem + 3.6vw, 4.25rem);
        font-weight: 400;
        line-height: 1;
        margin: 0;
        color: var(--color-moonlight);
        letter-spacing: 0.02em;
        white-space: nowrap;
      }
      .mkc__subtitle {
        font-size: 0.68rem;
        letter-spacing: 0.3em;
        color: var(--color-gold);
        margin: 1rem 0 0;
      }

      /* ---- band headings ---- */
      .mkc__band {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 3.5rem 0 1.5rem;
        flex-wrap: wrap;
      }
      .mkc__band-name {
        font-size: 0.74rem;
        font-weight: 500;
        letter-spacing: 0.24em;
        color: var(--color-gold);
        margin: 0;
      }
      .mkc__band-rule { flex: 1 1 3rem; height: 1px; background: var(--mkc-hair); }
      .mkc__band-note {
        font-size: 0.66rem;
        color: var(--mkc-quiet);
        margin: 0;
        text-transform: none;
        letter-spacing: 0.12em;
      }

      /* ---- shared card shell ---- */
      .mkc__card {
        background: var(--mkc-panel);
        border: 1px solid color-mix(in srgb, var(--color-mist) 22%, transparent);
        display: flex;
        flex-direction: column;
        gap: 0.95rem;
        padding: 1.6rem 1.35rem 1.45rem;
        transition: border-color 200ms ease, transform 200ms ease;
      }
      .mkc__card:hover {
        border-color: color-mix(in srgb, var(--mkc-accent) 55%, transparent);
        transform: translateY(-2px);
      }

      /* ---- the plate an emblem sits in ---- */
      .mkc__plate {
        width: 100%;
        max-width: 116px;
        aspect-ratio: 1;
        border-radius: 60px 60px 4px 4px;
        border: 1px solid color-mix(in srgb, var(--mkc-accent) 50%, transparent);
        color: var(--mkc-accent);
        display: grid;
        place-items: center;
        overflow: hidden;
        background:
          radial-gradient(112% 80% at 50% 30%,
            color-mix(in srgb, var(--mkc-accent) 30%, transparent), transparent 70%),
          repeating-linear-gradient(90deg,
            transparent 0 13px,
            color-mix(in srgb, var(--color-moonlight) 7%, transparent) 13px 14px),
          linear-gradient(180deg, #131A26, #090C12);
      }
      .mkc__plate--hero { max-width: 176px; border-radius: 90px 90px 5px 5px; }
      /* the pair are struck as medallions — two faces, one coin */
      .mkc__plate--mirror { max-width: 104px; border-radius: 50%; flex: none; }
      .mkc__emblem { width: 80%; height: 80%; display: block; }

      /* ---- names and labels ---- */
      .mkc__title-label {
        font-size: 0.62rem;
        letter-spacing: 0.28em;
        color: var(--mkc-quiet);
        margin: 0;
      }
      .mkc__title-label--hero {
        color: var(--color-gold);
        margin-top: 0.95rem;
      }
      .mkc__name {
        font-family: var(--font-hero), var(--font-display), serif;
        font-size: 1.2rem;
        margin: 0.4rem 0 0;
        line-height: 1.2;
        color: var(--color-moonlight);
        letter-spacing: 0.02em;
      }
      .mkc__name--hero {
        font-size: clamp(1.7rem, 1.2rem + 1.6vw, 2.4rem);
        margin: 0;
      }
      .mkc__role {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.65;
        color: var(--mkc-prose);
      }

      /* ---- design purpose: the reason the section exists ---- */
      .mkc__purpose {
        border: 1px solid var(--mkc-hair);
        border-left-width: 2px;
        border-left-color: var(--color-gold);
        background: color-mix(in srgb, var(--color-gold) 5%, transparent);
        padding: 0.9rem 1rem 1rem;
        margin-top: auto;
      }
      .mkc__purpose-label {
        font-size: 0.6rem;
        letter-spacing: 0.26em;
        color: var(--color-gold);
        margin: 0 0 0.45rem;
      }
      .mkc__purpose-text {
        margin: 0;
        font-size: 0.88rem;
        line-height: 1.65;
        color: var(--mkc-prose);
      }

      /* ---- band 1: the player ---- */
      .mkc__hero {
        border-color: color-mix(in srgb, var(--color-gold) 45%, transparent);
        padding: clamp(1.6rem, 1rem + 2.4vw, 2.5rem);
        gap: 1.5rem;
      }
      .mkc__hero-plate { display: grid; justify-items: center; text-align: center; }
      .mkc__hero-body { display: flex; flex-direction: column; gap: 1.1rem; }
      @media (min-width: 52rem) {
        .mkc__hero {
          display: grid;
          grid-template-columns: minmax(0, 200px) minmax(0, 1fr);
          gap: clamp(1.6rem, 3vw, 2.75rem);
          align-items: start;
        }
      }

      /* The contrast: two cells, an axis, and no sentence needed to see it. */
      .mkc__contrast {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        border: 1px solid var(--mkc-hair);
        background: color-mix(in srgb, var(--color-gold) 4%, transparent);
      }
      .mkc__contrast-cell { padding: 1rem 1.1rem 1.05rem; }
      .mkc__contrast-label {
        font-size: 0.74rem;
        letter-spacing: 0.2em;
        color: var(--color-silver);
        margin: 0 0 0.5rem;
      }
      .mkc__contrast-label--gold { color: var(--color-gold); }
      .mkc__contrast-note {
        margin: 0;
        font-size: 0.86rem;
        line-height: 1.6;
        color: var(--mkc-prose);
      }
      .mkc__contrast-axis {
        display: grid;
        place-items: center;
        padding: 0.35rem 0;
        border-top: 1px solid var(--mkc-hair);
        border-bottom: 1px solid var(--mkc-hair);
      }
      .mkc__contrast-diamond {
        width: 9px;
        height: 9px;
        background: var(--color-gold);
        transform: rotate(45deg);
      }
      @media (min-width: 40rem) {
        .mkc__contrast { grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); }
        .mkc__contrast-axis {
          width: 2.6rem;
          padding: 0;
          border: 0;
          border-left: 1px solid var(--mkc-hair);
          border-right: 1px solid var(--mkc-hair);
        }
      }

      /* ---- band 2: the encounters ---- */
      .mkc__encounters {
        display: grid;
        gap: 1.15rem;
        grid-template-columns: minmax(0, 1fr);
      }
      @media (min-width: 46rem) {
        .mkc__encounters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      .mkc__encounter-head { text-align: center; display: grid; justify-items: center; }
      .mkc__encounter-head .mkc__title-label { margin-top: 0.9rem; }

      /* ---- band 3: the mirror ---- */
      .mkc__keystone {
        position: relative;
        max-width: 44rem;
        margin: 0 auto;
        text-align: center;
        border: 1px solid var(--mkc-hair);
        background: color-mix(in srgb, var(--color-gold) 5%, transparent);
        padding: 1.15rem 1.35rem 1.25rem;
      }
      .mkc__keystone-label {
        font-size: 0.6rem;
        letter-spacing: 0.28em;
        color: var(--color-gold);
        margin: 0;
      }
      .mkc__keystone-line {
        font-size: clamp(1rem, 0.9rem + 0.5vw, 1.2rem);
        line-height: 1.55;
        color: var(--color-moonlight);
        margin: 0.6rem 0 0.55rem;
      }
      .mkc__keystone-note {
        font-size: 0.62rem;
        letter-spacing: 0.22em;
        color: var(--mkc-quiet);
        margin: 0;
      }
      .mkc__keystone-stem {
        position: absolute;
        left: 50%;
        bottom: -1.15rem;
        width: 1px;
        height: 1.15rem;
        background: color-mix(in srgb, var(--color-gold) 55%, transparent);
      }

      .mkc__mirror {
        display: grid;
        gap: 1.15rem;
        grid-template-columns: minmax(0, 1fr);
        margin-top: 1.15rem;
      }
      .mkc__mirror-head { display: flex; align-items: center; gap: 1rem; }
      .mkc__mirror-ident { min-width: 0; }
      .mkc__stance {
        font-family: var(--font-hero), var(--font-display), serif;
        font-size: 1.35rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--mkc-accent);
        margin: 0.35rem 0 0;
        line-height: 1.1;
      }
      .mkc__answer {
        margin: 0;
        border-left: 2px solid color-mix(in srgb, var(--mkc-accent) 70%, transparent);
        padding: 0.1rem 0 0.1rem 1rem;
      }
      .mkc__answer-text {
        margin: 0;
        font-style: italic;
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--color-moonlight);
      }

      /* The axis between them. Horizontal while the pair is stacked, vertical
         once they sit side by side — same three elements either way. */
      .mkc__axis {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 0.8rem;
        color: var(--color-gold);
        padding: 0.2rem 0;
      }
      .mkc__axis-line {
        height: 1px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-gold) 70%, transparent));
      }
      .mkc__axis-line:last-of-type {
        background: linear-gradient(270deg, transparent, color-mix(in srgb, var(--color-gold) 70%, transparent));
      }
      .mkc__axis-mark { display: grid; place-items: center; }
      .mkc__axis-mark svg { width: 1.5rem; height: 1.5rem; display: block; }

      @media (min-width: 62rem) {
        .mkc__mirror {
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          gap: 0;
          align-items: stretch;
        }
        .mkc__axis {
          grid-template-columns: none;
          grid-template-rows: 1fr auto 1fr;
          justify-items: center;
          width: 4.5rem;
          padding: 1.25rem 0;
          gap: 0.8rem;
        }
        .mkc__axis-line {
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-gold) 70%, transparent));
        }
        .mkc__axis-line:last-of-type {
          background: linear-gradient(0deg, transparent, color-mix(in srgb, var(--color-gold) 70%, transparent));
        }
        .mkc__axis-mark svg { width: 1.7rem; height: 1.7rem; transform: rotate(90deg); }

        /* Left card faces right, right card faces left: the two emblems end up
           either side of the axis and the text reads inward. */
        .mkc__mirror-card--left { text-align: right; }
        .mkc__mirror-card--left .mkc__mirror-head { flex-direction: row-reverse; }
        .mkc__mirror-card--left .mkc__answer {
          border-left: 0;
          border-right: 2px solid color-mix(in srgb, var(--mkc-accent) 70%, transparent);
          padding: 0.1rem 1rem 0.1rem 0;
        }
        .mkc__mirror-card--left .mkc__purpose {
          border-left-width: 1px;
          border-left-color: var(--mkc-hair);
          border-right-width: 2px;
          border-right-color: var(--color-gold);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .mkc__card { transition: none; }
        .mkc__card:hover { transform: none; }
      }
    `}</style>
  );
}
