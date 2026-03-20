"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    const mouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      gsap.to(ring, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.12,
        ease: "power2.out",
      });

      if (!visible.current) {
        visible.current = true;
        gsap.to(ring, { opacity: 1, duration: 0.3 });
      }
    };

    const onMouseLeave = () => {
      visible.current = false;
      gsap.to(ring, { opacity: 0, duration: 0.3 });
    };

    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.75, duration: 0.15, ease: "power2.out" });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.15, ease: "power2.out" });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-cursor-hide]")) {
        gsap.to(ring, { opacity: 0, duration: 0.15 });
        return;
      }

      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        target.closest("[data-cursor-view]")
      ) {
        gsap.to(ring, {
          width: 48,
          height: 48,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-cursor-hide]")) {
        gsap.to(ring, { opacity: 1, duration: 0.15 });
        return;
      }

      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        target.closest("[data-cursor-view]")
      ) {
        gsap.to(ring, {
          width: 28,
          height: 28,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

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
    <div
      ref={ringRef}
      className="fixed top-0 left-0 z-9998 pointer-events-none"
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        border: "1.5px solid var(--accent-raw)",
        opacity: 0,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}