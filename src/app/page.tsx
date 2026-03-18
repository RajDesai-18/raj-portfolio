/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { Navigation } from "@/components/layout/navigation";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/layout/section-label";
import { GhostText } from "@/components/background/ghost-text";

export default function Home() {
  const hasChecked = useRef(false);
  const [skipLoading, setSkipLoading] = useState<boolean | null>(null);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    const skip = !!sessionStorage.getItem("raj-portfolio-loaded");
    setSkipLoading(skip);
    if (skip) setHeroReady(true);
  }, []);

  if (skipLoading === null) return null;

  return (
    <>
      <Navigation visible={heroReady} />

      <HeroSection skipLoading={skipLoading} onReady={() => setHeroReady(true)} />

      {/* ─── About ─── */}
      <Section id="about" className="relative overflow-hidden">
        <GhostText text="ABOUT" align="right" speed={0.4} offsetY="5%" />
        <Container narrow className="relative" style={{ zIndex: 1 }}>
          <SectionLabel number="01">About Me</SectionLabel>
          <p className="font-body text-lg leading-relaxed" style={{ color: "var(--text)" }}>
            I&apos;m a product-minded fullstack engineer who likes building things that are both{" "}
            <span className="font-semibold" style={{ color: "var(--accent-raw)" }}>
              useful
            </span>{" "}
            and{" "}
            <span className="font-semibold" style={{ color: "var(--accent-raw)" }}>
              enjoyable
            </span>{" "}
            to use. I care a lot about the thinking behind software -- why it exists, how it
            behaves, and how it makes people feel when they use it.
          </p>
        </Container>
      </Section>

      {/* ─── Skills ─── */}
      <Section id="skills" className="relative overflow-hidden">
        <GhostText text="SKILLS" align="left" speed={0.6} offsetY="10%" />
        <Container className="relative" style={{ zIndex: 1 }}>
          <SectionLabel number="02">What I Do</SectionLabel>
          <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
            Skills section -- Phase 5
          </p>
        </Container>
      </Section>

      {/* ─── Work ─── */}
      <Section id="work" className="relative overflow-hidden">
        <GhostText text="WORK" align="right" speed={0.35} offsetY="8%" />
        <Container className="relative" style={{ zIndex: 1 }}>
          <SectionLabel number="03">Work</SectionLabel>
          <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
            Projects section -- Phase 6
          </p>
        </Container>
      </Section>

      {/* ─── Experience ─── */}
      <Section id="experience" className="relative overflow-hidden">
        <GhostText text="EXP" align="left" speed={0.5} offsetY="12%" />
        <Container className="relative" style={{ zIndex: 1 }}>
          <SectionLabel number="04">Experience</SectionLabel>
          <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
            Timeline -- Phase 7
          </p>
        </Container>
      </Section>

      {/* ─── Contact ─── */}
      <Section id="contact" className="relative overflow-hidden">
        <GhostText text="SAY HI" align="center" speed={0.45} offsetY="5%" />
        <Container narrow className="relative" style={{ zIndex: 1 }}>
          <SectionLabel number="05">Contact</SectionLabel>
          <p className="font-body text-lg" style={{ color: "var(--text)" }}>
            Got something interesting to build, discuss, or explore? I&apos;d love to hear from you.
          </p>
        </Container>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="py-8 relative" style={{ zIndex: 1 }}>
        <Container>
          <p
            className="font-mono text-[0.6875rem] text-center uppercase tracking-[0.1em]"
            style={{ color: "var(--text-muted)" }}
          >
            &copy; {new Date().getFullYear()} Raj Desai
          </p>
        </Container>
      </footer>
    </>
  );
}
