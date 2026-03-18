"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface GhostTextProps {
  text: string;
  /** Speed multiplier: 0.5 = half speed (feels far), 1.5 = faster (feels close) */
  speed?: number;
  /** Alignment */
  align?: "left" | "right" | "center";
  /** Additional top offset in viewport percentage */
  offsetY?: string;
}

export function GhostText({ text, speed = 0.5, align = "left", offsetY = "15%" }: GhostTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 150 * speed },
        {
          y: -150 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current!.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  const alignClass =
    align === "right"
      ? "right-[64px] text-right"
      : align === "center"
        ? "left-1/2 -translate-x-1/2 text-center"
        : "left-[64px] text-left";

  return (
    <div
      ref={ref}
      className={`absolute ${alignClass} pointer-events-none select-none whitespace-nowrap`}
      style={{
        top: offsetY,
        color: "var(--text)",
        opacity: 0.03,
        fontSize: "clamp(8rem, 20vw, 18rem)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "-0.05em",
        lineHeight: 0.85,
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}
