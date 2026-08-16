"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Geometry, Mesh, Program, Renderer } from "ogl";

type ParticlesProps = {
  /** Hex colours sampled at random, one per particle. */
  particleColors?: readonly string[];
  particleCount?: number;
  /** How far particles spread from the centre of the cloud. */
  particleSpread?: number;
  /** Animation pace. 0.1 is the reference value; higher is faster. */
  speed?: number;
  /** Parallax on hover — see the note below, this moves the camera. */
  moveParticlesOnHover?: boolean;
  /** How far the camera travels, in world units, at the edge of the box. */
  particleHoverFactor?: number;
  /** Soft-edged and translucent when true; solid discs when false. */
  alphaParticles?: boolean;
  particleBaseSize?: number;
  /** 0 makes every particle the same size. */
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  /** Defaults to the display's DPR, capped at 2. */
  pixelRatio?: number;
  className?: string;
};

const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

function hexToRgb(hex: string): [number, number, number] {
  let value = hex.replace(/^#/, "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = Number.parseInt(value.slice(0, 6), 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

/**
 * The React Bits particle field, ported to TypeScript.
 *
 * The shaders, the geometry and the motion are the upstream ones. What is
 * different, and why:
 *
 *  - Hover moves the CAMERA, not the cloud. Upstream translates the mesh by
 *    the negated cursor; here the camera trucks toward the cursor instead,
 *    which is the same parallax read from the other side and is what the
 *    effect is actually meant to be — the viewer leaning to look, rather
 *    than the particles being pushed around.
 *
 *  - The cursor is tracked on the window and hit-tested against the host's
 *    box, not with a listener on the container. The host is
 *    pointer-events:none wherever this is used, so a listener on it would
 *    never fire at all.
 *
 *  - Resizing is watched with a ResizeObserver rather than the window's
 *    resize event: these fields are sized by their section, which can
 *    change height without the window changing at all.
 *
 *  - Under prefers-reduced-motion the field is still drawn, but as a single
 *    static frame with no animation loop and no hover — the drifting is
 *    what the preference is about, and a motionless field is not motion.
 *
 *  - Cleanup releases the geometry, the program and the GL context, not
 *    just the animation frame and the canvas.
 */
export default function Particles({
  particleColors,
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio,
  className,
}: ParticlesProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  // Assume "reduced" until the client has actually read the preference, and
  // re-read it if the user changes it mid-session.
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
  const colorKey = (particleColors ?? defaultColors).join(",");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const dpr = pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2);

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr, depth: false, alpha: true });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.setAttribute("aria-hidden", "true");
    gl.canvas.style.cssText = "display:block;height:100%;width:100%;";
    host.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const palette = colorKey.split(",");
    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Rejection-sample a point in the unit sphere, then push it out by the
      // cube root so the cloud is evenly filled rather than centre-heavy.
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const hex = palette[Math.floor(Math.random() * palette.length)] ?? defaultColors[0];
      colors.set(hexToRgb(hex), i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * dpr },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      // A static field has no loop to repaint it, so the resized buffer has
      // to be redrawn here or it would be left blank.
      if (reducedMotion) renderer.render({ scene: particles, camera });
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    /* The canvas is pointer-events:none so it never intercepts selection or
       clicks, which also means it receives no pointer events of its own.
       The cursor is tracked on the window instead and tested against the
       host's box, and the smoothed value is what reaches the camera — so
       the view eases toward the cursor and relaxes when it leaves rather
       than snapping. */
    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        pointerTarget.x = 0;
        pointerTarget.y = 0;
        return;
      }

      pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      // Clip space runs bottom-up, client coordinates run top-down.
      pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handlePointerOut = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    };

    // A coarse pointer has no hover, so the parallax is desktop-only.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const interactive = moveParticlesOnHover && !reducedMotion && finePointer.matches;

    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.addEventListener("pointerleave", handlePointerOut);
    }

    let animationFrame = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (time: number) => {
      animationFrame = window.requestAnimationFrame(update);

      const delta = time - lastTime;
      lastTime = time;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (interactive) {
        // Frame-rate independent easing toward the cursor's position.
        const ease = 1 - Math.pow(0.0015, Math.min(delta / 1000, 0.1));
        pointer.x += (pointerTarget.x - pointer.x) * ease;
        pointer.y += (pointerTarget.y - pointer.y) * ease;

        // The camera leans toward the cursor. Moving it right shifts the
        // cloud left on screen, which is the same read as translating the
        // cloud by the negated cursor — but it is the viewpoint moving,
        // so nearer particles slide further than far ones.
        camera.position.x = pointer.x * particleHoverFactor;
        camera.position.y = pointer.y * particleHoverFactor;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    if (reducedMotion) {
      renderer.render({ scene: particles, camera });
    } else {
      animationFrame = window.requestAnimationFrame(update);
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
      gl.canvas.remove();
    };
  }, [
    alphaParticles,
    cameraDistance,
    colorKey,
    disableRotation,
    moveParticlesOnHover,
    particleBaseSize,
    particleCount,
    particleHoverFactor,
    particleSpread,
    pixelRatio,
    reducedMotion,
    sizeRandomness,
    speed,
  ]);

  return <div ref={hostRef} aria-hidden className={className} />;
}
