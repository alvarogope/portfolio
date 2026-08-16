"use client";

import { useEffect, useRef, useState } from "react";
import { Geometry, Mesh, Program, Renderer } from "ogl";

type ParticlesProps = {
  particleColors?: readonly string[];
  particleCount?: number;
  speed?: number;
  alphaParticles?: boolean;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  drift: number;
  speed: number;
};

/* ────────────────────────────────────────────────────────────────────
   TUNING — every knob for the field is here.

   These are set for a bright, star-like field. At this strength a
   particle CAN sit over hero copy at close to full opacity, which puts
   the --color-mist subline below AA at those pixels. That is a
   deliberate trade for visibility; the AA-safe value for each knob is
   noted beside it, and the veil in page.tsx (search: hp-hero-contrast)
   is the other half of the accessible setting.
   ──────────────────────────────────────────────────────────────────── */
const ALPHA_MIN = 0.7; // AA-safe: 0.35
const ALPHA_MAX = 1; //   AA-safe: 0.75
const SIZE_MIN = 50; //    AA-safe: 2.5
const SIZE_MAX = 100; //   AA-safe: 6.5

/* Twinkle depth: the field oscillates between this and full alpha. */
const TWINKLE_FLOOR = 0.6;
const TWINKLE_SPEED = 1.4;

/* Cursor repulsion. Radius is in NDC half-widths, so 0.35 is roughly a
   sixth of the viewport; push is how far a particle at the very centre
   of the cursor is displaced. */
const MOUSE_RADIUS = 0.38;
const MOUSE_PUSH = 0.12;

const glsl = (value: number) => value.toFixed(4);

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  attribute float aPhase;

  uniform float uDpr;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uAspect;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec2 pos = position;

    /* Shove the star away from the cursor. The offset is aspect-corrected
       so the zone of influence is a circle on screen rather than an
       ellipse stretched by the viewport. */
    vec2 toMouse = pos - uMouse;
    float dist = length(vec2(toMouse.x * uAspect, toMouse.y));
    float influence = 1.0 - smoothstep(0.0, ${glsl(MOUSE_RADIUS)}, dist);
    float push = influence * uMouseStrength;
    vec2 direction = dist > 0.0001 ? normalize(toMouse) : vec2(0.0);
    pos += direction * push * ${glsl(MOUSE_PUSH)};

    /* Stars nearest the cursor also flare, so the interaction reads even
       where a particle has nowhere to move. */
    float twinkle = ${glsl(TWINKLE_FLOOR)}
      + ${glsl(1 - TWINKLE_FLOOR)} * sin(uTime * ${glsl(TWINKLE_SPEED)} + aPhase * 6.2831853);
    vAlpha = aAlpha * mix(twinkle, 1.0, push);

    gl_PointSize = aSize * uDpr * (1.0 + push * 0.8);
    gl_Position = vec4(pos, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;

    /* A star, not a smudge: a solid core carrying most of the light, with
       a soft halo around it. The previous falloff started fading at 12% of
       the radius, so 3/4 of every point was translucent haze — which is
       what made the field look washed out however high its alpha went. */
    float core = 1.0 - smoothstep(0.0, 0.22, d);
    float halo = 1.0 - smoothstep(0.16, 0.5, d);
    float shape = clamp(core + halo * 0.45, 0.0, 1.0);

    gl_FragColor = vec4(vColor, vAlpha * shape);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((part) => part + part).join("")
    : value;
  const number = Number.parseInt(normalized, 16);

  return [
    ((number >> 16) & 255) / 255,
    ((number >> 8) & 255) / 255,
    (number & 255) / 255,
  ];
}

/**
 * An OGL point field. It mounts only after hydration and releases its
 * animation frame, WebGL resources, and canvas on unmount.
 *
 * Under prefers-reduced-motion the field is still drawn, but as a single
 * static frame with no animation loop — the drifting is what the preference
 * is about, and a motionless starfield is not motion.
 */
export default function Particles({
  particleColors = ["#B8C4D4", "#7A8699"],
  particleCount = 120,
  speed = 0.06,
  alphaParticles = true,
  className,
}: ParticlesProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Assume "reduced" until the client has actually read the preference, and
  // re-read it if the user changes it mid-session. This only decides whether
  // the field animates, not whether it is drawn.
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  /* The colours arrive as a fresh array on every parent render, so the effect
     keys off their content instead — rebuilding a WebGL context because an
     array literal changed identity would be an expensive no-op. */
  const colorKey = particleColors.join(",");

  useEffect(() => {
    const host = hostRef.current;

    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "display:block;height:100%;width:100%;";
    host.appendChild(canvas);

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        depth: false,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      canvas.remove();
      return;
    }

    const gl = renderer.gl;
    const colors = colorKey.split(",").map(hexToRgb);
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      drift: (Math.random() - 0.5) * 0.12,
      speed: 0.25 + Math.random() * 0.75,
    }));
    const positions = new Float32Array(particleCount * 2);
    const sizes = new Float32Array(particleCount);
    const colorsAttribute = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    particles.forEach((particle, index) => {
      positions[index * 2] = particle.x;
      positions[index * 2 + 1] = particle.y;
      sizes[index] = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);
      const color = colors[index % colors.length] ?? colors[0];
      colorsAttribute.set(color, index * 3);
      alphas[index] = alphaParticles
        ? ALPHA_MIN + Math.random() * (ALPHA_MAX - ALPHA_MIN)
        : ALPHA_MAX;
      // Random phase so the field twinkles out of step rather than pulsing
      // as one.
      phases[index] = Math.random();
    });

    const geometry = new Geometry(gl, {
      position: { size: 2, data: positions, usage: gl.DYNAMIC_DRAW },
      aSize: { size: 1, data: sizes },
      aColor: { size: 3, data: colorsAttribute },
      aAlpha: { size: 1, data: alphas },
      aPhase: { size: 1, data: phases },
    });
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uDpr: { value: renderer.dpr },
        uTime: { value: 0 },
        uMouse: { value: [0, 0] },
        uMouseStrength: { value: 0 },
        uAspect: { value: 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

    const resize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      program.uniforms.uDpr.value = renderer.dpr;
      program.uniforms.uAspect.value =
        host.clientHeight > 0 ? host.clientWidth / host.clientHeight : 1;
      // A static field has no loop to repaint it, so the resized buffer has
      // to be redrawn here or it would be left blank.
      if (reducedMotion) renderer.render({ scene: mesh });
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    /* The canvas is pointer-events:none so it never intercepts selection or
       clicks, which also means it receives no pointer events of its own.
       The cursor is tracked on the window instead and tested against the
       host's box, and the smoothed value is what reaches the shader — so
       the field eases toward the cursor and relaxes when it leaves rather
       than snapping. */
    const pointer = { x: 0, y: 0, strength: 0 };
    const pointerTarget = { x: 0, y: 0, strength: 0 };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      pointerTarget.strength = inside ? 1 : 0;
      if (!inside) return;

      pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      // NDC runs bottom-up, client coordinates run top-down.
      pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handlePointerOut = () => {
      pointerTarget.strength = 0;
    };

    // A coarse pointer has no hover, so the repulsion is desktop-only.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const interactive = !reducedMotion && finePointer.matches;

    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.addEventListener("pointerleave", handlePointerOut);
    }

    let animationFrame = 0;
    let previousTime = performance.now();
    const render = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.1);
      previousTime = time;

      // Frame-rate independent easing toward the cursor's current position.
      const ease = 1 - Math.pow(0.0015, delta);
      pointer.x += (pointerTarget.x - pointer.x) * ease;
      pointer.y += (pointerTarget.y - pointer.y) * ease;
      pointer.strength += (pointerTarget.strength - pointer.strength) * ease;

      particles.forEach((particle, index) => {
        particle.y += delta * speed * particle.speed * 0.16;
        particle.x += Math.sin(time * 0.0002 + index) * delta * particle.drift;
        if (particle.y > 1.08) particle.y = -1.08;
        if (particle.x > 1.08) particle.x = -1.08;
        if (particle.x < -1.08) particle.x = 1.08;
        positions[index * 2] = particle.x;
        positions[index * 2 + 1] = particle.y;
      });

      program.uniforms.uTime.value = time / 1000;
      program.uniforms.uMouse.value = [pointer.x, pointer.y];
      program.uniforms.uMouseStrength.value = pointer.strength;

      const position = geometry.attributes.position;
      if (position) geometry.updateAttribute(position);
      renderer.render({ scene: mesh });
      animationFrame = window.requestAnimationFrame(render);
    };

    if (reducedMotion) {
      renderer.render({ scene: mesh });
    } else {
      animationFrame = window.requestAnimationFrame(render);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (interactive) {
        window.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerleave", handlePointerOut);
      }
      observer.disconnect();
      geometry.remove();
      program.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [alphaParticles, colorKey, particleCount, speed, reducedMotion]);

  return <div ref={hostRef} aria-hidden className={className} />;
}
