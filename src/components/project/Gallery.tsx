"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  // Close on Escape, and lock body scroll while open
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {items.map((item) => (
          <figure key={item.src} style={{ margin: 0 }}>
            <button
              onClick={() => setActive(item)}
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
                fontSize: "0.8rem",
                color: "var(--color-mist)",
                lineHeight: 1.5,
              }}
            >
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox overlay */}
      {active && (
        <div
          onClick={() => setActive(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "color-mix(in srgb, var(--color-void) 92%, black)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(1rem, 5vw, 4rem)",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "min(90vw, 1400px)",
              maxHeight: "82vh",
              width: "100%",
              cursor: "default",
            }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={1600}
              height={900}
              sizes="90vw"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "82vh",
                objectFit: "contain",
                border: "1px solid color-mix(in srgb, var(--color-mist) 30%, transparent)",
              }}
            />
          </div>
          <p
            style={{
              marginTop: "1rem",
              color: "var(--color-moonlight)",
              fontSize: "0.9rem",
              maxWidth: "60ch",
              textAlign: "center",
            }}
          >
            {active.caption}
          </p>
          <button
            onClick={() => setActive(null)}
            className="mono"
            style={{
              marginTop: "0.75rem",
              background: "none",
              border: "1px solid var(--color-mist)",
              color: "var(--color-mist)",
              padding: "0.4rem 0.9rem",
              fontSize: "0.7rem",
              cursor: "pointer",
            }}
          >
            Close (Esc)
          </button>
        </div>
      )}
    </>
  );
}