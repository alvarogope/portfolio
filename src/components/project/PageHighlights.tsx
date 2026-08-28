/**
 * PageHighlights — the skim band that sits near the top of a long project page.
 *
 * WHY THIS EXISTS. The reading-load audit measured "time-to-best-point" on
 * every page: the cumulative word count a reader passes before the ownership
 * map's own designated strongest material appears. Break-In front-loads its
 * best idea at 20-38% depth. Moon-Knight's best audio idea lands at 99% and
 * Shattered Skies' best paragraph at 70-98% — past the point any first-pass
 * reader arrives. The audit's first two recommendations are to surface those,
 * and its instruction on how is explicit: *"a pull quote, not a move."*
 *
 * WHAT IT IS NOT. This is a POINTER, never a second home. It does not own a
 * word: every `quote` below is passed in from the owning section's own content
 * file, by key, and rendered verbatim. Nothing here is written for it, nothing
 * is paraphrased, and the full section is one click away. That keeps the
 * section-ownership map intact — the owning section is still the only place the
 * idea is explained — and follows the map's established pattern for `Own`
 * sections: one canonical home, others point at it in a line.
 *
 * The pull-quote treatment itself is the one already used for the thesis on
 * /moon-knight/engineering: hairline panel, a rule down the leading edge, the
 * display face at reading size.
 */

import Link from "next/link";

export interface Highlight {
  /**
   * The owning section's live kicker, verbatim (e.g. "15 · Score & Audio
   * Design"). Rendered as the eyebrow so a skimmer can see how far down the
   * full thing sits before deciding to jump.
   */
  section: string;
  /** The owning section's title, verbatim. Used as the jump link's label. */
  title: string;
  /** In-page anchor of the owning section. */
  href: string;
  /**
   * One line, passed in from the owning section's content file by key.
   * NEVER a literal typed at the call site — that would be a second copy free
   * to drift from the first.
   */
  quote: string;
}

export default function PageHighlights({
  items,
  accent = "var(--color-gold)",
}: {
  items: readonly Highlight[];
  /** The page's own accent, so the band reads as part of it. */
  accent?: string;
}) {
  return (
    <aside className="ph" aria-label="Start here">
      <p className="mono ph__eyebrow">Start here</p>

      <ul className="ph__list">
        {items.map((item) => (
          <li key={item.href} className="ph__item">
            <p className="mono ph__section">{item.section}</p>
            <p className="ph__quote">{item.quote}</p>
            <Link href={item.href} className="mono ph__jump">
              {item.title} &rarr;
            </Link>
          </li>
        ))}
      </ul>

      <style>{`
        .ph {
          --ph-accent: ${accent};
          --ph-hair: color-mix(in srgb, var(--color-mist) 26%, transparent);
          --ph-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          max-width: 46rem;
        }
        .ph__eyebrow {
          margin: 0 0 1rem;
          font-size: 0.68rem;
          color: var(--ph-quiet);
        }
        .ph__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1px;
          background: var(--ph-hair);
          border: 1px solid var(--ph-hair);
        }
        /* One hairline grid: the gap IS the divider, so a one-item band and a
           two-item band are the same component with no special case. */
        .ph__item {
          background: var(--color-void);
          border-left: 3px solid var(--ph-accent);
          padding: clamp(1.1rem, 3vw, 1.6rem) clamp(1.1rem, 3vw, 1.75rem);
        }
        .ph__section {
          margin: 0;
          font-size: 0.62rem;
          color: var(--ph-quiet);
        }
        .ph__quote {
          margin: 0.7rem 0 0;
          font-family: var(--font-hero);
          font-size: clamp(1.05rem, 0.95rem + 0.6vw, 1.4rem);
          line-height: 1.4;
          color: var(--color-moonlight);
        }
        .ph__jump {
          display: inline-block;
          margin-top: 0.9rem;
          font-size: 0.68rem;
          color: var(--ph-accent);
          border-bottom: 1px solid color-mix(in srgb, var(--ph-accent) 45%, transparent);
          padding-bottom: 2px;
        }
        .ph__jump:hover { border-bottom-color: var(--ph-accent); }
      `}</style>
    </aside>
  );
}
