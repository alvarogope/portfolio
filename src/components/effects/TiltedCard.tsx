"use client";

import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { motion, useSpring } from "motion/react";

type TiltedCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
};

const spring = { stiffness: 180, damping: 22, mass: 0.45 };

export default function TiltedCard({
  children,
  className,
  style,
  rotateAmplitude = 9,
  scaleOnHover = 1.03,
  showMobileWarning = false,
  showTooltip = false,
}: TiltedCardProps) {
  const [canTilt, setCanTilt] = useState(false);
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const scale = useSpring(1, spring);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanTilt(finePointer.matches && !reducedMotion.matches);

    update();
    finePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      finePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canTilt) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX.set(-vertical * rotateAmplitude * 2);
    rotateY.set(horizontal * rotateAmplitude * 2);
  };

  void showMobileWarning;
  void showTooltip;

  return (
    <motion.div
      className={className}
      style={{ ...style, rotateX, rotateY, scale, transformPerspective: 1200 }}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => canTilt && scale.set(scaleOnHover)}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}