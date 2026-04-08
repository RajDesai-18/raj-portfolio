/* eslint-disable react-hooks/immutability */
"use client";

import { useCallback, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import type { AboutCard } from "@/lib/about-data";

/* ──────────────────────────────────────────────────────────
   CONSTANTS
   ────────────────────────────────────────────────────────── */

const TAB_HEIGHT = 36;
const PEEK_OFFSET = 34;

/* ──────────────────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────────────────── */

interface RecordCrateProps {
  cards: AboutCard[];
  activeIndex: number;
  onCardChange: (index: number) => void;
  className?: string;
}

export function RecordCrate({
  cards,
  activeIndex,
  onCardChange,
  className = "",
}: RecordCrateProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isShuffling = useRef(false);
  const pendingIndex = useRef<number | null>(null);

  /* ── Shuffle: kill-safe, no querySelector, no rAF race ── */
  const handleShuffle = useCallback(
    (newIndex: number) => {
      if (newIndex === activeIndex) return;

      /* If already animating, queue the latest click */
      if (isShuffling.current) {
        pendingIndex.current = newIndex;
        return;
      }

      isShuffling.current = true;
      const el = cardRef.current;
      if (!el) {
        onCardChange(newIndex);
        isShuffling.current = false;
        return;
      }

      /* Kill any leftover tweens on this element */
      gsap.killTweensOf(el);

      /* Exit → state update → entrance (all on the same DOM node) */
      gsap.to(el, {
        y: -30,
        scale: 0.95,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          /* Update React state (swaps photo + tab) */
          onCardChange(newIndex);

          /* Entrance — same el, React only changes children */
          gsap.fromTo(
            el,
            { y: 30, scale: 0.97, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.35,
              ease: "power3.out",
              onComplete: () => {
                isShuffling.current = false;

                /* Process queued click if user clicked fast */
                if (pendingIndex.current !== null && pendingIndex.current !== newIndex) {
                  const next = pendingIndex.current;
                  pendingIndex.current = null;
                  handleShuffle(next);
                } else {
                  pendingIndex.current = null;
                }
              },
            }
          );
        },
      });
    },
    [activeIndex, onCardChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleShuffle((activeIndex + 1) % cards.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handleShuffle((activeIndex - 1 + cards.length) % cards.length);
      }
    },
    [activeIndex, cards.length, handleShuffle]
  );

  /* Build inactive cards in display order (behind active) */
  const inactiveOrdered: { card: AboutCard; originalIndex: number; depth: number }[] = [];
  for (let i = 1; i < cards.length; i++) {
    const idx = (activeIndex + i) % cards.length;
    inactiveOrdered.push({ card: cards[idx], originalIndex: idx, depth: i });
  }

  const activeCard = cards[activeIndex];
  const peekSpace = inactiveOrdered.length * PEEK_OFFSET;

  return (
    <div
      className={className}
      role="listbox"
      aria-label="About me card stack. Use arrow keys to browse."
      aria-activedescendant={`crate-card-${activeCard.id}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* ── Stack container ── */}
      <div className="relative w-full" style={{ paddingTop: `${peekSpace}px` }}>
        {/* ── Inactive peeking tabs (absolute, behind active) ── */}
        {inactiveOrdered.map(({ card, originalIndex, depth }) => (
          <div
            key={card.id}
            id={`crate-card-${card.id}`}
            role="option"
            aria-selected={false}
            className="absolute left-0 right-0 rounded-xl overflow-hidden cursor-pointer"
            style={{
              top: `${peekSpace - depth * PEEK_OFFSET}px`,
              height: `${TAB_HEIGHT}px`,
              zIndex: cards.length - depth,
              transform: `scale(${1 - depth * 0.025}) translateX(${depth * 4}px)`,
              opacity: Math.max(0.3, 1 - depth * 0.2),
              transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease",
              transformOrigin: "top center",
              border: "1px solid var(--border-custom)",
            }}
            onClick={() => handleShuffle(originalIndex)}
            data-cursor-hover
          >
            <div
              className="group/lip flex items-center justify-between w-full h-full relative"
              style={{
                paddingLeft: "clamp(14px, 2vw, 20px)",
                paddingRight: "clamp(14px, 2vw, 20px)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover/lip:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: "var(--accent-glow)" }}
              />
              <div className="relative flex items-center gap-2.5">
                <div
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ backgroundColor: "var(--text-muted)", opacity: 0.4 }}
                />
                <span
                  className="font-mono uppercase tracking-[0.14em]"
                  style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}
                >
                  {card.label}
                </span>
              </div>
              <span
                className="relative font-mono uppercase tracking-[0.1em]"
                style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)", opacity: 0.3 }}
              >
                {card.subtitle}
              </span>
            </div>
          </div>
        ))}

        {/* ── Active card (stable ref — never recreated by React) ── */}
        <div
          ref={cardRef}
          className="relative rounded-xl overflow-hidden"
          style={{
            zIndex: cards.length,
            border: "1px solid var(--accent-raw)",
          }}
        >
          {/* Tab header */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{
              height: `${TAB_HEIGHT}px`,
              paddingLeft: "clamp(14px, 2vw, 20px)",
              paddingRight: "clamp(14px, 2vw, 20px)",
              backgroundColor: "var(--surface)",
              borderBottom: "1px solid var(--border-custom)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-[7px] h-[7px] rounded-full"
                style={{ backgroundColor: "var(--accent-raw)" }}
              />
              <span
                className="font-mono uppercase tracking-[0.14em] font-medium"
                style={{ fontSize: "var(--text-micro)", color: "var(--accent-raw)" }}
              >
                {activeCard.label}
              </span>
            </div>
            <span
              className="font-mono uppercase tracking-[0.1em]"
              style={{ fontSize: "var(--text-micro)", color: "var(--text)", opacity: 0.5 }}
            >
              {activeCard.subtitle}
            </span>
          </div>

          {/* Photo */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "3/4",
              maxHeight: "55vh",
            }}
          >
            <Image
              src={activeCard.photo}
              alt={activeCard.photoAlt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 36vw"
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
