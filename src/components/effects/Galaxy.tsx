"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

type GalaxyProps = {
  /** Origin of the field, in [0,1] of the box. */
  focal?: [number, number];
  /** Fixed rotation of the field, as [cos, sin]. */
  rotation?: [number, number];
  /** Pace at which layers cycle through depth, i.e. stars flying past. */
  starSpeed?: number;
  /** Cell scale. Higher packs more, smaller stars into the same box. */
  density?: number;
  /** Rotates every star's hue, in degrees. */
  hueShift?: number;
  /** Global multiplier on every time-based term. */
  speed?: number;
  /** Size of each star's halo. The contrast knob -- see the note below. */
  glowIntensity?: number;
  /** 0 renders the field grey, 1 gives the stars their full colour. */
  saturation?: number;
  /** 0 holds every star steady, 1 is maximum flicker. */
  twinkleIntensity?: number;
  /** Pace of the field's own slow rotation. */
  rotationSpeed?: number;
  /** Parallax as the pointer crosses the box. Ignored on coarse pointers. */
  mouseInteraction?: boolean;
  /** Push stars away from the pointer instead of drifting the whole field. */
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  /** Push stars out from the centre. Overrides mouse repulsion when > 0. */
  autoCenterRepulsion?: number;
  /** false paints the field on solid black instead of on the page. */
  transparent?: boolean;
  /** The dimmer. Applied to the canvas, so it scales the whole effect. */
  opacity?: number;
  className?: string;
};

const VERT = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv) / 8.0;
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  /* Upstream writes smoothstep(1.0, 0.2, d). GLSL leaves smoothstep
     undefined when edge0 >= edge1, so it is flipped here into the
     identical, defined form. Same for the depth fade in main(). */
  m *= 1.0 - smoothstep(0.2, 1.0, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;

      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * (1.0 - smoothstep(0.9, 1.0, depth));
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

export default function Galaxy({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  speed = 1.0,
  glowIntensity = 0.3,
  saturation = 0.0,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  mouseInteraction = true,
  mouseRepulsion = true,
  repulsionStrength = 2,
  autoCenterRepulsion = 0,
  transparent = true,
  opacity = 1,
  className,
}: GalaxyProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  /* "still" until the client has actually read the preference, so the
     server-rendered markup and the first paint are never the animated one. */
  const [reducedMotion, setReducedMotion] = useState(true);

  const live = useRef({
    focal,
    rotation,
    starSpeed,
    density,
    hueShift,
    speed,
    glowIntensity,
    saturation,
    twinkleIntensity,
    rotationSpeed,
    mouseRepulsion,
    repulsionStrength,
    autoCenterRepulsion,
    transparent,
  });

  useEffect(() => {
    live.current = {
      focal,
      rotation,
      starSpeed,
      density,
      hueShift,
      speed,
      glowIntensity,
      saturation,
      twinkleIntensity,
      rotationSpeed,
      mouseRepulsion,
      repulsionStrength,
      autoCenterRepulsion,
      transparent,
    };
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "display:block;height:100%;width:100%;";

    const coarse = window.matchMedia("(max-width: 800px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.25);

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: transparent,
        depth: false,
        antialias: false,
        premultipliedAlpha: false,
        dpr,
      });
    } catch {
      return;
    }

    host.appendChild(canvas);

    const gl = renderer.gl;

    gl.clearColor(0, 0, 0, transparent ? 0 : 1);

    const seed = live.current;
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uFocal: { value: new Float32Array(seed.focal) },
        uRotation: { value: new Float32Array(seed.rotation) },
        uStarSpeed: { value: 0 },
        uDensity: { value: seed.density },
        uHueShift: { value: seed.hueShift },
        uSpeed: { value: seed.speed },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity: { value: seed.glowIntensity },
        uSaturation: { value: seed.saturation },
        uMouseRepulsion: { value: seed.mouseRepulsion },
        uTwinkleIntensity: { value: seed.twinkleIntensity },
        uRotationSpeed: { value: seed.rotationSpeed },
        uRepulsionStrength: { value: seed.repulsionStrength },
        uMouseActiveFactor: { value: 0 },
        uAutoCenterRepulsion: { value: seed.autoCenterRepulsion },
        uTransparent: { value: seed.transparent },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const pushUniforms = (elapsed: number) => {
      const p = live.current;
      const u = program.uniforms;
      u.uTime.value = elapsed;
      u.uStarSpeed.value = (elapsed * p.starSpeed) / 10;
      u.uFocal.value[0] = p.focal[0];
      u.uFocal.value[1] = p.focal[1];
      u.uRotation.value[0] = p.rotation[0];
      u.uRotation.value[1] = p.rotation[1];
      u.uDensity.value = p.density;
      u.uHueShift.value = p.hueShift;
      u.uSpeed.value = p.speed;
      u.uGlowIntensity.value = p.glowIntensity;
      u.uSaturation.value = p.saturation;
      u.uMouseRepulsion.value = p.mouseRepulsion;
      u.uTwinkleIntensity.value = p.twinkleIntensity;
      u.uRotationSpeed.value = p.rotationSpeed;
      u.uRepulsionStrength.value = p.repulsionStrength;
      u.uAutoCenterRepulsion.value = p.autoCenterRepulsion;
      u.uTransparent.value = p.transparent;
    };

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      ];

      if (reducedMotion) {
        pushUniforms(0);
        renderer.render({ scene: mesh });
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const interactive = mouseInteraction && !reducedMotion && finePointer.matches;

    const target = { x: 0.5, y: 0.5, active: 0 };
    const smooth = { x: 0.5, y: 0.5, active: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) {
        target.active = 0;
        return;
      }
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
      target.active = 1;
    };
    const handlePointerOut = () => {
      target.active = 0;
    };

    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.addEventListener("pointerleave", handlePointerOut);
    }

    let onScreen = true;
    let frame = 0;
    let elapsed = 0;
    let last = 0;

    const render = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += delta;

      pushUniforms(elapsed);

      if (interactive) {
        const ease = 1 - Math.pow(0.05, delta);
        smooth.x += (target.x - smooth.x) * ease;
        smooth.y += (target.y - smooth.y) * ease;
        smooth.active += (target.active - smooth.active) * ease;
        program.uniforms.uMouse.value[0] = smooth.x;
        program.uniforms.uMouse.value[1] = smooth.y;
        program.uniforms.uMouseActiveFactor.value = smooth.active;
      }

      renderer.render({ scene: mesh });
      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (frame || reducedMotion || document.hidden || !onScreen) return;
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

    if (reducedMotion) {
      pushUniforms(0);
      renderer.render({ scene: mesh });
    } else {
      start();
    }

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      visibility.disconnect();
      observer.disconnect();
      if (interactive) {
        window.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerleave", handlePointerOut);
      }
      geometry.remove();
      program.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [reducedMotion, mouseInteraction, transparent]);

  return <div ref={hostRef} aria-hidden className={className} style={{ opacity }} />;
}