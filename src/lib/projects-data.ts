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
    id: "clauseguard",
    number: "01",
    name: "CLAUSEGUARD",
    oneLiner:
      "Clause-by-clause contract risk analysis with redlines you can paste straight into a negotiation.",
    detailedDescription:
      "ClauseGuard takes an NDA, MSA, or SOW and returns a plain-English risk breakdown for every clause, plus a redlined Word document for the risky ones. Analysis runs as a five-stage Celery saga, and each stage commits before the next begins, so a worker can crash mid-run without losing paid work. Classification fans out one parallel task per clause. Every model call passes a circuit breaker with automatic provider failover, and every clause hits a cache before it is allowed to cost anything. Nine containerized services, deployed and running on a VPS I administer myself.",
    whyIBuiltIt:
      "I wanted one project where the hard part was not the feature list. Anything can call an API and render the response. Keeping it correct is the actual work: what happens when a provider degrades, when a worker dies at stage four, when the same clause arrives for the two hundredth time, when someone needs their data back. I also wanted to find out whether I could run the whole thing myself rather than handing the interesting parts to a platform.",
    pills: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Celery",
      "RabbitMQ",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "Docker",
      "LiteLLM",
    ],
    image: {
      src: "/images/clauseguard-project.png",
      alt: "ClauseGuard — AI contract review platform",
    },
    links: {
      live: "https://clauseguard.dev",
      github: "https://github.com/RajDesai-18/clauseguard",
    },
  },
  {
    id: "yoru",
    number: "02",
    name: "YORU",
    oneLiner: "A full-screen ambient station where you don't press play, you step inside.",
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
    number: "03",
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
    number: "04",
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
];
