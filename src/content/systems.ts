export type SystemPanelKind = "bidstream" | "anonymous";

export type SystemPanel = {
  id: string;
  kind: SystemPanelKind;
  title: string;
  short: string;
  bullets: [string, string, string];
  stack: string[];
  badge: "Owned" | "Confidential";
  caseSlug: string;
  detail: string[];
};

export const systemsPipeline = [
  "Scrape RFPs",
  "Extract insights",
  "Validate relevance",
  "Generate & refine",
  "Score proposals",
] as const;

export const systemPanels: SystemPanel[] = [
  {
    id: "scoring",
    kind: "bidstream",
    title: "Proposal Scoring",
    short: "6-agent LLM workflow",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["LlamaIndex", "Vertex AI", "FastAPI", "React"],
    bullets: [
      "End-to-end scoring with six specialised LLM calls / agents",
      "Visual assets, gaps, and evaluation-matrix extraction",
      "Persona classifier with DB cache hit/miss → section scoring",
    ],
    detail: [
      "Visual assets extraction from proposals",
      "Gaps identification",
      "Score evaluation matrix extraction",
      "Specialised persona classifier with DB-backed prompt cache",
      "Section scoring agent using the selected persona",
    ],
  },
  {
    id: "insights",
    kind: "bidstream",
    title: "RFP Insights",
    short: "Long-document intelligence",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["LlamaIndex", "Gemini long-context", "Vertex AI"],
    bullets: [
      "Automated insight generation from complex RFP sets",
      "Context-window overflow handling for large document packs",
      "Designed around Gemini long-context (~1M) for RFP corpora",
    ],
    detail: [
      "Insight extraction for bidding workflows",
      "Overflow strategy when context exceeds the window",
      "Long-context Gemini usage for large RFP packs",
    ],
  },
  {
    id: "cvGen",
    kind: "bidstream",
    title: "Proposal CV Generation",
    short: "KB-grounded resource CVs",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["LlamaIndex", "FastAPI", "React"],
    bullets: [
      "Detects resources / roles required by the RFP",
      "Generates proposal CVs from company resource knowledge base",
      "Grounds content in prior experience profiles",
    ],
    detail: [
      "Requirement → resource mapping from RFP text",
      "Knowledge-base retrieval of company resources",
      "Structured CV-style outputs for proposals",
    ],
  },
  {
    id: "l2Validation",
    kind: "bidstream",
    title: "Level-2 AI Validation",
    short: "Catalog-grounded RFP scoring",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["Vertex AI", "Explicit caching", "FastAPI"],
    bullets: [
      "Scores RFP fit with explicit reasons",
      "Grounded in a medical-domain client product catalog",
      "Explicit caching for repeatable, efficient validation",
    ],
    detail: [
      "Level-2 validation for RFP relevance",
      "Reasoned scores against product catalog (medical-domain)",
      "Cache integration to avoid redundant model work",
    ],
  },
  {
    id: "authenticated-scraping",
    kind: "anonymous",
    title: "Authenticated Scraping Automation",
    short: "E2E automated login for client scraping",
    badge: "Confidential",
    caseSlug: "authenticated-scraping-automation",
    stack: ["AWS Secrets Manager", "Gmail API", "Automated auth"],
    bullets: [
      "Owned end-to-end automatic login for a client scraping platform",
      "Credentials managed via AWS Secrets Manager (username/email & password)",
      "2FA OTP handled through Gmail API integration",
    ],
    detail: [
      "Designed and shipped automated authenticated access",
      "Secure secret storage and retrieval with AWS Secrets Manager",
      "2FA OTP retrieval and handling via Gmail API",
      "Session continuity for reliable downstream scraping",
    ],
  },
  {
    id: "meeting-intelligence",
    kind: "anonymous",
    title: "Meeting Intelligence Pipeline",
    short: "Speech-to-text → summary for video meetings",
    badge: "Confidential",
    caseSlug: "meeting-intelligence-pipeline",
    stack: ["Speech-to-text", "LLM summarization", "Messaging UX"],
    bullets: [
      "Owned e2e speech-to-text to summarization for video meetings",
      "Integrated into a client messaging platform meeting feature",
      "Cost-efficient STT + small LLM summary pipeline",
    ],
    detail: [
      "End-to-end pipeline: meeting audio/speech → transcript → summary",
      "Wired into messaging UX for post-meeting intelligence",
      "Production-oriented stack: speech-to-text + efficient LLM summarization (e.g. Whisper-class STT + Flash/mini-class summary — representative)",
    ],
  },
];
