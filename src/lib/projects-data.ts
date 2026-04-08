export interface Project {
  id: string;
  number: string;
  name: string;
  oneLiner: string;
  detailedDescription: string;
  whyIBuiltIt: string;
  pills: string[];
  image?: {
    src: string;
    alt: string;
  };
  links: {
    live?: string;
    github: string;
  };
}

export const PROJECTS: Project[] = [
  {
    id: "yoru",
    number: "01",
    name: "YORU",
    oneLiner: "A full-screen ambient station where you don't press play -- you step inside.",
    detailedDescription:
      "Yoru is a full-screen listening environment built around 21 anime-style scenes and 13 layered soundscapes. Scenes and sounds are mapped together -- switching audio automatically transitions the visuals to match. The UI fades away after a few seconds of inactivity so there's nothing between you and the atmosphere. Every transition crossfades, every interaction has keyboard support, and the whole experience is designed to make you forget you're in a browser.",
    whyIBuiltIt:
      "I wanted to build something where the goal wasn't productivity or metrics -- just a feeling. Most music sites are built around playlists and controls. I wanted to see what happens when you strip all of that away and design around atmosphere instead.",
    pills: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Howler.js",
      "shadcn/ui",
      "Vitest",
    ],
    image: {
      src: "/images/yoru-project.png",
      alt: "Yoru — cinematic ambient web experience",
    },
    links: {
      live: "https://yoru-sandy.vercel.app",
      github: "https://github.com/RajDesai-18/yoru",
    },
  },
  {
    id: "pr-sensei",
    number: "02",
    name: "PR SENSEI",
    oneLiner: "AI-powered code reviews that land on your PR in under 30 seconds.",
    detailedDescription:
      "PR Sensei hooks into GitHub's webhook system to intercept pull requests, queues them through an async Redis and BullMQ pipeline, and generates structured code reviews using OpenAI and Gemini APIs -- all in under 30 seconds. It posts a summary comment and up to 5 inline comments on the exact changed lines. Reviews are deduplicated so the same line never gets flagged twice, and the whole system is idempotent per commit SHA. A Next.js dashboard tracks review metrics, file hotspots, and history across repos, backed by a multi-tenant PostgreSQL schema.",
    whyIBuiltIt:
      "Code reviews are a bottleneck on every team I've been on. Someone opens a PR, and it sits there for hours waiting for a human to look at it. I wanted to build something that gives developers fast, structured feedback the moment they push -- not to replace human review, but to catch the obvious stuff so the real conversation can focus on architecture and design.",
    pills: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Fastify",
      "Redis",
      "BullMQ",
      "PostgreSQL",
      "Prisma ORM",
      "OpenAI API",
      "Gemini API",
      "OAuth 2.0",
    ],
    links: {
      github: "https://github.com/RajDesai-18/pr-sensei",
    },
  },
  {
    id: "llm-cookbook",
    number: "03",
    name: "LLM COOKBOOK",
    oneLiner: "Type in what's in your fridge, get back recipes that actually make sense.",
    detailedDescription:
      'LLM Cookbook matches natural-language queries to recipes using FAISS vector search and MiniLM embeddings -- so searching "something warm and spicy" returns results by meaning, not keywords. If nothing matches well enough, it falls back to a local LLM to generate a recipe from scratch. The system handles dietary filters, allergen exclusions, and ingredient substitution. A Pandas pipeline processes 10,000+ raw recipe records into model-ready embeddings in a single reproducible script, served through a FastAPI backend.',
    whyIBuiltIt:
      "I wanted to see how far I could push semantic search before needing a full LLM. Recipes were the perfect domain -- structured enough to test retrieval quality, messy enough to need real NLP. It started as a class project and turned into a deep dive into embeddings, vector search, and knowing when to let the model generate vs when retrieval is enough.",
    pills: [
      "Python",
      "FastAPI",
      "FAISS",
      "Sentence Transformers",
      "Ollama",
      "OpenAI API",
      "Streamlit",
      "Pandas",
      "NumPy",
    ],
    links: {
      github: "https://github.com/RajDesai-18/llm-cookbook",
    },
  },
  {
    id: "financial-saas",
    number: "04",
    name: "FINANCIAL SAAS",
    oneLiner:
      "A personal finance dashboard that connects to real bank accounts and makes your money make sense.",
    detailedDescription:
      "Horizon connects to multiple bank accounts through Plaid, pulls in real transaction data, and unifies everything into a single dashboard -- balances, spending breakdowns, transaction history, and fund transfers via Dwolla. Auth is handled server-side with Appwrite, and the UI updates in real time as accounts are linked or transactions come in. The focus was on building a complete product: proper loading states, responsive tables, form validation with Zod, and a cohesive design system -- not just a feature demo.",
    whyIBuiltIt:
      "I wanted to build something that feels like a real product, not just a feature. Most portfolio projects stop at the UI -- I wanted to go further and deal with real bank APIs, real auth flows, real-time data, and the messy details that make an app actually work end to end.",
    pills: [
      "Next.js",
      "TypeScript",
      "Appwrite",
      "Plaid",
      "Dwolla",
      "Tailwind CSS",
      "Chart.js",
      "React Hook Form",
      "Zod",
      "shadcn/ui",
    ],
    links: {
      live: "https://financial-saas-platform.vercel.app",
      github: "https://github.com/RajDesai-18/Financial_SaaS_Platform",
    },
  },
];
