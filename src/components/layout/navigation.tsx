"use client";

import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { ScrambleText } from "@/components/ui/scramble-text";

interface NavigationProps {
  visible?: boolean;
}

export function Navigation({ visible = true }: NavigationProps) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const threshold = 100;

        if (currentY < threshold) {
          // Always show at top of page
          setHidden(false);
        } else if (currentY > lastScrollY.current + 5) {
          // Scrolling down — hide
          setHidden(true);
        } else if (currentY < lastScrollY.current - 5) {
          // Scrolling up — show
          setHidden(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: hidden ? "translateY(-100%)" : "translateY(0%)",
      }}
    >
      <div className="w-full px-16 pt-8 flex items-start justify-between">
        {/* Logo mark with magnetic pull */}
        <Magnetic strength={0.3} radius={80} className="pointer-events-auto">
          <a
            href="#hero"
            className="flex items-center justify-center w-12 h-12 rounded-[12px] font-display font-bold text-[1rem] transition-opacity duration-300 hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: "var(--accent-raw)",
              color: "var(--bg)",
            }}
            aria-label="Back to top"
          >
            RD
          </a>
        </Magnetic>

        {/* Nav links — stacked, with rolling text */}
        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          {["About", "Work", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              data-cursor-hide
              className="block font-body font-medium text-[0.9375rem] uppercase tracking-[0.04em] transition-colors duration-300 cursor-pointer"
              style={{ color: "var(--text)", opacity: 0.7 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-raw)";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.opacity = "0.7";
              }}
            >
              <ScrambleText text={link} />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
