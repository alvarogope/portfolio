import Image from "next/image";
import type { ScreenshotSlot } from "@/content/moon-knight-game-engineering";

/**
 * Reserved space for editor captures that do not exist yet.
 *
 * Each item renders a labelled empty frame until a `src` is set in the
 * content file, at which point the same slot renders the real image at
 * the same aspect ratio, so nothing about the layout moves.
 */
export default function ScreenshotSlots({ items }: { items: ScreenshotSlot[] }) {
  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
        gap: "1.5rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {items.map((item) => (
        <li key={item.id}>
          <figure style={{ margin: 0 }}>
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
                  sizes="(max-width: 800px) 90vw, 32rem"
                  style={{ objectFit: "cover" }}
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
                      fontSize: "0.6rem",
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
                    style={{ fontSize: "0.62rem", color: "var(--color-mist)" }}
                  >
                    {item.id}
                  </span>
                </div>
              )}
            </div>
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
      ))}
    </ul>
  );
}
