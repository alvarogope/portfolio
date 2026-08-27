import {
  coreCombat,
  diegeticMechanics,
  diegeticThesis,
  invisibleDesign,
  moonHudStates,
  type DiegeticGlyph,
  type DiegeticMechanic,
} from "@/content/moon-knight-diegetic";
import { HarpMark, ROSE_INNER, ROSE_PETAL, ROSE_PETAL_INNER, ROSE_PETALS } from "./CastEmblems";
import { MoonPhaseGlyph } from "./MoonPhaseGlyph";

/**
 * Moon-Knight — diegetic design: the mechanics that hide in the world.
 *
 * The thesis of the project and the thing this whole page is arguing, so the
 * section is built to be READ AS AN ARGUMENT rather than browsed as a feature
 * list. Five bands, in the order the case is made:
 *
 *   1. THE THESIS. One line. Everything under it is evidence.
 *   2. THE MOON HUD, with the phase strip as the headline visual — full, half,
 *      new, running silver to scarlet. It is the fastest possible statement of
 *      the idea: that is a health bar, and it is also the moon.
 *   3. THREE MORE. Roses, sword, harp — XP, navigation and healing, each an
 *      object instead of a menu.
 *   4. INVISIBLE DESIGN. Four decisions the player never sees, where the
 *      reasoning IS the content, so they render as decision → why.
 *   5. CORE COMBAT, kept deliberately small and last.
 *
 * EVERY MECHANIC SHOWS ITS REASONING. The `Why` line is marked in every card,
 * because a reader skimming only the gold `Why` labels should still finish the
 * section with the argument. Prose-led on purpose: the emblems are punctuation
 * at 1.6–2rem, never diagrams, and the one thing allowed to be big is the moon
 * strip.
 *
 * NOTHING HERE MOVES. No state, no effects — a server component, and the only
 * transition in the file is a hover hairline that reduced-motion turns off.
 *
 * MOTIFS ARE SHARED, NOT COPIED. The moon comes from `MoonPhaseGlyph` (the
 * same discs the narrative arc is crowned with) and the rose and harp come
 * from `CastEmblems` (Death's flower, the Moon-Knight's instrument). Only the
 * sword is drawn here, and it is built to the bestiary's sword grammar —
 * tapered blade, barred guard, round pommel — so it reads as the same weapon.
 */

/* ---- local paint --------------------------------------------------------
   The cast emblems hang their gradients off ids registered by `CastSprite`,
   which must render exactly once per page and is owned by the `Cast` section.
   This section re-uses the cast's GEOMETRY but not its sprite: the ids below
   are its own, so the emblems here render identically no matter where on the
   page this section is placed, and nothing breaks if the cast is moved or
   dropped. */
function DiegeticSprite() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="mkd-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D9A8" />
          <stop offset="100%" stopColor="#B8974E" />
        </linearGradient>
        {/* The stain, painted as one rect clipped to the whole flower — never
            petal by petal, which would tint each of them evenly and just read
            as a pink rose instead of a white one taking blood from the hem. */}
        <linearGradient id="mkd-bleed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E2F3C" stopOpacity="0" />
          <stop offset="30%" stopColor="#9E2F3B" stopOpacity="0.32" />
          <stop offset="66%" stopColor="#B32F3C" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#C4333F" stopOpacity="1" />
        </linearGradient>
        <clipPath id="mkd-rose-clip">
          {ROSE_PETALS.map((a) => (
            <path key={"c" + a} d={ROSE_PETAL} transform={"rotate(" + a + " 60 56)"} />
          ))}
          {ROSE_INNER.map((a) => (
            <path key={"ci" + a} d={ROSE_PETAL_INNER} transform={"rotate(" + a + " 60 56)"} />
          ))}
        </clipPath>
      </defs>
    </svg>
  );
}

/* ---- emblems ------------------------------------------------------------ */

/**
 * THE WHITE ROSE, TAKING THE STAIN — one point of XP.
 *
 * Death's flower from `CastEmblems`, same petals, cropped to the head and a
 * stub of stem. It is deliberately the identical mark: the rose you stain is
 * hers, and a second, subtly different rose on the same page would quietly
 * break that.
 */
function RoseGlyph() {
  return (
    <svg className="mkd-emblem" viewBox="20 14 80 84" aria-hidden="true" focusable="false">
      <path d="M60 56 V100" stroke="#8E9AA4" strokeWidth="3" fill="none" />
      <path fill="#6F7C74" d="M60 74 L44 68 L58 80 Z" />
      <path fill="#6F7C74" d="M60 86 L76 80 L62 92 Z" />
      <g fill="#6F7C74">
        {[36, 108, 180, 252, 324].map((a) => (
          <path key={"s" + a} d="M60 56 L55 32 L60 18 L65 32 Z" transform={"rotate(" + a + " 60 56)"} />
        ))}
      </g>
      <g stroke="var(--color-void)" strokeWidth="1.4" strokeLinejoin="round">
        {ROSE_PETALS.map((a) => (
          <path key={"o" + a} d={ROSE_PETAL} fill="#F3F5F8" transform={"rotate(" + a + " 60 56)"} />
        ))}
        {ROSE_INNER.map((a) => (
          <path
            key={"i" + a}
            d={ROSE_PETAL_INNER}
            fill="#F3F5F8"
            transform={"rotate(" + a + " 60 56)"}
          />
        ))}
      </g>
      <rect x="14" y="48" width="92" height="52" fill="url(#mkd-bleed)" clipPath="url(#mkd-rose-clip)" />
      <circle cx="60" cy="56" r="4.5" fill="#C4333F" />
    </svg>
  );
}

/**
 * THE SWORD, CATCHING MOONLIGHT — the navigation gesture.
 *
 * The only mark drawn from scratch in this section, because the bestiary's
 * swords are baked into character compositions at absolute coordinates and
 * there is no single blade to import. So it is built to the same grammar
 * instead — tapered blade, barred guard, short grip, round pommel — and held
 * upright the way the bestiary holds them.
 *
 * The mark has to say moon → blade → direction in three elements, because at
 * 2rem there is room for three. So the moon is set clear to the LEFT rather
 * than behind the blade, and the three rays leave the right edge and fan out
 * with the light falling off: light arrives from the moon, the steel throws it,
 * and it points somewhere. That is the mechanic — the blade tells you which
 * way to walk. Silhouetting the sword across the moon was the first attempt
 * and it failed: the reflection rays then had to cross the disc, and moon and
 * light became one grey smudge at emblem size.
 */
function SwordGlyph() {
  return (
    <svg className="mkd-emblem" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle className="mkd-sword-moon" cx="11" cy="11" r="7.5" />
      <g className="mkd-sword-steel">
        <path d="M26 3 L29.4 10.5 L29.4 32.5 L22.6 32.5 L22.6 10.5 Z" />
        <rect x="15" y="32" width="22" height="3.1" />
        <rect x="24" y="35.1" width="4" height="6.6" />
        <circle cx="26" cy="43.6" r="2.7" />
      </g>
      <g className="mkd-sword-ray" fill="none" strokeLinecap="round">
        <path d="M31.4 11 L44 6.5" opacity="0.9" />
        <path d="M31.4 16 L46 15" opacity="0.65" />
        <path d="M31.4 21 L44 24.5" opacity="0.4" />
      </g>
    </svg>
  );
}

/**
 * THE HARP — how the player heals.
 *
 * Lifted whole from the Moon-Knight's own emblem in `CastEmblems`, cropped to
 * the instrument. Same gold frame over lighter strings, because at this size
 * one ink for both loses the strings and the mark stops being a harp.
 */
function HarpGlyph() {
  return (
    <svg className="mkd-emblem" viewBox="70 14 48 84" aria-hidden="true" focusable="false">
      <HarpMark frame="url(#mkd-gold)" strings="#E8D9A8" />
    </svg>
  );
}

/** The moon HUD's own card mark: the three phases, small, in a row. */
function MoonHudGlyph() {
  return (
    <span className="mkd-emblem mkd-emblem--row" aria-hidden="true">
      {moonHudStates.map((s) => (
        <MoonPhaseGlyph
          key={s.phase}
          phase={s.phase}
          className={`mkd-mini-moon is-${s.phase}`}
          discClassName="mkd-mini-disc"
          litClassName="mkd-mini-lit"
        />
      ))}
    </span>
  );
}

function Glyph({ glyph }: { glyph: DiegeticGlyph }) {
  if (glyph === "rose") return <RoseGlyph />;
  if (glyph === "sword") return <SwordGlyph />;
  if (glyph === "harp") return <HarpGlyph />;
  return <MoonHudGlyph />;
}

/* ---- a mechanic --------------------------------------------------------- */

/**
 * `replaces` sits above the title as the fastest read in the card: the thing
 * the mechanic is NOT. The contrast between that line and the title is the
 * whole argument in two lines, before any prose is asked for.
 */
function MechanicCard({ mechanic: m, hero = false }: { mechanic: DiegeticMechanic; hero?: boolean }) {
  return (
    <li className={`mkd-card${hero ? " mkd-card--hero" : ""}`}>
      <span className="mkd-card-mark">
        <Glyph glyph={m.glyph} />
      </span>
      <p className="mono mkd-replaces">
        <span className="mkd-replaces-key">Replaces</span>
        <span className="mkd-replaces-sep" aria-hidden="true">
          ·
        </span>
        <span className="mkd-replaces-val">{m.replaces}</span>
      </p>
      <h4 className="mkd-card-title">{m.title}</h4>
      <p className="mkd-card-body">{m.mechanic}</p>
      <p className="mkd-why">
        <span className="mono mkd-why-key">Why</span>
        {m.why}
      </p>
    </li>
  );
}

/* ---- the section -------------------------------------------------------- */

export default function DiegeticDesign() {
  const [hud, ...rest] = diegeticMechanics;

  return (
    <div className="mkd">
      <DiegeticSprite />

      {/* 1 — the thesis */}
      <section className="mkd-band mkd-band--thesis">
        <h3 className="mono mkd-band-title">{diegeticThesis.kicker}</h3>
        <p className="mkd-thesis">{diegeticThesis.line}</p>
        <p className="mkd-thesis-body">{diegeticThesis.body}</p>
      </section>

      {/* 2 — the headline: a health bar that is the moon */}
      <section className="mkd-band">
        <h3 className="mono mkd-band-title">The health bar is a moon</h3>

        {/* The one big visual in the section. Full → half → new, left to right,
            with the rule under the plates running silver to scarlet: the strip
            is a gradient, and reading it left to right is losing the fight. */}
        <ol className="mkd-hud">
          {moonHudStates.map((s) => (
            <li key={s.phase} className={`mkd-hud-state is-${s.phase}`}>
              <span className="mkd-plate" aria-hidden="true">
                <MoonPhaseGlyph
                  phase={s.phase}
                  className="mkd-moon"
                  discClassName="mkd-moon-disc"
                  litClassName="mkd-moon-lit"
                />
              </span>
              <p className="mono mkd-hud-label">{s.label}</p>
              <p className="mkd-hud-note">{s.note}</p>
            </li>
          ))}
        </ol>

        <ul className="mkd-cards mkd-cards--single">
          <MechanicCard mechanic={hud} hero />
        </ul>
      </section>

      {/* 3 — the other three */}
      <section className="mkd-band">
        <h3 className="mono mkd-band-title">Systems worn as objects</h3>
        <ul className="mkd-cards">
          {rest.map((m) => (
            <MechanicCard key={m.id} mechanic={m} />
          ))}
        </ul>
      </section>

      {/* 4 — decisions with no surface at all */}
      <section className="mkd-band">
        <h3 className="mono mkd-band-title">Invisible design</h3>
        <p className="mkd-lede">
          Four decisions the player never sees a screen for. The reasoning is the whole of it.
        </p>
        <dl className="mkd-decisions">
          {invisibleDesign.map((d) => (
            <div key={d.id} className="mkd-decision">
              <dt className="mkd-decision-name">{d.decision}</dt>
              <dd className="mkd-decision-why">
                <span className="mono mkd-why-key">Why</span>
                {d.why}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 5 — the generic verbs, kept small on purpose */}
      <section className="mkd-band">
        <h3 className="mono mkd-band-title">Core combat, for completeness</h3>
        <ul className="mkd-verbs">
          {coreCombat.map((v) => (
            <li key={v.id} className="mkd-verb">
              <span className="mono mkd-verb-name">{v.name}</span>
              <span className="mkd-verb-note">{v.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        .mkd {
          /* Same lifted steel as the narrative and bestiary bands: --color-mist
             is 4.41:1 on the panel and this is 6.3:1, so every small mono label
             in here clears AA as text. */
          --mkd-quiet: #93A0B3;
          --mkd-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
          --mkd-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);
          /* Scarlet is 2:1 on nightfall — unusable raw. Two lifts, because the
             two jobs owe different bars: 3.7:1 for rules and glyph strokes,
             over the 3:1 graphical minimum, and 5.2:1 for anything that is
             actually text. */
          --mkd-blood: color-mix(in srgb, var(--color-scarlet) 72%, var(--color-moonlight));
          --mkd-blood-ink: color-mix(in srgb, var(--color-scarlet) 55%, var(--color-moonlight));
          --mkd-plate-size: 4.6rem;

          display: grid;
          gap: 2.5rem;
        }

        .mkd-band { display: grid; gap: 1rem; }
        .mkd-band-title {
          margin: 0;
          font-size: 0.68rem;
          color: var(--color-gold);
          padding-bottom: 0.55rem;
          border-bottom: 1px solid var(--mkd-hair);
        }

        /* ---- 1 · the thesis ----
           The one sentence the section is arguing, set at display size so a
           reader who stops here still leaves with it. */
        .mkd-thesis {
          margin: 0.2rem 0 0;
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.7rem);
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: 0.01em;
          color: var(--color-moonlight);
          max-width: 34ch;
        }
        .mkd-thesis-body,
        .mkd-lede {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-silver);
          max-width: 46rem;
        }

        /* ---- 2 · the moon HUD strip ----
           Three plates on one rule. The rule is the health gradient and it is
           painted, not implied: silver at whole, gold at wounded, blood at
           failing. */
        .mkd-hud {
          position: relative;
          list-style: none;
          margin: 0.5rem 0 0.4rem;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        .mkd-hud::before {
          content: "";
          position: absolute;
          left: 8%;
          right: 8%;
          top: calc(var(--mkd-plate-size) / 2);
          height: 1px;
          background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--color-silver) 55%, transparent),
            color-mix(in srgb, var(--color-gold) 62%, transparent),
            color-mix(in srgb, var(--mkd-blood) 70%, transparent)
          );
        }
        .mkd-hud-state {
          position: relative;
          display: grid;
          justify-items: center;
          gap: 0.15rem;
          min-width: 0;
        }

        /* The backplate: a steel roundel, so the moon reads as something worn
           rather than something drawn over the screen. */
        .mkd-plate {
          display: grid;
          place-items: center;
          width: var(--mkd-plate-size);
          height: var(--mkd-plate-size);
          border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--color-silver) 40%, transparent);
          background:
            radial-gradient(
              circle at 34% 24%,
              color-mix(in srgb, var(--color-silver) 16%, transparent),
              transparent 62%
            ),
            var(--color-nightfall);
          box-shadow: inset 0 0 0 4px color-mix(in srgb, var(--color-void) 55%, transparent);
        }
        .mkd-moon { width: 55%; height: 55%; display: block; }
        .mkd-moon-disc {
          fill: none;
          stroke: color-mix(in srgb, var(--color-silver) 34%, transparent);
          stroke-width: 1;
        }
        .mkd-moon-lit { fill: var(--color-silver); }

        /* The gradient, stated in ink as well as in shape — the half-moon is
           gold and the new moon is blood, so the strip is legible as a health
           readout even at a glance and even in greyscale. */
        .is-half .mkd-moon-lit { fill: var(--color-gold); }
        .is-half .mkd-plate { border-color: color-mix(in srgb, var(--color-gold) 45%, transparent); }
        .is-new .mkd-moon-disc { stroke: var(--mkd-blood); stroke-width: 1.4; }
        .is-new .mkd-plate {
          border-color: color-mix(in srgb, var(--mkd-blood) 62%, transparent);
          background:
            radial-gradient(
              circle at 50% 50%,
              color-mix(in srgb, var(--color-scarlet) 26%, transparent),
              transparent 68%
            ),
            var(--color-nightfall);
        }

        .mkd-hud-label {
          margin: 0.65rem 0 0;
          font-size: 0.64rem;
          color: var(--color-silver);
        }
        .is-half .mkd-hud-label { color: var(--color-gold); }
        .is-new .mkd-hud-label { color: var(--mkd-blood-ink); }
        .mkd-hud-note {
          margin: 0.2rem 0 0;
          font-family: var(--font-body);
          font-size: 0.84rem;
          line-height: 1.55;
          color: var(--mkd-quiet);
          text-align: center;
          max-width: 24ch;
        }

        /* ---- the mechanic cards ---- */
        .mkd-cards {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(17rem, 100%), 1fr));
          gap: 1px;
          background: var(--mkd-edge);
          border: 1px solid var(--mkd-edge);
        }
        .mkd-cards--single { grid-template-columns: minmax(0, 1fr); }
        .mkd-card {
          background: var(--color-nightfall);
          padding: 1.15rem 1.15rem 1.25rem;
          display: grid;
          align-content: start;
          gap: 0.3rem;
          min-width: 0;
          border-top: 2px solid transparent;
          transition: border-top-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mkd-card:hover { border-top-color: var(--mkd-hair); }
        .mkd-card--hero { padding: 1.3rem 1.3rem 1.4rem; }

        /* Each mark carries its own motif's ink rather than inheriting one:
           silver moons, the white rose taking blood, the gold harp, and steel
           under emerald moonlight for the sword. The colour on this box is
           only the fallback for anything drawn in currentColor. */
        .mkd-card-mark {
          display: block;
          height: 2.75rem;
          margin-bottom: 0.55rem;
          color: var(--color-silver);
        }
        .mkd-emblem { height: 100%; width: auto; display: block; }
        .mkd-emblem--row { display: flex; align-items: center; gap: 0.4rem; height: 100%; }
        .mkd-mini-moon { width: 1.9rem; height: 1.9rem; }
        .mkd-mini-disc {
          fill: none;
          stroke: color-mix(in srgb, var(--color-silver) 34%, transparent);
          stroke-width: 1;
        }
        .mkd-mini-lit { fill: var(--color-silver); }
        .mkd-mini-moon.is-half .mkd-mini-lit { fill: var(--color-gold); }
        .mkd-mini-moon.is-new .mkd-mini-disc { stroke: var(--mkd-blood); stroke-width: 1.4; }

        /* The moon has to read as a LIT disc, not a hole: at 15% fill it
           came out darker than the card and looked like a punched-out dot. It
           is deliberately dimmer than the steel, though — the blade is the
           brightest thing in the mark, because the blade is the mechanic. */
        .mkd-sword-moon {
          fill: color-mix(in srgb, var(--color-silver) 52%, transparent);
          stroke: color-mix(in srgb, var(--color-silver) 80%, transparent);
          stroke-width: 1;
        }
        .mkd-sword-steel { fill: var(--color-silver); }
        /* Gold, not emerald: these three strokes are LIGHT leaving the blade,
           and green light off a moonlit sword reads as an enchantment rather
           than a reflection. Gold is also the only ink in the palette the
           silver steel cannot be confused with. */
        .mkd-sword-ray {
          stroke: var(--color-gold);
          stroke-width: 1.6;
        }

        .mkd-replaces {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.4rem;
          margin: 0;
          font-size: 0.6rem;
        }
        .mkd-replaces-key { color: var(--mkd-quiet); }
        .mkd-replaces-sep { color: var(--mkd-edge); }
        /* Struck through: the conventional element is named in order to be
           crossed out, which is the section's argument in one line. */
        .mkd-replaces-val {
          color: var(--mkd-blood-ink);
          text-decoration: line-through;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }

        .mkd-card-title {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0.15rem 0 0;
          color: var(--color-moonlight);
        }
        .mkd-card--hero .mkd-card-title { font-size: 1.2rem; }
        .mkd-card-body {
          margin: 0.3rem 0 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-moonlight);
          max-width: 46rem;
        }
        .mkd-card--hero .mkd-card-body { font-size: 0.95rem; line-height: 1.65; }

        /* The reasoning, marked everywhere it appears. Skimming only the gold
           "Why" labels down the page should still deliver the argument. */
        .mkd-why {
          margin: 0.7rem 0 0;
          padding-left: 0.85rem;
          border-left: 1px solid var(--mkd-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-silver);
          max-width: 46rem;
        }
        .mkd-why-key {
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        /* ---- 4 · invisible design ---- */
        .mkd-decisions {
          margin: 0.3rem 0 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
          gap: 1.4rem 1.8rem;
        }
        .mkd-decision { min-width: 0; }
        .mkd-decision-name {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .mkd-decision-why {
          margin: 0.45rem 0 0;
          padding-left: 0.85rem;
          border-left: 1px solid var(--mkd-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-silver);
        }

        /* ---- 5 · core combat ----
           Small, quiet and last. These are the verbs every game in the genre
           has; they are here so the section is complete, not so they are read
           first. */
        .mkd-verbs {
          list-style: none;
          margin: 0.2rem 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(19rem, 100%), 1fr));
          gap: 0.5rem 1.6rem;
        }
        .mkd-verb {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.5rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid color-mix(in srgb, var(--color-mist) 18%, transparent);
          min-width: 0;
        }
        .mkd-verb-name { font-size: 0.64rem; color: var(--color-silver); flex: 0 0 auto; }
        .mkd-verb-note {
          font-family: var(--font-body);
          font-size: 0.82rem;
          line-height: 1.5;
          color: var(--mkd-quiet);
        }

        /* ---- responsive ----
           The HUD strip is the only thing that has to change shape: stacked,
           the plates sit beside their text and the connecting rule is dropped,
           because a horizontal gradient under a vertical list means nothing. */
        @media (max-width: 720px) {
          .mkd-hud { grid-template-columns: minmax(0, 1fr); gap: 1.1rem; }
          .mkd-hud::before { display: none; }
          .mkd-hud-state {
            grid-template-columns: var(--mkd-plate-size) minmax(0, 1fr);
            justify-items: start;
            align-items: center;
            column-gap: 1rem;
          }
          .mkd-plate { grid-row: 1 / span 2; }
          .mkd-hud-label { margin: 0; align-self: end; }
          .mkd-hud-note { text-align: left; max-width: none; align-self: start; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mkd-card { transition: none; }
        }
      `}</style>
    </div>
  );
}
