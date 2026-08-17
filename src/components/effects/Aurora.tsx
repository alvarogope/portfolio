"use client";

import { useEffect, useRef, useState } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";

type Origin = "top" | "bottom" | "both";

type AuroraProps = {
  /**
   * Three hex colours sampled left → centre → right across the band.
   * With `origin="both"` this is the BOTTOM band; see `topColorStops`.
   */
  colorStops?: readonly string[];
  /**
   * The top band's ramp, `origin="both"` only. Defaults to `colorStops`,
   * which mirrors one palette into both bands.
   */
  topColorStops?: readonly string[];
  /** Height of the noise ridge. Higher reaches further up the box. */
  amplitude?: number;
  /** uTime units per second. */
  speed?: number;
  /** Softness of the band's edge, NOT its strength — see the note below. */
  blend?: number;
  /** The dimmer. Applied to the canvas, so it scales the whole effect. */
  opacity?: number;
  /** Which edge(s) the glow grows from. */
  origin?: Origin;
  className?: string;
};

/* ────────────────────────────────────────────────────────────────────
   A note on `blend`, because the name misleads.

   In this shader blend is the width of the smoothstep that turns the
   noise ridge into alpha:

     alpha = smoothstep(0.2 - blend/2, 0.2 + blend/2, intensity)

   So a LOW blend is a narrow ramp — a harder, more banded edge with MORE
   area at full alpha. A high blend is a wide ramp: softer, hazier, and
   what "faint" actually looks like. It is not an opacity control.

   The opacity control is `opacity`, which multiplies the finished canvas.
   That is the knob to turn when the effect needs to be dimmer; every
   contrast figure recorded on the Moon-Knight page was measured against
   it, not against blend.
   ──────────────────────────────────────────────────────────────────── */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/** Fraction of the box over which `origin="both"` dissolves into the page. */
const SEAM = 0.1;

const buildFrag = (origin: Origin) => `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec3 uColorStopsTop[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {                   \\
  int index = 0;                                                   \\
  for (int i = 0; i < 2; i++) {                                    \\
     ColorStop currentColor = colors[i];                           \\
     bool isInBetween = currentColor.position <= factor;           \\
     index = int(mix(float(index), float(i), float(isInBetween))); \\
  }                                                                \\
  ColorStop currentColor = colors[index];                          \\
  ColorStop nextColor = colors[index + 1];                         \\
  float range = nextColor.position - currentColor.position;        \\
  float lerpFactor = (factor - currentColor.position) / range;     \\
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  /* gl_FragCoord.y counts up from the bottom, so the stock shader grows the
     band from the top of the box. vy is the distance travelled from whichever
     edge the glow is anchored to: mirror uv.y and it pools at the bottom
     instead; fold it about the centre and you get BOTH edges at once, with
     the middle of the box (where the hero's content lives) at vy = 0 and
     therefore black.

     Keep this source pure ASCII, comments included: ANGLE rejects shaders
     containing characters outside the GLSL ES source set even inside a
     comment, which would blank the canvas on Chrome/Windows only. */
  float vy = ${
    origin === "bottom" ? "1.0 - uv.y" : origin === "both" ? "abs(uv.y * 2.0 - 1.0)" : "uv.y"
  };

  /* Which half of the box this pixel is in, for the two-band case. It picks
     the ramp and offsets the noise, so the two bands drift independently
     instead of reading as one shape reflected in a mirror. Constant-folded
     away for the single-band origins. */
  float side = ${origin === "both" ? "step(0.5, uv.y)" : "0.0"};

  ColorStop colors[3];
  colors[0] = ColorStop(mix(uColorStops[0], uColorStopsTop[0], side), 0.0);
  colors[1] = ColorStop(mix(uColorStops[1], uColorStopsTop[1], side), 0.5);
  colors[2] = ColorStop(mix(uColorStops[2], uColorStopsTop[2], side), 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  vec2 seed = vec2(side * 41.0, side * 17.0);
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25) + seed) * 0.5 * uAmplitude;
  height = exp(height);
  height = (vy * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  /* The two-band form is at its brightest hard against the box's edges,
     which would cut a visible line across the page where the hero ends.
     This dissolves the last tenth into nothing so the glow meets the page
     background rather than stopping at it. Single-band origins keep their
     hard anchor edge; nothing above depends on this. */
  auroraAlpha *= ${
    // min(uv.y, 1 - uv.y) is the distance to the nearer edge, so one
    // smoothstep fades both seams. Written this way rather than as a pair of
    // opposed smoothsteps because GLSL leaves smoothstep undefined when
    // edge0 >= edge1, which the descending half would need.
    origin === "both" ? `smoothstep(0.0, ${SEAM}, min(uv.y, 1.0 - uv.y))` : "1.0"
  };

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

/**
 * A CSS stand-in for the shader, used when motion is not wanted or WebGL2
 * is not available.
 *
 * The horizontal colour ramp is the shader's COLOR_RAMP; the mask is the
 * vertical falloff. It is not a frame of the animation — the noise makes
 * any single frame arbitrary — it is the same atmosphere held still, at
 * zero GPU cost, which matters more on the hardware likely to land here.
 */
/* The still version paints the ramp colours flat, while the shader first
   multiplies them by `intensity` (< 1 almost everywhere). At equal alpha
   the still one therefore reads brighter, and this is the factor that pulls
   the two peak luminances back level. Measured, not guessed, per origin —
   the two-band form needs a much harder dim because its seam fade caps the
   animated band's peak intensity at ~0.64 rather than the ~0.85 the
   single-band origins reach at their anchor edge. The calibration runs, each
   against the Moon-Knight hero at the opacity noted:

     top/bottom  0.80  animated peak #161c28 vs still #161c29 (opacity 0.5)
     both        0.55  animated peak #131820 vs still #131821 (opacity 0.25)

   These pair a dim factor with a peak, not with any particular set of props:
   the factor is what keeps the still fallback level with the animation at
   whatever opacity the caller picks, so it holds while the hero is retuned. */
const STATIC_DIM: Record<Origin, number> = { top: 0.8, bottom: 0.8, both: 0.55 };

/* Where the shader's alpha reaches 1 and where it dies, for amplitude ~0.5
   and blend ~0.6 — so the mask peaks and clears in the same places the
   animated band does, instead of approximating it. */
const BOTH_MASK =
  "linear-gradient(to bottom, transparent, #000 9%, transparent 35%, transparent 65%, #000 91%, transparent)";

/* Narrower than React.CSSProperties on purpose: every value here is written
   straight onto a CSSStyleDeclaration by the fallback path below, which only
   takes strings. */
type StillStyle = {
  backgroundImage: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  maskImage: string;
  WebkitMaskImage: string;
};

function staticGradient(
  stops: readonly string[],
  origin: Origin,
  topStops: readonly string[]
): StillStyle {
  if (origin === "both") {
    /* One element, two ramps: each linear-gradient is painted into its own
       half by background-size/position, and the mask supplies the vertical
       falloff for both at once. */
    return {
      backgroundImage: [
        `linear-gradient(to right, ${topStops.join(", ")})`,
        `linear-gradient(to right, ${stops.join(", ")})`,
      ].join(", "),
      backgroundSize: "100% 50%",
      backgroundPosition: "top, bottom",
      backgroundRepeat: "no-repeat",
      maskImage: BOTH_MASK,
      WebkitMaskImage: BOTH_MASK,
    };
  }

  const toEdge = origin === "bottom" ? "to top" : "to bottom";
  return {
    backgroundImage: `linear-gradient(to right, ${stops.join(", ")})`,
    maskImage: `linear-gradient(${toEdge}, #000, transparent 55%)`,
    WebkitMaskImage: `linear-gradient(${toEdge}, #000, transparent 55%)`,
  };
}

/**
 * Whether this browser can run the shader at all. The fragment source is
 * `#version 300 es`, which a WebGL1 context compiles into nothing rather
 * than an error — so it is probed up front instead of being discovered as
 * a blank canvas.
 */
function supportsWebgl2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * The React Bits aurora, ported to TypeScript and tuned to sit quiet.
 *
 * Differences from upstream, all deliberate:
 *  - the band grows from a chosen edge rather than always the top, and
 *    `origin="both"` puts one band at each edge from a single canvas: one
 *    context, one noise sample and one rAF loop, rather than the two of
 *    everything that stacking two instances would cost;
 *  - `opacity` dims the finished canvas, so the effect has a single honest
 *    strength control (see the note on `blend` above);
 *  - the loop stops when the host scrolls out of view or the tab is
 *    hidden, so a background on one hero does not cost anything while the
 *    reader is further down the page;
 *  - reduced motion and missing WebGL2 both fall back to a static
 *    gradient instead of a live context.
 */
export default function Aurora({
  colorStops = ["#5227FF", "#7cff67", "#5227FF"],
  topColorStops,
  amplitude = 1,
  speed = 1,
  blend = 0.5,
  opacity = 1,
  origin = "top",
  className,
}: AuroraProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  /* "still" until the client has actually read the preference, so the
     server-rendered markup and the first paint are never the animated one.
     Both reasons to hold still — the user asked for less motion, or the
     GPU cannot run the shader — collapse into this one flag, because the
     rendered result is identical either way. */
  const [mode, setMode] = useState<"still" | "animate">("still");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Capability is fixed for the session; the preference is not, so it is
    // re-read whenever the user changes it.
    const capable = supportsWebgl2();
    const update = () => setMode(query.matches || !capable ? "still" : "animate");

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  /* Stops arrive as a fresh array literal on every parent render, so the
     effect keys off their content — rebuilding a GL context because an
     array changed identity would be an expensive no-op. */
  const colorKey = colorStops.join(",");
  const topColorKey = (topColorStops ?? colorStops).join(",");

  useEffect(() => {
    if (mode !== "animate") return;

    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "display:block;height:100%;width:100%;";

    // A full-viewport noise shader is the kind of thing that costs real
    // battery on a phone, so the buffer is capped harder on small screens
    // than the starfield's is.
    const coarse = window.matchMedia("(max-width: 800px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);

    /* The probe in the effect above already said this browser can do
       WebGL2, so getting here means creation failed for some other reason
       — context loss under memory pressure being the likely one. Paint the
       still gradient straight onto the host rather than leave a hole.
       Doing it imperatively keeps it out of React's hands: a setState in an
       effect body would only buy a cascading render for the same result. */
    const paintStill = () => {
      const still = staticGradient(colorKey.split(","), origin, topColorKey.split(","));
      host.style.opacity = String(opacity * STATIC_DIM[origin]);
      host.style.backgroundImage = still.backgroundImage;
      host.style.backgroundSize = still.backgroundSize ?? "";
      host.style.backgroundPosition = still.backgroundPosition ?? "";
      host.style.backgroundRepeat = still.backgroundRepeat ?? "";
      host.style.setProperty("mask-image", still.maskImage);
      host.style.setProperty("-webkit-mask-image", still.WebkitMaskImage);
    };
    const clearStill = () => {
      host.style.opacity = "";
      host.style.backgroundImage = "";
      host.style.backgroundSize = "";
      host.style.backgroundPosition = "";
      host.style.backgroundRepeat = "";
      host.style.removeProperty("mask-image");
      host.style.removeProperty("-webkit-mask-image");
    };

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        depth: false,
        antialias: false,
        premultipliedAlpha: true,
        dpr,
      });
    } catch {
      paintStill();
      return clearStill;
    }

    // Belt and braces on the probe: a WebGL1 context would compile the
    // `#version 300 es` shader into a blank canvas rather than an error.
    if (!renderer.isWebgl2) {
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
      paintStill();
      return clearStill;
    }

    host.appendChild(canvas);

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    // The full-screen triangle carries no texture, and an unused uv
    // attribute would just be a buffer the program never reads.
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const toStops = (key: string) =>
      key.split(",").map((hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: buildFrag(origin),
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: toStops(colorKey) },
        // Folded out of the shader unless origin is "both"; ogl only uploads
        // uniforms the compiler kept, so supplying it always costs nothing.
        uColorStopsTop: { value: toStops(topColorKey) },
        uResolution: { value: [host.clientWidth, host.clientHeight] },
        uBlend: { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let onScreen = true;
    let frame = 0;
    // Time is accumulated rather than read from the clock, so a pause
    // does not jump the band forward by however long the reader was away.
    let elapsed = 0;
    let last = 0;

    const render = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed;
      renderer.render({ scene: mesh });
      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (frame || document.hidden || !onScreen) return;
      last = performance.now();
      frame = window.requestAnimationFrame(render);
    };

    const stop = () => {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    /* The band drifts slowly and means nothing in particular at any given
       moment, so there is no reason to render it while it cannot be seen.
       Both the scroll position and the tab's visibility gate the loop. */
    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry?.isIntersecting ?? true;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 }
    );
    visibility.observe(host);

    const handleVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", handleVisibility);

    start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      visibility.disconnect();
      observer.disconnect();
      geometry.remove();
      program.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [amplitude, blend, colorKey, mode, opacity, origin, speed, topColorKey]);

  const still = mode === "still";

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className}
      style={{
        opacity: still ? opacity * STATIC_DIM[origin] : opacity,
        ...(still ? staticGradient(colorKey.split(","), origin, topColorKey.split(",")) : null),
      }}
    />
  );
}
