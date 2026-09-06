import {
  bestiaryAnchor,
  bestiaryBosses,
  bestiaryEnemies,
  type BossEntry,
  type EnemyEntry,
  type MechanicDiagramId,
  type WeaknessType,
} from "@/content/moon-knight-bestiary";
import { CreatureEmblem, EmblemSprite } from "./BestiaryEmblems";
import BossPlateArch from "./BossPlateArch";

/**
 * Moon-Knight — the bestiary, as an illuminated codex plate.
 *
 * Reads `src/content/moon-knight-bestiary.ts` and renders two tiers: four
 * bosses, each carrying the quantum mechanic its fight teaches (plus a
 * schematic plate of that mechanic), then six common ranks read through
 * gameplay and weakness.
 *
 * Server component — no state, no motion that carries meaning. The only
 * animation is a hover lift, and it is disabled under reduced motion.
 *
 * Stage 2 (world map): each card is anchored at `#bestiary-<id>` via
 * `bestiaryAnchor`, so a map pin can link straight to its entry without this
 * component learning anything about the map.
 */

/* Diagram ink. Kept here rather than in the theme: these are schematic line
   colours, lifted off the token palette so they clear AA on the card. */
const INK = {
  gold: "#C9A961",
  silver: "#B8C4D4",
  emerald: "#57A886",
  scarlet: "#CE727E",
  quiet: "#93A0B3",
};

export default function Bestiary({ kicker }: { kicker?: string }) {
  return (
    <section className="mkb" aria-labelledby="mkb-title">
      <EmblemSprite />

      <header className="mkb__head">
        {kicker && <p className="mono mkb__kicker">{kicker}</p>}
        <div className="mkb__title-row">
          <span className="mkb__rule mkb__rule--l" aria-hidden />
          <h2 id="mkb-title" className="mkb__title">
            Bestiary
          </h2>
          <span className="mkb__rule mkb__rule--r" aria-hidden />
        </div>
        <p className="mono mkb__subtitle">Liber Monstrorum · Moon-Knight</p>
      </header>

      {/* ---- bosses ---- */}
      <div className="mkb__tier">
        <h3 className="mono mkb__tier-name">The Four Bosses</h3>
        <span className="mkb__tier-rule" aria-hidden />
        <p className="mono mono-note mkb__tier-note">One quantum mechanic each</p>
      </div>

      <div className="mkb__bosses">
        {bestiaryBosses.map((boss) => (
          <BossCard key={boss.id} boss={boss} />
        ))}
      </div>

      {/* ---- enemies ---- */}
      <div className="mkb__tier">
        <h3 className="mono mkb__tier-name">The Common Ranks</h3>
        <span className="mkb__tier-rule" aria-hidden />
        <p className="mono mono-note mkb__tier-note">Learn the weakness, then commit</p>
      </div>

      <div className="mkb__enemies">
        {bestiaryEnemies.map((enemy) => (
          <EnemyCard key={enemy.id} enemy={enemy} />
        ))}
      </div>

      <style>{`
        .mkb {
          --mkb-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
          --mkb-panel: #0F141E;
          --mkb-prose: #A9B4C4;
          --mkb-quiet: #93A0B3;
        }

        /* ---- illuminated header ---- */
        .mkb__head { text-align: center; }
        .mkb__kicker {
          font-size: 0.7rem;
          color: var(--color-gold);
          margin: 0 0 1.4rem;
        }
        .mkb__title-row {
          display: flex;
          align-items: center;
          gap: clamp(0.9rem, 3vw, 2rem);
        }
        .mkb__rule {
          flex: 1 1 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-gold));
          position: relative;
        }
        .mkb__rule--r { background: linear-gradient(270deg, transparent, var(--color-gold)); }
        .mkb__rule::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 6px;
          height: 6px;
          background: var(--color-gold);
          transform: translateY(-50%) rotate(45deg);
        }
        .mkb__rule--l::after { right: -2px; }
        .mkb__rule--r::after { left: -2px; }
        .mkb__title {
          font-family: var(--font-unifraktur), var(--font-display), serif;
          font-size: clamp(2.4rem, 1.5rem + 3.6vw, 4.25rem);
          font-weight: 400;
          line-height: 1;
          margin: 0;
          color: var(--color-moonlight);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .mkb__subtitle {
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          color: var(--color-gold);
          margin: 1rem 0 0;
        }

        /* ---- tier headings ---- */
        .mkb__tier {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 3.5rem 0 1.5rem;
          flex-wrap: wrap;
        }
        .mkb__tier-name {
          font-size: 0.74rem;
          font-weight: 500;
          letter-spacing: 0.24em;
          color: var(--color-gold);
          margin: 0;
        }
        .mkb__tier-rule {
          flex: 1 1 3rem;
          height: 1px;
          background: var(--mkb-hair);
        }
        /* Casing and tracking come from the shared .mono-note modifier in
           globals.css - this used to undo .mono's uppercase locally. */
        .mkb__tier-note {
          font-size: 0.72rem;
          color: var(--mkb-quiet);
          margin: 0;
        }

        /* ---- grids ---- */
        .mkb__bosses,
        .mkb__enemies {
          display: grid;
          gap: 1.15rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 30rem) { .mkb__enemies { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 46rem) {
          .mkb__bosses  { grid-template-columns: repeat(2, 1fr); }
          .mkb__enemies { grid-template-columns: repeat(3, 1fr); }
        }

        /* ---- cards ---- */
        .mkb__card {
          background: var(--mkb-panel);
          border: 1px solid color-mix(in srgb, var(--color-mist) 22%, transparent);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          transition: border-color 200ms ease, transform 200ms ease;
        }
        .mkb__card:hover {
          border-color: color-mix(in srgb, var(--mkb-accent) 55%, transparent);
          transform: translateY(-2px);
        }
        .mkb__card--boss { padding: 1.9rem 1.5rem 1.7rem; gap: 0.95rem; }
        .mkb__card--enemy { padding: 1.5rem 1.25rem 1.35rem; }
        .mkb__card--final { border-color: color-mix(in srgb, var(--color-gold) 45%, transparent); }

        /* ---- reliquary arch ---- */
        .mkb__arch {
          width: 100%;
          aspect-ratio: 3 / 4;
          margin: 0 auto;
          border-radius: 120px 120px 3px 3px;
          border: 1px solid color-mix(in srgb, var(--mkb-accent) 50%, transparent);
          color: var(--mkb-accent);
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            radial-gradient(110% 78% at 50% 26%,
              color-mix(in srgb, var(--mkb-accent) 30%, transparent), transparent 70%),
            repeating-linear-gradient(90deg,
              transparent 0 13px,
              color-mix(in srgb, var(--color-moonlight) 7%, transparent) 13px 14px),
            linear-gradient(180deg, #131A26, #090C12);
        }
        .mkb__arch--boss { max-width: 172px; }
        .mkb__arch--enemy { max-width: 118px; }
        .mkb__emblem { width: 80%; height: 80%; display: block; }

        /* ---- card head ---- */
        .mkb__card-head { text-align: center; }
        .mkb__rank {
          display: inline-block;
          font-size: 0.70rem;
          letter-spacing: 0.28em;
          color: var(--color-gold);
          margin: 0.9rem 0 0.45rem;
        }
        .mkb__rank--final {
          color: var(--color-void);
          background: var(--color-gold);
          padding: 0.2rem 0.6rem;
        }
        .mkb__name {
          font-family: var(--font-hero), var(--font-display), serif;
          margin: 0;
          line-height: 1.2;
          color: var(--color-moonlight);
          letter-spacing: 0.02em;
        }
        .mkb__card--boss .mkb__name { font-size: 1.4rem; }
        .mkb__card--enemy .mkb__name { font-size: 1.05rem; }
        .mkb__epithet {
          margin: 0.55rem 0 0;
          font-style: italic;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--mkb-quiet);
        }

        /* ---- mechanic block ---- */
        .mkb__mech {
          border: 1px solid var(--mkb-hair);
          border-left-width: 2px;
          border-left-color: var(--color-gold);
          background: color-mix(in srgb, var(--color-gold) 5%, transparent);
          padding: 0.9rem 1rem 1rem;
        }
        .mkb__mech-kicker {
          font-size: 0.70rem;
          letter-spacing: 0.26em;
          color: var(--mkb-quiet);
          margin: 0;
        }
        .mkb__mech-name {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1rem;
          letter-spacing: 0.06em;
          color: var(--color-gold);
          margin: 0.35rem 0 0.5rem;
        }
        .mkb__mech-desc {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--mkb-prose);
        }
        .mkb__diagram {
          display: block;
          width: 100%;
          height: auto;
          margin-top: 0.9rem;
        }

        /* ---- prose ---- */
        .mkb__gameplay {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--mkb-prose);
        }
        .mkb__lore-label {
          font-size: 0.70rem;
          letter-spacing: 0.26em;
          color: var(--mkb-quiet);
          margin: 0 0 0.4rem;
        }
        .mkb__lore {
          margin: 0;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--mkb-prose);
        }
        .mkb__foot {
          border-top: 1px solid color-mix(in srgb, var(--color-mist) 20%, transparent);
          padding-top: 0.85rem;
          margin-top: auto;
        }

        .mkb__card--enemy .mkb__lore { font-style: italic; color: var(--mkb-quiet); font-size: 0.82rem; }

        /* ---- weakness tag ---- */
        .mkb__weak-label {
          font-size: 0.70rem;
          letter-spacing: 0.26em;
          color: var(--mkb-quiet);
          margin: 0 0 0.5rem;
        }
        .mkb__weak {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.32rem 0.72rem;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--mkb-weak) 45%, transparent);
          background: color-mix(in srgb, var(--mkb-weak) 9%, transparent);
          color: var(--mkb-weak);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          line-height: 1.35;
        }
        .mkb__weak-icon { width: 0.95rem; height: 0.95rem; flex: none; }

        @media (prefers-reduced-motion: reduce) {
          .mkb__card { transition: none; }
          .mkb__card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ cards -- */

function BossCard({ boss }: { boss: BossEntry }) {
  return (
    <article
      id={bestiaryAnchor(boss.id)}
      className={"mkb__card mkb__card--boss" + (boss.isFinal ? " mkb__card--final" : "")}
      style={{ "--mkb-accent": boss.accent } as React.CSSProperties}
    >
      <div className="mkb__card-head">
        {/* ONE VISUAL SLOT PER CARD, whatever fills it.

            The Werewolf is the only creature a capture exists of, and it used
            to be rendered as an extra figure further down the card — a whole
            additional band on one card in a grid of eleven, which made the
            other ten look like they were missing something rather than making
            this one look better evidenced. The capture now fills the arch
            instead of the drawn emblem: same slot, same frame, same size, so
            the grid stays even and the photograph reads as the strongest card
            rather than the odd one. Its caption moved into the viewer, where
            the detail it describes is actually legible. */}
        <div className="mkb__arch mkb__arch--boss">
          {boss.plate ? (
            <BossPlateArch plate={boss.plate} bossName={boss.name} />
          ) : (
            <CreatureEmblem id={boss.id} />
          )}
        </div>
        <p className={"mono mkb__rank" + (boss.isFinal ? " mkb__rank--final" : "")}>
          {boss.isFinal ? "Final Boss" : boss.rankLabel}
        </p>
        <h4 className="mkb__name">{boss.name}</h4>
        <p className="mkb__epithet">{boss.epithet}</p>
      </div>

      <div className="mkb__mech">
        <p className="mono mkb__mech-kicker">Quantum mechanic</p>
        <p className="mkb__mech-name">{boss.mechanic.name}</p>
        <p className="mkb__mech-desc">{boss.mechanic.description}</p>
        <MechanicDiagram id={boss.mechanic.diagram} />
      </div>

      <div className="mkb__foot">
        <p className="mono mkb__lore-label">Lore</p>
        <p className="mkb__lore">{boss.lore}</p>
      </div>
    </article>
  );
}

function EnemyCard({ enemy }: { enemy: EnemyEntry }) {
  return (
    <article
      id={bestiaryAnchor(enemy.id)}
      className="mkb__card mkb__card--enemy"
      style={{ "--mkb-accent": enemy.accent } as React.CSSProperties}
    >
      <div className="mkb__card-head">
        <div className="mkb__arch mkb__arch--enemy">
          <CreatureEmblem id={enemy.id} />
        </div>
        <h4 className="mkb__name" style={{ marginTop: "0.9rem" }}>
          {enemy.name}
        </h4>
      </div>

      <p className="mkb__gameplay">{enemy.gameplay}</p>

      <div style={{ marginTop: "auto" }}>
        <p className="mono mkb__weak-label">Weakness</p>
        <WeaknessTag type={enemy.weakness.type} label={enemy.weakness.label} />
      </div>

      <div className="mkb__foot">
        <p className="mkb__lore">{enemy.lore}</p>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------- weakness -- */

const WEAKNESS_INK: Record<WeaknessType, string> = {
  fire: "#E07A45",
  lightning: "#DDBE79",
  light: "#E8E6DF",
  ice: "#8FD4E8",
  melee: "#B8C4D4",
  none: "#97A3B5",
};

/** 16×16 glyphs. Decorative — the tag always carries the weakness as text too. */
function WeaknessIcon({ type }: { type: WeaknessType }) {
  const common = {
    className: "mkb__weak-icon",
    viewBox: "0 0 16 16",
    "aria-hidden": true,
    focusable: "false" as const,
  };
  switch (type) {
    case "fire":
      return (
        <svg {...common}>
          <path
            fill="currentColor"
            d="M8 1c1.6 2.6 1 3.9 0 5 -.8-.6-1.2-1.4-1.2-1.4C5 6.3 3.4 7.6 3.4 10a4.6 4.6 0 0 0 9.2 0c0-2.6-1.6-3.9-2.4-6.4A6 6 0 0 1 8 1Z"
          />
          <path fill="var(--color-void)" d="M8 9.2c1 1 1.2 1.7 1.2 2.4a1.2 1.2 0 0 1-2.4 0c0-.8.6-1.6 1.2-2.4Z" />
        </svg>
      );
    case "lightning":
      return (
        <svg {...common}>
          <path fill="currentColor" d="M9.6 1 3.4 9h3.3l-.9 6 6.4-8.4H8.8L9.6 1Z" />
        </svg>
      );
    case "light":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M8 1v2.2M8 12.8V15M1 8h2.2M12.8 8H15M3 3l1.6 1.6M11.4 11.4 13 13M13 3l-1.6 1.6M4.6 11.4 3 13" />
          </g>
        </svg>
      );
    case "ice":
      return (
        <svg {...common}>
          <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M8 1v14M2 4.5l12 7M14 4.5l-12 7" />
            <path d="M6.2 2.8 8 4.6l1.8-1.8M6.2 13.2 8 11.4l1.8 1.8" />
          </g>
        </svg>
      );
    case "melee":
      return (
        <svg {...common}>
          <path fill="currentColor" d="M8 1l1.7 3.2v5.3H6.3V4.2L8 1Z" />
          <rect x="4" y="9.8" width="8" height="1.6" fill="currentColor" />
          <rect x="7.2" y="11.4" width="1.6" height="3.6" fill="currentColor" />
        </svg>
      );
    case "none":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3.8 12.2 12.2 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
  }
}

function WeaknessTag({ type, label }: { type: WeaknessType; label: string }) {
  return (
    <span className="mkb__weak" style={{ "--mkb-weak": WEAKNESS_INK[type] } as React.CSSProperties}>
      <WeaknessIcon type={type} />
      {label}
    </span>
  );
}

/* -------------------------------------------------------------- diagrams -- */

/**
 * Schematic plates for the four boss mechanics — gold/emerald/scarlet line work
 * on the dark card. Decorative: every diagram restates the mechanic description
 * printed directly above it, so they are hidden from assistive tech.
 */
function MechanicDiagram({ id }: { id: MechanicDiagramId }) {
  const common = {
    className: "mkb__diagram",
    viewBox: "0 0 260 112",
    preserveAspectRatio: "xMidYMid meet",
    "aria-hidden": true,
    focusable: "false" as const,
  };
  const label = {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 10.5,
    letterSpacing: "0.1em",
  } as const;

  switch (id) {
    /* Instability — the orb mutates on contact with the environment. */
    case "instability":
      return (
        <svg {...common}>
          <text x="6" y="16" fill={INK.quiet} {...label}>
            STABLE
          </text>
          <text x="256" y="16" textAnchor="end" fill={INK.scarlet} {...label}>
            Δ SIZE · Δ SPEED
          </text>
          {/* incoming path */}
          <path
            d="M8 66 H112"
            stroke={INK.quiet}
            strokeWidth="1.2"
            strokeDasharray="5 5"
            fill="none"
          />
          <circle cx="34" cy="66" r="7" fill="none" stroke={INK.silver} strokeWidth="1.6" />
          <path d="M58 60l6 6-6 6M74 60l6 6-6 6" stroke={INK.silver} strokeWidth="1.4" fill="none" />
          {/* the environment */}
          <path d="M124 12 V102" stroke={INK.gold} strokeWidth="2" />
          <path
            d="M124 18 l-9 8M124 34 l-9 8M124 50 l-9 8M124 66 l-9 8M124 82 l-9 8"
            stroke={INK.gold}
            strokeWidth="1.1"
            opacity="0.75"
          />
          {/* impact */}
          <g stroke={INK.scarlet} strokeWidth="1.6">
            <path d="M124 66 l-11-11M124 66 l-11 11M124 66 l-15 0" />
          </g>
          {/* outgoing, larger and faster */}
          <path
            d="M126 64 Q170 58 214 44"
            stroke={INK.scarlet}
            strokeWidth="1.2"
            strokeDasharray="7 4"
            fill="none"
          />
          <path
            d="M152 78l7 7-7 7M170 76l7 7-7 7M188 74l7 7-7 7"
            stroke={INK.scarlet}
            strokeWidth="1.4"
            fill="none"
          />
          <circle cx="226" cy="42" r="14" fill="none" stroke={INK.scarlet} strokeWidth="2" />
          <circle cx="226" cy="42" r="21" fill="none" stroke={INK.scarlet} strokeWidth="0.9" opacity="0.5" />
          <text x="88" y="106" fill={INK.gold} {...label}>
            CONTACT
          </text>
        </svg>
      );

    /* Master of Matters — several states of matter, one blade. */
    case "matters": {
      const states = [
        { x: 40, name: "SOLID" },
        { x: 100, name: "LIQUID" },
        { x: 160, name: "GAS" },
        { x: 220, name: "PLASMA" },
      ];
      return (
        <svg {...common}>
          {states.map((s, i) => (
            <g key={s.name}>
              <text x={s.x} y="14" fill={INK.quiet} textAnchor="middle" {...label}>
                {s.name}
              </text>
              <circle cx={s.x} cy="42" r="15" fill="none" stroke={INK.emerald} strokeWidth="1.5" />
              <MatterGlyph index={i} x={s.x} y={42} />
              <path
                d={`M${s.x} 57 Q${s.x} 76 130 82`}
                stroke={INK.emerald}
                strokeWidth="1.1"
                strokeDasharray="4 4"
                fill="none"
                opacity="0.8"
              />
            </g>
          ))}
          <rect x="96" y="84" width="68" height="6" fill={INK.gold} />
          <path d="M164 84 L184 87 L164 90 Z" fill={INK.gold} />
          <rect x="88" y="82" width="8" height="10" fill={INK.silver} />
          <text x="130" y="106" fill={INK.gold} textAnchor="middle" {...label}>
            ONE BLADE
          </text>
        </svg>
      );
    }

    /* Inversion — an undodgeable area, answered only by a counter. */
    case "inversion":
      return (
        <svg {...common}>
          <text x="6" y="14" fill={INK.scarlet} {...label}>
            UNDODGEABLE AREA
          </text>
          {/* caster */}
          <circle cx="26" cy="58" r="8" fill="none" stroke={INK.scarlet} strokeWidth="1.8" />
          <path d="M26 66 V88 M16 96 L26 88 L36 96" stroke={INK.scarlet} strokeWidth="1.5" fill="none" />
          {/* expanding front */}
          <g stroke={INK.scarlet} fill="none" opacity="0.85">
            <path d="M74 24 A48 48 0 0 1 74 92" strokeWidth="1.6" />
            <path d="M96 20 A66 66 0 0 1 96 96" strokeWidth="1.3" opacity="0.75" />
            <path d="M118 16 A84 84 0 0 1 118 98" strokeWidth="1.1" opacity="0.55" />
          </g>
          {/* the counter, thrown back */}
          <g stroke={INK.emerald} fill="none" strokeWidth="1.8">
            <path d="M214 44 A34 34 0 1 0 190 78" />
            <path d="M186 66 L190 79 L203 75" />
          </g>
          <circle cx="204" cy="61" r="6" fill={INK.emerald} />
          {/* player */}
          <circle cx="240" cy="58" r="8" fill="none" stroke={INK.silver} strokeWidth="1.8" />
          <path d="M240 66 V88 M230 96 L240 88 L250 96" stroke={INK.silver} strokeWidth="1.5" fill="none" />
          <text x="130" y="108" fill={INK.emerald} textAnchor="middle" {...label}>
            COUNTER ⇄ COUNTERED
          </text>
        </svg>
      );

    /* Elliptical Force — sun and moon converge on one point. */
    case "elliptical":
      return (
        <svg {...common}>
          <ellipse
            cx="130"
            cy="56"
            rx="86"
            ry="34"
            fill="none"
            stroke={INK.gold}
            strokeWidth="1.3"
            strokeDasharray="6 5"
            transform="rotate(-16 130 56)"
          />
          <ellipse
            cx="130"
            cy="56"
            rx="86"
            ry="34"
            fill="none"
            stroke={INK.silver}
            strokeWidth="1.3"
            strokeDasharray="6 5"
            transform="rotate(16 130 56)"
          />
          {/* sun */}
          <circle cx="52" cy="76" r="9" fill={INK.gold} />
          <text x="52" y="104" textAnchor="middle" fill={INK.gold} {...label}>
            SOL
          </text>
          {/* moon */}
          <circle cx="208" cy="76" r="9" fill="none" stroke={INK.silver} strokeWidth="2.4" />
          <path
            d="M208 67 A9 9 0 0 0 208 85 A7 7 0 0 1 208 67Z"
            fill={INK.silver}
          />
          <text x="208" y="104" textAnchor="middle" fill={INK.silver} {...label}>
            LUNA
          </text>
          {/* the point they meet on */}
          <g stroke={INK.scarlet} strokeWidth="1.7">
            <path d="M130 30 v-14M130 82 v14M104 56 h-14M156 56 h14" />
          </g>
          <circle cx="130" cy="56" r="12" fill="none" stroke={INK.scarlet} strokeWidth="2" />
          <circle cx="130" cy="56" r="4" fill={INK.scarlet} />
          <text x="130" y="14" fill={INK.scarlet} textAnchor="middle" {...label}>
            COLLISION · YOU
          </text>
        </svg>
      );
  }
}

/** The four matter-state marks inside the Centaur-Knight's nodes. */
function MatterGlyph({ index, x, y }: { index: number; x: number; y: number }) {
  switch (index) {
    case 0: // solid — a fixed lattice
      return (
        <g fill={INK.silver}>
          {[-5, 0, 5].map((dx) =>
            [-5, 0, 5].map((dy) => <circle key={`${dx}:${dy}`} cx={x + dx} cy={y + dy} r="1.5" />)
          )}
        </g>
      );
    case 1: // liquid — a level and a wave
      return (
        <g stroke={INK.silver} strokeWidth="1.4" fill="none">
          <path d={`M${x - 8} ${y + 1} q4 -4 8 0 t8 0`} />
          <path d={`M${x - 8} ${y + 6} q4 -4 8 0 t8 0`} />
        </g>
      );
    case 2: // gas — scattered
      return (
        <g fill={INK.silver}>
          <circle cx={x - 6} cy={y - 5} r="1.6" />
          <circle cx={x + 4} cy={y - 6} r="1.6" />
          <circle cx={x - 3} cy={y + 3} r="1.6" />
          <circle cx={x + 7} cy={y + 4} r="1.6" />
          <circle cx={x - 8} cy={y + 6} r="1.6" />
        </g>
      );
    default: // plasma — a discharge
      return (
        <g stroke={INK.silver} strokeWidth="1.4" fill="none" strokeLinecap="round">
          <path d={`M${x} ${y - 8} v16M${x - 7} ${y - 4} l14 8M${x + 7} ${y - 4} l-14 8`} />
        </g>
      );
  }
}
