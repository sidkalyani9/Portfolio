export type SystemPanelKind = "bidstream" | "anonymous";

export type SystemPanel = {
  id: string;
  kind: SystemPanelKind;
  title: string;
  short: string;
  metric: string;
  bullets: [string, string, string];
  stack: string[];
  badge: "Owned" | "Confidential";
  caseSlug: string;
  detail: string[];
};

export const systemsPipeline = [
  "Discover RFPs",
  "Extract insights",
  "Validate fit",
  "Generate proposals",
  "Score compliance",
] as const;

export const systemPanels: SystemPanel[] = [
  {
    id: "generation",
    kind: "bidstream",
    title: "Multi-Agent Proposal Generation",
    short: "Planner · Writer · Reviewer agents",
    metric: "~50% → ~5% rework",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["Google ADK", "Vertex AI", "Gemini", "RAG", "Context caching"],
    bullets: [
      "Autonomous Planner, Writer and Reviewer agents on Google ADK + Vertex AI",
      "RAG with multimodal ingestion and context caching across the loop",
      "Manual proposal rework fell from ~50% of sections to ~5% minor edits",
    ],
    detail: [
      "Planner decomposes the RFP into sections, constraints and evaluation tasks",
      "Writer drafts grounded sections against retrieved knowledge",
      "Reviewer audits drafts against the rubric before human eyes ever see them",
    ],
  },
  {
    id: "scoring",
    kind: "bidstream",
    title: "Proposal Scoring Engine",
    short: "6-stage agentic pipeline",
    metric: "−95% review effort",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["Vertex AI", "Async orchestration", "Prompt caching"],
    bullets: [
      "Six stages: rubric extraction → compliance audit → persona-driven evaluation",
      "Async orchestration with prompt caching at every stage",
      "Manual compliance-review effort reduced by 95%",
    ],
    detail: [
      "Rubric extraction turns RFP legalese into scoreable criteria",
      "Compliance auditing maps every requirement to proposal evidence",
      "Persona-driven evaluation scores each section like a domain expert",
    ],
  },
  {
    id: "caching",
    kind: "bidstream",
    title: "LLM Caching Infrastructure",
    short: "Production caching platform",
    metric: "−80% inference cost",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["CachedContent API", "Vertex AI", "Prompt design"],
    bullets: [
      "Production-grade caching platform on Vertex AI's CachedContent API",
      "Cut generation costs by 80% across pipelines",
      "100+ standardised prompt templates · a further 20% via implicit caching",
    ],
    detail: [
      "Explicit cache lifecycles for shared context across agents",
      "Template standardisation turned ad-hoc prompts into reusable assets",
      "Cache-hit economics measured and reported daily",
    ],
  },
  {
    id: "graphrag",
    kind: "bidstream",
    title: "GraphRAG Search Layer",
    short: "Structured NL queries at scale",
    metric: "100K+ insights",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["GraphRAG", "Knowledge graphs", "PostgreSQL"],
    bullets: [
      "Natural-language structured queries across 100,000+ RFP insights",
      "Replaced noisy vector retrieval · irrelevant LLM context cut sharply",
      "Knowledge-graph relationships make answers explainable",
    ],
    detail: [
      "Entities and relations extracted from the RFP corpus into a queryable graph",
      "Structured retrieval feeds the generation and scoring agents",
      "Precision retrieval: less context in, better answers out",
    ],
  },
  {
    id: "batch",
    kind: "bidstream",
    title: "Batch Validation & Prompt Ops",
    short: "Cost-engineered validation",
    metric: "−50% · −30% cost",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["Vertex Batch API", "GCS", "SHA-256 dedup"],
    bullets: [
      "Batched validation pipeline on Vertex AI Batch Prediction + GCS",
      "SHA-256 fingerprinting: 50% batch discount plus 30% via dedup",
      "Prompts tuned on 20K labeled rows to 95%+ accuracy",
    ],
    detail: [
      "Every validation request fingerprinted and deduplicated",
      "Batch windows trade latency for cost where UX allows",
      "Accuracy measured, not assumed · labeled-set driven tuning",
    ],
  },
  {
    id: "observability",
    kind: "bidstream",
    title: "LLMOps Observability",
    short: "Token-level cost intelligence",
    metric: "1B+ tokens tracked",
    badge: "Owned",
    caseSlug: "bidstream-ai",
    stack: ["PostgreSQL", "Telemetry", "Cost analytics"],
    bullets: [
      "Observability layer tracking 1B+ cached and uncached tokens",
      "Quality metrics and costs across 5+ production AI pipelines",
      "Daily PostgreSQL reports guide cost/quality tuning",
    ],
    detail: [
      "Every call attributed: pipeline, model, cache state, tokens, cost",
      "Regression visibility when prompts or models change",
      "The data behind every optimisation claim on this site",
    ],
  },
  {
    id: "collection",
    kind: "bidstream",
    title: "Data Collection Platform",
    short: "30+ production scrapers",
    metric: "30+ portals",
    badge: "Owned",
    caseSlug: "authenticated-scraping-automation",
    stack: ["Playwright", "SeleniumBase", "Gemini multimodal", "AWS Secrets Manager"],
    bullets: [
      "30+ scrapers across government and enterprise portals, kept alive in production",
      "Gemini-based multimodal CAPTCHA solving for challenge-response sites",
      "Authenticated access: Secrets Manager credentials + Gmail API OTP for 2FA",
    ],
    detail: [
      "Playwright where it's enough, SeleniumBase where bot detection fights back",
      "Credentials in AWS Secrets Manager · never hardcoded",
      "2FA OTP retrieved and entered automatically via Gmail API",
    ],
  },
  {
    id: "meghdoot",
    kind: "anonymous",
    title: "MeghDoot Audio Intelligence",
    short: "Meetings → searchable transcripts",
    metric: "speech → summary",
    badge: "Confidential",
    caseSlug: "meeting-intelligence-pipeline",
    stack: ["Audio processing", "Speech-to-text", "Diarization"],
    bullets: [
      "Audio pipeline for an internal Slack/Teams-style messaging platform",
      "Noise reduction, silence trimming, STT and speaker diarization",
      "Auto-generated searchable conversation transcripts",
    ],
    detail: [
      "Fault-tolerant audio chunking and cleanup before transcription",
      "Speaker diarization keeps multi-voice meetings attributable",
      "Transcripts become searchable knowledge inside the product",
    ],
  },
];
