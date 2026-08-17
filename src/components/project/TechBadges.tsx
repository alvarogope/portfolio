"use client";

export type TechItem = { name: string; icon?: string };
export type TechGroup = { label: string; items: TechItem[] };

const INVERT = new Set(["unity", "unreal"]);

const BADGE = 60;
const ICON = 34;

export default function TechBadges({ groups }: { groups: TechGroup[] }) {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {groups.map((group) => (
        <div key={group.label} style={{ display: "grid", gap: "0.7rem" }}>
          <span
            className="mono"
            style={{ fontSize: "0.72rem", color: "var(--color-silver)" }}
          >
            {group.label}
          </span>

          <ul className="tb-row">
            {group.items.map((item) => (
              <Badge key={item.name} item={item} />
            ))}
          </ul>
        </div>
      ))}

      <style>{`
        .tb-row {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .tb-badge {
          position: relative;
          height: ${BADGE}px;
          min-width: ${BADGE}px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid color-mix(in srgb, var(--color-mist) 30%, transparent);
          border-radius: 3px;
          background: color-mix(in srgb, var(--color-nightfall) 60%, transparent);
          transition: border-color 0.18s ease, background 0.18s ease;
        }

        /* Text-only chips keep the badge height and frame, and simply
           run wider than a square. */
        .tb-badge--text {
          padding: 0 0.7rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-moonlight);
          white-space: nowrap;
        }

        .tb-badge:hover,
        .tb-badge:focus-visible {
          border-color: color-mix(in srgb, var(--color-silver) 60%, transparent);
          background: color-mix(in srgb, var(--color-nightfall) 95%, transparent);
        }

        .tb-badge:focus-visible {
          outline: 2px solid var(--color-silver);
          outline-offset: 3px;
        }
        .tb-badge:focus:not(:focus-visible) { outline: none; }

        /* The name, revealed on hover AND on keyboard focus. */
        .tb-tip {
          position: absolute;
          bottom: calc(100% + 7px);
          left: 50%;
          transform: translateX(-50%) translateY(3px);
          padding: 0.28rem 0.5rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 35%, transparent);
          border-radius: 3px;
          background: var(--color-void);
          color: var(--color-moonlight);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.16s ease, transform 0.16s ease;
          z-index: 2;
        }

        .tb-badge:hover .tb-tip,
        .tb-badge:focus-visible .tb-tip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .tb-badge, .tb-tip { transition: none; }
        }
      `}</style>
    </div>
  );
}

function Badge({ item }: { item: TechItem }) {
  const { name, icon } = item;

  return (
    <li
      className={`tb-badge${icon ? "" : " tb-badge--text"}`}
      tabIndex={0}
      role="img"
      aria-label={name}
    >
      {icon ? (
        <img
          src={`/images/tech/${encodeURIComponent(icon)}.svg`}
          alt=""
          aria-hidden
          width={ICON}
          height={ICON}
          style={{
            width: ICON,
            height: ICON,
            display: "block",
            filter: INVERT.has(icon) ? "brightness(0) invert(1)" : undefined,
          }}
        />
      ) : (
        name
      )}
      {icon && (
        <span className="tb-tip" aria-hidden>
          {name}
        </span>
      )}
    </li>
  );
}
