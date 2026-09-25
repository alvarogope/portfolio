"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

type Origin = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type SideRaysProps = {

  origin?: Origin;

  rayColor1?: string;

  rayColor2?: string;

  blend?: number;

  spread?: number;

  tilt?: number;

  intensity?: number;

  falloff?: number;

  saturation?: number;

  speed?: number;

  opacity?: number;
  className?: string;
};

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;

  /* The fan is authored pointing away from the top-right. Mirroring the
     coordinate frame is what moves it to any other corner, so everything
     below is written once and only ever sees the top-right case. */
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1];
}

function originToFlip(origin: Origin): [number, number] {
  switch (origin) {
    case "top-left":
      return [1, 0];
    case "bottom-right":
      return [0, 1];
    case "bottom-left":
      return [1, 1];
    default:
      return [0, 0];
  }
}

const CORNER: Record<Origin, string> = {
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
};

type Tuning = Required<
  Pick<
    SideRaysProps,
    "rayColor1" | "rayColor2" | "blend" | "spread" | "intensity" | "falloff" | "saturation" | "opacity"
  >
>;

function sampleAt(t: number, cfg: Tuning, aspect = 16 / 9) {
  // The light sits just outside the corner; see rayPos in the shader.
  const source = [1.1 * aspect, 1.5];
  const d = Math.hypot((1 - t) * aspect - source[0], 1 - t - source[1]);

  const atten = Math.min(1, Math.max(0.5, (aspect - d) / aspect));
  const c1 = hexToRgb(cfg.rayColor1);
  const c2 = hexToRgb(cfg.rayColor2);
  let rgb = [0, 1, 2].map((i) => 0.9 * atten * (c1[i] * (1 - cfg.blend) + c2[i] * cfg.blend));

  rgb = rgb.map((v) => v * ((cfg.intensity * 0.4) / Math.max(d, 0.001) ** cfg.falloff));

  const gray = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  rgb = rgb.map((v) => gray + cfg.saturation * (v - gray));

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  return {
    rgb: rgb.map(clamp01).map((v) => Math.round(v * 255)),
    a: clamp01(Math.max(...rgb) * cfg.opacity),
  };
}

function staticGradient(origin: Origin, cfg: Tuning) {
  const stops = [0, 0.12, 0.28, 0.55].map((t) => {
    const { rgb, a } = sampleAt(t, cfg);
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a.toFixed(3)}) ${Math.round(t * 100)}%`;
  });
  return `radial-gradient(125% 125% at ${CORNER[origin]}, ${stops.join(", ")}, transparent 100%)`;
}

function supportsWebgl() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function SideRays({
  origin = "top-right",
  rayColor1 = "#ffaa6e",
  rayColor2 = "#96c8ff",
  blend = 0.78,
  spread = 1,
  tilt = 0,
  intensity = 1,
  falloff = 2,
  saturation = 1,
  speed = 1,
  opacity = 1,
  className,
}: SideRaysProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"still" | "animate">("still");

  const live = useRef({
    rayColor1,
    rayColor2,
    blend,
    spread,
    tilt,
    intensity,
    falloff,
    saturation,
    speed,
    opacity,
    origin,
  });

  useEffect(() => {
    live.current = {
      rayColor1,
      rayColor2,
      blend,
      spread,
      tilt,
      intensity,
      falloff,
      saturation,
      speed,
      opacity,
      origin,
    };
  }, [
    rayColor1,
    rayColor2,
    blend,
    spread,
    tilt,
    intensity,
    falloff,
    saturation,
    speed,
    opacity,
    origin,
  ]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const capable = supportsWebgl();
    const update = () => setMode(query.matches || !capable ? "still" : "animate");

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (mode !== "animate") return;

    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "display:block;height:100%;width:100%;";

    const coarse = window.matchMedia("(max-width: 800px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);

    let renderer: Renderer;
    try {
      renderer = new Renderer({ canvas, alpha: true, depth: false, antialias: false, dpr });
    } catch {

      return;
    }

    host.appendChild(canvas);

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const seed = live.current;
    const [flipX, flipY] = originToFlip(seed.origin);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        iSpeed: { value: seed.speed },
        iRayColor1: { value: hexToRgb(seed.rayColor1) },
        iRayColor2: { value: hexToRgb(seed.rayColor2) },
        iIntensity: { value: seed.intensity },
        iSpread: { value: seed.spread },
        iFlipX: { value: flipX },
        iFlipY: { value: flipY },
        iTilt: { value: seed.tilt },
        iSaturation: { value: seed.saturation },
        iBlend: { value: seed.blend },
        iFalloff: { value: seed.falloff },
        iOpacity: { value: seed.opacity },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);

      program.uniforms.iResolution.value = [width * renderer.dpr, height * renderer.dpr];
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
      elapsed += delta;

      const p = live.current;
      const u = program.uniforms;
      u.iTime.value = elapsed;
      u.iSpeed.value = p.speed;
      u.iRayColor1.value = hexToRgb(p.rayColor1);
      u.iRayColor2.value = hexToRgb(p.rayColor2);
      u.iIntensity.value = p.intensity;
      u.iSpread.value = p.spread;
      u.iTilt.value = p.tilt;
      u.iSaturation.value = p.saturation;
      u.iBlend.value = p.blend;
      u.iFalloff.value = p.falloff;
      u.iOpacity.value = p.opacity;
      const [fx, fy] = originToFlip(p.origin);
      u.iFlipX.value = fx;
      u.iFlipY.value = fy;

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
  }, [mode]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className}
      style={{
        overflow: "hidden",
        pointerEvents: "none",
        backgroundImage: staticGradient(origin, {
          rayColor1,
          rayColor2,
          blend,
          spread,
          intensity,
          falloff,
          saturation,
          opacity,
        }),
      }}
    />
  );
}