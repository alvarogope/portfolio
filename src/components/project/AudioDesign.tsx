import type { ReactNode } from "react";
import {
  composerCredit,
  instrumentMeanings,
  silenceThesis,
  soundFeedback,
  villageThemes,
} from "@/content/moon-knight-audio";

/**
 * Moon-Knight — audio design, wrapped around the two real recordings.
 *
 * The players are NOT re-implemented here. `MoonKnightAudio` stays exactly as
 * it is and is passed in as `children`, so this component owns the argument and
 * that one owns the audio element, the playback state and the willow. The only
 * thing this file decides about the tracks is where in the argument they sit.
 *
 * THERE ARE NO PLACEHOLDER PLAYERS, AND THERE MUST NEVER BE. Two recordings
 * exist; the village themes, the dungeon piano, the harp figure and the boss
 * themes do not, and they are written as design prose for that reason. Anything
 * added to `moon-knight-audio.ts` is text — if a future entry needs a play
 * button, it needs a recording first.
 *
 * SIX BANDS, and the order is the argument:
 *
 *   1. THE CREDIT. Said once, plainly: I wrote this music. It is the section's
 *      whole reason for existing at this length — a technical designer who also
 *      scored the game is the differentiator, and burying it would waste it.
 *   2. SILENCE. The strongest audio decision in the project is the decision not
 *      to score most of it, so it leads. It also re-frames what follows: the
 *      two tracks below are rare events, not a short soundtrack.
 *   3. THE RECORDINGS — the playable core, sitting immediately after the reason
 *      music is rare, which is the best possible frame for them.
 *   4. THE VILLAGE THEMES. Three safe places, three pieces, decision → why.
 *   5. INSTRUMENTS THAT MEAN SOMETHING. The diegetic half: piano, synths, harp,
 *      boss themes — each headed `context → instrument`, because that pairing
 *      IS the idea and should be readable without the prose under it.
 *   6. SOUND FEEDBACK, kept deliberately short.
 *
 * MOTIFS ARE SHARED. The dungeon piano and the healing harp are marked with an
 * `Echoes` chip naming the section that makes the same point, and the copy is
 * kept phrased to match it — "an instrument this world should not have", "the
 * harp Death gave them" — so the page reads as one argument told twice rather
 * than two descriptions that drifted.
 *
 * A SERVER COMPONENT. No state and no effects; the only transitions are hover
 * hairlines, which reduced-motion turns off.
 */

export default function AudioDesign({ children }: { children: ReactNode }) {
  return (
    <div className="mkm">
      {/* 1 — whose music this is */}
      <aside className="mkm-credit" aria-labelledby="mkm-credit-line">
        <p className="mono mkm-credit-kicker">
          <span className="mkm-credit-mark" aria-hidden="true" />
          {composerCredit.kicker}
        </p>
        <p id="mkm-credit-line" className="mkm-credit-line">
          {composerCredit.line}
        </p>
        <p className="mkm-credit-body">{composerCredit.body}</p>
      </aside>

      {/* 2 — the decision not to score most of the game */}
      <section className="mkm-band">
        <h3 className="mono mkm-band-title">{silenceThesis.kicker}</h3>
        <p className="mkm-thesis">{silenceThesis.line}</p>
        {silenceThesis.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="mkm-thesis-body">
            {paragraph}
          </p>
        ))}
      </section>

      {/* 3 — the two real tracks, untouched */}
      <section className="mkm-band">
        <h3 className="mono mkm-band-title">The recordings</h3>
        <p className="mkm-lede">
          Two finished pieces from the score. Both loop; press either card to play.
        </p>
        <div className="mkm-players">{children}</div>
      </section>

      {/* 4 — the safe places, and the only calm music in the game */}
      <section className="mkm-band">
        <h3 className="mono mkm-band-title">The three village themes</h3>
        <p className="mkm-lede">
          The villages are where the knight is allowed to stop, so they get the only calm music
          in the game — slow, and each one written to tell its own place&apos;s story.
        </p>
        <ul className="mkm-villages">
          {villageThemes.map((v) => (
            <li key={v.id} className="mkm-village">
              <p className="mono mkm-village-tag">{v.instrumentation}</p>
              <h4 className="mkm-village-place">{v.place}</h4>
              <p className="mkm-body">{v.sound}</p>
              <p className="mkm-why">
                <span className="mono mkm-why-key">Why</span>
                {v.why}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 5 — where the instrument itself is the information */}
      <section className="mkm-band">
        <h3 className="mono mkm-band-title">Instruments that mean something</h3>
        <p className="mkm-lede">
          The score is medieval folk almost everywhere. These four are where it deliberately
          stops being that — and each break is telling the player something no line of dialogue
          does.
        </p>
        <ul className="mkm-meanings">
          {instrumentMeanings.map((m) => (
            <li key={m.id} className="mkm-meaning">
              <h4 className="mkm-pair">
                <span className="mkm-pair-context">{m.context}</span>
                <span className="mkm-pair-arrow" aria-hidden="true">
                  →
                </span>
                <span className="mkm-pair-instrument">{m.instrument}</span>
              </h4>
              {m.echo && (
                <p className="mono mkm-echo">
                  <span className="mkm-echo-key">Echoes</span>
                  {m.echo}
                </p>
              )}
              <p className="mkm-body">{m.sound}</p>
              <p className="mkm-why">
                <span className="mono mkm-why-key">Why</span>
                {m.why}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 6 — the effects, kept small on purpose */}
      <section className="mkm-band">
        <h3 className="mono mkm-band-title">{soundFeedback.kicker}</h3>
        <p className="mkm-body mkm-body--wide">{soundFeedback.line}</p>
        <ul className="mkm-actions">
          {soundFeedback.actions.map((a) => (
            <li key={a} className="mono mkm-action">
              {a}
            </li>
          ))}
        </ul>
        <p className="mkm-why">
          <span className="mono mkm-why-key">Why</span>
          {soundFeedback.why}
        </p>
      </section>

      <style>{`
        .mkm {
          /* The same lifted steel the other Moon-Knight bands use: --color-mist
             is 4.41:1 on the panel and this is 6.3:1, so every quiet label in
             here clears AA as text. */
          --mkm-quiet: #93A0B3;
          --mkm-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
          --mkm-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);

          display: grid;
          gap: 2.5rem;
        }

        .mkm-band { display: grid; gap: 1rem; }
        .mkm-band-title {
          margin: 0;
          font-size: 0.68rem;
          color: var(--color-gold);
          padding-bottom: 0.55rem;
          border-bottom: 1px solid var(--mkm-hair);
        }

        /* ---- 1 · the credit ----
           Gold and framed, because it is the one line on the page where I am
           claiming authorship of something rather than explaining a system. */
        .mkm-credit {
          border: 1px solid color-mix(in srgb, var(--color-gold) 34%, transparent);
          border-left: 3px solid color-mix(in srgb, var(--color-gold) 62%, transparent);
          background:
            linear-gradient(
              110deg,
              color-mix(in srgb, var(--color-gold) 6%, transparent),
              transparent 58%
            ),
            var(--color-nightfall);
          padding: 1.2rem 1.3rem 1.3rem;
        }
        .mkm-credit-kicker {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-gold);
        }
        /* A small gold lozenge — a note head, tipped. */
        .mkm-credit-mark {
          width: 0.5rem;
          height: 0.36rem;
          background: var(--color-gold);
          border-radius: 50%;
          transform: rotate(-20deg);
          flex: 0 0 auto;
        }
        .mkm-credit-line {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: clamp(1.05rem, 0.95rem + 0.45vw, 1.3rem);
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0.55rem 0 0;
          color: var(--color-moonlight);
        }
        .mkm-credit-body {
          margin: 0.55rem 0 0;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--color-silver);
          max-width: 46rem;
        }

        /* ---- 2 · silence ----
           The loudest thing in the section is set at display size, which is the
           joke and also the point. */
        .mkm-thesis {
          margin: 0.2rem 0 0;
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.7rem);
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: 0.01em;
          color: var(--color-moonlight);
          max-width: 34ch;
        }
        .mkm-thesis-body {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-silver);
          max-width: 46rem;
        }
        .mkm-lede {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--mkm-quiet);
          max-width: 46rem;
        }

        /* ---- 3 · the players ----
           A slot, nothing more. The cards bring their own grid, their own tints
           and their own motion; this only gives them air. */
        .mkm-players { margin-top: 0.4rem; }

        /* ---- shared prose ---- */
        .mkm-body {
          margin: 0.3rem 0 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }
        .mkm-body--wide { max-width: 46rem; }

        /* The reasoning, marked everywhere it appears — skimming only the gold
           "Why" labels down the section should still deliver the argument. */
        .mkm-why {
          margin: 0.7rem 0 0;
          padding-left: 0.85rem;
          border-left: 1px solid var(--mkm-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-silver);
          max-width: 46rem;
        }
        .mkm-why-key {
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        /* ---- 4 · the villages ----
           Three columns of equal weight: they are three answers to the same
           brief, and ranking them would imply one is the real one. */
        .mkm-villages,
        .mkm-meanings {
          list-style: none;
          margin: 0.2rem 0 0;
          padding: 0;
          display: grid;
          gap: 1px;
          background: var(--mkm-edge);
          border: 1px solid var(--mkm-edge);
        }
        .mkm-villages { grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); }
        .mkm-village,
        .mkm-meaning {
          background: var(--color-nightfall);
          padding: 1.15rem 1.15rem 1.25rem;
          display: grid;
          align-content: start;
          gap: 0.15rem;
          min-width: 0;
          border-top: 2px solid transparent;
          transition: border-top-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mkm-village:hover,
        .mkm-meaning:hover { border-top-color: var(--mkm-hair); }

        .mkm-village-tag {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-silver);
        }
        .mkm-village-place {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0.2rem 0 0;
          color: var(--color-moonlight);
        }

        /* ---- 5 · instruments that mean something ----
           "context → instrument" is the whole idea, so it is the heading and it
           is built to survive being the only thing read. */
        /* TWO COLUMNS, NOT auto-fit. There are exactly four of these, and
           auto-fit at a 21rem minimum fits three across a normal desktop —
           which left the fourth alone on its own row, reading as an
           afterthought rather than the fourth of four. Fixed at two so the
           set always lands as a square, and the wider column suits cards this
           text-heavy better than three cramped ones did. */
        .mkm-meanings { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .mkm-pair {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.5rem;
          margin: 0;
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .mkm-pair-context { color: var(--color-silver); }
        .mkm-pair-arrow { color: var(--color-gold); font-size: 0.9rem; }

        .mkm-echo {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.4rem;
          margin: 0.35rem 0 0;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--mkm-quiet);
        }
        .mkm-echo-key { color: var(--color-gold); }

        /* ---- 6 · sound feedback ---- */
        .mkm-actions {
          list-style: none;
          margin: 0.9rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .mkm-action {
          padding: 0.32rem 0.6rem;
          border: 1px solid var(--mkm-edge);
          background: color-mix(in srgb, var(--color-nightfall) 70%, transparent);
          font-size: 0.70rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-silver);
        }

        /* Two columns need roughly 21rem each to hold a line of this prose;
           below that the square becomes a single file rather than two columns
           too narrow to read. */
        @media (max-width: 760px) {
          .mkm-meanings { grid-template-columns: minmax(0, 1fr); }
        }

        @media (max-width: 520px) {
          .mkm-credit { padding: 1rem 1.05rem 1.1rem; }
          .mkm-village,
          .mkm-meaning { padding: 1rem 1rem 1.1rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mkm-village,
          .mkm-meaning { transition: none; }
        }
      `}</style>
    </div>
  );
}
