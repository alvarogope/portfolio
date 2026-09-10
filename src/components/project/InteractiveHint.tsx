export default function InteractiveHint({
  what,
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
          ? `Drag, scroll or tab to the ${what} and use the arrow keys ${does}`
          : `Point at, tap or tab any ${what}. ${does}`}
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
