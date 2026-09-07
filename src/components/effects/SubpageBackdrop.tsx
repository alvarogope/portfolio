import type { ReactNode } from "react";

/**
 * The route backdrops, and the band that carries one behind a subpage header.
 *
 * WHY THIS FILE EXISTS. `/moon-knight` and `/shattered-skies` each open on a
 * hero with a tuned WebGL backdrop behind it — Aurora and Galaxy. When the deep
 * dives were split into their own routes, the effect stayed with the hero it
 * was mounted inside, so `/moon-knight/world`, `/moon-knight/engineering`,
 * `/moon-knight/engineering/quantum` and `/shattered-skies/world` rendered no
 * backdrop at all. The route chrome carried over — `MoonProgress` and
 * `Symbiochord` live in the route layouts — so the subpages kept the furniture
 * and lost the sky. That was a side-effect of the split, not a decision.
 *
 * THE TUNING LIVES HERE, ONCE. The prop objects below are the same values the
 * parent heroes pass, spread into both, so a subpage backdrop cannot drift from
 * the hero it is supposed to match. Every knob keeps the comment it carried on
 * the page it came from — this is now the only place either effect is tuned.
 *
 * WHAT THE SUBPAGES GET, AND WHY IT IS NOT THE HERO TREATMENT VERBATIM. A hero
 * is a screenful of title over a picture; a deep-dive page is eight thousand
 * words. Running the hero's opacity behind that much prose would put a moving
 * aurora under body text, which is the one thing a backdrop must never do. So
 * the band is pinned to the TOP of the subpage, sized to roughly the header
 * that opens every one of them (breadcrumb, kicker, `h1`, standfirst), and
 * masked to nothing well before the first section — and it runs dimmer than the
 * hero besides. The reader meets the same sky the parent opened on, and the
 * text below it sits on the flat route colour exactly as it did before.
 *
 * REDUCED MOTION IS ALREADY HANDLED, AND NOT BY THIS FILE. `Aurora` swaps to a
 * static gradient and `Galaxy` renders a single still frame when
 * `prefers-reduced-motion: reduce` matches; neither starts a RAF loop. Mounting
 * them here inherits that, so there is no second guard to keep in sync.
 *
 * THE MASK IS ON THE WRAPPER, NOT ON THE EFFECT, and that is load-bearing.
 * `Aurora`'s reduced-motion path writes `mask-image` INLINE on its own host
 * element to fade its static gradient. An inline style beats a stylesheet rule,
 * so a fade declared on the effect's own class would be silently replaced by
 * Aurora's the moment a reader had reduced motion on — the exact condition
 * hardest to notice in review. Masking the wrapper instead leaves Aurora's
 * inline mask to do its job and composes the band's fade on top of it.
 */

/** Moon-Knight — the aurora over the hero, and over every subpage header. */
export const MOON_KNIGHT_AURORA = {
  colorStops: ["#2d5e48", "#614844", "#95313f"],
  origin: "top",
  amplitude: 0.9,
  speed: 2,
  blend: 1,
} as const;

/** Shattered Skies — the starfield. Knob comments are the originals. */
export const SHATTERED_SKIES_GALAXY = {
  hueShift: 97, // Shifts the hue of all stars by the specified degrees (0-360)
  saturation: 1.1, // Controls color saturation of stars (0 = grayscale, 1 = full color)
  density: 1.2, // Controls the density of stars in the galaxy
  glowIntensity: 0.03, // Controls the intensity of the star glow effect
  speed: 0.1, // Global speed multiplier for all animations
  starSpeed: 0.1,
  rotationSpeed: 0.03, // Speed of automatic galaxy rotation
  twinkleIntensity: 0.5, // Controls how much stars twinkle (0 = no twinkle, 1 = maximum twinkle)
  mouseInteraction: true,
  mouseRepulsion: true, // Black Hole Effect when true
  transparent: true, // Refers to the background
} as const;

/**
 * Hero strength, unchanged from what each page already shipped, and the dimmer
 * subpage strength. Kept adjacent so the relationship between the two is
 * visible rather than being two numbers in two files.
 */
export const BACKDROP_OPACITY = {
  moonKnight: { hero: 0.6, subpage: 0.34 },
  shatteredSkies: { hero: 0.66, subpage: 0.4 },
} as const;

/**
 * Wraps a subpage in its route's backdrop band.
 *
 * A server component: `backdrop` arrives as an already-created element from the
 * route layout, so the client boundary stays inside `Aurora` / `Galaxy` and the
 * layout itself ships no JavaScript.
 */
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
