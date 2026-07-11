export type ProjectPriority = "P0" | "P1" | "P2";

export type Project = {
  slug: string;
  title: string;
  priority: ProjectPriority;
  problem: string;
  role: string;
  tech: string[];
  outcome: string;
  links: { label: string; href: string }[];
  cover: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "bidstream-ai",
    title: "BidStreamAI",
    priority: "P0",
    featured: true,
    problem:
      "Automate RFP intake, insight extraction, relevance validation, proposal generation, and specialised scoring for high-stakes bidding.",
    role: "Owned Proposal Scoring (6-agent workflow), RFP insights, Proposal CV generation, and Level-2 validation",
    tech: ["LlamaIndex", "Vertex AI", "FastAPI", "React", "Gemini long-context"],
    outcome:
      "Production multi-agent scoring with persona caching, long-document insights, KB-grounded CVs, and catalog-grounded validation.",
    links: [{ label: "Case study", href: "/work/bidstream-ai" }],
    cover: "/media/bidstream-proposal-scoring.png",
  },
  {
    slug: "grantflow",
    title: "GrantFlow · VibelySane",
    priority: "P0",
    featured: true,
    problem:
      "Ship an industry-standard grant workflow product — including LLM scoring and a form-filling chatbot — in about eight hours.",
    role: "Team of 4 (VibelySane) — LLM integration, red-team scoring prompts, chatbot guardrails",
    tech: ["Claude Code", "LLM integration", "Prompt engineering"],
    outcome: "Organisation hackathon winner through prioritisation and resilient LLM UX.",
    links: [{ label: "Case study", href: "/work/grantflow" }],
    cover: "/media/hackathon.jpeg",
  },
  {
    slug: "health-sync",
    title: "Health Sync",
    priority: "P1",
    problem:
      "People need a practical way to track diets, calories, BMI, and history with verified diet guidance.",
    role: "Full-stack builder (internship / early career project)",
    tech: ["Angular", "Node.js", "Chart.js", "PrimeNG", "Google login"],
    outcome:
      "Diet tracking web app with BMI-based calorie targets, verified diets, history, and chart visualisations.",
    links: [
      { label: "GitHub", href: "https://github.com/sidkalyani9/HealthSync" },
    ],
    cover: "/media/healthsync.webp",
  },
  {
    slug: "mealdash",
    title: "MealDash",
    priority: "P1",
    problem:
      "Food delivery needs a fluid mobile UX for menus, cart state, and delivery location.",
    role: "React Native developer — front-end product surfaces",
    tech: ["React Native", "Redux", "Maps"],
    outcome:
      "Mobile app with featured sections, Redux cart, menu flows, and delivery map pin behaviour.",
    links: [
      { label: "GitHub", href: "https://github.com/sidkalyani9/MealDash" },
    ],
    cover: "/media/mealdash.webp",
  },
  {
    slug: "lucky-shrub",
    title: "Lucky Shrub",
    priority: "P2",
    problem:
      "A plant nursery needed an e-commerce storefront with full front-end and PHP back-end.",
    role: "Full-stack student project",
    tech: ["HTML", "CSS", "Bootstrap", "jQuery", "JavaScript", "PHP"],
    outcome: "E-commerce experience for a hypothetical plant nursery.",
    links: [
      { label: "GitHub", href: "https://github.com/sidkalyani9/Lucky-Shrub" },
    ],
    cover: "/media/lucky-shrub.webp",
  },
  {
    slug: "portfolio-v1",
    title: "Portfolio v1",
    priority: "P2",
    problem: "Need a personal site to present bio, skills, and featured projects.",
    role: "Sole builder",
    tech: ["React", "Node.js", "MongoDB"],
    outcome: "First major React portfolio — now evolved into this experience.",
    links: [
      { label: "GitHub", href: "https://github.com/sidkalyani9/Portfolio" },
    ],
    cover: "/media/portfolio-v1.webp",
  },
];

export const featuredProjects = projects.filter(
  (p) => p.priority === "P0" || p.priority === "P1",
);
