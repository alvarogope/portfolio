"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  getMarker,
  mapAlt,
  mapMarkers,
  markerTypeMeta,
  planLinkSuffix,
  regionProfileLabels,
  regionProfilePointer,
  resolveRegion,
  type MapMarker,
  type MarkerId,
  type MarkerType,
  type ResolvedRegion,
} from "@/content/moon-knight-map";
import InteractiveHint from "./InteractiveHint";

const MAP_SRC = "/images/moon-knight/world-map.jpg";
const MAP_W = 2048;
const MAP_H = 1536;

/* ---- sigils ---- */
function Sigil({ type }: { type: MarkerType }) {
  if (type === "fortress") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path
          d="M10 2.5c2.9 3.3 4.5 5.8 4.5 8.1a4.5 4.5 0 0 1-9 0c0-2.3 1.6-4.8 4.5-8.1Z"
          fill="currentColor"
        />
        <path
          className="wm-flame-core"
          d="M10 8.4c1.2 1.5 1.8 2.6 1.8 3.6a1.8 1.8 0 0 1-3.6 0c0-1 .6-2.1 1.8-3.6Z"
        />
      </svg>
    );
  }
  if (type === "dungeon") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="10" cy="10" r="1.4" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M10 2.6 17.4 10 10 17.4 2.6 10Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.3" fill="currentColor" />
    </svg>
  );
}

/* ---- popover placement ---- */
type Align = "start" | "center" | "end";

const alignOf = (xPct: number): Align => (xPct <= 25 ? "start" : xPct >= 75 ? "end" : "center");
const sideOf = (yPct: number): "above" | "below" => (yPct < 42 ? "below" : "above");

/* ---- the region profile ---- */
function Names({
  refs,
  linked,
}: {
  refs: readonly { entry: { name: string }; href: string }[];
  linked: boolean;
}) {
  return (
    <>
      {refs.map((ref, i) => (
        <span key={ref.href}>
          {i > 0 && <span className="wm-sep" aria-hidden="true"> · </span>}
          {linked ? (
            <Link className="wm-link" href={ref.href}>
              {ref.entry.name}
            </Link>
          ) : (
            ref.entry.name
          )}
        </span>
      ))}
    </>
  );
}

function ProfileRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="wm-prof-row">
      <dt className="mono wm-prof-label">{label}</dt>
      <dd className="wm-prof-value">{children}</dd>
    </div>
  );
}

function RegionProfileView({ region }: { region: ResolvedRegion }) {
  if (region.isEmpty) return null;

  const plan = region.level
    ? {
        href: `#bc-tab-${region.level.id}`,
        label: [region.level.ordinal, region.level.stageLabel, region.level.name]
          .filter(Boolean)
          .join(" · "),
      }
    : null;

  return (
    <dl className="wm-prof">
      {region.cast.length > 0 && (
        <ProfileRow label={regionProfileLabels.cast}>
          <Names refs={region.cast} linked />
        </ProfileRow>
      )}

      {(region.enemies.length > 0 || region.boss) && (
        <ProfileRow label={regionProfileLabels.guards}>
          <Names refs={region.enemies} linked />
          {region.boss && (
            <span className="wm-boss">
              {region.enemies.length > 0 && (
                <span className="wm-sep" aria-hidden="true"> · </span>
              )}
              <span className="mono wm-boss-tag">{regionProfileLabels.boss}</span>{" "}
              <Names refs={[region.boss]} linked />
            </span>
          )}
        </ProfileRow>
      )}

      {plan && (
        <ProfileRow label={regionProfileLabels.plan}>
          <Link href={plan.href} className="wm-link">
            {plan.label}
          </Link>{" "}
          <span className="wm-plan-suffix">— {planLinkSuffix}</span>
        </ProfileRow>
      )}
    </dl>
  );
}

function PinLabel({ marker }: { marker: MapMarker }) {
  return (
    <span className={`wm-tag align-${alignOf(marker.xPct)} side-${sideOf(marker.yPct)}`} aria-hidden="true">
      {marker.label}
    </span>
  );
}

export default function WorldMap() {
  const [selected, setSelected] = useState<MarkerId>(mapMarkers[0].id);

  const marker = getMarker(selected);
  const region = resolveRegion(selected);

  const hover = (id: MarkerId) => (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") setSelected(id);
  };

  return (
    <div className="wm">
      <InteractiveHint what="sigil" does="its lore, who is there and what guards it read out below" />

      <div className="wm-frame">
        <div className="wm-plate">
          <Image
            className="wm-img"
            src={MAP_SRC}
            alt={mapAlt}
            width={MAP_W}
            height={MAP_H}
            quality={92}
            sizes="(max-width: 900px) 94vw, 62rem"
            style={{ width: "100%", height: "auto" }}
          />

          {mapMarkers.map((m, index) => {
            const isSelected = m.id === selected;
            return (
              <div
                key={m.id}
                className={`wm-marker is-${m.type} ${isSelected ? "is-selected" : ""}`}
                style={
                  {
                    left: `${m.xPct}%`,
                    top: `${m.yPct}%`,
                    "--wm-i": index,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className="wm-pin"
                  aria-label={`${m.label} — ${markerTypeMeta[m.type].term}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(m.id)}
                  onFocus={() => setSelected(m.id)}
                  onPointerEnter={hover(m.id)}
                >
                  <Sigil type={m.type} />
                </button>
                {isSelected && <PinLabel marker={m} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* THE INDEX */}
      <div className="wm-index" role="group" aria-label="Places in Kaelum">
        {mapMarkers.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`wm-chip is-${m.type}${m.id === selected ? " is-on" : ""}`}
            aria-pressed={m.id === selected}
            onClick={() => setSelected(m.id)}
            onFocus={() => setSelected(m.id)}
            onPointerEnter={hover(m.id)}
          >
            <span className="wm-chip-sigil" aria-hidden="true">
              <Sigil type={m.type} />
            </span>
            {m.label}
          </button>
        ))}
      </div>

      {/* THE ONE DETAIL PANEL */}
      <div className="wm-readout" role="status">
        <p className="mono wm-readout-type">{markerTypeMeta[marker.type].term}</p>
        <p className="wm-readout-name">{marker.label}</p>
        <p className="wm-readout-lore">{marker.lore}</p>
        {region && !region.isEmpty && <RegionProfileView region={region} />}
      </div>

      <div className="wm-under">
        <dl className="wm-key">
          {(Object.keys(markerTypeMeta) as MarkerType[]).map((type) => (
            <div key={type} className={`wm-key-row is-${type}`}>
              <dt className="wm-key-head">
                <span className="wm-key-sigil" aria-hidden="true">
                  <Sigil type={type} />
                </span>
                <span className="mono wm-key-term">{markerTypeMeta[type].term}</span>
              </dt>
              <dd className="wm-key-gloss">{markerTypeMeta[type].gloss}</dd>
            </div>
          ))}
        </dl>
      </div>

      <style>{`
        .wm {
          --wm-ink: #0E131C;
          --wm-edge: color-mix(in srgb, var(--color-mist) 24%, transparent);
          /* --color-mist is 4.41:1 here, under the AA bar for small type. */
          --wm-quiet: #93A0B3;
          --wm-rose: color-mix(in srgb, var(--color-scarlet) 60%, var(--color-moonlight));
          display: grid;
          gap: 1.5rem;
          justify-items: start;
        }

        /* ---- the plate ---- */
        .wm-frame {
          width: 100%;
          max-width: 62rem;
          padding: 0.6rem;
          background: var(--wm-ink);
          border: 1px solid var(--wm-edge);
        }
        .wm-plate { position: relative; line-height: 0; }
        .wm-img { display: block; width: 100%; height: auto; }

        /* ---- markers ----
           Placed by percentage, sized in pixels. The position has to scale with
           the art or it drifts off the coastline; the pin must NOT, or it would
           be a 9px target on a phone. */
        .wm-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          line-height: 1;
        }
        .wm-marker.is-selected { z-index: 3; }

        .wm-pin {
          --wm-pin-size: clamp(26px, 3vw, 34px);
          position: relative;
          display: grid;
          place-items: center;
          width: var(--wm-pin-size);
          height: var(--wm-pin-size);
          padding: 0;
          appearance: none;
          border: 1px solid currentColor;
          border-radius: 50%;
          /* The art underneath runs from pale rock to near-black sea, so every
             sigil carries its own dark plate rather than trusting the map. */
          background: color-mix(in srgb, var(--color-void) 76%, transparent);
          backdrop-filter: blur(2px);
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1),
                      background-color 200ms ease;
        }
        /* Grows the tap target to ~48px without growing the sigil. */
        .wm-pin::before {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 50%;
        }
        .wm-pin svg { width: 62%; height: 62%; overflow: visible; }
        .wm-pin:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 3px;
        }

        .wm-marker.is-area .wm-pin { color: var(--color-silver); }
        .wm-marker.is-fortress .wm-pin { color: var(--color-gold); }
        .wm-marker.is-dungeon .wm-pin { color: var(--wm-rose); }
        .wm-flame-core { fill: var(--color-void); opacity: 0.5; }

        /* THE RESTING AFFORDANCE. Every pin carries a faint halo before it is
           touched, so the sigils read as controls sitting ON the art rather
           than as painted detail IN it. Hover and selection strengthen the
           same ring rather than introducing a new one. */
        .wm-pin::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 26%, transparent);
          transition: box-shadow 200ms ease;
        }
        .wm-pin:hover,
        .wm-marker.is-selected .wm-pin {
          transform: scale(1.14);
          background: color-mix(in srgb, var(--color-void) 88%, transparent);
          box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 45%, transparent),
                      0 0 14px color-mix(in srgb, currentColor 55%, transparent);
        }
        .wm-pin:hover::after,
        .wm-marker.is-selected .wm-pin::after {
          box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 60%, transparent);
        }

        /* A torch is a flame, so the three fortresses breathe. The lands and
           the dungeons hold still — eight pulsing markers over hand-painted
           art would be a light show, not a map. */
        .wm-marker.is-fortress .wm-pin svg {
          animation: wm-flicker 3.4s ease-in-out infinite;
          animation-delay: calc(var(--wm-i) * -0.73s);
        }
        @keyframes wm-flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          45% { opacity: 0.78; transform: scale(0.94); }
          70% { opacity: 0.95; transform: scale(1.03); }
        }

        /* ---- the pinned name ----
           Decorative: the readout below is the accessible copy, and the pin's
           own aria-label already carries the name. */
        .wm-tag {
          position: absolute;
          z-index: 4;
          width: max-content;
          max-width: 14rem;
          padding: 0.2rem 0.5rem 0.24rem;
          background: var(--wm-ink);
          border: 1px solid color-mix(in srgb, var(--color-silver) 40%, transparent);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          line-height: 1.4;
          color: var(--color-moonlight);
          pointer-events: none;
        }
        .wm-tag.side-top { top: calc(100% + 0.5rem); }
        .wm-tag.side-bottom { bottom: calc(100% + 0.5rem); }
        .wm-tag.align-left { left: 50%; transform: translateX(-0.9rem); }
        .wm-tag.align-center { left: 50%; transform: translateX(-50%); }
        .wm-tag.align-right { right: 50%; transform: translateX(0.9rem); }

        /* ---- the one readout ---- */
        .wm-readout {
          width: 100%;
          max-width: 62rem;
          padding: 1rem 1.15rem 1.15rem;
          background: var(--wm-ink);
          border: 1px solid color-mix(in srgb, var(--color-silver) 34%, transparent);
          border-left: 3px solid var(--color-lunar-gold);
        }
        .wm-readout-type { margin: 0; font-size: 0.70rem; color: var(--wm-quiet); }
        .wm-readout-name {
          margin: 0.25rem 0 0;
          font-family: var(--font-hero);
          font-size: 1.25rem;
          letter-spacing: 0.03em;
          color: var(--color-moonlight);
        }
        .wm-readout-lore {
          margin: 0.5rem 0 0;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-moonlight);
          max-width: 48rem;
        }

        /* ---- the index ---- */
        .wm-index {
          width: 100%;
          max-width: 62rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .wm-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.42rem 0.8rem;
          appearance: none;
          background: transparent;
          border: 1px solid var(--wm-edge);
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 0.84rem;
          line-height: 1.3;
          color: var(--color-moonlight);
          cursor: pointer;
          touch-action: manipulation;
          transition: border-color 160ms ease, background-color 160ms ease;
        }
        .wm-chip:hover { border-color: color-mix(in srgb, var(--color-lunar-gold) 60%, transparent); }
        .wm-chip.is-on {
          border-color: var(--color-lunar-gold);
          background: color-mix(in srgb, var(--color-lunar-gold) 10%, transparent);
        }
        .wm-chip:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        .wm-chip-sigil { display: inline-grid; place-items: center; width: 1rem; height: 1rem; }
        .wm-chip-sigil svg { width: 100%; height: 100%; }
        .wm-chip.is-area .wm-chip-sigil { color: var(--color-silver); }
        .wm-chip.is-fortress .wm-chip-sigil { color: var(--color-gold); }
        .wm-chip.is-dungeon .wm-chip-sigil { color: var(--wm-rose); }

        /* ---- key ---- */
        .wm-under {
          max-width: 62rem;
          width: 100%;
          display: grid;
          gap: 0.9rem;
        }
        .wm-key {
          margin: 0;
          padding: 0.9rem 0 0;
          border-top: 1px solid var(--wm-edge);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
          gap: 0.9rem 1.6rem;
        }
        .wm-key-row.is-area { color: var(--color-silver); }
        .wm-key-row.is-fortress { color: var(--color-gold); }
        .wm-key-row.is-dungeon { color: var(--wm-rose); }
        .wm-key-head { display: flex; align-items: center; gap: 0.45rem; }
        .wm-key-sigil { display: inline-grid; place-items: center; width: 1.05rem; height: 1.05rem; }
        .wm-key-sigil svg { width: 100%; height: 100%; }
        .wm-key-term { font-size: 0.71rem; color: var(--wm-quiet); }
        .wm-key-gloss {
          margin: 0.3rem 0 0;
          font-family: var(--font-body);
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--wm-quiet);
        }

        /* ---- the region profile ----
           A definition list, because that is what it is: three short answers
           about one place. Kept to names — the descriptions are a click away,
           which is the whole design. */
        .wm-prof {
          margin: 0.85rem 0 0;
          padding-top: 0.75rem;
          border-top: 1px solid var(--wm-edge);
          display: grid;
          gap: 0.4rem;
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.55;
        }
        .wm-prof-row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.1rem 0.6rem;
        }
        .wm-prof-label {
          flex: 0 0 7.6rem;
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.13em;
          color: var(--wm-quiet);
          line-height: 1.9;
        }
        .wm-prof-value { flex: 1 1 12rem; min-width: 0; margin: 0; color: var(--color-moonlight); }
        .wm-sep { color: var(--wm-quiet); }
        .wm-plan-suffix { color: var(--wm-quiet); font-size: 0.8rem; }

        /* The boss is the one name in the row that is not an equal of the
           others, so it is tagged rather than merely listed last. */
        .wm-boss-tag {
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          color: var(--color-gold);
        }

        /* Gold at full strength is 9.6:1 on this ink, so the link colour
           carries. Underlined from the start: these are cross-references into
           other sections and they should look like it before they are
           hovered. */
        .wm-link {
          color: var(--color-gold);
          text-decoration: underline;
          text-decoration-color: color-mix(in srgb, var(--color-gold) 45%, transparent);
          text-underline-offset: 0.18em;
        }
        .wm-link:hover,
        .wm-link:focus-visible { text-decoration-color: currentColor; }
        .wm-link:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }

        .wm-pointer {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.8rem;
          line-height: 1.55;
          color: var(--wm-quiet);
          max-width: 52rem;
        }

        /* On a narrow screen a label pinned to a sigil would cover the land it
           names, and there is no room for it anyway. The chips and the readout
           do the whole job there. */
        @media (max-width: 640px) {
          .wm-tag { display: none; }
          .wm-frame { padding: 0.35rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wm-marker.is-fortress .wm-pin svg { animation: none; }
          .wm-pin, .wm-pin::after, .wm-chip { transition: none; }
        }
      `}</style>
    </div>
  );
}
