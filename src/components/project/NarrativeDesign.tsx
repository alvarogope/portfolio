import {
  fullStory,
  narrativeActs,
  narrativeThemes,
  prologueNote,
  reversal,
  storyThroughMechanics,
  type MoonPhase,
  type ThemeGlyph,
} from "@/content/moon-knight-narrative";
import { MoonPhaseGlyph } from "./MoonPhaseGlyph";

/* ---- moon phases ---- */
function MoonGlyph({ phase }: { phase: MoonPhase }) {
  return (
    <MoonPhaseGlyph
      phase={phase}
      className="nd-moon"
      discClassName="nd-moon-disc"
      litClassName="nd-moon-lit"
    />
  );
}

/* ---- theme glyphs ---- */
const TRISKELION_ARM = "M12 12C12 8.5 13.6 6 16.1 5.5C18.2 5.1 19.6 6.7 19 8.5";

function ThemeGlyphMark({ glyph }: { glyph: ThemeGlyph }) {
  if (glyph === "phases") {
    return (
      <svg className="nd-glyph" viewBox="0 0 48 24" aria-hidden="true" focusable="false">
        <g className="nd-glyph-moons">
          <circle className="nd-moon-disc" cx="8" cy="12" r="6" />
          <path className="nd-moon-lit" d="M8 6A6 6 0 0 1 8 18A3 6 0 0 0 8 6Z" />
          <circle className="nd-moon-disc" cx="24" cy="12" r="6" />
          <path className="nd-moon-lit" d="M24 6A6 6 0 0 1 24 18Z" />
          <circle className="nd-moon-disc" cx="40" cy="12" r="6" />
          <circle className="nd-moon-lit" cx="40" cy="12" r="6" />
        </g>
      </svg>
    );
  }

  if (glyph === "willow") {
    return (
      <svg className="nd-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M12 21v-6.4" />
          <path d="M12 14.6c-4.2 0-6.9-2.5-6.9-5.6C5.1 5.6 8.2 3 12 3s6.9 2.6 6.9 6c0 3.1-2.7 5.6-6.9 5.6Z" />
          <path d="M8.3 9.6c.3 2.9-.1 4.6-1.1 6.4" />
          <path d="M12 10.4c0 3.2-.1 5.1-.1 7.1" />
          <path d="M15.7 9.6c-.3 2.9.1 4.6 1.1 6.4" />
        </g>
      </svg>
    );
  }

  if (glyph === "triskelion") {
    return (
      <svg className="nd-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          {[0, 120, 240].map((angle) => (
            <path key={angle} d={TRISKELION_ARM} transform={`rotate(${angle} 12 12)`} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg className="nd-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3.2" y="7" width="17.6" height="10" />
        <path d="M9.1 7v10M14.9 7v10" />
      </g>
      <rect x="8" y="7" width="2.2" height="6" fill="currentColor" />
      <rect x="13.8" y="7" width="2.2" height="6" fill="currentColor" />
    </svg>
  );
}

/* ---- the arc ---- */

function ActCard({ act }: { act: (typeof narrativeActs)[number] }) {
  return (
    <li className="nd-act">
      <p className="mono nd-act-kicker">
        <span className="nd-act-label">{act.actLabel}</span>
        <span className="nd-act-stage">{act.lifeStage}</span>
      </p>

      <div className="nd-crown">
        <span className="nd-rule nd-rule--l" aria-hidden="true" />
        <MoonGlyph phase={act.phase} />
        <span className="nd-rule nd-rule--r" aria-hidden="true" />
      </div>

      <h4 className="nd-act-title">{act.title}</h4>
      <p className="mono nd-act-meta">
        {act.land} · {act.fragment}
      </p>
      <p className="mono nd-act-guard">Guarded by {act.guardian}</p>
      <p className="nd-act-beat">{act.beat}</p>
    </li>
  );
}

export default function NarrativeDesign() {
  return (
    <div className="nd">
      {/* 1 — the arc */}
      <section className="nd-band">
        <h3 className="mono nd-band-title">The three-act arc</h3>

        <p className="nd-prologue">
          <span className="mono nd-prologue-label">{prologueNote.label}</span>
          {prologueNote.line}
        </p>

        <ol className="nd-acts">
          {narrativeActs.map((act) => (
            <ActCard key={act.id} act={act} />
          ))}
        </ol>

        <div className="panel nd-reversal">
          <p className="mono nd-reversal-kicker">{reversal.kicker}</p>
          <h4 className="nd-reversal-title">{reversal.title}</h4>
          <p className="nd-reversal-body">{reversal.body}</p>
          <p className="nd-reversal-body nd-reversal-payoff">{reversal.payoff}</p>
          <p className="nd-reversal-note">{reversal.note}</p>
        </div>
      </section>

      {/* 2 — themes */}
      <section className="nd-band">
        <h3 className="mono nd-band-title">Themes &amp; symbolism</h3>
        <ul className="nd-themes">
          {narrativeThemes.map((theme) => (
            <li key={theme.id} className={`nd-theme is-${theme.glyph}`}>
              <span className="nd-theme-mark">
                <ThemeGlyphMark glyph={theme.glyph} />
              </span>
              <h4 className="nd-theme-title">{theme.title}</h4>
              <p className="nd-theme-line">{theme.line}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3 — story through mechanics */}
      <section className="nd-band">
        <h3 className="mono nd-band-title">Story through mechanics</h3>
        <p className="nd-thesis">{storyThroughMechanics.thesis}</p>
        <dl className="nd-pairs">
          {storyThroughMechanics.pairs.map((pair) => (
            <div key={pair.id} className="nd-pair">
              <dt className="mono nd-pair-mech">{pair.mechanic}</dt>
              <dd className="nd-pair-meaning">{pair.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <details className="nd-more">
        <summary className="mono nd-more-summary">
          <span className="nd-more-caret" aria-hidden="true" />
          Read the full narrative
        </summary>
        <div className="nd-more-body">
          {fullStory.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </details>

      <style>{`
        .nd {
          /* Matches the bestiary's lifted steel: --color-mist is 4.41:1 on
             .panel, under the bar, and this is 6.3:1 — so every small mono
             label in here clears AA. */
          --nd-quiet: #93A0B3;
          --nd-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
          --nd-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);
          /* Scarlet is 2:1 on .panel — unusable either as ink or as a rule.
             Two lifts, because the two jobs have different bars: 3.7:1 for the
             marker rule and the rune, over the 3:1 graphical bar, and 5.2:1
             for the kicker, which is text and owes 4.5:1. */
          --nd-blood: color-mix(in srgb, var(--color-scarlet) 72%, var(--color-moonlight));
          --nd-blood-ink: color-mix(in srgb, var(--color-scarlet) 55%, var(--color-moonlight));

          display: grid;
          gap: 2.5rem;
        }

        .nd-band { display: grid; gap: 1rem; }
        .nd-band-title {
          margin: 0;
          font-size: 0.68rem;
          color: var(--color-gold);
          padding-bottom: 0.55rem;
          border-bottom: 1px solid var(--nd-hair);
        }

        /* ---- 1 · the arc ----
           The prologue note first, set as an aside rather than a fourth card:
           it is structure, not a beat, and a card would put it back inside the
           count it exists to stand outside of. */
        .nd-prologue {
          margin: 0 0 0.35rem;
          padding-left: 0.9rem;
          border-left: 1px solid var(--nd-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--nd-quiet);
          max-width: 46rem;
        }
        .nd-prologue-label {
          display: block;
          font-size: 0.70rem;
          color: var(--color-gold);
          margin-bottom: 0.3rem;
        }

        /* Three columns held as long as a column can carry a sentence; the
           moons then stack and the spine runs down the page instead of across
           it, which is the same reading either way. */
        .nd-acts {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          background: var(--nd-edge);
          border: 1px solid var(--nd-edge);
        }
        .nd-act {
          background: var(--color-nightfall);
          padding: 1.15rem 1.1rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          min-width: 0;
        }

        .nd-act-kicker {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem;
          margin: 0;
          font-size: 0.70rem;
        }
        .nd-act-label { color: var(--color-gold); }
        .nd-act-stage { color: var(--nd-quiet); }

        .nd-crown {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin: 0.35rem 0 0.15rem;
        }
        .nd-rule { flex: 1 1 auto; height: 1px; }
        .nd-rule--l { background: linear-gradient(90deg, transparent, var(--nd-hair)); }
        .nd-rule--r { background: linear-gradient(270deg, transparent, var(--nd-hair)); }

        .nd-moon { width: 2.1rem; height: 2.1rem; flex: 0 0 auto; }
        .nd-moon-disc {
          fill: none;
          stroke: color-mix(in srgb, var(--color-silver) 34%, transparent);
          stroke-width: 1;
        }
        .nd-moon-lit { fill: var(--color-silver); }

        .nd-act-title {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin: 0.1rem 0 0;
          color: var(--color-moonlight);
          text-align: center;
        }
        .nd-act-meta,
        .nd-act-guard {
          margin: 0;
          font-size: 0.70rem;
          color: var(--nd-quiet);
          text-align: center;
          line-height: 1.5;
        }
        .nd-act-guard { color: color-mix(in srgb, var(--color-gold) 70%, var(--nd-quiet)); }
        .nd-act-beat {
          margin: 0.6rem 0 0;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        /* The payoff gets its own panel rather than a fourth column: it is not
           a fourth act, it is what the three become on the way out. */
        .nd-reversal {
          border: 1px solid var(--nd-edge);
          border-left: 3px solid var(--nd-blood);
          padding: 1.2rem 1.3rem 1.3rem;
        }
        .nd-reversal-kicker {
          margin: 0;
          font-size: 0.70rem;
          color: var(--nd-blood-ink);
        }
        .nd-reversal-title {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0.4rem 0 0;
          color: var(--color-moonlight);
        }
        .nd-reversal-body {
          margin: 0.7rem 0 0;
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--color-moonlight);
          max-width: 46rem;
        }
        .nd-reversal-payoff { color: var(--color-silver); }
        .nd-reversal-note {
          margin: 0.9rem 0 0;
          padding-top: 0.8rem;
          border-top: 1px solid var(--nd-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--nd-quiet);
          max-width: 46rem;
        }

        /* ---- 2 · themes ---- */
        .nd-themes {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
          gap: 1px;
          background: var(--nd-edge);
          border: 1px solid var(--nd-edge);
        }
        .nd-theme {
          background: var(--color-nightfall);
          padding: 1.1rem 1.1rem 1.2rem;
          display: grid;
          gap: 0.3rem;
          align-content: start;
          min-width: 0;
        }
        .nd-theme-mark {
          display: block;
          height: 1.6rem;
          margin-bottom: 0.35rem;
          color: var(--color-silver);
        }
        .nd-theme.is-triskelion .nd-theme-mark { color: var(--nd-blood); }
        .nd-theme.is-willow .nd-theme-mark {
          color: color-mix(in srgb, var(--color-emerald) 78%, var(--color-moonlight));
        }
        .nd-theme.is-piano .nd-theme-mark { color: var(--color-gold); }
        .nd-glyph { height: 100%; width: auto; display: block; }

        .nd-theme-title {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .nd-theme-line {
          margin: 0.15rem 0 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        /* ---- 3 · story through mechanics ---- */
        .nd-thesis {
          margin: 0;
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-moonlight);
          max-width: 46rem;
        }
        .nd-pairs {
          margin: 0.4rem 0 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
          gap: 1.1rem 1.8rem;
        }
        .nd-pair {
          padding-left: 0.9rem;
          border-left: 1px solid var(--nd-hair);
          min-width: 0;
        }
        .nd-pair-mech {
          font-size: 0.72rem;
          color: var(--color-gold);
          line-height: 1.5;
        }
        .nd-pair-meaning {
          margin: 0.35rem 0 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        /* ---- the folded plot ---- */
        .nd-more {
          border-top: 1px solid var(--nd-hair);
          padding-top: 1rem;
        }
        .nd-more-summary {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.7rem;
          color: var(--color-gold);
          cursor: pointer;
          list-style: none;
          width: max-content;
        }
        /* The default disclosure triangle is replaced by the caret below. */
        .nd-more-summary::-webkit-details-marker { display: none; }
        .nd-more-summary:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 4px;
        }
        .nd-more-caret {
          width: 0.42em;
          height: 0.42em;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: translateY(-0.12em) rotate(-45deg);
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nd-more[open] .nd-more-caret { transform: translateY(-0.06em) rotate(45deg); }

        .nd-more-body { max-width: 46rem; }
        .nd-more-body p {
          margin: 1rem 0 0;
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--color-moonlight);
        }

        /* ---- responsive ---- */
        @media (max-width: 900px) {
          .nd-acts { grid-template-columns: minmax(0, 1fr); }
          .nd-act { padding: 1.1rem 1rem 1.2rem; }
          .nd-act-title,
          .nd-act-meta,
          .nd-act-guard { text-align: left; }
          /* Stacked, the spine reads better as a single rule to the right of
             the moon than as two stubs bracketing it. */
          .nd-crown { gap: 0.75rem; }
          .nd-rule--l { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nd-more-caret { transition: none; }
        }
      `}</style>
    </div>
  );
}
