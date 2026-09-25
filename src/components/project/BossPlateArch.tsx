"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { BossPlate } from "@/content/moon-knight-bestiary";
import Lightbox from "./Lightbox";

export default function BossPlateArch({
  plate,
  bossName,
}: {
  plate: BossPlate;
  bossName: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef} className="bpa">
      <button
        type="button"
        className="bpa-btn"
        onClick={() => setOpen(true)}
        aria-label={`${bossName}, captured in play — open the full frame`}
      >
        <Image
          src={plate.src}
          alt={plate.alt}
          width={1689}
          height={952}
          sizes="420px"
          quality={92}
          className="bpa-img"
        />
        <span className="mono bpa-tag" aria-hidden="true">
          In play
          <svg viewBox="0 0 12 12" width="9" height="9" focusable="false">
            <path
              d="M4.5 1.5h6v6M10.5 1.5 5 7M7.5 9.5v1h-6v-6h1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <Lightbox
        items={[{ src: plate.src, alt: plate.alt, caption: plate.caption }]}
        index={open ? 0 : null}
        onClose={() => setOpen(false)}
        onIndexChange={() => {}}
        themeSource={rootRef}
      />

      <style>{`
        .bpa { display: contents; }
        .bpa-btn {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          background: none;
          cursor: pointer;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        /* object-fit cover, which is the opposite of what this page does
           everywhere else — deliberately. The other plates here are DOCUMENTS
           whose callouts a crop would destroy. This is a photograph, and the
           arch is 3:4 against a 16:9 source, so covering it keeps the FULL
           HEIGHT and trims the sides: the werewolf and the knight below it are
           both dead centre and both survive. The whole frame is one click away
           regardless. */
        .bpa-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 50%;
          transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* A scrim, for two reasons: the tag has to stay legible over whatever
           the bottom of the shot happens to be, and this frame is a daylit
           green field dropped into a codex of near-black plates. Mild enough
           that nothing in the picture is hidden — and the viewer shows it
           untouched. */
        .bpa-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, transparent 45%,
              color-mix(in srgb, var(--color-void) 72%, transparent) 100%),
            linear-gradient(180deg,
              color-mix(in srgb, var(--color-void) 18%, transparent),
              color-mix(in srgb, var(--color-void) 18%, transparent));
        }
        .bpa-btn:hover .bpa-img,
        .bpa-btn:focus-visible .bpa-img { transform: scale(1.04); }
        .bpa-btn:focus-visible {
          outline: 2px solid var(--color-gold);
          outline-offset: -3px;
        }

        /* The affordance, and it is visible at rest rather than on hover: a
           frame that only announces itself once you are already pointing at it
           has announced itself to nobody. */
        .bpa-tag {
          position: absolute;
          /* Above the scrim the button paints over the image. */
          z-index: 1;
          left: 0.4rem;
          bottom: 0.4rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.45rem;
          background: color-mix(in srgb, var(--color-void) 82%, transparent);
          border: 1px solid color-mix(in srgb, var(--color-gold) 55%, transparent);
          border-radius: 2px;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-gold);
          backdrop-filter: blur(2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .bpa-img { transition: none; }
          .bpa-btn:hover .bpa-img,
          .bpa-btn:focus-visible .bpa-img { transform: none; }
        }
      `}</style>
    </div>
  );
}
