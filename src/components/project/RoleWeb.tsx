"use client";

import type { Role } from "@/content/schema";

/* Break-In's signature element. The four roles are fully
   interdependent: hover any one and ALL of them illuminate, because
   removing any single role breaks the heist. The interaction is the
   design thesis, "nobody wins alone," made literal.

   The illumination is a shared power rail rather than four outlines.
   Each card's top edge is a filament that blooms light down into the
   card body; on hover the whole rail energises in a left-to-right
   cascade, so the four cards read as one circuit completing instead
   of four boxes changing colour. The hovered card is the focal point
   (brightest wash, deepest lift, no stagger delay) and the other
   three answer it.

   Driven entirely by CSS :has() group hover, gated behind
   (hover: hover) so touch devices get the clean static state, where
   the text alone carries the information. */

export default function RoleWeb({ roles }: { roles: Role[] }) {
  return (
    <div
      className="rw-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.25rem",
      }}
    >
      {roles.map((role, i) => (
        <article
          key={role.name}
          className="panel rw-card"
          style={{ "--rw-i": String(i) } as React.CSSProperties}
        >
          <div>
            <h3 style={{ fontSize: "var(--text-lg)", margin: 0, fontFamily: "var(--font-hero)" }}>
              {role.name}
            </h3>
            <p style={{ margin: "0.4rem 0 0", color: "var(--color-moonlight)", lineHeight: 1.55 }}>
              {role.brief}
            </p>
          </div>

          <p className="rw-tools" style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>
            {role.tools}
          </p>

          <div
            className="rw-links"
            style={{
              marginTop: "auto",
              paddingTop: "1rem",
              display: "grid",
              gap: "0.6rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline" }}>
              <span className="mono rw-key" style={{ fontSize: "0.6rem", minWidth: "5.5rem" }}>
                Depends on
              </span>
              <span style={{ fontSize: "0.85rem" }}>{role.dependsOn}</span>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline" }}>
              <span className="mono rw-key rw-key-out" style={{ fontSize: "0.6rem", minWidth: "5.5rem" }}>
                Needed by
              </span>
              <span style={{ fontSize: "0.85rem" }}>{role.neededBy}</span>
            </div>
          </div>
        </article>
      ))}

      <style>{`
        .rw-card {
          --rw-wash: 0;
          --rw-ease: cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 20%, transparent);
          border-top-color: color-mix(in srgb, var(--color-silver) 40%, transparent);
          transition:
            border-color 400ms var(--rw-ease),
            box-shadow 400ms var(--rw-ease),
            transform 400ms var(--rw-ease);
          transition-delay: 0s;
        }

        /* The filament: a lit edge that blooms down into the card. */
        .rw-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          z-index: 1;
          background: var(--color-silver);
          opacity: 0.4;
          transition:
            opacity 400ms var(--rw-ease),
            box-shadow 400ms var(--rw-ease);
          transition-delay: 0s;
        }

        /* The light the filament spills into the card body. Sits above
           the panel texture, below the text (negative z-index inside
           the card's own stacking context). */
        .rw-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: var(--rw-wash);
          background: radial-gradient(
            125% 62% at 50% 0%,
            color-mix(in srgb, var(--color-silver) 26%, transparent) 0%,
            color-mix(in srgb, var(--color-silver) 7%, transparent) 38%,
            transparent 72%
          );
          transition: opacity 400ms var(--rw-ease);
          transition-delay: 0s;
        }

        .rw-tools {
          color: var(--color-mist);
          transition: color 400ms var(--rw-ease);
        }

        .rw-links {
          border-top: 1px solid color-mix(in srgb, var(--color-mist) 18%, transparent);
          transition: border-color 400ms var(--rw-ease);
        }

        .rw-key {
          color: var(--color-mist);
          transition: color 400ms var(--rw-ease), text-shadow 400ms var(--rw-ease);
        }

        .rw-key-out { color: var(--color-silver); }

        @media (hover: hover) and (pointer: fine) {
          /* Any card hovered: the whole circuit energises, cascading
             left to right so it reads as current propagating. */
          .rw-grid:has(.rw-card:hover) .rw-card {
            --rw-wash: 0.72;
            border-color: color-mix(in srgb, var(--color-silver) 20%, transparent);
            border-top-color: color-mix(in srgb, var(--color-silver) 85%, transparent);
            box-shadow: 0 14px 34px -22px color-mix(in srgb, var(--color-silver) 60%, transparent);
            transform: translateY(-2px);
            transition-delay: calc(var(--rw-i) * 65ms);
          }

          .rw-grid:has(.rw-card:hover) .rw-card::before {
            opacity: 1;
            box-shadow: 0 0 14px 1px color-mix(in srgb, var(--color-silver) 45%, transparent);
            transition-delay: calc(var(--rw-i) * 65ms);
          }

          .rw-grid:has(.rw-card:hover) .rw-card::after {
            transition-delay: calc(var(--rw-i) * 65ms);
          }

          .rw-grid:has(.rw-card:hover) .rw-links {
            border-top-color: color-mix(in srgb, var(--color-silver) 32%, transparent);
            transition-delay: calc(var(--rw-i) * 65ms);
          }

          .rw-grid:has(.rw-card:hover) .rw-key {
            color: color-mix(in srgb, var(--color-silver) 88%, transparent);
            transition-delay: calc(var(--rw-i) * 65ms);
          }

          .rw-grid:has(.rw-card:hover) .rw-tools {
            color: color-mix(in srgb, var(--color-moonlight) 62%, var(--color-mist));
            transition-delay: calc(var(--rw-i) * 65ms);
          }

          /* The card under the cursor is the source: it responds with
             no delay and burns a step brighter than the rest. Its edge
             stays soft on purpose — the lift, the wash and the bloom
             carry the focus, not a hard amber rectangle. */
          .rw-grid:has(.rw-card:hover) .rw-card:hover {
            --rw-wash: 1;
            border-color: color-mix(in srgb, var(--color-silver) 34%, transparent);
            border-top-color: var(--color-silver);
            box-shadow: 0 22px 46px -24px color-mix(in srgb, var(--color-silver) 75%, transparent);
            transform: translateY(-6px);
            transition-delay: 0s;
          }

          .rw-grid:has(.rw-card:hover) .rw-card:hover::before {
            box-shadow: 0 0 26px 4px color-mix(in srgb, var(--color-silver) 75%, transparent);
            transition-delay: 0s;
          }

          .rw-grid:has(.rw-card:hover) .rw-card:hover::after {
            transition-delay: 0s;
          }

          .rw-grid:has(.rw-card:hover) .rw-card:hover .rw-links {
            border-top-color: color-mix(in srgb, var(--color-silver) 45%, transparent);
            transition-delay: 0s;
          }

          .rw-grid:has(.rw-card:hover) .rw-card:hover .rw-key {
            color: var(--color-silver);
            text-shadow: 0 0 12px color-mix(in srgb, var(--color-silver) 45%, transparent);
            transition-delay: 0s;
          }

          .rw-grid:has(.rw-card:hover) .rw-card:hover .rw-tools {
            color: var(--color-moonlight);
            transition-delay: 0s;
          }
        }

        /* No motion: the circuit still lights, it just does not move. */
        @media (prefers-reduced-motion: reduce) {
          .rw-card,
          .rw-grid:has(.rw-card:hover) .rw-card,
          .rw-grid:has(.rw-card:hover) .rw-card:hover {
            transform: none !important;
          }
          .rw-card,
          .rw-card::before,
          .rw-card::after,
          .rw-links,
          .rw-key,
          .rw-tools,
          .rw-grid:has(.rw-card:hover) .rw-card,
          .rw-grid:has(.rw-card:hover) .rw-card::before,
          .rw-grid:has(.rw-card:hover) .rw-card::after,
          .rw-grid:has(.rw-card:hover) .rw-links,
          .rw-grid:has(.rw-card:hover) .rw-key,
          .rw-grid:has(.rw-card:hover) .rw-tools {
            transition-delay: 0s !important;
          }
        }
      `}</style>
    </div>
  );
}
