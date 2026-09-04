/**
 * OpeningStatement — the project's strongest line, said first.
 *
 * WHY THIS EXISTS. The reading-load audit measured "time-to-best-point" on
 * every page: the cumulative word count a reader passes before the ownership
 * map's own designated strongest material appears. Moon-Knight's best audio
 * idea lands at 99% depth and Shattered Skies' best paragraph at 70-98% — past
 * where any first-pass reader stops. The audit's instruction was explicit:
 * *"a pull quote, not a move."*
 *
 * WHAT IT IS NOT. This is a POINTER, never a second home. It does not own a
 * word: every `quote` is passed in from the owning section's own content file,
 * BY KEY, and rendered verbatim. Nothing here is written for it, nothing is
 * paraphrased, and the owning section is one click away. That keeps the
 * section-ownership map intact — the owning section is still the only place
 * the idea is explained.
 *
 * WHY IT NO LONGER LOOKS LIKE A WIDGET. The first version of this was a boxed
 * list under a "Start here" label: a hairline panel, one bordered row per
 * quote, a small eyebrow on top. That reads as site furniture — a nav aid
 * bolted above the article — and a reader skims past furniture. It also said
 * the wrong thing about the material: these are the best lines on the page,
 * and presenting them as a table of contents entry made them look like
 * signposting rather than argument.
 *
 * So the label is gone and the box is gone. What is left is the line itself at
 * display size, immediately after the hero, where a magazine would put a
 * standfirst: this is what the project is about. The jump link survives, but
 * demoted to a quiet credit UNDER the quote, where it reads as an attribution
 * ("this is from §08, and §08 is where it is explained") rather than as a
 * button. Same mechanism, same verbatim text, same anchors — presentation only.
 */

import Link from "next/link";

export interface Highlight {
  /**
   * The owning section's live kicker, verbatim (e.g. "15 · Score & Audio
   * Design"). Rendered as the attribution so a reader can see where the full
   * thing lives before deciding to jump.
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

export default function OpeningStatement({
  items,
  accent = "var(--color-gold)",
}: {
  items: readonly Highlight[];
  /** The page's own accent, so the statement reads as part of it. */
  accent?: string;
}) {
  return (
    <div className="os">
      {items.map((item) => (
        <figure key={item.href} className="os__item">
          <blockquote className="os__quote">
            <p className="os__line">{item.quote}</p>
          </blockquote>
          <figcaption>
            <Link href={item.href} className="os__jump">
              <span className="mono os__section">{item.section}</span>
              <span className="os__title">
                {item.title} <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          </figcaption>
        </figure>
      ))}

      <style>{`
        .os {
          --os-accent: ${accent};
          --os-quiet: var(--color-silver);
          display: grid;
          gap: clamp(2.25rem, 5vw, 3.25rem);
          /* No panel, no border, no fill. The statement is type on the page
             ground — the moment it gets a box it reads as a widget again. */
        }

        .os__item {
          margin: 0;
          /* A short rule above the line instead of a frame around it: enough
             to mark where the voice changes, not enough to build a container.
             A border-top on a max-content-width box would run the full column,
             so the rule is drawn as a pseudo-element at a fixed length. */
          position: relative;
          padding-top: 1.5rem;
        }
        .os__item::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 3.25rem;
          height: 2px;
          background: var(--os-accent);
        }

        .os__quote { margin: 0; }
        .os__line {
          margin: 0;
          font-family: var(--font-hero);
          /* Display size, not body size. This is the one place on the page
             where a sentence is allowed to be the largest thing on screen. */
          font-size: clamp(1.5rem, 1.15rem + 1.5vw, 2.35rem);
          line-height: 1.32;
          letter-spacing: -0.005em;
          color: var(--color-moonlight);
          /* Shorter measure than body prose: at display size the eye needs
             fewer characters per line, not more. */
          max-width: 24em;
          text-wrap: balance;
        }

        /* The attribution. Deliberately small and quiet — it is a credit line
           under a pull quote, not a call to action. */
        .os__jump {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.55rem;
          margin-top: 1.1rem;
          border-bottom: 1px solid transparent;
          padding-bottom: 2px;
        }
        .os__section {
          font-size: 0.7rem;
          color: var(--os-quiet);
        }
        .os__title {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-style: italic;
          color: color-mix(in srgb, var(--os-accent) 82%, var(--color-moonlight));
        }
        .os__jump:hover .os__title,
        .os__jump:focus-visible .os__title {
          color: var(--color-moonlight);
        }
        .os__jump:hover {
          border-bottom-color: color-mix(in srgb, var(--os-accent) 55%, transparent);
        }

        @media (max-width: 640px) {
          .os__line { max-width: none; }
        }
      `}</style>
    </div>
  );
}
