"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Lightbox, { type LightboxItem } from "./Lightbox";
import LoopingVideo from "./LoopingVideo";

export interface Plate {
  /** Path under /public. */
  src: string;
  /** Describe the DESIGN POINT the plate makes, not just what is depicted. */
  alt: string;
  caption: string;
  /** Small mono eyebrow above the caption. */
  label?: string;
  /** When set, the plate is a silent loop and `src` is unused. */
  video?: string;
}

/**
 * Labelled plates that show the WHOLE image and open it full-size.
 *
 * The distinction from `Gallery` is deliberate and is about what the pictures
 * are for. A gallery is a set of pretty frames from the game, so it crops to a
 * tidy grid — `object-fit: cover` is right there. These are documents: floor
 * plans, annotated level shots, node graphs. Cropping one to fill a tile
 * destroys the thing it was placed to show, so every plate is `contain`, and
 * the frame takes a letterbox rather than the drawing taking a crop.
 *
 * Clicking opens the shared `Lightbox` at full resolution, because a 1920px
 * plan or a node graph has to be readable, not merely visible. Video plates
 * loop in place and do not open — a loop is already playing at the size it
 * needs, and the viewer is an image viewer.
 */
export default function PlateGrid({
  items,
  minWidth = "26rem",
  aspect = "16 / 9",
}: {
  items: Plate[];
  /**
   * Smallest column before the grid drops to fewer columns. Pass `"100%"`
   * for a single full-content-width stack, which is what a plate carrying
   * readable annotations needs: the callouts are burned into the image at
   * a size that assumes the plate is nearly as wide as the page.
   */
  minWidth?: string;
  aspect?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* The viewer pages through the still plates only, so a video in the middle
     of the set does not leave a hole in the sequence. `lightboxIndex` maps a
     plate's position in the grid to its position in that filtered list. */
  const stills = items.filter((i) => !i.video);
  const lightboxItems: LightboxItem[] = stills.map((i) => ({
    src: i.src,
    alt: i.alt,
    caption: i.caption,
  }));
  const lightboxIndex = (plate: Plate) => stills.indexOf(plate);

  return (
    <>
      <div
        ref={rootRef}
        style={{
          display: "grid",
          /* `min(100%, X)` is what stops a fixed rem minimum from overflowing
             a container narrower than itself — the track can never demand more
             than the space it has. "100%" is the full-width case and is
             written out as a single track rather than as min(100%, 100%). */
          gridTemplateColumns:
            minWidth === "100%"
              ? "minmax(0, 1fr)"
              : `repeat(auto-fit, minmax(min(100%, ${minWidth}), 1fr))`,
          gap: "1.75rem",
        }}
      >
        {items.map((item) => (
          <figure key={item.video ?? item.src} style={{ margin: 0, minWidth: 0 }}>
            {item.video ? (
              <LoopingVideo src={item.video} label={item.alt} aspect={aspect} />
            ) : (
              <button
                type="button"
                onClick={() => setOpenIndex(lightboxIndex(item))}
                aria-label={`View full size: ${item.alt}`}
                style={{
                  display: "block",
                  width: "100%",
                  padding: 0,
                  border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  cursor: "zoom-in",
                  background: "color-mix(in srgb, var(--color-nightfall) 55%, transparent)",
                }}
              >
                <div style={{ position: "relative", aspectRatio: aspect }}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={
                      minWidth === "100%"
                        ? "(max-width: 700px) 94vw, 58rem"
                        : "(max-width: 700px) 94vw, (max-width: 1100px) 48vw, 30rem"
                    }
                    /* These plates are DOCUMENTS: floor plans, node graphs,
                       and level shots with the reasoning set as type inside
                       the image. The default quality of 75 softens small text
                       into mush, which is the one thing a plate cannot afford.
                       92 is the same quality the hand-drawn Kaelum map already
                       asks for, and next.config.ts already permits it. */
                    quality={92}
                    /* contain, never cover: these are documents. */
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </button>
            )}

            <figcaption style={{ marginTop: "0.7rem" }}>
              {item.label && (
                <span
                  className="mono"
                  style={{
                    display: "block",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-silver)",
                    marginBottom: "0.35rem",
                  }}
                >
                  {item.label}
                </span>
              )}
              <span
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--color-mist)",
                }}
              >
                {item.caption}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Lightbox
        items={lightboxItems}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
        themeSource={rootRef}
      />
    </>
  );
}
