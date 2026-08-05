import type { CareerEntry } from "@/components/sections/career-section";

export const EDUCATION_ENTRIES: CareerEntry[] = [
  {
    id: "utd-ms",
    isCurrent: false,
    dateLabel: "2024 \u2013 2026",
    role: "M.S. Computer Science",
    organization: "University of Texas at Dallas",
    summary: "Focused on going deeper into AI/ML systems and strengthening core fundamentals.",
    bullets: [
      "Coursework in Machine Learning, NLP, AI, Big Data Analytics, Database Design, and Design & Analysis of Algorithms",
      "Focused on integrating AI/ML into full-stack products -- from semantic search pipelines to LLM-powered developer tools",
      "Strengthened core CS fundamentals in algorithms, systems design, and data modeling",
    ],
  },
  {
    id: "mumbai-beng",
    isCurrent: false,
    dateLabel: "2020 \u2013 2024",
    role: "B.Eng. Computer Engineering",
    organization: "University of Mumbai",
    summary:
      "Built a foundation in computer science fundamentals -- data structures, algorithms, operating systems, databases, and software development.",
    bullets: [
      "Chairperson, CSI-TCET -- managed 80 committee members, organized technical seminars, hackathons, a 3-day technical festival, and a 150+ student out-of-state industrial visit",
      "Deputy Cultural Secretary, TSDW TCET -- organized the college's 3-day cultural festival SOJOURN",
      "Art Designer Lead, Nimbus -- led a 4-person team designing the department magazine from concept to launch",
      "Developed early interest in fullstack engineering and product thinking that carried into everything built after",
    ],
  },
];
