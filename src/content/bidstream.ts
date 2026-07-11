export type BidStreamModuleId =
  | "scoring"
  | "insights"
  | "cvGen"
  | "l2Validation";

export type BidStreamModule = {
  id: BidStreamModuleId;
  title: string;
  short: string;
  bullets: [string, string, string];
  owned: boolean;
  detail: string[];
};

export const bidstreamStack = [
  "LlamaIndex",
  "Vertex AI",
  "FastAPI",
  "React",
  "Gemini long-context",
] as const;

export const bidstreamModules: BidStreamModule[] = [
  {
    id: "scoring",
    title: "Proposal Scoring",
    short: "6-agent LLM workflow",
    owned: true,
    bullets: [
      "End-to-end scoring pipeline with six specialised LLM calls / agents",
      "Visual asset extraction, gap identification, and evaluation-matrix extraction",
      "Persona classifier with DB cache hit/miss → specialised section scoring",
    ],
    detail: [
      "Visual assets extraction from proposals",
      "Gaps identification across scored content",
      "Score evaluation matrix extraction",
      "Specialised persona classifier: reads a section, chooses a persona (e.g. technical:fastapi/python, legal:iso27001), checks DB for a cached persona prompt; on miss writes, caches, then hands off",
      "Proposal section scoring agent using that persona",
    ],
  },
  {
    id: "insights",
    title: "RFP Insights",
    short: "Long-document intelligence",
    owned: true,
    bullets: [
      "Automated insight generation from complex RFP document sets",
      "Context-window overflow handling for documents that exceed model limits",
      "Designed around Gemini long-context (~1M) for large RFP packs",
    ],
    detail: [
      "Insight extraction tuned for bidding workflows",
      "Overflow strategy when context exceeds the active window",
      "Long-context Gemini usage for large RFP corpora",
    ],
  },
  {
    id: "cvGen",
    title: "Proposal CV Generation",
    short: "KB-grounded resource CVs",
    owned: true,
    bullets: [
      "Detects resources / roles required by the RFP",
      "Generates proposal CVs from company resource knowledge base",
      "Grounds content in prior experience and reusable profiles",
    ],
    detail: [
      "Requirement → resource mapping from RFP text",
      "Knowledge-base retrieval of company resources and experience",
      "Structured CV-style outputs for proposal packaging",
    ],
  },
  {
    id: "l2Validation",
    title: "Level-2 AI Validation",
    short: "Catalog-grounded RFP scoring",
    owned: true,
    bullets: [
      "Scores RFP fit with explicit reasons",
      "Grounded in a medical-domain client product catalog",
      "Explicit caching for repeatable, efficient validation",
    ],
    detail: [
      "Level-2 validation layer for RFP relevance",
      "Reasoned scores against exact product catalog (medical-domain client)",
      "Explicit cache integration to avoid redundant model work",
    ],
  },
];

export const bidstreamCaseStudy = {
  slug: "bidstream-ai",
  title: "Multi-agent proposal scoring",
  productLine: "BidStreamAI (internal product)",
  subtitle: "End-to-end RFP → proposal intelligence",
  role: "GenAI Engineer / Forward Deployed Engineer — owned scoring, insights, CV generation, and L2 validation modules",
  problem:
    "Bidding on complex RFPs is slow, inconsistent, and high-stakes. Teams need reliable extraction, relevance validation, document generation, and specialised scoring — not one-off chat prompts.",
  approach:
    "Contributed across the BidStreamAI pipeline while owning the Proposal Scoring multi-agent workflow, RFP insights with long-context handling, automatic Proposal CV generation, and Level-2 catalog-grounded validation with caching.",
  outcome:
    "A production GenAI workflow that specialises scoring personas, reuses cached prompts, handles long RFPs, generates resource CVs from a knowledge base, and validates fit against a medical-domain product catalog.",
  /** Confidential — no company UI screenshots */
  media: [] as string[],
  pipeline: [
    "Scrape RFPs",
    "Extract insights",
    "Validate relevance",
    "Generate & refine proposals",
    "Score proposals",
  ],
} as const;
