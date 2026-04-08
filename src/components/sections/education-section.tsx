"use client";

import { CareerSection } from "@/components/sections/career-section";
import { EDUCATION_ENTRIES } from "@/lib/education-data";

export function EducationSection() {
  return <CareerSection id="education" entries={EDUCATION_ENTRIES} />;
}
