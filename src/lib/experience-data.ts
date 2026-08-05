import type { CareerEntry } from "@/components/sections/career-section";

export const EXPERIENCE_ENTRIES: CareerEntry[] = [
  {
    id: "utd-sa",
    isCurrent: false,
    dateLabel: "Sep 2025 \u2013 May 2026",
    role: "Student Assistant",
    organization: "University of Texas at Dallas",
    summary:
      "Accessibility support and front-desk operations at UT Dallas's AccessAbility Resource Center.",
    bullets: [
      "Scribe and read notes for visually challenged students, translating code, mathematical equations, and technical concepts into accessible formats",
      "Built a Python script with AI to convert handwritten mathematical notes into JAWS-compatible formats (.docx, .html)",
      "Manage exam proctoring to maintain a fair and accessible testing environment for students with disabilities",
      "Handle front-desk operations, student and faculty inquiries, and administrative support",
    ],
  },
  {
    id: "hydracoral",
    isCurrent: false,
    dateLabel: "Jan 2023 \u2013 Dec 2023",
    role: "Software Engineer Intern",
    organization: "Hydracoral Technologies",
    summary:
      "Full-stack development across Flutter mobile and Django web for a pre-launch product in a 3-person Agile team.",
    bullets: [
      "Developed a Flutter/Dart onboarding flow with facial-recognition APIs, cutting user verification time by 30% in staging",
      "Diagnosed and resolved 15+ bugs in state management, API error handling, and memory leaks using Firebase Crashlytics -- reducing crash rate by 20% pre-launch",
      "Designed responsive cross-platform UI components validated through structured user testing, improving usability scores by 20%",
      "Owned CI/CD pipelines, integrating REST APIs for JWT authentication, data sync, and release automation",
    ],
  },
];
