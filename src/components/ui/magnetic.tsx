"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticProps {
  children: ReactNode;
  /** How far the element pulls toward cursor (0-1). Default 0.35 */
  strength?: number;
  /** Radius of the magnetic field in px. Default 80 */
  radius?: number;
  /** Class name for the wrapper */
  className?: string;
}

export function Magnetic({ children, strength = 0.35, radius = 80, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        gsap.to(ref.current, {
          x: distX * strength,
          y: distY * strength,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ display: "inline-flex" }}
    >
      {children}
    </div>
  );
}
