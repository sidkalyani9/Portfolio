export const grantflow = {
  slug: "grantflow",
  title: "GrantFlow",
  team: "VibelySane",
  teamSize: 4,
  duration: "~8 hours",
  result: "Organisation hackathon winner",
  problem:
    "Build GrantFlow against an industry-standard style brief (~30-page document with client-like requirements), including LLM integration, under extreme time pressure.",
  approach:
    "Strategically prioritised features under the 8-hour constraint. Delivered near-complete LLM integration with a red-team prompt strategy for grant application scoring, plus edge-case guardrails on a chatbot that could fill forms from free-form chat.",
  outcome:
    "Won the organisational hackathon as VibelySane (team of 4) by shipping a focused, resilient LLM-powered experience instead of an unfinished feature sprawl.",
  tech: ["Claude Code", "LLM integration", "Prompt engineering", "Guardrails"],
  media: ["/media/hackathon.jpeg", "/media/hackathon-dinner.jpeg"],
  highlights: [
    "Strategic feature prioritisation under time pressure",
    "Red-team prompt strategy for grant application scoring",
    "Chatbot form-fill with edge-case guardrails",
  ],
} as const;
