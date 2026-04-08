"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseInViewOptions {
  /** Root margin for preloading. Default "200px" (starts loading before visible) */
  rootMargin?: string;
  /** Only trigger once (stays true after first intersection). Default true */
  once?: boolean;
  /** Intersection threshold. Default 0 (any pixel visible) */
  threshold?: number;
}

/**
 * Returns [ref, isInView] — attach ref to the element you want to observe.
 * isInView becomes true when the element enters the viewport (+ rootMargin).
 * With once=true (default), it stays true permanently after first trigger.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { rootMargin = "200px", once = true, threshold = 0 } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and once mode, skip
    if (isInView && once) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, once, isInView]);

  return [ref, isInView];
}
