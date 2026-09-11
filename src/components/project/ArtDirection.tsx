import {
  artThesis,
  palette,
  paletteNote,
  sublimeTranslations,
  visualDecisions,
  type SublimeTranslation,
} from "@/content/moon-knight-art";

function TranslationCard({ item }: { item: SublimeTranslation }) {
  return (
    <li className={`mka-move${item.key ? " is-key" : ""}`}>
      <p className="mono mka-move-head">
        <span className="mka-move-tag">{item.tag}</span>
        {item.crossover && <span className="mka-move-chip">{item.crossover}</span>}
      </p>
      <h4 className="mka-move-title">{item.title}</h4>
      <p className="mka-move-body">{item.decision}</p>
      <p className="mka-why">
        <span className="mono mka-why-key">Why</span>
        {item.why}
      </p>
    </li>
  );
}

export default function ArtDirection({
  variant = "full",
}: {
  variant?: "full" | "short";
}) {
  const short = variant === "short";

  return (
    <div className="mka">
      {/* 1 — the thesis */}
      <section className="mka-band mka-band--thesis">
        <h3 className="mono mka-band-title">{artThesis.kicker}</h3>
        <p className="mka-thesis">{artThesis.line}</p>
        {!short &&
          artThesis.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="mka-thesis-body">
              {paragraph}
            </p>
          ))}
      </section>

      {/* 2 — what the principle decides. Deep dive only: the translation
         moves, darkness included, are owned by /moon-knight/world. */}
      {!short && (
        <section className="mka-band">
          <h3 className="mono mka-band-title">How the Sublime works in the design</h3>
          <ol className="mka-moves">
            {sublimeTranslations.map((item) => (
              <TranslationCard key={item.id} item={item} />
            ))}
          </ol>
        </section>
      )}

      {/* 3 — the one visual. Deep dive only, next to the moves it explains. */}
      {!short && (
        <section className="mka-band">
          <h3 className="mono mka-band-title">The palette</h3>
          <div className="mka-frame">
            <ul className="mka-swatches">
              {palette.map((c) => (
                <li key={c.hex} className="mka-swatch">
                  <span
                    className="mka-chip"
                    style={{ background: c.hex }}
                    aria-hidden="true"
                  />
                  <span className="mono mka-hex">{c.hex}</span>
                  <span className="mka-swatch-name">{c.name}</span>
                  <span className="mka-swatch-role">{c.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mka-lede">{paletteNote}</p>
        </section>
      )}

      {/* 4 — framing and composition, decision */}
      {!short && (
        <section className="mka-band">
          <h3 className="mono mka-band-title">Visual Decisions</h3>
          <dl className="mka-decisions">
            {visualDecisions.map((d) => (
              <div key={d.id} className="mka-decision">
                <dt className="mka-decision-name">{d.decision}</dt>
                <dd className="mka-decision-why">
                  <span className="mono mka-why-key">Why</span>
                  {d.why}
                  {d.pillars && (
                    <span className="mka-pillars">
                      {d.pillars.map((p) => (
                        <span key={p.subject} className="mka-pillar">
                          <span className="mka-pillar-subject">{p.subject}</span>
                          <span className="mono mka-pillar-stands">{p.stands}</span>
                        </span>
                      ))}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <style>{`
        .mka {
          /* Same lifted steel the narrative and diegetic bands use: --color-mist
             is 4.41:1 on the panel and this is 6.3:1, so every quiet label in
             here clears AA as text. */
          --mka-quiet: #93A0B3;
          --mka-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
          --mka-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);

          display: grid;
          gap: 2.5rem;
        }

        .mka-band { display: grid; gap: 1rem; }
        .mka-band-title {
          margin: 0;
          font-size: 0.68rem;
          color: var(--color-gold);
          padding-bottom: 0.55rem;
          border-bottom: 1px solid var(--mka-hair);
        }

        /* ---- 1 · the thesis ----
           The Sublime, once, at display size. A reader who stops after this one
           line should still have the principle. */
        .mka-thesis {
          margin: 0.2rem 0 0;
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.7rem);
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: 0.01em;
          color: var(--color-moonlight);
          max-width: 34ch;
        }
        .mka-thesis-body {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-silver);
          max-width: 46rem;
        }
        .mka-lede {
          margin: 0.2rem 0 0;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--mka-quiet);
          max-width: 46rem;
        }

        /* ---- 2 · the translation ----
           A single column, not a card grid: these are four steps of one
           argument and they are meant to be read down, in order. The numbers
           carry that; the hairline between them is the only furniture. */
        .mka-moves {
          list-style: none;
          margin: 0.2rem 0 0;
          padding: 0;
          display: grid;
          gap: 1.6rem;
        }
        .mka-move {
          display: grid;
          gap: 0.3rem;
          padding-left: 1rem;
          border-left: 1px solid var(--mka-edge);
          min-width: 0;
          transition: border-left-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mka-move:hover { border-left-color: var(--mka-hair); }

        /* The one entry where the aesthetic becomes a rule. Gold, framed, and
           lit from the left, so a reader skimming the section cannot miss the
           place where the argument stops being about looks. */
        .mka-move.is-key {
          border-left-width: 3px;
          border-left-color: color-mix(in srgb, var(--color-gold) 62%, transparent);
          background: linear-gradient(
            100deg,
            color-mix(in srgb, var(--color-gold) 6%, transparent),
            transparent 58%
          );
          padding: 1rem 1.15rem 1.15rem;
        }
        .mka-move.is-key:hover { border-left-color: var(--color-gold); }

        .mka-move-head {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.45rem;
          margin: 0;
          font-size: 0.70rem;
        }
        .mka-move-tag {
          color: var(--color-silver);
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .mka-move-chip {
          padding: 0.1rem 0.45rem;
          border: 1px solid color-mix(in srgb, var(--color-gold) 55%, transparent);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        .mka-move-title {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0.15rem 0 0;
          color: var(--color-moonlight);
        }
        .mka-move.is-key .mka-move-title { font-size: 1.2rem; }
        .mka-move-body {
          margin: 0.3rem 0 0;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--color-moonlight);
          max-width: 46rem;
        }

        /* The reasoning, marked everywhere it appears. Skimming only the gold
           "Why" labels down the section should still deliver the argument. */
        .mka-why {
          margin: 0.7rem 0 0;
          padding-left: 0.85rem;
          border-left: 1px solid var(--mka-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-silver);
          max-width: 46rem;
        }
        .mka-why-key {
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        /* ---- 3 · the palette ----
           Gothic frame: a steel hairline with an inset rule and four corner
           ticks, the same reliquary treatment the rest of the page gives to a
           thing being displayed rather than read. */
        .mka-frame {
          position: relative;
          margin-top: 0.3rem;
          padding: 1.35rem 1.35rem 1.45rem;
          border: 1px solid var(--mka-edge);
          background:
            linear-gradient(
              160deg,
              color-mix(in srgb, var(--color-silver) 4%, transparent),
              transparent 46%
            ),
            var(--color-nightfall);
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-void) 60%, transparent);
        }
        /* The ticks: one gold L in each corner, drawn as two gradients per
           pseudo-element so no extra markup is needed. */
        .mka-frame::before,
        .mka-frame::after {
          content: "";
          position: absolute;
          width: 0.85rem;
          height: 0.85rem;
          border-color: color-mix(in srgb, var(--color-gold) 55%, transparent);
          border-style: solid;
          pointer-events: none;
        }
        .mka-frame::before {
          top: -1px;
          left: -1px;
          border-width: 1px 0 0 1px;
        }
        .mka-frame::after {
          right: -1px;
          bottom: -1px;
          border-width: 0 1px 1px 0;
        }

        .mka-swatches {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 8.5rem), 1fr));
          gap: 1.25rem 1rem;
        }
        .mka-swatch {
          display: grid;
          align-content: start;
          gap: 0.1rem;
          min-width: 0;
        }
        /* The block is the game's real ink, so it gets a silver hairline and an
           inset void ring: #001021 against the page's own void would otherwise
           be a rectangle nobody can see. */
        .mka-chip {
          display: block;
          height: 4.25rem;
          margin-bottom: 0.6rem;
          border: 1px solid color-mix(in srgb, var(--color-silver) 38%, transparent);
          box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--color-void) 45%, transparent);
        }
        .mka-hex {
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: var(--color-moonlight);
        }
        .mka-swatch-name {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
          margin-top: 0.15rem;
        }
        .mka-swatch-role {
          font-family: var(--font-body);
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--mka-quiet);
        }

        /* ---- 4 · framing decisions ---- */
        .mka-decisions {
          margin: 0.3rem 0 0;
          display: grid;
          gap: 1.5rem;
        }
        .mka-decision { min-width: 0; }
        .mka-decision-name {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .mka-decision-why {
          margin: 0.45rem 0 0;
          padding-left: 0.85rem;
          border-left: 1px solid var(--mka-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-silver);
          max-width: 46rem;
        }

        /* The three pillars the opening image frames. Named on the page so the
           claim — one image states what the game is about — is checkable. */
        .mka-pillars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
          gap: 0.6rem 1rem;
          margin-top: 0.85rem;
        }
        .mka-pillar {
          display: grid;
          gap: 0.15rem;
          padding: 0.5rem 0.7rem;
          border: 1px solid var(--mka-edge);
          background: color-mix(in srgb, var(--color-nightfall) 70%, transparent);
          min-width: 0;
        }
        .mka-pillar-subject {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--color-moonlight);
        }
        .mka-pillar-stands {
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        /* ---- responsive ----
           Two swatches across is the floor: below that the blocks stop reading
           as a strip and start reading as four unrelated rectangles. */
        @media (max-width: 520px) {
          .mka-swatches { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .mka-frame { padding: 1.1rem; }
          .mka-move.is-key { padding: 0.85rem 0.9rem 1rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mka-move { transition: none; }
        }
      `}</style>
    </div>
  );
}
