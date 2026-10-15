import {
  bestiaryAnchor,
  bestiaryBosses,
  bestiaryEnemies,
  type BossEntry,
  type EnemyEntry,
  type WeaknessType,
} from "@/content/moon-knight-bestiary";
import { CreatureEmblem, EmblemSprite } from "./BestiaryEmblems";
import BossPlateArch from "./BossPlateArch";

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
        <h3 className="mono mkb__tier-name">Basic Enemies</h3>
        <span className="mkb__tier-rule" aria-hidden />
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
