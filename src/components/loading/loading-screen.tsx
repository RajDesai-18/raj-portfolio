"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Skip if already shown this session
    if (sessionStorage.getItem("raj-portfolio-loaded")) {
      onComplete();
      return;
    }

    const obj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Clip-path reveal: circle expanding from center
        gsap.to(screenRef.current, {
          clipPath: "circle(0% at 50% 50%)",
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            sessionStorage.setItem("raj-portfolio-loaded", "true");
            onComplete();
          },
        });
      },
    });

    tl.to(obj, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const rounded = Math.round(obj.val);
        setCount(rounded);
        if (fillRef.current) {
          fillRef.current.style.width = `${rounded}%`;
        }
      },
    });

    // Set initial clip-path to full
    if (screenRef.current) {
      screenRef.current.style.clipPath = "circle(150% at 50% 50%)";
    }

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={screenRef} className="loading-screen">
      <span className="label">Raj Desai -- Portfolio</span>
      <span ref={counterRef} className="counter">
        {String(count).padStart(3, "0")}
      </span>
      <div className="progress-line">
        <div ref={fillRef} className="progress-fill" />
      </div>
    </div>
  );
}
