"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { BossPlate } from "@/content/moon-knight-bestiary";
import Lightbox from "./Lightbox";

/**
 * A boss's real capture, rendered INSIDE the card's reliquary arch — in the
 * exact slot every other creature's drawn emblem occupies.
 *
 * THE PROBLEM THIS SOLVES. The Werewolf is the one creature in the bestiary a
 * screenshot exists of, and the capture was placed as an extra `<figure>`
 * below its mechanic block: a whole additional band of image plus caption on
 * one card in a grid of eleven. The card did not read as "this one has more
 * evidence", it read as "the other ten are missing something" — the picture
 * drew attention to the hole rather than to itself.
 *
 * THE FIX IS TO STOP MAKING IT AN EXTRA. Every card already carries exactly
 * one visual, in exactly one place: the arch at the top. The Werewolf's arch
 * holds a photograph where the others hold a drawing. Same slot, same frame,
 * same size, so the grid stays even — and a real frame from the game sitting
 * where a sigil sits reads as the strongest card, not the odd one.
 *
 * WHAT THE CAPTION BECOMES. It moves into the viewer. A caption printed under
 * a 172px arch would be the asymmetry all over again in text, and the sentence
 * it carries is about a detail (the boss health bar) that is unreadable at
 * thumbnail size anyway. It belongs where the picture is legible.
 *
 * AFFORDANCE. The arch is a real `<button>`: a cursor, a focus ring, a hover
 * lift on the frame, and a corner tag that says the frame opens. `alt` carries
 * the description; the button's accessible name says what activating it does.
 */
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
          /* The capture's TRUE intrinsic size. It was declared 1712x950,
             which is a different aspect ratio to the real file and made the
             optimiser reason about a frame that does not exist. */
          width={1689}
          height={952}
          /* NOT the 172px the arch is wide - this is a `cover` fit of a 16:9
             source into a 3:4 box, so the browser scales the image by HEIGHT
             (229/952) and paints it 407 CSS px wide, throwing the sides away.
             `sizes` has to describe the width the image is PAINTED at, not the
             width of the window you see it through, or the optimiser serves a
             variant sized for the window and the visible slice gets upscaled
             ~3x. 420px covers the paint width; the browser doubles it again on
             a 2x display. */
          sizes="420px"
          /* 92 rather than the default 75, for the same reason the Kaelum map
             takes it: this is a detailed game frame shown small and cropped,
             so every artefact JPEG-style quantisation leaves lands inside the
             172px the reader actually looks at. Allow-listed in next.config. */
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
