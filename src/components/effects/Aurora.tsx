"use client";

import { useEffect, useRef, useState } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";

type Origin = "top" | "bottom" | "both";

type AuroraProps = {

  colorStops?: readonly string[];

  topColorStops?: readonly string[];

  amplitude?: number;

  speed?: number;

  blend?: number;

  opacity?: number;

  origin?: Origin;
  className?: string;
};

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;


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

    origin === "both" ? `smoothstep(0.0, ${SEAM}, min(uv.y, 1.0 - uv.y))` : "1.0"
  };

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

const STATIC_DIM: Record<Origin, number> = { top: 0.8, bottom: 0.8, both: 0.55 };

const BOTH_MASK =
  "linear-gradient(to bottom, transparent, #000 9%, transparent 35%, transparent 65%, #000 91%, transparent)";

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

function supportsWebgl2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

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

  const [mode, setMode] = useState<"still" | "animate">("still");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const capable = supportsWebgl2();
    const update = () => setMode(query.matches || !capable ? "still" : "animate");

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const colorKey = colorStops.join(",");
  const topColorKey = (topColorStops ?? colorStops).join(",");

  useEffect(() => {
    if (mode !== "animate") return;

    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "display:block;height:100%;width:100%;";

    const coarse = window.matchMedia("(max-width: 800px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);

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