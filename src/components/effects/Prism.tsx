"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

type AnimationType = "rotate" | "hover" | "3drotate";

type PrismProps = {
  /** Apex height of the prism, in world units. */
  height?: number;
  /** Total base width across X/Z, in world units. */
  baseWidth?: number;
  /** Shader wobble, pointer tilt, or a full 3D spin. */
  animationType?: AnimationType;

  rotation?: { yaw?: number; pitch?: number; roll?: number };
  /** Glow/bleed multiplier. Multiplies with `bloom`; they are one knob. */
  glow?: number;
  /** Pixel offset within the canvas. Absolute px, so it does not scale. */
  offset?: { x?: number; y?: number };
  /** Film grain added to the final colour. 0 disables. */
  noise?: number;
  /** Whether the canvas keeps an alpha channel. */
  transparent?: boolean;
  /** Screen-space size of the prism. Higher is LARGER. */
  scale?: number;
  /** Hue rotation in RADIANS. */
  hueShift?: number;
  /** Frequency of the internal colour bands. The rainbow knob; see below. */
  colorFrequency?: number;
  /** 0 renders grey, 1 leaves the bands alone, above 1 boosts them. */
  saturation?: number;
  /** Sensitivity of the hover tilt. */
  hoverStrength?: number;
  /** Easing for the hover tilt, 0..1, higher is snappier. */
  inertia?: number;
  /** Second glow multiplier, layered on the first. */
  bloom?: number;
  /** Pause rendering while the element is off screen. */
  suspendWhenOffscreen?: boolean;
  /** Global time multiplier. 0 freezes the shader. */
  timeScale?: number;
  /** The dimmer. Applied to the canvas, so it scales the whole effect. */
  opacity?: number;
  className?: string;
};

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  iResolution;
uniform float iTime;

uniform float uHeight;
uniform float uBaseHalf;
uniform mat3  uRot;
uniform int   uUseBaseWobble;
uniform float uGlow;
uniform vec2  uOffsetPx;
uniform float uNoise;
uniform float uSaturation;
uniform float uScale;
uniform float uHueShift;
uniform float uColorFreq;
uniform float uBloom;
uniform float uCenterShift;
uniform float uInvBaseHalf;
uniform float uInvHeight;
uniform float uMinAxis;
uniform float uPxScale;
uniform float uTimeScale;

vec4 tanh4(vec4 x){
  vec4 e2x = exp(2.0*x);
  return (e2x - 1.0) / (e2x + 1.0);
}

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
}

float sdOctaAnisoInv(vec3 p){
  vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
  float m = q.x + q.y + q.z - 1.0;
  return m * uMinAxis * 0.5773502691896258;
}

float sdPyramidUpInv(vec3 p){
  float oct = sdOctaAnisoInv(p);
  float halfSpace = -p.y;
  return max(oct, halfSpace);
}

/* Written COLUMN-major, which is how GLSL reads mat3(...), so that the ROWS
   below are the intended hue-rotation rows. Upstream writes the rows
   directly and therefore ships the transpose; see the note in the .tsx. */
mat3 hueRotation(float a){
  float c = cos(a), s = sin(a);
  mat3 W = mat3(
    0.299, 0.299, 0.299,
    0.587, 0.587, 0.587,
    0.114, 0.114, 0.114
  );
  mat3 U = mat3(
     0.701, -0.299, -0.300,
    -0.587,  0.413, -0.588,
    -0.114, -0.114,  0.886
  );
  mat3 V = mat3(
     0.168,  0.328, -0.497,
    -0.331,  0.035,  0.296,
     0.500, -0.500,  0.201
  );
  return W + U * c + V * s;
}

void main(){
  vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

  float z = 5.0;
  float d = 0.0;

  vec3 p;
  vec4 o = vec4(0.0);

  float centerShift = uCenterShift;
  float cf = uColorFreq;

  mat2 wob = mat2(1.0);
  if (uUseBaseWobble == 1) {
    float t = iTime * uTimeScale;
    float c0 = cos(t + 0.0);
    float c1 = cos(t + 33.0);
    float c2 = cos(t + 11.0);
    wob = mat2(c0, c1, c2, c0);
  }

  const int STEPS = 100;
  for (int i = 0; i < STEPS; i++) {
    p = vec3(f, z);
    p.xz = p.xz * wob;
    p = uRot * p;
    vec3 q = p;
    q.y += centerShift;
    d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
    z -= d;
    o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
  }

  o = tanh4(o * o * (uGlow * uBloom) / 1e5);

  vec3 col = o.rgb;
  float n = rand(gl_FragCoord.xy + vec2(iTime));
  col += (n - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0);

  float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

  if(abs(uHueShift) > 0.0001){
    col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
  }

  gl_FragColor = vec4(col, o.a);
}
`;

function setMat3FromEuler(yawY: number, pitchX: number, rollZ: number, out: Float32Array) {
  const cy = Math.cos(yawY);
  const sy = Math.sin(yawY);
  const cx = Math.cos(pitchX);
  const sx = Math.sin(pitchX);
  const cz = Math.cos(rollZ);
  const sz = Math.sin(rollZ);
  out[0] = cy * cz + sy * sx * sz;
  out[1] = cx * sz;
  out[2] = -sy * cz + cy * sx * sz;
  out[3] = -cy * sz + sy * sx * cz;
  out[4] = cx * cz;
  out[5] = sy * sz + cy * sx * cz;
  out[6] = sy * cx;
  out[7] = -sx;
  out[8] = cy * cx;
  return out;
}

export default function Prism({
  height = 3.5,
  baseWidth = 5.5,
  animationType = "rotate",
  rotation,
  glow = 1,
  offset,
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  saturation,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = false,
  timeScale = 0.5,
  opacity = 1,
  className,
}: PrismProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);

  const live = useRef({
    height, baseWidth, glow, offset, noise, scale, hueShift, colorFrequency,
    saturation, hoverStrength, inertia, bloom, timeScale, transparent, rotation,
  });

  useEffect(() => {
    live.current = {
      height, baseWidth, glow, offset, noise, scale, hueShift, colorFrequency,
      saturation, hoverStrength, inertia, bloom, timeScale, transparent, rotation,
    };
  });

  const redraw = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (reducedMotion) redraw.current?.();
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
        dpr,
        alpha: transparent,
        antialias: false,
        depth: false,
      });
    } catch {
      return;
    }

    host.appendChild(canvas);

    const gl = renderer.gl;

    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, transparent ? 0 : 1);

    const iResBuf = new Float32Array(2);
    const offsetPxBuf = new Float32Array(2);
    const rotBuf = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      depthTest: false,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },
        uHeight: { value: 3.5 },
        uBaseHalf: { value: 2.75 },
        uUseBaseWobble: { value: animationType === "rotate" ? 1 : 0 },
        uRot: { value: rotBuf },
        uGlow: { value: 1 },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: 0.5 },
        uSaturation: { value: 1.5 },
        uScale: { value: 3.6 },
        uHueShift: { value: 0 },
        uColorFreq: { value: 1 },
        uBloom: { value: 1 },
        uCenterShift: { value: 0.875 },
        uInvBaseHalf: { value: 1 / 2.75 },
        uInvHeight: { value: 1 / 3.5 },
        uMinAxis: { value: 2.75 },
        uPxScale: { value: 1 },
        uTimeScale: { value: 0.5 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const pushUniforms = () => {
      const p = live.current;
      const u = program.uniforms;
      const H = Math.max(0.001, p.height);
      const baseHalf = Math.max(0.001, p.baseWidth) * 0.5;
      const sc = Math.max(0.001, p.scale);
      u.uHeight.value = H;
      u.uBaseHalf.value = baseHalf;
      u.uCenterShift.value = H * 0.25;
      u.uInvBaseHalf.value = 1 / baseHalf;
      u.uInvHeight.value = 1 / H;
      u.uMinAxis.value = Math.min(baseHalf, H);
      u.uScale.value = sc;
      u.uGlow.value = Math.max(0, p.glow);
      u.uBloom.value = Math.max(0, p.bloom || 1);
      u.uNoise.value = Math.max(0, p.noise);
      u.uSaturation.value = p.saturation ?? (p.transparent ? 1.5 : 1);
      u.uHueShift.value = p.hueShift || 0;
      u.uColorFreq.value = Math.max(0, p.colorFrequency || 1);
      u.uTimeScale.value = reducedMotion ? 0 : Math.max(0, p.timeScale);
      u.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * sc);
      offsetPxBuf[0] = (p.offset?.x ?? 0) * dpr;
      offsetPxBuf[1] = (p.offset?.y ?? 0) * dpr;
      /* Only "rotate" leaves the matrix free; the other two modes write it
         from the loop, and overwriting it here would cancel them out. */
      if (animationType === "rotate") {
        setMat3FromEuler(
          p.rotation?.yaw ?? 0,
          p.rotation?.pitch ?? 0,
          p.rotation?.roll ?? 0,
          rotBuf
        );
      }
    };

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h);
      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;
      pushUniforms();
      if (reducedMotion) renderer.render({ scene: mesh });
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const wX = 0.3 + Math.random() * 0.6;
    const wY = 0.2 + Math.random() * 0.7;
    const wZ = 0.1 + Math.random() * 0.5;
    const phX = Math.random() * Math.PI * 2;
    const phZ = Math.random() * Math.PI * 2;

    let yaw = 0;
    let pitch = 0;
    let roll = 0;
    const pointer = { x: 0, y: 0, inside: false };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let onScreen = true;
    let frame = 0;
    let elapsed = 0;
    let last = 0;

    const render = (now: number) => {

      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += delta;

      pushUniforms();
      program.uniforms.iTime.value = elapsed;

      const p = live.current;
      let keepGoing = true;

      if (animationType === "hover") {
        const inert = Math.max(0, Math.min(1, p.inertia || 0.12));
        const strength = Math.max(0, p.hoverStrength || 1);
        const targetYaw = (pointer.inside ? -pointer.x : 0) * 0.6 * strength;
        const targetPitch = (pointer.inside ? pointer.y : 0) * 0.6 * strength;
        yaw = lerp(yaw, targetYaw, inert);
        pitch = lerp(pitch, targetPitch, inert);
        roll = lerp(roll, 0, 0.1);
        setMat3FromEuler(yaw, pitch, roll, rotBuf);
        if (p.noise < 1e-6) {
          keepGoing =
            Math.abs(yaw - targetYaw) > 1e-4 ||
            Math.abs(pitch - targetPitch) > 1e-4 ||
            Math.abs(roll) > 1e-4;
        }
      } else if (animationType === "3drotate") {
        const t = elapsed * Math.max(0, p.timeScale);
        setMat3FromEuler(
          t * wY,
          Math.sin(t * wX + phX) * 0.6,
          Math.sin(t * wZ + phZ) * 0.5,
          rotBuf
        );
      }

      renderer.render({ scene: mesh });
      frame = keepGoing ? window.requestAnimationFrame(render) : 0;
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

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hovering =
      animationType === "hover" && !reducedMotion && finePointer.matches;

    const onMove = (e: PointerEvent) => {
      const ww = Math.max(1, window.innerWidth);
      const wh = Math.max(1, window.innerHeight);
      pointer.x = Math.max(-1, Math.min(1, (e.clientX - ww * 0.5) / (ww * 0.5)));
      pointer.y = Math.max(-1, Math.min(1, (e.clientY - wh * 0.5) / (wh * 0.5)));
      pointer.inside = true;
      start();
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    if (hovering) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    let visibility: IntersectionObserver | null = null;
    if (suspendWhenOffscreen) {
      visibility = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry?.isIntersecting ?? true;
          if (onScreen) start();
          else stop();
        },
        { threshold: 0 }
      );
      visibility.observe(host);
    }

    const handleVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", handleVisibility);

    redraw.current = () => {
      pushUniforms();
      renderer.render({ scene: mesh });
    };

    if (reducedMotion) {
      pushUniforms();
      renderer.render({ scene: mesh });
    } else {
      start();
    }

    return () => {
      stop();
      redraw.current = null;
      document.removeEventListener("visibilitychange", handleVisibility);
      visibility?.disconnect();
      ro.disconnect();
      if (hovering) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onLeave);
      }
      geometry.remove();
      program.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [reducedMotion, animationType, transparent, suspendWhenOffscreen]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className}
      style={{ pointerEvents: "none", opacity }}
    />
  );
}
