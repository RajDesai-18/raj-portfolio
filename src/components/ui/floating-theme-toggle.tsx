"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { Magnetic } from "@/components/ui/magnetic";
import { Sun, Moon } from "lucide-react";

export function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isPastHero, setIsPastHero] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function checkVisibility() {
      setIsVisible(!!sessionStorage.getItem("raj-portfolio-loaded"));
    }

    checkVisibility();
    const interval = setInterval(checkVisibility, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onScroll() {
      setIsPastHero(window.scrollY > window.innerHeight * 0.15);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // In hero: sits right after LinkedIn icon
  // GitHub is at left: 64px, LinkedIn at 64+36+20=120px, toggle at 64+36+20+36+20=176px
  // Past hero: slides to where GitHub was (64px)
  return (
    <div
      className="fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        bottom: "28px",
        left: isPastHero ? "64px" : "176px",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <Magnetic strength={0.4} radius={60}>
        <button
          onClick={toggleTheme}
          className="cursor-pointer transition-colors duration-300 flex items-center justify-center w-[36px] h-[36px]"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent-raw)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
          }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </Magnetic>
    </div>
  );
}
