"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getMarker,
  mapAlt,
  mapMarkers,
  markerTypeMeta,
  regionProfileLabels,
  regionProfilePointer,
  resolveRegion,
  type MapMarker,
  type MarkerId,
  type MarkerType,
  type ResolvedRegion,
} from "@/content/moon-knight-map";

/**
 * Moon-Knight — the world of Kaelum, over the hand-drawn map.
 *
 * The art is the thing; everything this component adds is meant to sit on top
 * of it without competing with it. Eight markers are placed in percentages of
 * the image (see `moon-knight-map.ts`), so they stay registered to the
 * coastline at every width, and each one opens the lore for its place.
 *
 * TWO WAYS IN, one selection behind them:
 *
 *   - THE MAP. Hover, tap or tab a sigil and its lore opens in a popover
 *     anchored to it. Which way the popover opens is derived from the marker's
 *     own coordinates, so a marker moved in the data file re-picks its side
 *     rather than needing anything here changed.
 *   - THE LIST under the map. The same eight places as running text, always
 *     visible: the reading path on a phone, the text equivalent of the map for
 *     a screen reader, and a way to light a marker up without hunting for it.
 *
 * The list selects a marker but does not open its popover — hence `from` on the
 * selection. Reading down the list lights the map up in step; it does not throw
 * a panel of text you are already reading over the art.
 *
 * EACH PLACE CARRIES A PROFILE, and it is the reason the map earns its section:
 * beside the lore, a marker says who is here, what guards it, and when in the
 * story it comes. All of it is resolved from ids by `resolveRegion` — the
 * creature is the bestiary's entry, the character is the cast's, the level is
 * the beat chart's — so this component prints names and hrefs and never a
 * description. The map answers WHAT IS WHERE; the sections it links to answer
 * what those things are.
 *
 * NAMES ARE LINKS IN THE LIST, PLAIN TEXT IN THE POPOVER. The popover is a
 * `role="tooltip"`, and a tooltip is the wrong place to put a row of links a
 * reader has to chase a closing panel to click. The list under the map is
 * always present at every width, is the map's text equivalent, and is where
 * the same profile appears with every name as a real anchor into §04, §07 and
 * §11. Nothing is reachable only through the popover.
 *
 * CLOSING. A mouse leaving a marker closes its popover at once, and focus
 * leaving does the same — the ordinary tooltip contract. Three things keep
 * that from being annoying:
 *
 *   - The popover is a descendant of the marker, and a transparent bridge
 *     spans the gap between the two, so moving the pointer INTO the popover to
 *     read it does not count as leaving. (WCAG 1.4.13 asks for exactly this:
 *     hover content must be hoverable as well as dismissable.)
 *   - Touch is exempt. A tap fires a pointerleave of its own the moment the
 *     finger lifts, which would shut the popover before it was read, so only a
 *     mouse or pen closes on leave. A tap is cleared by tapping open water,
 *     the dismiss button, or another marker.
 *   - Escape still clears from anywhere.
 */

const MAP_SRC = "/images/moon-knight/world-map.jpg";
const MAP_W = 2048;
const MAP_H = 1536;

type Source = "map" | "list";

interface Selection {
  id: MarkerId;
  from: Source;
}

/* ---- sigils ----
   One glyph per kind of place, drawn rather than typed so they stay crisp at
   any marker size: a diamond for a land, a flame for a torch-marked fortress,
   a rosette for the roses that mark the Old Gods quests. All three take
   `currentColor`, so the marker's colour is set once in CSS. */
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

/* ---- popover placement ----
   Derived from the marker's own coordinates so the data file stays the only
   place a position is written down. A marker in the left quarter opens its
   popover rightwards from itself, one in the right quarter leftwards, and
   anything between opens centred; a marker in the top of the map opens
   downwards. The result never leaves the frame. */
type Align = "start" | "center" | "end";

const alignOf = (xPct: number): Align => (xPct <= 25 ? "start" : xPct >= 75 ? "end" : "center");
const sideOf = (yPct: number): "above" | "below" => (yPct < 42 ? "below" : "above");

/* ---- the region profile ----
   One component, three places: over the art, in the phone readout, and in the
   list. `linked` is the only thing that differs — see the note in the header
   about why the popover's copy is inert. Rows are omitted rather than blanked:
   a fortress has no residents and the dungeons have no act, and printing "—"
   three times would make the profile look like a form nobody filled in. */
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
            <a className="wm-link" href={ref.href}>
              {ref.entry.name}
            </a>
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

function RegionProfileView({
  region,
  linked,
}: {
  region: ResolvedRegion;
  linked: boolean;
}) {
  if (region.isEmpty) return null;

  /* The moon phase and the act are the same reading taken twice, so they sit
     on one line rather than as two rows saying the same progress. */
  const when = [region.level?.ordinal, region.act?.actLabel, region.level?.phaseLabel]
    .filter(Boolean)
    .join(" · ");
  /* The act names the fragment; the beat chart phrases it as a task. Prefer
     the act's name where there is one, since that is what the story calls it. */
  const objective = region.act?.fragment ?? region.level?.cells.objective ?? null;

  return (
    <dl className="wm-prof">
      {region.cast.length > 0 && (
        <ProfileRow label={regionProfileLabels.cast}>
          <Names refs={region.cast} linked={linked} />
        </ProfileRow>
      )}

      {(region.enemies.length > 0 || region.boss) && (
        <ProfileRow label={regionProfileLabels.guards}>
          <Names refs={region.enemies} linked={linked} />
          {region.boss && (
            <span className="wm-boss">
              {region.enemies.length > 0 && (
                <span className="wm-sep" aria-hidden="true"> · </span>
              )}
              <span className="mono wm-boss-tag">{regionProfileLabels.boss}</span>{" "}
              <Names refs={[region.boss]} linked={linked} />
            </span>
          )}
        </ProfileRow>
      )}

      {when && <ProfileRow label={regionProfileLabels.when}>{when}</ProfileRow>}
      {objective && (
        <ProfileRow label={regionProfileLabels.objective}>{objective}</ProfileRow>
      )}
    </dl>
  );
}

function Popover({ marker, onDismiss }: { marker: MapMarker; onDismiss: () => void }) {
  const meta = markerTypeMeta[marker.type];
  const region = resolveRegion(marker.id);
  return (
    <div
      className={`wm-pop align-${alignOf(marker.xPct)} side-${sideOf(marker.yPct)}`}
      role="tooltip"
      id={`wm-pop-${marker.id}`}
    >
      <p className="mono wm-pop-type">{meta.term}</p>
      <p className="wm-pop-name">{marker.label}</p>
      <p className="wm-pop-lore">{marker.lore}</p>
      {region && !region.isEmpty && <RegionProfileView region={region} linked={false} />}
      <button type="button" className="wm-pop-close" onClick={onDismiss} aria-label="Dismiss">
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}

export default function WorldMap() {
  const [selection, setSelection] = useState<Selection | null>(null);

  const selected = selection ? getMarker(selection.id) : null;
  const selectedRegion = selection ? resolveRegion(selection.id) : null;

  const select = (id: MarkerId, from: Source) => setSelection({ id, from });
  const clear = () => setSelection(null);

  /* Hover on a fine pointer only. A touch fires a synthetic enter before its
     click, and letting that through would open a popover under the finger
     that is still travelling. */
  const hover = (id: MarkerId, from: Source) => (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") select(id, from);
  };

  /* Closes on the way out, but only for a pointer that can actually hover: a
     touch fires pointerleave as the finger lifts, and honouring that would
     close the popover a tap had just opened. */
  const unhover = (id: MarkerId) => (event: React.PointerEvent) => {
    if (event.pointerType !== "touch" && selection?.id === id) clear();
  };

  /* Focus leaving the marker entirely — not merely moving from the sigil to
     the dismiss button inside its own popover. */
  const unfocus = (id: MarkerId) => (event: React.FocusEvent<HTMLElement>) => {
    if (selection?.id !== id) return;
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    clear();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="wm">
      {/* A click that missed every sigil lands on open water and clears the
          selection — the pointer equivalent of Escape. */}
      <div
        className="wm-frame"
        onClick={(event) => {
          if (!(event.target as HTMLElement).closest("button")) clear();
        }}
      >
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

          {mapMarkers.map((marker, index) => {
            const isSelected = selection?.id === marker.id;
            const isOpen = isSelected && selection?.from === "map";
            return (
              <div
                key={marker.id}
                className={`wm-marker is-${marker.type} ${isSelected ? "is-selected" : ""}`}
                onPointerLeave={unhover(marker.id)}
                onBlur={unfocus(marker.id)}
                style={
                  {
                    left: `${marker.xPct}%`,
                    top: `${marker.yPct}%`,
                    "--wm-i": index,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className="wm-pin"
                  aria-label={`${marker.label} — ${markerTypeMeta[marker.type].term}`}
                  aria-pressed={isSelected}
                  aria-describedby={isOpen ? `wm-pop-${marker.id}` : undefined}
                  onClick={() => select(marker.id, "map")}
                  onFocus={() => select(marker.id, "map")}
                  onPointerEnter={hover(marker.id, "map")}
                >
                  <Sigil type={marker.type} />
                </button>
                {isOpen && <Popover marker={marker} onDismiss={clear} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* The phone's answer to the popover. Same content, under the art
          instead of over it, so a tap always puts the lore in view. */}
      {selected && (
        <div className="wm-readout" role="status">
          <p className="mono wm-readout-type">{markerTypeMeta[selected.type].term}</p>
          <p className="wm-readout-name">{selected.label}</p>
          <p className="wm-readout-lore">{selected.lore}</p>
          {selectedRegion && !selectedRegion.isEmpty && (
            <RegionProfileView region={selectedRegion} linked />
          )}
        </div>
      )}

      {/* The key decodes the three sigils AND carries what each kind of place
          is in general, so the specific lore on a marker never has to repeat
          it — the fortress framing would otherwise be printed three times. */}
      <div className="wm-under">
        <p className="mono wm-hint">Point at, tap or tab a sigil to read its lore</p>
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

      {/* The same eight places as text. Visible at every width: on a phone it
          is how you read the map, and for a screen reader it is the map. */}
      <ol className="wm-list">
        {mapMarkers.map((marker) => {
          const isSelected = selection?.id === marker.id;
          const region = resolveRegion(marker.id);
          return (
            <li
              key={marker.id}
              className={`panel wm-item is-${marker.type} ${isSelected ? "is-selected" : ""}`}
              onPointerLeave={unhover(marker.id)}
              onBlur={unfocus(marker.id)}
            >
              <h3 className="wm-item-name">
                <button
                  type="button"
                  className="wm-item-hit"
                  aria-pressed={isSelected}
                  onClick={() => select(marker.id, "list")}
                  onFocus={() => select(marker.id, "list")}
                  onPointerEnter={hover(marker.id, "list")}
                >
                  <span className="wm-item-sigil" aria-hidden="true">
                    <Sigil type={marker.type} />
                  </span>
                  {marker.label}
                </button>
              </h3>
              <p className="mono wm-item-type">{markerTypeMeta[marker.type].term}</p>
              <p className="wm-item-lore">{marker.lore}</p>
              {region && !region.isEmpty && <RegionProfileView region={region} linked />}
            </li>
          );
        })}
      </ol>

      {/* The hand-off, once, under the whole index. */}
      <p className="wm-pointer">{regionProfilePointer}</p>

      <style>{`
        .wm {
          /* Mist is 4.41:1 on .panel — under the 4.5 bar — so the small mono
             type takes a lift toward moonlight: 7.4:1 on .panel, 8.6:1 on the
             near-black popover. */
          --wm-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          --wm-edge: color-mix(in srgb, var(--color-mist) 34%, transparent);
          /* Scarlet at full strength is 2.2:1 on near-black — too dark to read
             as a mark. Lifted it lands at 3.8:1, over the 3:1 bar for a
             graphical object, and still reads as the roses on the map. */
          --wm-rose: color-mix(in srgb, var(--color-scarlet) 72%, var(--color-moonlight));
          --wm-ink: color-mix(in srgb, var(--color-void) 92%, #000);

          display: grid;
          gap: 1.25rem;
        }

        /* ---- the frame ----
           A gothic double rule: an outer border, an inset hairline, and four
           corner ticks. Nothing rounded — the whole route is squared off. */
        .wm-frame {
          position: relative;
          max-width: 62rem;
          width: 100%;
          margin-inline: auto;
          padding: 0.55rem;
          border: 1px solid color-mix(in srgb, var(--color-silver) 34%, transparent);
          background:
            linear-gradient(
              color-mix(in srgb, var(--color-nightfall) 70%, transparent),
              color-mix(in srgb, var(--color-void) 70%, transparent)
            );
        }
        .wm-frame::before {
          content: "";
          position: absolute;
          inset: 0.22rem;
          border: 1px solid color-mix(in srgb, var(--color-silver) 16%, transparent);
          pointer-events: none;
        }

        .wm-plate {
          position: relative;
          /* Held to the art's own ratio so the markers are in place before the
             image itself has arrived. */
          aspect-ratio: ${MAP_W} / ${MAP_H};
          line-height: 0;
        }
        .wm-img {
          display: block;
          width: 100%;
          height: auto;
        }

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
        .wm-pin svg {
          width: 62%;
          height: 62%;
          overflow: visible;
        }
        .wm-pin:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 3px;
        }

        .wm-marker.is-area .wm-pin { color: var(--color-silver); }
        .wm-marker.is-fortress .wm-pin { color: var(--color-gold); }
        .wm-marker.is-dungeon .wm-pin { color: var(--wm-rose); }
        .wm-flame-core { fill: var(--color-void); opacity: 0.5; }

        .wm-pin:hover,
        .wm-marker.is-selected .wm-pin {
          transform: scale(1.14);
          background: color-mix(in srgb, var(--color-void) 88%, transparent);
          box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 45%, transparent),
                      0 0 14px color-mix(in srgb, currentColor 55%, transparent);
        }

        /* A torch is a flame, so the three fortresses breathe. The lands and
           the dungeons hold still — eight pulsing markers over hand-painted
           art would be a light show, not a map. */
        .wm-marker.is-fortress .wm-pin svg {
          animation: wm-flicker 3.4s ease-in-out infinite;
        }
        /* Offset per marker so the three torches never beat in unison. */
        .wm-marker.is-fortress .wm-pin svg { animation-delay: calc(var(--wm-i) * -0.73s); }

        @keyframes wm-flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          45% { opacity: 0.78; transform: scale(0.94); }
          70% { opacity: 0.95; transform: scale(1.03); }
        }

        /* ---- popover ---- */
        .wm-pop {
          position: absolute;
          z-index: 4;
          width: max-content;
          max-width: min(23rem, 74vw);
          padding: 0.7rem 0.85rem 0.8rem;
          background: var(--wm-ink);
          border: 1px solid color-mix(in srgb, var(--color-silver) 40%, transparent);
          box-shadow: 0 10px 30px color-mix(in srgb, #000 55%, transparent);
          text-align: left;
          line-height: 1.5;
        }
        .wm-pop.side-below { top: calc(100% + 0.6rem); }
        .wm-pop.side-above { bottom: calc(100% + 0.6rem); }

        /* The 0.6rem of air between sigil and popover is map, not marker, so a
           pointer crossing it would fire pointerleave and shut the thing the
           reader is reaching for. This bridges the gap invisibly; it is a
           child of the popover, so the crossing never leaves the marker. */
        .wm-pop::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 0.75rem;
        }
        .wm-pop.side-below::before { top: -0.75rem; }
        .wm-pop.side-above::before { bottom: -0.75rem; }
        .wm-pop.align-center { left: 50%; transform: translateX(-50%); }
        .wm-pop.align-start { left: -0.5rem; }
        .wm-pop.align-end { right: -0.5rem; }

        .wm-pop-type {
          margin: 0;
          font-size: 0.6rem;
          color: var(--wm-quiet);
          padding-right: 1.2rem;
        }
        .wm-pop-name {
          margin: 0.25rem 0 0;
          font-family: var(--font-hero);
          font-size: 1rem;
          letter-spacing: 0.03em;
          color: var(--color-moonlight);
        }
        .wm-pop-lore {
          margin: 0.4rem 0 0;
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: var(--color-moonlight);
        }
        .wm-marker.is-area .wm-pop-name { color: var(--color-silver); }
        .wm-marker.is-fortress .wm-pop-name { color: var(--color-gold); }
        .wm-marker.is-dungeon .wm-pop-name { color: var(--wm-rose); }

        .wm-pop-close {
          position: absolute;
          top: 0.3rem;
          right: 0.3rem;
          width: 1.6rem;
          height: 1.6rem;
          display: grid;
          place-items: center;
          padding: 0;
          appearance: none;
          border: 0;
          background: none;
          color: var(--wm-quiet);
          font-size: 0.72rem;
          cursor: pointer;
          line-height: 1;
        }
        .wm-pop-close:hover { color: var(--color-moonlight); }
        .wm-pop-close:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 1px;
        }

        /* ---- readout (small screens only) ---- */
        .wm-readout {
          display: none;
          max-width: 62rem;
          width: 100%;
          margin-inline: auto;
          padding: 0.85rem 0.95rem 0.95rem;
          background: var(--wm-ink);
          border: 1px solid color-mix(in srgb, var(--color-silver) 34%, transparent);
        }
        .wm-readout-type { margin: 0; font-size: 0.62rem; color: var(--wm-quiet); }
        .wm-readout-name {
          margin: 0.25rem 0 0;
          font-family: var(--font-hero);
          font-size: 1.05rem;
          letter-spacing: 0.03em;
          color: var(--color-moonlight);
        }
        .wm-readout-lore {
          margin: 0.4rem 0 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--color-moonlight);
        }

        /* ---- key + hint ---- */
        .wm-under {
          max-width: 62rem;
          width: 100%;
          margin-inline: auto;
          display: grid;
          gap: 0.9rem;
        }
        .wm-key {
          margin: 0;
          padding: 0.9rem 0 0;
          border-top: 1px solid var(--wm-edge);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
          gap: 0.9rem 1.6rem;
        }
        .wm-key-row.is-area { color: var(--color-silver); }
        .wm-key-row.is-fortress { color: var(--color-gold); }
        .wm-key-row.is-dungeon { color: var(--wm-rose); }
        .wm-key-head { display: flex; align-items: center; gap: 0.45rem; }
        .wm-key-sigil { display: inline-grid; place-items: center; width: 1.05rem; height: 1.05rem; }
        .wm-key-sigil svg { width: 100%; height: 100%; }
        .wm-key-term { font-size: 0.64rem; color: var(--wm-quiet); }
        .wm-key-gloss {
          margin: 0.3rem 0 0;
          font-family: var(--font-body);
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--wm-quiet);
        }
        .wm-hint { margin: 0; font-size: 0.64rem; color: var(--wm-quiet); }

        /* ---- the region profile ----
           A definition list, because that is what it is: four short answers
           about one place. Two columns where there is room so the labels form
           a scannable spine, one column below 30rem of card. Kept to names —
           the descriptions are a click away, which is the whole design. */
        .wm-prof {
          margin: 0.7rem 0 0;
          padding-top: 0.65rem;
          border-top: 1px solid var(--wm-edge);
          display: grid;
          gap: 0.35rem;
          font-family: var(--font-body);
          font-size: 0.82rem;
          line-height: 1.5;
        }
        /* Label beside value where the row has room for both, label above it
           where it does not — done with wrapping rather than a breakpoint,
           because this same profile renders in a 62rem readout, a ~15rem list
           card and a popover that sizes itself to its own text. The value's
           12rem flex-basis is the hinge: below that the line wraps and the
           spine becomes a stack, with no query to keep in step with the
           list's auto-fit columns. */
        .wm-prof-row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.1rem 0.6rem;
        }
        .wm-prof-label { flex: 0 0 6.4rem; }
        .wm-prof-value { flex: 1 1 12rem; min-width: 0; }
        .wm-prof-label {
          margin: 0;
          font-size: 0.56rem;
          letter-spacing: 0.13em;
          color: var(--wm-quiet);
          line-height: 1.9;
        }
        .wm-prof-value { margin: 0; color: var(--color-moonlight); }
        .wm-sep { color: var(--wm-quiet); }

        /* The boss is the one name in the row that is not an equal of the
           others, so it is tagged rather than merely listed last. */
        .wm-boss-tag {
          font-size: 0.54rem;
          letter-spacing: 0.14em;
          color: var(--color-gold);
        }

        /* Gold at full strength is 8.4:1 on .panel and 9.6:1 on the popover
           ink, so the link colour carries on both. Underlined from the start:
           these are cross-references into other sections and they should look
           like it before they are hovered. */
        .wm-link {
          color: var(--color-gold);
          text-decoration: underline;
          text-decoration-color: color-mix(in srgb, var(--color-gold) 45%, transparent);
          text-underline-offset: 0.18em;
          /* The list card's hit-area ::after covers the whole card; without
             this the anchors underneath it would be unclickable. */
          position: relative;
          z-index: 1;
        }
        .wm-link:hover,
        .wm-link:focus-visible {
          text-decoration-color: currentColor;
        }
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

        /* ---- the location list ---- */
        .wm-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
          gap: 1px;
          background: var(--wm-edge);
          border: 1px solid var(--wm-edge);
        }
        .wm-item {
          position: relative;
          padding: 1rem 1.05rem 1.15rem;
          display: grid;
          gap: 0.3rem;
          align-content: start;
        }
        .wm-item.is-selected {
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-silver) 45%, transparent);
        }

        .wm-item-name {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }
        /* The name is the control and its ::after covers the whole card, so a
           thumb anywhere on the card selects it. The outline stays on the name. */
        .wm-item-hit {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
          appearance: none;
          border: 0;
          background: none;
          font: inherit;
          letter-spacing: inherit;
          color: var(--color-moonlight);
          text-align: left;
          cursor: pointer;
          touch-action: manipulation;
        }
        .wm-item-hit::after { content: ""; position: absolute; inset: 0; }
        .wm-item-hit:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 3px;
        }
        .wm-item-sigil { display: inline-grid; place-items: center; width: 1.05rem; height: 1.05rem; }
        .wm-item-sigil svg { width: 100%; height: 100%; }
        .wm-item.is-area .wm-item-sigil { color: var(--color-silver); }
        .wm-item.is-fortress .wm-item-sigil { color: var(--color-gold); }
        .wm-item.is-dungeon .wm-item-sigil { color: var(--wm-rose); }

        .wm-item-type { margin: 0; font-size: 0.6rem; color: var(--wm-quiet); }
        .wm-item-lore {
          margin: 0.25rem 0 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--color-moonlight);
        }

        /* On a narrow screen the popover would cover the land it describes, so
           below 640px the map keeps the sigils and the list below carries the
           lore — which is what a thumb can read anyway. */
        @media (max-width: 640px) {
          .wm-pop { display: none; }
          .wm-readout { display: block; }
          .wm-frame { padding: 0.35rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wm-marker.is-fortress .wm-pin svg { animation: none; }
          .wm-pin { transition: none; }
        }
      `}</style>
    </div>
  );
}
