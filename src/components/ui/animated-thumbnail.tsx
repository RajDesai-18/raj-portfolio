"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface AnimatedThumbnailProps {
  children: ReactNode;
  /** Aspect ratio for the placeholder. Default "16/10" */
  aspectRatio?: string;
  /** How far before viewport to start loading. Default "300px" */
  rootMargin?: string;
}

/**
 * Wraps animated thumbnail components (PR Sensei, LLM Cookbook, Financial SaaS).
 * Only mounts children when near the viewport. Unmounts when scrolled far away,
 * which kills all setInterval/setTimeout timers inside the thumbnail.
 *
 * Shows a lightweight placeholder when unmounted.
 */
export function AnimatedThumbnail({
  children,
  aspectRatio = "16/10",
  rootMargin = "300px",
}: AnimatedThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ aspectRatio }}>
      {isVisible ? (
        children
      ) : (
        /* Lightweight placeholder — matches thumbnail appearance */
        <div
          className="w-full h-full rounded-xl flex items-center justify-center"
          style={{
            border: "1px solid var(--border-custom)",
            backgroundColor: "var(--surface)",
          }}
        >
          <span
            className="font-mono text-[0.625rem] uppercase tracking-[0.15em]"
            style={{ color: "var(--text-muted)", opacity: 0.3 }}
          >
            ···
          </span>
        </div>
      )}
    </div>
  );
}
