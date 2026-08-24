import {
  bridge,
  lead,
  metaphor,
  relics,
  relicsLead,
  roleNote,
  textures,
  whoRemains,
} from "@/content/shattered-skies-world";

/**
 * Shattered Skies — the world of Shatterstorm: the setting's soul, placed
 * directly above the planetary dossier, which is its facts.
 *
 * PROSE IS THE LEAD HERE, and that is a decision rather than a shortcut. The
 * planets already have the picture — the orrery and the survey grid are the
 * page's visual for this material — so a second diagram in front of them would
 * compete with the one that has the data. What this section owes the reader is
 * the voice: what the place is, why it is broken, and what the breakage is
 * doing for the story. So it reads as a setting bible, banded so it can be
 * skimmed:
 *
 *   1. THE PREMISE, at lead size. The shattered crust, then the design claim
 *      under it — the ground is not a given.
 *   2. THE ARGUMENT. A shattered world for two shattered peoples. This is the
 *      thesis panel, and it wears the two hosts' colours on its edge because
 *      it is about the two of them.
 *   3. THE LIVING RUINS — four sensory notes, one line each.
 *   4. RELICS OF THE VEYNAR — prose, then five terms as a light glossary.
 *   5. WHO REMAINS — short.
 *   6. THE HANDOVER — one sentence into the dossier below.
 *
 * NO PLANETS. Not a name, not a stat, not a hazard: `PlanetDossier` owns all
 * of that a few hundred pixels further down, and repeating it here would make
 * the reader skim both. The single exception is Zyrium's gloss, which has to
 * say the journey ends at the coldest world for the relic to mean anything —
 * and it says it without naming the planet.
 *
 * The only ornament is a hairline fracture rule, drawn twice. It is
 * `aria-hidden` decoration, and its one animation is gated behind
 * `prefers-reduced-motion: no-preference`.
 *
 * Static server component: no state, no client JavaScript.
 */

/* ---- the fracture rule ---------------------------------------------------
   A crack, not a border. The line steps between four heights across the width
   with three short branches falling off the step points, and the stroke runs
   through a gradient that is transparent at both ends, so it reads as a
   fissure crossing the page rather than a rule that stops. */

const FR_W = 1200;
const FR_H = 44;

const FRACTURE_MAIN =
  "M 0 22 H 118 L 166 12 H 298 L 344 28 H 520 L 566 15 H 758 L 802 30 H 978 L 1022 19 H 1200";

/** Hairlines falling off the step points. Each one is a fracture giving up. */
const FRACTURE_BRANCHES = [
  "M 344 28 L 360 40",
  "M 566 15 L 552 3",
  "M 802 30 L 820 41",
  "M 1022 19 L 1008 8",
];

/** The step points, lit. Staggered so the pulse never reads as a metronome. */
const FRACTURE_NODES = [
  { cx: 344, cy: 28, delay: "0s" },
  { cx: 566, cy: 15, delay: "-2.6s" },
  { cx: 802, cy: 30, delay: "-5.2s" },
];

function FractureRule({ id }: { id: string }) {
  const gradientId = `sw-fracture-${id}`;
  return (
    <svg
      className="sw-fracture"
      viewBox={`0 0 ${FR_W} ${FR_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" className="sw-fracture-end" />
          <stop offset="22%" className="sw-fracture-mid" />
          <stop offset="78%" className="sw-fracture-mid" />
          <stop offset="100%" className="sw-fracture-end" />
        </linearGradient>
      </defs>
      <path className="sw-fracture-line" d={FRACTURE_MAIN} stroke={`url(#${gradientId})`} />
      {FRACTURE_BRANCHES.map((d) => (
        <path key={d} className="sw-fracture-branch" d={d} stroke={`url(#${gradientId})`} />
      ))}
      {FRACTURE_NODES.map((n) => (
        <circle
          key={`${n.cx}-${n.cy}`}
          className="sw-fracture-node"
          cx={n.cx}
          cy={n.cy}
          r={2.2}
          style={{ animationDelay: n.delay }}
        />
      ))}
    </svg>
  );
}

export default function ShatterstormWorld() {
  return (
    <div className="sw">
      {/* The credit is one line, not a panel: this section is my work, and the
          team attribution for the game itself is already up the page. */}
      <p className="mono sw__role">
        <span className="sw__role-mark" aria-hidden="true" />
        <span>
          <strong className="sw__role-name">{roleNote.role}</strong> · {roleNote.body}
        </span>
      </p>

      {/* ---- 1 · the premise ---- */}
      <div className="sw__lead">
        <p className="mono sw__lead-tag">{lead.tag}</p>
        <p className="sw__lead-body">{lead.body}</p>
        <p className="sw__lead-reconcile">{lead.reconcile}</p>
        <p className="sw__lead-note">{lead.note}</p>
      </div>

      <FractureRule id="a" />

      {/* ---- 2 · the argument ---- */}
      <section className="sw__thesis" aria-labelledby="sw-thesis-title">
        <h3 className="sw__thesis-title" id="sw-thesis-title">
          {metaphor.title}
        </h3>
        <p className="sw__thesis-body">{metaphor.body}</p>
        <p className="sw__thesis-note">{metaphor.note}</p>
      </section>

      {/* ---- 3 · the living ruins ---- */}
      <section className="sw__band" aria-labelledby="sw-ruins-title">
        <h3 className="sw__band-title" id="sw-ruins-title">
          The living ruins
        </h3>
        <ul className="sw__textures">
          {textures.map((t) => (
            <li key={t.id} className="sw__texture">
              <p className="mono sw__texture-label">{t.label}</p>
              <p className="sw__texture-body">{t.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- 4 · relics ---- */}
      <section className="sw__band" aria-labelledby="sw-relics-title">
        <h3 className="sw__band-title" id="sw-relics-title">
          Relics of the Veynar
        </h3>
        <p className="sw__band-lead">{relicsLead}</p>
        <dl className="sw__relics">
          {relics.map((r) => (
            <div key={r.id} className="sw__relic">
              <dt className="mono sw__relic-term">{r.term}</dt>
              <dd className="sw__relic-gloss">{r.gloss}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---- 5 · who remains ---- */}
      <section className="sw__band" aria-labelledby="sw-remains-title">
        <h3 className="sw__band-title" id="sw-remains-title">
          {whoRemains.title}
        </h3>
        <p className="sw__band-lead">{whoRemains.body}</p>
      </section>

      <FractureRule id="b" />

      {/* ---- 6 · into the dossier ---- */}
      <p className="sw__bridge">{bridge}</p>

      <style>{`
        .sw {
          /* Same palette discipline as the narrative map: the layout scopes
             the theme, so these are tokens rather than hexes. */
          --sw-cyan: var(--color-nebula, #7ec8d8);
          --sw-warm: var(--color-gold);
          --sw-drayk: var(--color-emerald);
          /* Mist alone is 4.2:1 on the panels. Blended toward moonlight the
             body copy clears AA everywhere it is used: about 8.8:1. */
          --sw-quiet: color-mix(in srgb, var(--color-mist) 50%, var(--color-moonlight));
          --sw-edge: color-mix(in srgb, var(--color-mist) 32%, transparent);
          --sw-panel: color-mix(in srgb, var(--color-nightfall) 62%, var(--color-void));

          display: grid;
          gap: 2.5rem;
        }

        /* ---- the credit line ---- */
        .sw__role {
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          font-size: 0.7rem;
          line-height: 1.6;
          letter-spacing: 0.1em;
          color: var(--sw-quiet);
          max-width: 44rem;
        }
        .sw__role-name {
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sw-cyan);
        }
        .sw__role-mark {
          flex: none;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: var(--sw-cyan);
          transform: translateY(-0.05rem);
        }

        /* ---- 1 · the premise ----
           The one place on the page where the copy runs at lead size. It is
           the world-design idea the rest of the section is elaborating, so it
           gets the weight. */
        .sw__lead { display: grid; gap: 1rem; max-width: 46rem; }
        .sw__lead-tag {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--sw-cyan);
        }
        .sw__lead-body {
          margin: 0;
          font-size: clamp(1.15rem, 1rem + 0.75vw, 1.5rem);
          line-height: 1.6;
          color: var(--color-moonlight);
        }
        /* The name means two things across the project. This says so, once,
           and is set apart so it reads as a gloss rather than as more scene. */
        .sw__lead-reconcile {
          margin: 0;
          padding-left: 1rem;
          border-left: 2px solid var(--sw-warm);
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }
        .sw__lead-note {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--sw-quiet);
        }

        /* ---- 2 · the thesis ----
           The edge carries both hosts' colours, because the claim is about the
           two of them being one thing now. It is the only gradient in the
           section, and it is load-bearing rather than decorative. */
        .sw__thesis {
          position: relative;
          background: var(--sw-panel);
          border: 1px solid var(--sw-edge);
          padding: 1.5rem 1.6rem 1.65rem;
          display: grid;
          gap: 0.85rem;
        }
        .sw__thesis::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--sw-drayk), var(--sw-cyan));
        }
        .sw__thesis-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: clamp(1.2rem, 1rem + 0.7vw, 1.6rem);
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .sw__thesis-body {
          margin: 0;
          max-width: 46rem;
          font-size: 1.02rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }
        .sw__thesis-note {
          margin: 0;
          max-width: 46rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--sw-edge);
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--sw-quiet);
        }

        /* ---- shared band furniture ---- */
        .sw__band { display: grid; gap: 1rem; }
        .sw__band-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-moonlight);
        }
        .sw__band-lead {
          margin: 0;
          max-width: 46rem;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }

        /* ---- 3 · sensory notes ----
           Two columns rather than four: these are sentences, and four columns
           would set them at a width that reads as a table. */
        .sw__textures {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1.25rem 2.5rem;
        }
        @media (min-width: 44rem) {
          .sw__textures { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .sw__texture {
          display: grid;
          gap: 0.35rem;
          padding-top: 0.7rem;
          border-top: 1px solid var(--sw-edge);
          min-width: 0;
        }
        .sw__texture-label {
          margin: 0;
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--sw-cyan);
        }
        .sw__texture-body {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }

        /* ---- 4 · the glossary ----
           Kept light on purpose: a mono term and one line, hung off a hairline
           rail. Prose is the lead in this section and these are footnotes to
           it, not a spec table. */
        .sw__relics {
          margin: 0;
          display: grid;
          gap: 0.9rem;
        }
        @media (min-width: 52rem) {
          .sw__relics { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 2.5rem; }
        }
        .sw__relic {
          display: grid;
          gap: 0.2rem;
          padding-left: 0.9rem;
          border-left: 1px solid var(--sw-edge);
          min-width: 0;
        }
        .sw__relic-term {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--sw-warm);
        }
        .sw__relic-gloss {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--sw-quiet);
        }

        /* ---- the handover ---- */
        .sw__bridge {
          margin: 0;
          max-width: 44rem;
          font-size: 1.02rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }

        /* ---- the fracture rule ----
           Stretched rather than scaled: preserveAspectRatio is none, so the
           crack spans whatever width it is given at a constant height. */
        .sw-fracture {
          display: block;
          width: 100%;
          height: 44px;
        }
        .sw-fracture-line,
        .sw-fracture-branch {
          fill: none;
          vector-effect: non-scaling-stroke;
        }
        .sw-fracture-line { stroke-width: 1.25; }
        .sw-fracture-branch { stroke-width: 1; opacity: 0.55; }
        .sw-fracture-end { stop-color: var(--sw-cyan); stop-opacity: 0; }
        .sw-fracture-mid { stop-color: var(--sw-cyan); stop-opacity: 0.8; }
        .sw-fracture-node { fill: var(--sw-cyan); opacity: 0.7; }

        /* ---- motion ----
           One animation in the section: the lit points along the fracture
           breathe, out of step with each other. Purely decorative — the
           fracture is aria-hidden and nothing depends on it — so reduced
           motion simply gets it still. */
        @media (prefers-reduced-motion: no-preference) {
          .sw-fracture-node { animation: sw-glow 7.8s ease-in-out infinite; }
        }
        @keyframes sw-glow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
