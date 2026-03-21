/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { Navigation } from "@/components/layout/navigation";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/layout/section-label";
import { AboutSection } from "@/components/sections/about-section";
import { GhostText } from "@/components/background/ghost-text";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/project-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EducationSection } from "@/components/sections/education-section";

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
      <AboutSection />

      {/* ─── Skills ─── */}
      <SkillsSection />

      {/* ─── Work ─── */}
      <ProjectsSection />

      {/* ─── Experience ─── */}
      <ExperienceSection />

      {/* ─── Education ─── */}
      <EducationSection />

      {/* ─── Contact ─── */}
      <Section id="contact" fullHeight className="relative overflow-hidden">
        <GhostText text="SAY HI" align="center" speed={0.45} offsetY="5%" />
        <Container narrow className="relative" style={{ zIndex: 1 }}>
          <SectionLabel number="06">Contact</SectionLabel>
          <p className="font-body text-lg" style={{ color: "var(--text)" }}>
            Got something interesting to build, discuss, or explore? I&apos;d love to hear from you.
          </p>
        </Container>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="py-8 relative" style={{ zIndex: 1 }}>
        <Container>
          <p
            className="font-mono text-[0.6875rem] text-center uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            &copy; {new Date().getFullYear()} Raj Desai
          </p>
        </Container>
      </footer>
    </>
  );
}