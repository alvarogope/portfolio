/**
 * "This figure does something." One chip, said the same way everywhere.
 *
 * WHY IT EXISTS. This portfolio's strongest sections are diagrams you operate
 * — the world map, the beat chart, the quantum sigil, the controller map, the
 * role graph. A recruiter gives a page a minute and does not go hunting for
 * hotspots, so a figure whose interactivity is only discoverable BY HOVERING
 * is, for most readers, a static picture. Each of those components had grown
 * its own quiet one-line hint in its own words, its own size and its own
 * place — which is four different ways of saying one thing, and none of them
 * loud enough.
 *
 * WHAT IT IS. A single chip, placed ABOVE the figure it describes rather than
 * under it, because an instruction that arrives after the thing it explains
 * has already been skipped. Gold ring, gold pointer glyph, and the verbs in
 * the order a reader will try them: point, tap, tab.
 *
 * IT IS NOT THE ONLY AFFORDANCE. Telling someone a figure is interactive does
 * not excuse a figure that looks inert — every one of these components also
 * carries a resting visual state on its targets (a ring on a disc, a lit pin,
 * an underlined cell) so the chip confirms what the drawing already suggests.
 * The chip is the second half of that pair, never the whole of it.
 *
 * `what` names the target in the figure's own vocabulary — "sigil", "disc",
 * "level", "control" — so the instruction is about the picture in front of the
 * reader rather than about a generic widget.
 *
 * TWO MODES, BECAUSE THERE ARE TWO KINDS OF FIGURE ON THIS SITE.
 *
 *   · `select` (the default) — the figure has TARGETS you pick: a sigil, a
 *     disc, a level, a world. Point, tap, tab.
 *   · `pan` — the figure has no targets at all. It is a wide drawing in a
 *     focusable, horizontally scrollable frame: the narrative map, the
 *     telepathy flow, the three asymmetry schematics. The only thing you can
 *     do to it is move it.
 *
 * The mode exists so the chip can go on a pannable drawing HONESTLY. Those
 * figures had each grown their own quiet one-line note in their own words —
 * "scrolls horizontally", "the drawing scrolls sideways on narrow screens" —
 * which is the same fragmentation this component was built to end. But telling
 * a reader to "point at or tap any diagram" when nothing in it responds is
 * worse than saying nothing: it sends them hunting for hotspots that do not
 * exist, and it teaches them to distrust the chip on the figures where the
 * hotspots are real. So `pan` says what is actually true — drag it, scroll it,
 * or tab to it and use the arrow keys — and the chip stays trustworthy.
 *
 * A STATIC FIGURE STILL GETS NO CHIP. `pan` is not a licence to label
 * everything; it is for frames that genuinely scroll and genuinely take focus.
 */
export default function InteractiveHint({
  what,
  /** What happens when they do. One short clause, no full stop. */
  does,
  mode = "select",
}: {
  what: string;
  does: string;
  mode?: "select" | "pan";
}) {
  return (
    <p className="ih">
      <span className="ih-glyph" aria-hidden="true">
        {/* A cursor arrow with a tap ripple: the one picture that reads as
            "you can touch this" at 14px in both themes. */}
        <svg viewBox="0 0 16 16" width="12" height="12" focusable="false">
          <path
            d="M3 1.6 12.2 8 7.8 8.9 6.2 13.4Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="mono ih-lead">Interactive</span>
      <span className="ih-body">
        {mode === "pan"
          ? `Drag, scroll or tab to the ${what} and use the arrow keys — ${does}`
          : `Point at, tap or tab any ${what} — ${does}`}
      </span>

      <style>{`
        .ih {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.45rem 0.6rem;
          margin: 0 0 1.1rem;
          padding: 0.4rem 0.8rem 0.42rem;
          border: 1px solid color-mix(in srgb, var(--color-gold) 45%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-gold) 7%, transparent);
          line-height: 1.5;
        }
        .ih-glyph {
          display: inline-grid;
          place-items: center;
          color: var(--color-gold);
        }
        .ih-lead {
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-gold);
        }
        .ih-body {
          font-size: 0.82rem;
          /* Lifted steel rather than --color-mist, which is 4.41:1 on this
             ground and under the AA bar for small type. This is 6.3:1. */
          color: #93A0B3;
        }
      `}</style>
    </p>
  );
}
