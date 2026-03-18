"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Dot follows instantly
      gsap.set(dot, { x: mouse.x, y: mouse.y });

      // Ring follows with lag
      gsap.to(ring, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.15,
        ease: "power2.out",
      });

      if (!visible.current) {
        visible.current = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
    };

    const onMouseLeave = () => {
      visible.current = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { scale: 1.5, duration: 0.15, ease: "power2.out" });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { scale: 1, duration: 0.15, ease: "power2.out" });
    };

    // Grow ring on hoverable elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Fully hide cursor on [data-cursor-hide] elements
      if (target.closest("[data-cursor-hide]")) {
        gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
        return;
      }

      // Expand ring on interactive elements
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]")
      ) {
        gsap.to(ring, {
          width: 48,
          height: 48,
          duration: 0.25,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 0, duration: 0.15 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Restore cursor from [data-cursor-hide] elements
      if (target.closest("[data-cursor-hide]")) {
        gsap.to(dot, { opacity: 1, duration: 0.15 });
        gsap.to(ring, { opacity: 1, duration: 0.15 });
        return;
      }

      // Reset from interactive elements
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]")
      ) {
        gsap.to(ring, {
          width: 32,
          height: 32,
          duration: 0.25,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 1, duration: 0.15 });
      }
    };

    // Hide default cursor
    document.documentElement.style.cursor = "none";

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      {/* Dot — small, follows instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none opacity-0"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "var(--accent-raw)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Ring — larger, follows with delay */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none opacity-0"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid var(--accent-raw)",
          opacity: 0,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
