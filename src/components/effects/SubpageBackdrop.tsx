import type { ReactNode } from "react";

/** Moon-Knight — the aurora */
export const MOON_KNIGHT_AURORA = {
  colorStops: ["#2d5e48", "#614844", "#95313f"],
  origin: "top",
  amplitude: 0.9,
  speed: 2,
  blend: 1,
} as const;

/** Shattered Skies — the starfield */
export const SHATTERED_SKIES_GALAXY = {
  hueShift: 97, 
  saturation: 1.1, 
  density: 1.2, 
  glowIntensity: 0.03, 
  speed: 0.1, 
  starSpeed: 0.1,
  rotationSpeed: 0.03, 
  twinkleIntensity: 0.5, 
  mouseInteraction: true,
  mouseRepulsion: true, 
  transparent: true, 
} as const;

export const BACKDROP_OPACITY = {
  moonKnight: { hero: 0.6, subpage: 0.34 },
  shatteredSkies: { hero: 0.66, subpage: 0.4 },
} as const;

export default function SubpageBackdrop({
  backdrop,
  children,
}: {
  backdrop: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="sub-bd">
      <div className="sub-bd__layer" aria-hidden>
        {backdrop}
      </div>
      <div className="sub-bd__content">{children}</div>

      <style>{`
        .sub-bd {
          position: relative;
          isolation: isolate;
        }

        /* Pinned to the top of the page and sized to the header band the deep
           dives all open with, not to the viewport: on a short laptop window a
           vh-only height would crop the sky to a stripe, and on a tall monitor
           it would run it into the first section. The clamp gives it a floor
           and a ceiling either side of that. */
        .sub-bd__layer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: clamp(20rem, 46vh, 32rem);
          z-index: 0;
          pointer-events: none;
          /* Gone well before the first section, so no body copy is ever read
             against moving colour. See the file comment: this belongs on the
             wrapper because Aurora writes its own inline mask under reduced
             motion. */
          -webkit-mask-image: linear-gradient(to bottom, #000 42%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 42%, transparent 100%);
        }

        /* The effects fill the band; both render a bare host div. */
        .sub-bd__layer > * {
          position: absolute;
          inset: 0;
        }

        .sub-bd__content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}