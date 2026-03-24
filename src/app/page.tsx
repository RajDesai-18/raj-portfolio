/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { Navigation } from "@/components/layout/navigation";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/project-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EducationSection } from "@/components/sections/education-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FooterSection } from "@/components/sections/footer-section";

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

      <div className="-mt-[25vh]">
        <EducationSection />
      </div>

      {/* ─── Contact ─── */}
      <div className="-mt-[6vh]">
      <ContactSection />
      </div>

      {/* ─── Footer ─── */}
      <FooterSection />
    </>
  );
}
