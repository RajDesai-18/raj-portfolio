"use client";

import { useState, useCallback, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function ScrambleText({ text, className, style }: ScrambleTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ ...style, display: "inline-flex", overflow: "hidden" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {text.split("").map((char, i) => {
        if (char === " ") {
          return <span key={i} style={{ width: "0.25em" }} />;
        }

        const upperChar = char.toUpperCase();
        const charIndex = ALPHABET.indexOf(upperChar);

        const rollSequence =
          charIndex >= 0 ? [upperChar, ...ALPHABET.slice(0, charIndex + 1).split("")] : [upperChar];

        const totalSteps = rollSequence.length - 1;

        return (
          <span
            key={i}
            className="inline-block relative overflow-hidden"
            style={{ height: "1.2em" }}
          >
            {/* Target char — in normal flow, determines column width */}
            <span
              className="block leading-[1.2em] invisible"
              style={{ height: "1.2em" }}
              aria-hidden="true"
            >
              {upperChar}
            </span>

            {/* Rolling column — absolutely positioned, doesn't affect width */}
            <span
              className="absolute left-0 top-0 flex flex-col items-center w-full"
              style={{
                transition: isHovered
                  ? `transform ${400 + i * 60}ms cubic-bezier(0.16, 1, 0.3, 1)`
                  : "transform 300ms cubic-bezier(0.33, 1, 0.68, 1)",
                transform: isHovered ? `translateY(-${totalSteps * 1.2}em)` : "translateY(0)",
              }}
            >
              {rollSequence.map((c, j) => (
                <span
                  key={j}
                  className="block leading-[1.2em] text-center w-full"
                  style={{ height: "1.2em" }}
                  aria-hidden={j !== 0}
                >
                  {c}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
