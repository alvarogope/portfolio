"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Lightbox, { type LightboxItem } from "./Lightbox";
import LoopingVideo from "./LoopingVideo";

export interface Plate {
  src: string;
  alt: string;
  caption: string;
  label?: string;
  video?: string;
}

export default function PlateGrid({
  items,
  minWidth = "26rem",
  aspect = "16 / 9",
}: {
  items: Plate[];
  minWidth?: string;
  aspect?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

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
                    quality={92}
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
