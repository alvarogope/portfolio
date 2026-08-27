"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Lightbox, { type LightboxItem } from "./Lightbox";

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

/**
 * A grid of thumbnails that opens the shared viewer.
 *
 * The viewer itself is `Lightbox`, deliberately not inlined here: the overlay
 * has to portal out to `document.body` to escape the transform `Reveal` leaves
 * on every section wrapper, and that is a fix every gallery on the site should
 * get rather than one this component owns privately.
 *
 * The gallery keeps only the INDEX of the open item, so the viewer can page
 * through the set with arrows, swipes and the prev/next buttons. `rootRef` is
 * handed to the viewer as its theme source — it sits inside the route's font
 * wrapper, so the portal can copy this page's palette and faces out of it
 * before it leaves the subtree.
 */
export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Captions are optional on the viewer's item type; every gallery item has
     one, so they pass straight through. */
  const lightboxItems: LightboxItem[] = items;

  return (
    <>
      <div
        ref={rootRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: "1.5rem",
        }}
      >
        {items.map((item, i) => (
          <figure key={item.src} style={{ margin: 0 }}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              style={{
                display: "block",
                width: "100%",
                padding: 0,
                border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
                borderRadius: "2px",
                overflow: "hidden",
                cursor: "zoom-in",
                background: "none",
              }}
              aria-label={`Enlarge: ${item.alt}`}
            >
              <div style={{ position: "relative", aspectRatio: "16 / 9" }}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 800px) 90vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </button>
            <figcaption
              style={{
                marginTop: "0.6rem",
                fontSize: "0.92rem",
                color: "var(--color-mist)",
                lineHeight: 1.6,
              }}
            >
              {item.caption}
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
