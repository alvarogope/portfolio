import Link from "next/link";
import { chapterHref, type Chapter } from "@/content/project-chapters";

/**
 * The horizontal chapter index, directly under a project hero.
 *
 * WHY THIS SHAPE. A project page is long and its best material — the level
 * design, the score, the screenshots — used to be invisible until you had
 * scrolled past it. This is the page stating its own contents in one screen,
 * before the first argument starts.
 *
 * It is a table of contents and nothing more. Each tile carries the section's
 * own title and a six-word label, never an explanation — the section below is
 * still the only place its idea is made. See `project-chapters.ts` for the
 * rule and `docs/section-ownership-map.md` § "Pointers are not owners".
 *
 * EVERY TILE GOES DOWN THIS PAGE. It listed the project's subpages too, and
 * that was a mistake twice over: they are already in the hero's links block a
 * few inches above and in the `ProjectNav` at the foot, and a tile that left
 * the page was indistinguishable at a glance from one that scrolled. One row,
 * one promise — `↓`, always.
 */
export default function ChapterNav({
  chapters,
  label = "Chapters on this page",
}: {
  chapters: readonly Chapter[];
  /** The accessible name. Only worth overriding on a page that has two. */
  label?: string;
}) {
  return (
    <nav aria-label={label} className="chn">
      <p className="mono chn__lead">
        <span className="chn__lead-key">Click here for</span>
        <span className="chn__lead-body">
          any chapter of this project — it jumps straight to it
        </span>
      </p>

      <ol className="chn__list">
        {chapters.map((c, i) => (
          <li key={c.id} className="chn__item">
            <Link className="chn__tile" href={chapterHref(c)}>
              <span className="mono chn__index">{String(i + 1).padStart(2, "0")}</span>
              <span className="chn__title">{c.title}</span>
              <span className="chn__note">{c.note}</span>
              {/* The "click here" cue is on the block lead above, once, and not
                  on every tile: a grid where each cell shouts the same three
                  words stops being read at about the third one. */}
              <span className="mono chn__go">
                Jump to it
                <span aria-hidden="true" className="chn__arrow">
                  ↓
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <style>{`
        /* The rule is the seam under the hero, so the space above it is thin
           and the space below it separates the index from the first section. */
        .chn {
          margin: 0 0 2.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid color-mix(in srgb, var(--color-mist) 22%, transparent);
        }

        .chn__lead {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.4rem 0.7rem;
          margin: 0 0 1.1rem;
        }
        .chn__lead-key {
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-gold);
        }
        .chn__lead-body {
          font-size: 0.8rem;
          /* Lifted steel rather than --color-mist, which is 4.41:1 on this
             ground and under the AA bar for small type. This is 6.3:1. */
          color: #93A0B3;
        }

        /* Horizontal by default, and it WRAPS rather than scrolling: a row you
           have to drag sideways hides exactly the chapters this block exists to
           reveal. Tiles are a fixed minimum so they stay scannable, and the
           whole thing collapses to one column on a phone. */
        .chn__list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(13.5rem, 1fr));
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .chn__item { display: contents; }

        .chn__tile {
          display: grid;
          align-content: start;
          gap: 0.3rem;
          height: 100%;
          padding: 0.85rem 0.9rem 0.75rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 24%, transparent);
          background: color-mix(in srgb, var(--color-nightfall) 55%, transparent);
          color: inherit;
          text-decoration: none;
          transition: border-color 200ms ease, background-color 200ms ease;
        }
        .chn__tile:hover,
        .chn__tile:focus-visible {
          border-color: color-mix(in srgb, var(--color-gold) 65%, transparent);
          background: color-mix(in srgb, var(--color-nightfall) 90%, transparent);
        }
        .chn__tile:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }

        .chn__index {
          font-size: 0.66rem;
          letter-spacing: 0.16em;
          color: var(--color-gold);
        }

        .chn__title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          line-height: 1.25;
          color: var(--color-moonlight);
        }
        .chn__note {
          font-size: 0.76rem;
          line-height: 1.45;
          color: #93A0B3;
        }

        .chn__go {
          margin-top: 0.35rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.63rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--color-gold);
        }
        .chn__arrow { transition: transform 200ms ease; }
        .chn__tile:hover .chn__arrow,
        .chn__tile:focus-visible .chn__arrow { transform: translateY(2px); }

        @media (max-width: 560px) {
          .chn__list { grid-template-columns: minmax(0, 1fr); }
        }

        @media (prefers-reduced-motion: reduce) {
          .chn__tile, .chn__arrow { transition: none; }
          .chn__tile:hover .chn__arrow,
          .chn__tile:focus-visible .chn__arrow { transform: none; }
        }
      `}</style>
    </nav>
  );
}
