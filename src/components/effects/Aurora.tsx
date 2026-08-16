"use client";

import { useEffect, useRef, useState } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";

type AuroraProps = {
  /** Three hex colours sampled left → centre → right across the band. */
  colorStops?: readonly string[];
  /** Height of the noise ridge. Higher reaches further up the box. */
  amplitude?: number;
  /** uTime units per second. */
  speed?: number;
  /** Softness of the band's edge, NOT its strength — see the note below. */
  blend?: number;
  /** The dimmer. Applied to the canvas, so it scales the whole effect. */
  opacity?: number;
  /** Which edge the glow grows from. */
  origin?: "top" | "bottom";
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

const buildFrag = (origin: "top" | "bottom") => `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
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

  /* gl_FragCoord.y counts up from the bottom, so the stock shader grows
     the band from the top of the box. Mirroring uv.y drops it to the
     bottom edge, which is where atmosphere belongs: it pools under the
     content instead of hanging over the headline. */
  float vy = ${origin === "bottom" ? "1.0 - uv.y" : "uv.y"};

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (vy * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

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
   the still one therefore reads brighter. 0.8 is the factor that makes
   the two peak luminances match — measured, not guessed: at the page's
   opacity of 0.5 the animated band peaks at #161c28 and the gradient at
   0.5 * 0.8 peaks at #161c29. */
const STATIC_DIM = 0.8;

function staticGradient(stops: readonly string[], origin: "top" | "bottom") {
  const toEdge = origin === "bottom" ? "to top" : "to bottom";
  return {
    backgroundImage: `linear-gradient(to right, ${stops.join(", ")})`,
    maskImage: `linear-gradient(${toEdge}, #000, transparent 55%)`,
    WebkitMaskImage: `linear-gradient(${toEdge}, #000, transparent 55%)`,
  } satisfies React.CSSProperties;
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
 *  - the band grows from a chosen edge rather than always the top;
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
      const still = staticGradient(colorKey.split(","), origin);
      host.style.opacity = String(opacity * STATIC_DIM);
      host.style.backgroundImage = still.backgroundImage;
      host.style.setProperty("mask-image", still.maskImage);
      host.style.setProperty("-webkit-mask-image", still.WebkitMaskImage);
    };
    const clearStill = () => {
      host.style.opacity = "";
      host.style.backgroundImage = "";
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

    const stops = colorKey.split(",").map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: buildFrag(origin),
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: stops },
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
  }, [amplitude, blend, colorKey, mode, opacity, origin, speed]);

  const still = mode === "still";

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className}
      style={{
        opacity: still ? opacity * STATIC_DIM : opacity,
        ...(still ? staticGradient(colorKey.split(","), origin) : null),
      }}
    />
  );
}
