"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { Container } from "@/components/layout/container";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

export interface CareerEntry {
  id: string;
  isCurrent?: boolean;
  dateLabel: string;
  role: string;
  organization: string;
  summary: string;
  bullets: string[];
}

export interface CareerSectionProps {
  id: string;
  entries: CareerEntry[];
}

/* ────────────────────────────────────────────
   NOW DOT — pulsing accent circle
   ──────────────────────────────────────────── */

function NowDot() {
  return (
    <div
      className="exp-now-dot"
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: "var(--accent-raw)",
        flexShrink: 0,
      }}
    />
  );
}

/* ────────────────────────────────────────────
   MOBILE ENTRY — stacked vertically
   ──────────────────────────────────────────── */

function MobileEntry({ entry }: { entry: CareerEntry }) {
  return (
    <div>
      {/* Date */}
      <div className="flex items-center gap-2" style={{ marginBottom: "clamp(10px, 1.2vw, 16px)" }}>
        {entry.isCurrent && <NowDot />}
        <span
          className="font-mono tracking-[0.12em]"
          style={{
            fontSize: "var(--text-label)",
            color: entry.isCurrent ? "var(--accent-raw)" : "var(--text)",
            opacity: entry.isCurrent ? 1 : 0.6,
          }}
        >
          {entry.dateLabel}
        </span>
      </div>

      {/* Role */}
      <h3
        className="font-display font-bold tracking-[-0.03em] leading-[0.92]"
        style={{
          color: "var(--text)",
          fontSize: "clamp(1.75rem, 6vw, 2.25rem)",
          marginBottom: "clamp(6px, 1vw, 10px)",
        }}
      >
        {entry.role}
      </h3>

      {/* Org */}
      <p
        className="font-body font-semibold"
        style={{
          color: "var(--accent-raw)",
          fontSize: "var(--text-body-sm)",
          marginBottom: "clamp(14px, 2.5vw, 22px)",
        }}
      >
        {entry.organization}
      </p>

      {/* Summary */}
      <p
        className="font-body font-medium italic leading-[1.6] tracking-[-0.005em]"
        style={{
          color: "var(--text)",
          opacity: 0.7,
          fontSize: "var(--text-body-sm)",
          marginBottom: "clamp(12px, 1.5vw, 18px)",
        }}
      >
        {entry.summary}
      </p>

      {/* Bullets */}
      <div className="flex flex-col gap-[6px]">
        {entry.bullets.map((bullet, i) => (
          <div key={i} className="flex gap-[10px] items-baseline">
            <span
              className="font-mono flex-shrink-0"
              style={{ color: "var(--accent-raw)", fontSize: "var(--text-micro)", opacity: 0.8 }}
            >
              --
            </span>
            <span
              className="font-body font-medium leading-[1.55] tracking-[-0.005em]"
              style={{ color: "var(--text)", opacity: 0.75, fontSize: "var(--text-body-sm)" }}
            >
              {bullet}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT — Split-Row Spreads
   Left: date + role + org | VR | Right: summary + bullets
   ════════════════════════════════════════════════════════ */

export function CareerSection({ id, entries }: CareerSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── GSAP Scroll Entrance ── */
  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const splits: InstanceType<typeof SplitText>[] = [];

    const ctx = gsap.context(() => {
      /* ── Top HR entrance ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          end: "top 40%",
          scrub: 0.6,
        },
      });

      const topHR = sectionRef.current?.querySelector(".career-hr-top");
      if (topHR) {
        gsap.set(topHR, { scaleX: 0 });
        tl.to(topHR, { scaleX: 1, duration: 0.3, ease: "none" }, 0);
      }

      /* ── Per-row entrance ── */
      rowRefs.current.forEach((row) => {
        if (!row) return;

        const hr = row.querySelector(".career-row-hr");
        const vr = row.querySelector(".career-row-vr");
        const left = row.querySelector(".career-row-left");
        const summary = row.querySelector(".career-row-summary");
        const bullets = row.querySelectorAll(".career-bullet");

        const rowTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 100%",
            end: "top 55%",
            scrub: 0.5,
          },
        });

        if (hr) {
          gsap.set(hr, { scaleX: 0 });
          rowTl.to(hr, { scaleX: 1, duration: 0.3, ease: "none" }, 0);
        }

        if (vr) {
          gsap.set(vr, { scaleY: 0 });
          rowTl.to(vr, { scaleY: 1, duration: 0.3, ease: "none" }, 0.05);
        }

        if (left) {
          gsap.set(left, { opacity: 0, x: -24 });
          rowTl.to(left, { opacity: 1, x: 0, duration: 0.3, ease: "none" }, 0.1);
        }

        if (summary) {
          gsap.set(summary, { opacity: 0, y: 12 });
          rowTl.to(summary, { opacity: 1, y: 0, duration: 0.2, ease: "none" }, 0.15);
        }

        if (bullets.length > 0) {
          gsap.set(bullets, { opacity: 0, x: -10 });
          rowTl.to(bullets, { opacity: 1, x: 0, stagger: 0.03, duration: 0.2, ease: "none" }, 0.2);
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} id={id} className="relative w-full overflow-hidden">
      <div className="py-[6vh] sm:py-[8vh] lg:py-[10vh]">
        <Container>
          {/* ── Top HR ── */}
          <div
            className="career-hr-top h-px w-full origin-left"
            style={{ backgroundColor: "var(--border-custom)" }}
          />

          {/* ══════════════════════════════════════════
              DESKTOP: Split rows (lg+)
              ══════════════════════════════════════════ */}
          <div className="hidden lg:block">
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
              >
                {i > 0 && (
                  <div
                    className="career-row-hr h-px w-full origin-left"
                    style={{ backgroundColor: "var(--border-custom)" }}
                  />
                )}

                <div
                  className="grid items-start"
                  style={{
                    gridTemplateColumns: "38% 1px 1fr",
                    minHeight: "clamp(220px, 30vh, 340px)",
                  }}
                >
                  {/* ── Left: Date + Role + Org ── */}
                  <div
                    className="career-row-left flex flex-col justify-center"
                    style={{
                      padding: "clamp(36px, 4.5vw, 64px) clamp(16px, 2.5vw, 32px)",
                      minHeight: "inherit",
                    }}
                  >
                    <div
                      className="flex items-center gap-2"
                      style={{ marginBottom: "clamp(12px, 1.5vw, 20px)" }}
                    >
                      {entry.isCurrent && <NowDot />}
                      <span
                        className="font-mono tracking-[0.12em]"
                        style={{
                          fontSize: "var(--text-label)",
                          color: entry.isCurrent ? "var(--accent-raw)" : "var(--text)",
                          opacity: entry.isCurrent ? 1 : 0.6,
                        }}
                      >
                        {entry.dateLabel}
                      </span>
                    </div>

                    <h3
                      className="font-display font-bold tracking-[-0.03em] leading-[0.92]"
                      style={{ color: "var(--text)", fontSize: "var(--text-heading)" }}
                    >
                      {entry.role}
                    </h3>

                    <p
                      className="font-body font-semibold mt-2"
                      style={{ color: "var(--accent-raw)", fontSize: "var(--text-body-sm)" }}
                    >
                      {entry.organization}
                    </p>
                  </div>

                  {/* ── VR ── */}
                  <div
                    className="career-row-vr origin-top h-full"
                    style={{ backgroundColor: "var(--border-custom)" }}
                  />

                  {/* ── Right: Summary + Bullets ── */}
                  <div
                    className="career-row-right flex flex-col justify-center"
                    style={{
                      padding: "clamp(36px, 4.5vw, 64px) clamp(24px, 3vw, 48px)",
                    }}
                  >
                    {/* Summary — italic one-liner */}
                    <p
                      className="career-row-summary font-body font-medium leading-[1.6] tracking-[-0.005em] "
                      style={{
                        color: "var(--text)",
                        opacity: 0.7,
                        fontSize: "var(--text-body)",
                        marginBottom: "clamp(16px, 2vw, 24px)",
                        maxWidth: "990px",
                      }}
                    >
                      {entry.summary}
                    </p>

                    {/* Bullet points */}
                    <div className="flex flex-col gap-[8px]" style={{ maxWidth: "840px" }}>
                      {entry.bullets.map((bullet, bi) => (
                        <div key={bi} className="career-bullet flex gap-[10px] items-baseline">
                          <span
                            className="font-mono flex-shrink-0"
                            style={{
                              color: "var(--accent-raw)",
                              fontSize: "var(--text-micro)",
                              opacity: 0.8,
                            }}
                          >
                            --
                          </span>
                          <span
                            className="font-body font-medium leading-[1.55] tracking-[-0.005em]"
                            style={{
                              color: "var(--text)",
                              opacity: 0.75,
                              fontSize: "var(--text-body-sm)",
                            }}
                          >
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom HR */}
            <div className="h-px w-full" style={{ backgroundColor: "var(--border-custom)" }} />
          </div>

          {/* ══════════════════════════════════════════
              MOBILE: Stacked (<lg)
              ══════════════════════════════════════════ */}
          <div className="lg:hidden">
            {entries.map((entry, i) => (
              <div key={entry.id}>
                {i > 0 && (
                  <div
                    className="h-px w-full"
                    style={{ backgroundColor: "var(--border-custom)" }}
                  />
                )}
                <div style={{ padding: "clamp(24px, 5vw, 40px) 0" }}>
                  <MobileEntry entry={entry} />
                </div>
              </div>
            ))}
            <div className="h-px w-full" style={{ backgroundColor: "var(--border-custom)" }} />
          </div>
        </Container>
      </div>
    </section>
  );
}
