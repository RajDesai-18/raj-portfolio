export interface Skill {
  id: string;
  number: string;
  name: string;
  description: string;
  pills: string[];
}

export const SKILLS: Skill[] = [
  {
    id: "ai",
    number: "01",
    name: "AI",
    description:
      "Building intelligent features with LLMs, semantic search, embeddings, and structured generation pipelines.",
    pills: [
      "OpenAI API",
      "Gemini API",
      "FAISS",
      "Sentence Transformers",
      "Scikit-learn",
      "PyTorch",
      "Prompt Engineering",
      "NLP",
    ],
  },
  {
    id: "frontend",
    number: "02",
    name: "FRONTEND",
    description:
      "Crafting polished, accessible interfaces with React, Next.js, and animation systems that feel intentional.",
    pills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "shadcn/ui",
      "WCAG 2.1 AA",
      "Vitest",
    ],
  },
  {
    id: "backend",
    number: "03",
    name: "BACKEND",
    description: "Designing scalable APIs, async pipelines, and multi-tenant data architectures.",
    pills: [
      "Node.js",
      "Express.js",
      "FastAPI",
      "Redis",
      "BullMQ",
      "PostgreSQL",
      "Prisma ORM",
      "OAuth 2.0",
    ],
  },
  {
    id: "design",
    number: "04",
    name: "DESIGN",
    description:
      "Translating product thinking into intentional UI/UX through prototyping, usability testing, and design systems.",
    pills: [
      "Figma",
      "Responsive Design",
      "Mobile-first",
      "User Testing",
      "Accessibility",
      "Design Systems",
    ],
  },
  {
    id: "mobile",
    number: "05",
    name: "MOBILE",
    description:
      "Shipping cross-platform mobile experiences with native performance and structured debugging.",
    pills: ["Flutter", "Dart", "Firebase", "REST APIs", "CI/CD", "Cross-platform"],
  },
];
