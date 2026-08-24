import {
  conceptTag,
  expansions,
  expansionsFraming,
} from "@/content/moon-knight-expansions";

/**
 * Moon-Knight — two expansion concepts, kept deliberately small.
 *
 * The page's "and beyond": proof that the world and its systems keep giving,
 * placed after the beat chart has finished planning the four levels that exist.
 * Two panels and a framing line, and that is the whole section — these are
 * premises, not built content, and a section that looked as substantial as the
 * pillars above it would be claiming otherwise.
 *
 * WORLDBUILDING, NOT A PLAN TO SHIP. Every card is stamped `Concept`, the
 * framing says "neither of these is built" in its first four words, and there
 * is no roadmap, no ordering, no achievements and nothing resembling a
 * commercial argument anywhere in the section. The Roman numerals are labels,
 * not a release order.
 *
 * THE MECHANIC IS THE POINT, so it is the loudest thing on each card after the
 * title, and it is drawn in the grammar section 03 already taught the reader:
 * a gold left rule with the quantum basis beside it, exactly as `AbilityCard`
 * annotates its abilities. A reader who saw those cards should recognise this
 * one as the same kind of statement and know to read it back up the page.
 *
 * EACH CARD IS AN ARGUMENT IN TWO LINES. The hook is the story; the `Why` line
 * under the rule is why the story counts as evidence. Someone skimming only
 * the titles, the mechanic chips and the gold `Why` labels should still leave
 * with the section's claim intact, which is the same skim contract the
 * diegetic and jousting sections keep.
 *
 * A server component. Nothing here has state, and nothing moves except a
 * hover hairline that reduced-motion turns off.
 */
export default function Expansions() {
  return (
    <div className="ex">
      <p className="ex-framing">{expansionsFraming}</p>

      <ul className="ex-list">
        {expansions.map((x) => (
          <li key={x.id} className="panel ex-card">
            <p className="mono ex-kicker">
              <span className="ex-kicker-label">{x.label}</span>
              <span className="ex-tag">{conceptTag}</span>
            </p>

            <h4 className="ex-title">{x.title}</h4>

            {/* The provenance, in section 03's own notation. */}
            <p className="ex-mechanic">
              <span className="mono ex-mechanic-key">Extends</span>
              <span className="ex-mechanic-name">{x.mechanic}</span>
              <span className="mono ex-mechanic-note">{x.mechanicNote}</span>
            </p>

            <p className="ex-hook">{x.hook}</p>

            <p className="ex-why">
              <span className="mono ex-why-key">Why</span>
              {x.designPoint}
            </p>
          </li>
        ))}
      </ul>

      <style>{`
        .ex {
          /* The page's established inks. --ex-quiet is 6.3:1 on the panel,
             where --color-mist is 4.41:1 — small mono labels use the lift so
             every one of them clears AA as text rather than sitting on it. */
          --ex-quiet: #93A0B3;
          --ex-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
          --ex-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);

          display: grid;
          gap: 1.5rem;
        }

        .ex-framing {
          margin: 0;
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-moonlight);
          max-width: 46rem;
        }

        /* Two panels while a panel can carry its own paragraph, then stacked.
           Never three-up: there are two of these and there should look like
           there are two of these. */
        .ex-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.1rem;
        }
        .ex-card {
          border: 1px solid var(--ex-edge);
          border-top: 2px solid color-mix(in srgb, var(--color-silver) 45%, transparent);
          padding: 1.15rem 1.2rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 0;
          transition: border-top-color 220ms ease;
        }
        .ex-card:hover {
          border-top-color: color-mix(in srgb, var(--color-silver) 78%, transparent);
        }

        .ex-kicker {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          font-size: 0.62rem;
        }
        .ex-kicker-label {
          color: var(--color-gold);
          letter-spacing: 0.08em;
        }
        /* Stamped on every card rather than said once at the top: the framing
           line is skippable and this is not. */
        .ex-tag {
          flex: 0 0 auto;
          padding: 0.1rem 0.4rem;
          font-size: 0.53rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ex-quiet);
          border: 1px solid var(--ex-edge);
        }

        .ex-title {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin: 0.1rem 0 0;
          color: var(--color-moonlight);
        }

        /* AbilityCard's annotation grammar — a gold left rule against the
           quantum basis — so the cross-reference is recognisable as one. */
        .ex-mechanic {
          margin: 0.3rem 0 0.2rem;
          padding: 0.1rem 0 0.15rem 0.7rem;
          border-left: 2px solid var(--color-gold);
          display: grid;
          gap: 0.1rem;
        }
        .ex-mechanic-key {
          font-size: 0.55rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-gold);
        }
        .ex-mechanic-name {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-silver);
        }
        .ex-mechanic-note {
          font-size: 0.6rem;
          line-height: 1.5;
          color: var(--ex-quiet);
        }

        .ex-hook {
          margin: 0.35rem 0 0;
          font-family: var(--font-body);
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }

        /* The rule is what separates the story from the reasoning, and the
           gold key is the skim path through the whole section. */
        .ex-why {
          margin: 0.6rem 0 0;
          padding-top: 0.85rem;
          border-top: 1px solid var(--ex-hair);
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-silver);
        }
        .ex-why-key {
          display: block;
          margin-bottom: 0.3rem;
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        @media (max-width: 820px) {
          .ex-list { grid-template-columns: minmax(0, 1fr); }
          .ex-card { padding: 1.05rem 1.05rem 1.15rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ex-card { transition: none; }
        }
      `}</style>
    </div>
  );
}
