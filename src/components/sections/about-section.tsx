"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/layout/section-label";
import { GhostText } from "@/components/background/ghost-text";
import Image from "next/image";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const text2Ref = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !text2Ref.current || !pinWrapRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set([labelRef.current, dividerRef.current], { opacity: 1 });
      gsap.set(photoRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Split both paragraphs into words + characters
    const split1 = new SplitText(textRef.current, {
      type: "words,chars",
      wordsClass: "about-word",
      charsClass: "about-char",
    });

    const split2 = new SplitText(text2Ref.current, {
      type: "words,chars",
      wordsClass: "about-word",
      charsClass: "about-char",
    });

    const ctx = gsap.context(() => {
      // ── Pin the section for immersive scroll reveal ──
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: pinWrapRef.current,
        pinSpacing: true,
      });

      // ── Label entrance ──
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
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      /// ── Combined character-by-character opacity reveal ──
      const allChars = [...split1.chars, ...split2.chars];
      gsap.set(allChars, { opacity: 0.12 });

      gsap.to(allChars, {
        opacity: 1,
        stagger: 0.02,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.6}`,
          scrub: 0.5,
        },
      });
      // ── Photo entrance ──
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // ── Photo parallax during pinned scroll ──
        gsap.fromTo(
          photoInnerRef.current,
          { y: 20 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=200%",
              scrub: true,
            },
          }
        );
      }

      // ── Divider line draw (after both paragraphs) ──
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${window.innerHeight * 1.65} top`,
            end: () => `top+=${window.innerHeight * 1.85} top`,
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      split1.revert();
      split2.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative w-full overflow-hidden">
      {/* Pinned wrapper */}
      <div ref={pinWrapRef} className="relative w-full" style={{ height: "100vh" }}>
        {/* Ghost text */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <GhostText text="ABOUT" align="right" speed={0.4} offsetY="5%" />
        </div>

        {/* Content -- absolutely centered */}
        <div
          ref={contentRef}
          className="absolute left-0 right-0"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          <Container className="relative">
            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 xl:gap-20 items-center">
              {/* Left: Text content */}
              <div>
                {/* Section label */}
                <div ref={labelRef} style={{ opacity: 0 }}>
                  <SectionLabel number="01">About Me</SectionLabel>
                </div>

                {/* Paragraph 1 */}
                <p
                  ref={textRef}
                  className="font-body font-medium leading-[1.5] tracking-[-0.01em] [word-break:keep-all]"
                  style={{
                    color: "var(--text)",
                    fontSize: "clamp(1.375rem, 2.8vw, 2rem)",
                  }}
                >
                  I&apos;m a product-minded full-stack engineer currently working towards my
                  Master&apos;s in Computer Science at UT Dallas, graduating in May 2026, and
                  seeking full-time opportunities. I like building software that is both{" "}
                  <span style={{ color: "var(--accent-raw)", fontWeight: 600 }}>useful</span> and{" "}
                  <span style={{ color: "var(--accent-raw)", fontWeight: 600 }}>enjoyable</span>,
                  and I care deeply about purpose, behavior, and user experience.
                </p>

                {/* Paragraph 2 -- same style, continues the character reveal */}
                <p
                  ref={text2Ref}
                  className="mt-6 font-body font-medium leading-[1.5] tracking-[-0.01em] [word-break:keep-all]"
                  style={{
                    color: "var(--text)",
                    fontSize: "clamp(1.375rem, 2.8vw, 2rem)",
                  }}
                >
                  I build polished interfaces, robust backend systems, and thoughtful AI-driven
                  features. My strength is making every product{" "}
                  <span style={{ color: "var(--accent-raw)", fontWeight: 600 }}>unified</span> and{" "}
                  <span style={{ color: "var(--accent-raw)", fontWeight: 600 }}>intentional</span>{" "}
                  from concept to launch.
                </p>

                {/* Divider */}
                <div
                  ref={dividerRef}
                  className="mt-10 h-[2px] w-full origin-left"
                  style={{
                    backgroundColor: "var(--accent-raw)",
                    opacity: 0.5,
                  }}
                />
              </div>

              {/* Right: Photo */}
              <div ref={photoRef} className="relative group hidden lg:block" style={{ opacity: 0 }}>
                <div ref={photoInnerRef} className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/images/raj-about.jpeg"
                    alt="Raj Desai"
                    width={440}
                    height={550}
                    className="w-full h-auto object-cover aspect-[4/5] transition-all duration-700 ease-out"
                    style={{
                      filter: "grayscale(100%) brightness(0.85) contrast(1.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "grayscale(0%) brightness(1) contrast(1)";
                      e.currentTarget.style.transform = "scale(1.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter =
                        "grayscale(100%) brightness(0.85) contrast(1.1)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    priority={false}
                  />

                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 0 1px var(--accent-raw)",
                    }}
                  />
                </div>

                <p
                  className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-right"
                  style={{ color: "var(--text-muted)" }}
                >
                  Dallas, TX · 2025
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
