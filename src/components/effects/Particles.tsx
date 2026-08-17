"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Geometry, Mesh, Program, Renderer } from "ogl";

type ParticlesProps = {

  particleColors?: readonly string[];
  particleCount?: number;

  particleSpread?: number;

  speed?: number;

  moveParticlesOnHover?: boolean;

  particleHoverFactor?: number;

  alphaParticles?: boolean;
  particleBaseSize?: number;

  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;

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

  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

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

      if (reducedMotion) renderer.render({ scene: particles, camera });
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

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

      pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handlePointerOut = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    };

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

        const ease = 1 - Math.pow(0.0015, Math.min(delta / 1000, 0.1));
        pointer.x += (pointerTarget.x - pointer.x) * ease;
        pointer.y += (pointerTarget.y - pointer.y) * ease;

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
