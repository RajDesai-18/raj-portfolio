"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/layout/section-label";
import { GhostText } from "@/components/background/ghost-text";

/* ────────────────────────────────────────────
   Shared type
   ──────────────────────────────────────────── */
export interface TimelineEntry {
    id: string;
    isCurrent?: boolean;
    dateLabel: string;
    bleedText: string;
    role: string;
    organization: string;
}

/* ────────────────────────────────────────────
   Props
   ──────────────────────────────────────────── */
export interface TimelineSectionProps {
    id: string;
    number: string;
    label: string;
    ghostText: string;
    ghostAlign: "left" | "right";
    entries: TimelineEntry[];
}

/* ════════════════════════════════════════════
   TIMELINE SECTION — Center Spine Zigzag
   ════════════════════════════════════════════ */
export function TimelineSection({
    id,
    number,
    label,
    ghostText,
    ghostAlign,
    entries,
}: TimelineSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const pinWrapRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const spineRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);

    // Per-entry refs (single set — content rendered once)
    const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const yearRefs = useRef<(HTMLDivElement | null)[]>([]);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const roleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const orgRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    const dateRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current || !pinWrapRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(labelRef.current, { opacity: 1, y: 0 });
            if (spineRef.current) gsap.set(spineRef.current, { scaleY: 1 });
            contentRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, x: 0 }));
            yearRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1 }));
            nodeRefs.current.forEach((el) => el && gsap.set(el, { scale: 1, opacity: 1 }));
            orgRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1 }));
            dateRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1 }));
            if (dividerRef.current) gsap.set(dividerRef.current, { scaleX: 1 });
            return;
        }

        const isDesktop = window.innerWidth >= 1024;
        const splits: SplitText[] = [];

        const ctx = gsap.context(() => {
            if (isDesktop) {
                /* ═══════════════════════════════════════
                   DESKTOP — Pinned spine zigzag
                   ═══════════════════════════════════════ */
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=200%",
                        scrub: 0.6,
                        pin: pinWrapRef.current,
                        pinSpacing: true,
                    },
                });

                // Section label
                tl.fromTo(
                    labelRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" },
                    0
                );

                // Spine draws top-to-bottom
                if (spineRef.current) {
                    gsap.set(spineRef.current, { scaleY: 0 });
                    tl.to(
                        spineRef.current,
                        { scaleY: 1, duration: 0.80, ease: "none" },
                        0.05
                    );
                }

                // Sequential entry choreography
                entries.forEach((entry, i) => {
                    const content = contentRefs.current[i];
                    const yearEl = yearRefs.current[i];
                    const node = nodeRefs.current[i];
                    const roleEl = roleRefs.current[i];
                    const orgEl = orgRefs.current[i];
                    const dateEl = dateRefs.current[i];

                    if (!content || !roleEl) return;

                    const isLeft = i % 2 === 0;
                    const t = 0.08 + i * 0.42;
                    const contentX = isLeft ? -50 : 50;
                    const yearX = isLeft ? 40 : -40;

                    // Node scales in
                    if (node) {
                        tl.fromTo(
                            node,
                            { scale: 0, opacity: 0 },
                            { scale: 1, opacity: 1, duration: 0.10, ease: "back.out(2)" },
                            t
                        );
                    }

                    // Content column swings in from its side
                    tl.fromTo(
                        content,
                        { opacity: 0, x: contentX },
                        { opacity: 1, x: 0, duration: 0.18, ease: "power3.out" },
                        t + 0.02
                    );

                    // Date label
                    if (dateEl) {
                        tl.fromTo(
                            dateEl,
                            { opacity: 0, y: 10 },
                            { opacity: 1, y: 0, duration: 0.10, ease: "power2.out" },
                            t + 0.03
                        );
                    }

                    // Role — SplitText word stagger
                    const split = new SplitText(roleEl, {
                        type: "words",
                        wordsClass: "exp-word",
                    });
                    splits.push(split);
                    gsap.set(split.words, { opacity: 0, y: 25 });

                    tl.to(
                        split.words,
                        {
                            opacity: 1,
                            y: 0,
                            stagger: 0.035,
                            duration: 0.14,
                            ease: "power3.out",
                        },
                        t + 0.05
                    );

                    // Organization
                    if (orgEl) {
                        tl.fromTo(
                            orgEl,
                            { opacity: 0, y: 12 },
                            { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
                            t + 0.10
                        );
                    }

                    // Year ghost marker swings from opposite side
                    if (yearEl) {
                        tl.fromTo(
                            yearEl,
                            { opacity: 0, x: yearX },
                            { opacity: 1, x: 0, duration: 0.16, ease: "power2.out" },
                            t + 0.04
                        );
                    }
                });

                // Bottom accent divider
                if (dividerRef.current) {
                    tl.fromTo(
                        dividerRef.current,
                        { scaleX: 0 },
                        { scaleX: 1, duration: 0.08, ease: "power2.inOut" },
                        0.90
                    );
                }

                // Year markers: continuous parallax through full pin
                yearRefs.current.forEach((yearEl) => {
                    if (!yearEl) return;
                    gsap.fromTo(
                        yearEl,
                        { y: 40 },
                        {
                            y: -40,
                            ease: "none",
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top top",
                                end: "+=200%",
                                scrub: true,
                            },
                        }
                    );
                });
            } else {
                /* ═══════════════════════════════════════
                   MOBILE — Scroll-triggered fades
                   ═══════════════════════════════════════ */
                gsap.fromTo(
                    labelRef.current,
                    { opacity: 0, y: 16 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );

                entries.forEach((_, i) => {
                    const entryEl = entryRefs.current[i];
                    const roleEl = roleRefs.current[i];
                    const orgEl = orgRefs.current[i];

                    if (!entryEl) return;

                    gsap.fromTo(
                        entryEl,
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: entryEl,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        }
                    );

                    if (roleEl) {
                        const split = new SplitText(roleEl, {
                            type: "words",
                            wordsClass: "exp-word",
                        });
                        splits.push(split);

                        gsap.fromTo(
                            split.words,
                            { opacity: 0, y: 16 },
                            {
                                opacity: 1,
                                y: 0,
                                stagger: 0.04,
                                duration: 0.6,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: entryEl,
                                    start: "top 80%",
                                    toggleActions: "play none none none",
                                },
                            }
                        );
                    }

                    if (orgEl) {
                        gsap.fromTo(
                            orgEl,
                            { opacity: 0 },
                            {
                                opacity: 1,
                                duration: 0.6,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: entryEl,
                                    start: "top 78%",
                                    toggleActions: "play none none none",
                                },
                            }
                        );
                    }
                });

                if (dividerRef.current) {
                    gsap.fromTo(
                        dividerRef.current,
                        { scaleX: 0 },
                        {
                            scaleX: 1,
                            duration: 0.8,
                            ease: "power2.inOut",
                            scrollTrigger: {
                                trigger: dividerRef.current,
                                start: "top 90%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                }
            }
        }, sectionRef);

        return () => {
            ctx.revert();
            splits.forEach((s) => s.revert());
        };
    }, [entries]);

    /* ═══════════════════════════════════════════
       RENDER
       ═══════════════════════════════════════════ */
    return (
        <section
            ref={sectionRef}
            id={id}
            className="relative w-full overflow-hidden"
        >
            <div ref={pinWrapRef} className="relative w-full">
                {/* Ghost text */}
                <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ zIndex: 0 }}
                >
                    <GhostText
                        text={ghostText}
                        align={ghostAlign}
                        speed={0.4}
                        offsetY="5%"
                    />
                </div>

                {/* Vertically centered content in pinned viewport */}
                <div
                    className="relative min-h-screen flex items-center py-16 lg:py-0"
                    style={{ zIndex: 2 }}
                >
                    <Container className="relative w-full">
                        {/* Section label */}
                        <div ref={labelRef} style={{ opacity: 0 }}>
                            <SectionLabel number={number}>{label}</SectionLabel>
                        </div>

                        {/* ── Entries with center spine ── */}
                        <div className="relative mt-6 lg:mt-10">
                            {/* Center spine (desktop only) */}
                            <div
                                ref={spineRef}
                                className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 origin-top"
                                style={{
                                    width: "1.5px",
                                    background:
                                        "linear-gradient(to bottom, var(--accent-raw), transparent)",
                                    opacity: 0.3,
                                }}
                            />

                            {entries.map((entry, i) => {
                                const isLeft = i % 2 === 0;
                                const isFirst = i === 0;
                                const isLast = i === entries.length - 1;

                                return (
                                    <div
                                        key={entry.id}
                                        ref={(el) => {
                                            entryRefs.current[i] = el;
                                        }}
                                        className={cn(
                                            "relative",
                                            !isLast && "mb-10 lg:mb-[4.5rem]"
                                        )}
                                    >
                                        {/* Unified flex row — CSS order creates the zigzag */}
                                        <div className="flex flex-col lg:flex-row lg:items-start">
                                            {/* ── Content column ── */}
                                            <div
                                                ref={(el) => {
                                                    contentRefs.current[i] = el;
                                                }}
                                                className={cn(
                                                    "w-full lg:w-[45%]",
                                                    isLeft
                                                        ? "lg:order-1 lg:pr-10 lg:text-right"
                                                        : "lg:order-3 lg:pl-10 lg:text-left"
                                                )}
                                                style={{ opacity: 0 }}
                                            >
                                                {/* Date + optional pulse */}
                                                <div
                                                    ref={(el) => {
                                                        dateRefs.current[i] = el;
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-2 mb-3",
                                                        isLeft && "lg:justify-end"
                                                    )}
                                                    style={{ opacity: 0 }}
                                                >
                                                    {entry.isCurrent && (
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
                                                    )}
                                                    <span
                                                        className="font-mono text-[0.6875rem] uppercase tracking-[0.1em]"
                                                        style={{
                                                            color: entry.isCurrent
                                                                ? "var(--accent-raw)"
                                                                : "var(--text-muted)",
                                                        }}
                                                    >
                                                        {entry.dateLabel}
                                                    </span>
                                                </div>

                                                {/* Role title */}
                                                <h3
                                                    ref={(el) => {
                                                        roleRefs.current[i] = el;
                                                    }}
                                                    className="font-display font-semibold tracking-[-0.03em] leading-[1.05]"
                                                    style={{
                                                        color: "var(--text)",
                                                        fontSize: "clamp(1.75rem, 3.5vw, 2.375rem)",
                                                    }}
                                                >
                                                    {entry.role}
                                                </h3>

                                                {/* Organization */}
                                                <p
                                                    ref={(el) => {
                                                        orgRefs.current[i] = el;
                                                    }}
                                                    className="mt-2 font-body font-medium"
                                                    style={{
                                                        color: "var(--accent-raw)",
                                                        fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)",
                                                        opacity: 0,
                                                    }}
                                                >
                                                    {entry.organization}
                                                </p>
                                            </div>

                                            {/* ── Center node (desktop only) ── */}
                                            <div className="hidden lg:flex lg:w-[10%] lg:order-2 lg:justify-center relative pt-1">
                                                <div
                                                    ref={(el) => {
                                                        nodeRefs.current[i] = el;
                                                    }}
                                                    style={{
                                                        width: isFirst ? 14 : 10,
                                                        height: isFirst ? 14 : 10,
                                                        borderRadius: "50%",
                                                        background: isFirst ? "var(--accent-raw)" : "transparent",
                                                        border: isFirst ? "none" : "2.5px solid rgba(127, 175, 155, 0.8)",
                                                        zIndex: 2,
                                                        boxShadow: isFirst
                                                            ? "0 0 12px var(--accent-glow), 0 0 24px rgba(127,175,155,0.12)"
                                                            : "none",
                                                        opacity: 0,
                                                        transform: "scale(0)",
                                                    }}
                                                />
                                            </div>

                                            {/* ── Year ghost (desktop only) ── */}
                                            <div
                                                ref={(el) => {
                                                    yearRefs.current[i] = el;
                                                }}
                                                className={cn(
                                                    "hidden lg:block lg:w-[45%] pt-0",
                                                    isLeft
                                                        ? "lg:order-3 lg:pl-10"
                                                        : "lg:order-1 lg:pr-10 lg:text-right"
                                                )}
                                                style={{ opacity: 0 }}
                                            >
                                                <span
                                                    className="font-display font-bold tracking-[-0.05em] leading-[0.85] select-none pointer-events-none"
                                                    style={{
                                                        color: "var(--text)",
                                                        opacity: 0.45,
                                                        fontSize: "clamp(4rem, 8vw, 6rem)",
                                                    }}
                                                    aria-hidden="true"
                                                >
                                                    {entry.bleedText}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ── Mobile bleed year ── */}
                                        <span
                                            className="lg:hidden absolute top-0 right-0 pointer-events-none select-none font-display font-bold leading-[0.85] tracking-[-0.05em]"
                                            style={{
                                                color: "var(--text)",
                                                opacity: 0.05,
                                                fontSize: "4rem",
                                            }}
                                            aria-hidden="true"
                                        >
                                            {entry.bleedText}
                                        </span>

                                        {/* ── Mobile separator ── */}
                                        {!isLast && (
                                            <div
                                                className="lg:hidden mt-8 h-px w-full"
                                                style={{
                                                    backgroundColor: "var(--text)",
                                                    opacity: 0.08,
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom accent divider */}
                        <div
                            ref={dividerRef}
                            className="mt-8 lg:mt-10 h-[2px] w-full origin-left"
                            style={{
                                backgroundColor: "var(--accent-raw)",
                                opacity: 0.4,
                                transform: "scaleX(0)",
                            }}
                        />
                    </Container>
                </div>
            </div>
        </section>
    );
}