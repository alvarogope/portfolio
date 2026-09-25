"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ScreenshotSlot } from "@/content/moon-knight-game-engineering";
import Lightbox, { type LightboxItem } from "./Lightbox";

export default function ScreenshotSlots({ items }: { items: ScreenshotSlot[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLUListElement>(null);

  const filled = items.filter((i) => i.src);
  const lightboxItems: LightboxItem[] = filled.map((i) => ({
    src: i.src as string,
    alt: i.alt ?? i.label,
    caption: `${i.label}. ${i.caption}`,
  }));

  return (
    <>
      <ul
        ref={rootRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 27rem), 1fr))",
          gap: "1.5rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item) => {
          const frame = (
            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 10",
                overflow: "hidden",
                border: item.src
                  ? "1px solid color-mix(in srgb, var(--color-mist) 30%, transparent)"
                  : "1px dashed color-mix(in srgb, var(--color-mist) 45%, transparent)",
                background: "color-mix(in srgb, var(--color-nightfall) 55%, transparent)",
              }}
            >
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.alt ?? item.label}
                  fill
                  sizes="(max-width: 800px) 92vw, 42rem"
                  quality={92}
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    padding: "1.25rem",
                    textAlign: "center",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.70rem",
                      letterSpacing: "0.16em",
                      color: "var(--color-silver)",
                    }}
                  >
                    IMAGE SLOT
                  </span>
                  <span
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--color-moonlight)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: "0.70rem", color: "var(--color-mist)" }}
                  >
                    {item.id}
                  </span>
                </div>
              )}
            </div>
          );

          return (
            <li key={item.id}>
              <figure style={{ margin: 0 }}>
                {item.src ? (
                  <button
                    type="button"
                    onClick={() => setOpenIndex(filled.indexOf(item))}
                    aria-label={`View full size: ${item.label}`}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: 0,
                      border: "none",
                      background: "none",
                      cursor: "zoom-in",
                    }}
                  >
                    {frame}
                  </button>
                ) : (
                  frame
                )}
                <figcaption
                  style={{
                    marginTop: "0.7rem",
                    fontSize: "0.9rem",
                    color: "var(--color-mist)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.src && (
                    <strong style={{ color: "var(--color-moonlight)", fontWeight: 400 }}>
                      {item.label}.{" "}
                    </strong>
                  )}
                  {item.caption}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

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
