# Portfolio Revamp — Implementation Plans (Concepts A–E)

**Document type:** Design + implementation planning (no code yet)  
**Owner:** Siddharth Kalyani  
**Audience:** Future implementation sessions / agents  
**Status:** Draft v1.1 — QA complete (PASS WITH GAPS); P0/P1 amendments applied  
**Goal:** Award-caliber personal portfolio SPA optimized for **job search** (not freelance), positioning as **GenAI / AI developer + Forward Deployed Engineer**  
**QA:** Senior UI/UX + React + strict QA subagent · 2026-07-11 · Verdict **PASS WITH GAPS** (see §17)

---

## 0. Locked requirements (do not drift)

These requirements are **canonical**. Any plan, critique, or implementation that contradicts them is wrong.

### 0.1 Career & positioning

| Field | Locked value |
|--------|----------------|
| **Name** | Siddharth Kalyani |
| **Location** | Ahmedabad, India · **open to remote** |
| **Primary roles targeted** | AI / GenAI Developer · Forward Deployed Engineer |
| **Current identity** | GenAI Engineer / Forward Deployed Engineer |
| **Company context** | Argusoft India Pvt. Ltd. · product work on **BidStreamAI** |
| **Not freelancing** | No services pricing, no “hire me for a website,” no agency package CTAs |
| **Primary conversion** | Recruiter / hiring manager: **resume download + LinkedIn + email + GitHub** |
| **Tone** | Senior, technical, outcome-driven, product-minded — not student template |

### 0.1.1 Display strings vs job-target keywords (lock for implementers)

| Use | Exact string |
|-----|----------------|
| **H1 / hero role line** | `GenAI Engineer · Forward Deployed Engineer` |
| **Document title / OG** | `Siddharth Kalyani — GenAI Engineer \| Forward Deployed Engineer` |
| **Job-target keywords (meta, about, subtle)** | AI Developer, GenAI Developer, Forward Deployed Engineer |
| **Do not mix randomly** | Never ship H1 as only “AI Developer” if hero elsewhere says “GenAI Engineer” without a deliberate hierarchy |

### 0.1.2 Product naming rule

| Form | When to use |
|------|-------------|
| **BidStreamAI** | First mention, hero, case-study titles, SEO, OG |
| **BidStream** | Short nav / chrome after first full mention is allowed |
| **Bidstram** | **Filename only** (`photo/Bidstram proposal scoring screenshot.png`) — never in UI copy. On import, rename to `bidstream-proposal-scoring.webp` |

### 0.1.3 Allowed claims vs forbidden claims

**Allowed (true facts):** 6 LLM agents/calls in scoring workflow · specialised persona classifier with DB cache · long-context / overflow handling for RFP insights · automatic Proposal CV generation · L2 validation vs medical-domain client product catalog with explicit caching · stack LlamaIndex / Vertex AI / FastAPI / React · Gemini ~1M context used · VibelySane team of 4 · GrantFlow · ~8 hours · org hackathon win · red-team prompt strategy · chatbot form-fill guardrails · B.Tech IT VGEC 2021–2024 · 9.11 CGPA · Ahmedabad · open to remote · Argusoft  

**Forbidden:** Invented % improvements, revenue, client brand names (unless approved), fake user counts, “Site of the Day” claims before awards, freelance rates, inflated solo ownership of entire BidStreamAI product

### 0.2 BidStreamAI — product facts (feature carefully; no client secrets)

**Product one-liner (approved framing):**  
BidStreamAI is an end-to-end automated system that scrapes RFPs, extracts insights, validates RFP relevance with AI, and generates / refines / scores proposal bidding documents.

**Stack (locked):** LlamaIndex · Vertex AI · FastAPI · React · Gemini (context window ~1M used for long docs; plan copy may say “Gemini long-context” unless exact model marketing name is confirmed later)

**What Siddharth owned (highlight these — personal differentiators):**

1. **Proposal Scoring — end-to-end workflow** with **6 LLM calls / agents**:
   - Visual assets extraction from proposals  
   - Gaps identification  
   - Score evaluation matrix extraction  
   - **Specialised persona classifier** (flagship solution): reads a section → decides specialised persona (e.g. `technical:fastapi/python`, `legal:iso27001`) → checks DB for cached persona prompt → if miss, **writes prompt, caches in DB**, then hands off  
   - Proposal **section scoring** agent using that persona  
2. **RFP insights generation** with **context-window overflow handling** (long RFP docs)  
3. **Automatic Proposal CV generation** — detects resources required by RFP, generates CVs from company resource knowledge base + prior experience  
4. **Level-2 AI validation** — scores RFPs with reasons against **exact product catalog** of a **medical-domain client**, with **explicit caching**  
5. Additional pipeline contributions in scraping / validation / generation (team product; frame as “contributed across pipeline; owned scoring + insights + CV gen + L2 validation”)

**Confidentiality rules:**

- Do **not** invent client names, metrics, revenue, or internal URLs  
- Medical client → say “medical-domain client” unless user later approves a public name  
- Screenshot: `photo/Bidstram proposal scoring screenshot.png` — use as case-study media; crop/blur if UI shows sensitive data at implement time  
- Prefer architecture diagrams + agent-flow visuals over raw production data  

### 0.3 Hackathon — VibelySane / GrantFlow

| Field | Locked value |
|--------|----------------|
| **Team** | VibelySane · **team of 4** |
| **Product** | GrantFlow |
| **Constraint** | Built in **~8 hours** with Claude Code, including LLM integration |
| **Brief** | Industry-standard style brief (~30-page document with client-like requirements) |
| **Why won** | Strategic feature prioritization under time pressure; near-perfect LLM integration; **red-team prompt strategy** for grant application scoring; **edge-case guardrails** on chatbot that could fill forms from chat |
| **Assets** | `photo/HACKATHON.jpeg` · `photo/HACKATHON DINNER.jpeg` |
| **Display** | Dedicated “Win” / “Lab” highlight — proof of speed, LLM craft, product judgment |

### 0.4 Projects to feature (priority order)

| Priority | Project | Source | Notes |
|----------|---------|--------|--------|
| P0 | **BidStreamAI** (owned modules) | Work product | Hero case study |
| P0 | **GrantFlow / VibelySane hackathon** | Org hackathon win | Credibility spike |
| P1 | **Health Sync** | Existing site | Diet/BMI tracking · Angular/Node etc. from career copy |
| P1 | **MealDash** | Existing site | React Native · Redux cart · map |
| P2 | **React Portfolio (v1)** | Existing site | Meta — optional or “evolution” footer |
| P2 | **Lucky Shrub** | Existing site | E-commerce plant nursery |
| Archive | Career timeline items (Canteen, FlightEase, RN chat POC) | Career.js | Timeline / experience, not all full case studies |

Each featured project case study must include: **problem · your role · tech · approach · outcome · links/media**. Metrics only if real (do not invent).

### 0.5 Contact (from current site — keep unless user changes)

| Channel | Value |
|---------|--------|
| Email | `sidkalyani9@gmail.com` |
| GitHub | https://github.com/sidkalyani9 |
| LinkedIn | https://www.linkedin.com/in/siddharth-kalyani/ |
| X/Twitter | https://twitter.com/techybuffoon |
| LeetCode | https://leetcode.com/sidkalyani9/ |
| YouTube | https://youtube.com/@techybuffoon |
| Resume | PDF download — **asset TBD** (placeholder path `public/resume.pdf` until provided) |

### 0.6 Assets inventory

| Asset | Path | Use |
|--------|------|-----|
| Display portrait | `src/images/displayPic.webp` | Hero / About |
| BidStream scoring UI | `photo/Bidstram proposal scoring screenshot.png` | BidStream case study |
| Hackathon | `photo/HACKATHON.jpeg` | Win section |
| Hackathon dinner | `photo/HACKATHON DINNER.jpeg` | Story / human proof |
| HealthSync | `src/images/healthsync.webp` | Project card |
| MealDash | `src/images/mealdash.webp` | Project card |
| Portfolio shot | `src/images/project2.webp` | Project card |
| Lucky Shrub | `src/images/project1.webp` | Project card |
| Argusoft logo | `src/images/argusoftLogo.png` | Experience (with brand guidelines care) |
| VGEC logo | `src/images/vgeclogo.png` | Education |
| Extra | `src/images/Project3.webp`, `project4.webp` | Optional archive |

### 0.7 Non-goals (explicit)

- Freelance / agency sales funnel  
- Cloning Bruno Simon game world unless **Concept D** is selected intentionally  
- Keeping CRA + Chakra + PrimeReact + Bootstrap stack for the new design  
- Fake metrics, fake clients, or exaggerated titles  
- Autoplay loud audio  
- Scroll-jacking that traps keyboard/mobile users  
- “MERN developer / YouTuber” as primary identity (legacy typewriter strings — retire for job target)

### 0.8 Success criteria (all concepts)

1. **First 5 seconds:** visitor understands GenAI / FDE + BidStreamAI gravity  
2. **First 30 seconds:** BidStream owned work + hackathon win are discoverable  
3. **Recruiter path:** resume + LinkedIn + email always ≤ 1 click from header  
4. **Mobile:** fully usable; 3D reduced or replaced, not broken  
5. **A11y:** keyboard nav, focus states, `prefers-reduced-motion`, contrast  
6. **Performance budget (targets):** LCP < 2.5s on mid mobile on 4G-class; 3D not on critical path; Lighthouse Performance ≥ 85 desktop goal (100 where feasible without gutting concept)  
7. **Visual:** custom design system — not template purple particles + wave emoji  
8. **Content truth:** all claims map to Section 0  

---

## 1. Shared foundation (applies to A–E)

### 1.1 Recommended base stack (rebuild)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Build | **Vite + React 19 + TypeScript** | Fast DX; SPA-first; escape CRA debt |
| Routing | **React Router v7 only** (no TanStack split-brain) | Case-study routes optional; SPA sections primary |
| Styling | **Tailwind CSS v4** + CSS variables design tokens | One system; no multi-kit chaos |
| Motion UI | **GSAP 3 + ScrollTrigger** | Award-site standard for scroll choreography |
| Smooth scroll | **Lenis** (desktop); evaluate native on mobile if jank | Premium inertia; pair with ScrollTrigger proxy |
| Micro-interaction | **GSAP first**; Framer Motion only for layout/modals if needed | Avoid double systems |
| 3D | **Three.js + @react-three/fiber + @react-three/drei** | Concepts A/B/C/D/E as scoped |
| Icons | lucide-react | Consistent, light |
| Forms | **Default: no form** — mailto + LinkedIn + Resume | Optional Formspree later with privacy note |
| Testing | **Vitest + React Testing Library + Playwright** | Unit content claims + e2e recruiter path |
| Analytics | Plausible or Vercel Analytics | Events: resume, LinkedIn, case-study open, GitHub |
| Deploy | Vercel or Cloudflare Pages | Preview deploys; noindex on previews |

**Migration strategy:**

1. Greenfield Vite app **or** wipe/replace `src/` — do **not** layer on Chakra+Prime+Bootstrap.  
2. **Asset pipeline:** copy `photo/*` → `public/media/` (rename Bidstram → `bidstream-proposal-scoring.png` then convert WebP); keep `src/images/*` project covers; purge template junk (`Soumyajit_Behera-BIT_MESRA.pdf`, stock `css/Assets/Projects/*` if unused).  
3. Extract copy from `Career.js`, `ProjectsSection.js`, `AboutCard.js`, `Footer.js` into `src/content/*`.  
4. Dependency kill list: `@chakra-ui/*`, `primereact`, `primeicons`, `mdb-react-ui-kit`, `react-bootstrap`, `react-tsparticles` / `tsparticles` (unless consciously reintroduced), old `react-router-dom@4`.  

### 1.1.1 Engineering appendix — Lenis + GSAP + R3F pitfalls

| Topic | Rule |
|-------|------|
| Lenis ↔ ScrollTrigger | `lenis.on('scroll', ScrollTrigger.update)`; add Lenis `raf` to `gsap.ticker`; `scrollerProxy` if required by setup; kill all ScrollTriggers on unmount/route change |
| Resize | `ScrollTrigger.refresh()` on orientation change; remeasure sticky header offset |
| Mobile Lenis | Disable Lenis if scroll jank or iOS rubber-band bugs; pins off below `md` |
| Anchor offset | `scroll-margin-top: calc(headerHeight + 12px)` on sections |
| R3F load | `React.lazy` + `Suspense`; canvas not on critical LCP path |
| R3F runtime | `dpr={[1, 1.5]}`; `frameloop="demand"` when static; pause when `document.hidden` or offscreen (`IntersectionObserver`) |
| Dispose | Dispose geometries/materials on unmount; avoid leaking textures (screenshot on monitor) |
| WebGL detect | Shared `useWebGLSupport()` → fallback poster for A/C/E; full DOM site for B/D |
| GSAP vs Framer | One owner per interaction; no dual timelines on same node |

### 1.2 Information architecture (shared) — RESOLVED

**Router default (locked for build):** React Router v7 · **history** mode (not hash-primary).

**Default IA (SPA sections + optional deep routes):**

```
/                          → Full SPA experience (concept shell)
/#work                     → Same page section (scroll-margin for sticky header)
/#experience
/#about
/#contact
/work/bidstream-ai         → Optional deep case study route (preferred for share/SEO)
/work/grantflow
/work/health-sync
/work/mealdash
/work/lucky-shrub
/resume.pdf                → Static in public/
```

**Rules:**

1. Primary navigation scrolls to **sections on `/`** for Work (featured), Experience, About, Contact.  
2. BidStreamAI and GrantFlow are **first cards** inside Work; clicking opens `/work/:slug` **or** inline expanded panel — **pick one per concept at build start** (A/C default: **route** for shareability; E: inline longread; B: drawer; D: zone panel).  
3. Hash links are progressive enhancement for section anchors only — not a second product.  
4. **Nav labels (job-focused, no redundancy):** `Work` · `Experience` · `About` · `Contact` · **`Resume` (primary button)**.  
   - Do **not** also put “BidStream” as a top-level peer to Work; BidStreamAI is featured first inside Work.

### 1.3 Content modules (shared copy blocks)

Implement as typed content in `src/content/*.ts` so UI concepts swap without rewriting facts.

**Content file list (locked):**

```
src/content/profile.ts      # name, role lines, location, one-liner
src/content/bidstream.ts    # modules, owned work, stack, media paths
src/content/grantflow.ts    # hackathon facts + photo paths
src/content/projects.ts     # Health Sync, MealDash, Lucky Shrub, portfolio v1
src/content/experience.ts   # timeline roles + education
src/content/socials.ts      # contact links + resume path
src/content/claims.ts       # allowedClaims[] used by content QA tests
```

**TypeScript contracts (minimum):**

```ts
// sketches — expand at implement
type Social = { id: string; label: string; href: string; priority: 'primary' | 'secondary' };
type Profile = { name: string; roleLine: string; location: string; remote: boolean; oneLiner: string };
type BidStreamModuleId = 'scoring' | 'insights' | 'cvGen' | 'l2Validation';
type BidStreamModule = {
  id: BidStreamModuleId;
  title: string;
  bullets: [string, string, string]; // exactly 3 for UI switcher
  owned: boolean;
  media?: string[];
};
type Project = {
  slug: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  problem: string;
  role: string;
  tech: string[];
  outcome: string; // qualitative unless real metric
  links: { label: string; href: string }[];
  cover: string;
};
type ExperienceItem = {
  title: string;
  org: string;
  date: string;
  bullets: string[];
  logo?: string;
};
```

**BidStreamAI module map (locked — Concept C switcher + all case studies):**

| Module id | Title | Must include |
|-----------|--------|----------------|
| `scoring` | Proposal Scoring | 6-agent workflow; visual assets; gaps; score matrix; **persona classifier + DB cache hit/miss**; section scoring agent |
| `insights` | RFP Insights | Insights generation; **context-window overflow handling**; Gemini long-context |
| `cvGen` | Proposal CV Generation | Resource detection from RFP; KB + prior experience; auto CV content |
| `l2Validation` | Level-2 AI Validation | Score + reason; **medical-domain product catalog**; **explicit caching** |

1. **Hero**  
   - Name  
   - Role line: `GenAI Engineer · Forward Deployed Engineer`  
   - One sentence: end-to-end AI systems for RFP → proposal intelligence (**BidStreamAI**)  
   - CTAs: `View work` · `Download resume` · `LinkedIn`  
   - Location chip: Ahmedabad · Open to remote  

2. **Proof points strip** (not “stats” — avoid inventing numbers)  
   - End-to-end Proposal Scoring (6-agent LLM workflow)  
   - Org hackathon winner — VibelySane / GrantFlow  
   - Stack: LlamaIndex · Vertex AI · FastAPI · React  
   - Open to remote GenAI / FDE roles  

3. **BidStream case study** (long form)  
   - Context / problem in bidding automation  
   - System diagram (scrape → extract → validate → generate → score)  
   - Deep dives: persona classifier + cache, scoring agents, long-context insights, CV gen, L2 catalog validation  
   - Screenshot gallery  
   - Stack chips  
   - Confidentiality note if needed  

4. **Hackathon card / page**  
   - VibelySane · 4 · 8h · GrantFlow · win rationale · photos  

5. **Secondary projects**  
   - Health Sync, MealDash, Lucky Shrub (+ optional portfolio v1)  

6. **Experience timeline**  
   - Update **current** role copy to GenAI / BidStreamAI (replace outdated “RN + Spring Boot only” present tense from old Career.js)  
   - Keep prior Argusoft steps + VGEC 9.11 CGPA  

7. **About**  
   - Professional story; hobbies optional secondary (YouTube, gym, F1, travel) — not hero identity  

8. **Contact**  
   - Email, LinkedIn, GitHub, Resume; optional short message form  

### 1.4 Design tokens (shared starting point — concept skins vary)

```css
/* Color */
--bg-0: #05060a;
--bg-1: #0c0e14;
--bg-2: #141824;
--fg-0: #f4f1ea;
--fg-1: #a8a29a;
--fg-2: #6f6a63;
--accent: /* set by concept — see locked picks below */;
--accent-muted: color-mix(in oklab, var(--accent) 20%, transparent);
--border: rgba(244, 241, 234, 0.08);
--focus: #7dd3fc; /* always visible focus ring; may differ from accent */
--danger: #f87171;
--success: #34d399;

/* Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 20px;

/* Spacing scale */
--space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
--space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
--space-section: clamp(5rem, 12vh, 9rem);
--container: 1200px;
--container-narrow: 720px; /* longread */
--gutter: clamp(16px, 4vw, 32px);

/* Type ramp */
--text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1.0625rem;
--text-lg: 1.25rem; --text-xl: 1.5rem; --text-2xl: 2rem;
--text-display: clamp(2rem, 5vw, 4.5rem);
--font-display: /* concept */;
--font-body: "Geist", "Inter", system-ui, sans-serif;
--leading-body: 1.6;
--measure: 65ch;

/* Motion */
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--dur-fast: 150ms; --dur-med: 300ms; --dur-slow: 600ms;

/* Elevation / z-index (locked scale) */
--z-base: 0;
--z-sticky: 40;
--z-header: 50;
--z-overlay: 60;   /* dimmed 3D / drawers backdrop */
--z-modal: 70;
--z-preloader: 80;
--z-cursor: 90;    /* desktop custom cursor only */
--shadow-1: 0 1px 0 rgba(255,255,255,0.04);
--shadow-2: 0 12px 40px rgba(0,0,0,0.45);

/* Breakpoints (match Tailwind defaults in config) */
/* sm 640 | md 768 | lg 1024 | xl 1280 | 2xl 1440 */
```

**Concept accent picks (locked — no OR at implement time):**

| Concept | Accent | Display font direction |
|---------|--------|-------------------------|
| A | Teal `#2ee6a6` | Syne / Cabinet Grotesk |
| B | Monitor cyan `#5eead4` on warm lamp amber secondary (cyan primary) | Geist |
| C | Violet `#7c5cff` | Geist / Inter Tight |
| D | Game amber `#f5b942` | Geist |
| E | Ink red `#e11d48` sparingly | Instrument Serif + Inter |

**Rules:**

- Dark-first cinematic base  
- Max **1** loud accent + neutrals (+ optional muted secondary)  
- Type: display via `--text-display`; body 16–18px  
- Avoid pure `#000` / `#fff` only; warm/cool neutrals  
- Grain/noise overlay ≤ 4% opacity  
- Concept skins override `--accent` + fonts only — not the z-index scale  

### 1.5 Motion language (shared)

| Token | Value |
|--------|--------|
| Enter | 0.6–0.9s, ease-out |
| Scrub | ScrollTrigger scrub 0.4–0.8 |
| Stagger | 0.06–0.12s |
| Reduced motion | Instant opacity; no parallax/3D orbit |
| Preloader | Real asset gate (fonts + hero media), max 2.5s with skip |

### 1.6 Performance & a11y checklist (all concepts)

- [ ] Dynamic `import()` for R3F canvas  
- [ ] DPR cap 1.5 (2 on high-end desktop only)  
- [ ] Pause WebGL when offscreen / tab hidden  
- [ ] Mobile: static poster or lightweight CSS fallback  
- [ ] Images: WebP/AVIF, explicit width/height, blur placeholder  
- [ ] Fonts: `font-display: swap`; subset if self-hosted  
- [ ] Focus-visible rings on all interactive  
- [ ] Skip to content link  
- [ ] Semantic headings one h1  
- [ ] ARIA labels on icon-only socials  
- [ ] No information only in hover-dependent cursor effects  

### 1.7 SEO & social

- Title: `Siddharth Kalyani — GenAI Engineer | Forward Deployed Engineer`  
- Meta description: BidStreamAI + scoring agents + hackathon + open to remote  
- OG image: branded 1200×630 with name + role (generate at implement)  
- JSON-LD `Person` + `AlumniOf` + `worksFor`  
- `robots.txt` + sitemap if multi-route  

### 1.8 Suggested repo structure (new)

```
src/
  app/                 # providers, router, lenis, gsap setup
  content/             # typed facts: projects, experience, socials
  design/              # tokens.css, typography, motion presets
  sections/            # Hero, Work, BidStream, Hackathon, Experience, About, Contact
  case-studies/        # BidStream, GrantFlow, ...
  three/               # scenes, materials, hooks (lazy)
  components/ui/       # Button, Chip, Section, Magnetic (desktop)
  assets/
  pages/               # if routed case studies
```

### 1.9 Implementation phases (shared skeleton)

| Phase | Work | Exit criteria |
|-------|------|----------------|
| P0 | Vite TS scaffold, tokens, content modules, routing shell | Content renders unstyled OK |
| P1 | Layout chrome, nav, footer, resume CTA, a11y baseline | Recruiter path works |
| P2 | Concept-specific hero + motion system | Concept identity clear |
| P3 | BidStream + GrantFlow case studies | P0 content complete |
| P4 | Secondary projects + experience | Full IA |
| P5 | 3D/wow polish + performance pass | Budgets met |
| P6 | SEO, OG, analytics, QA, deploy | Ship |

---

## 2. Concept A — Cinematic Scroll Portfolio

### 2.1 Concept statement

A single-page **cinematic scroll narrative**: premium type, Lenis smoothness, GSAP-pinned chapters, **one high-quality 3D/WebGL hero accent**, deep case studies. Optimized for **recruiters who scroll**, not gamers who explore.

**Metaphor:** Product launch film for a GenAI engineer.

### 2.2 Why it fits Siddharth

- BidStream is a **pipeline** — scroll chapters map to scrape → extract → validate → generate → score  
- Hackathon win slots as a **plot twist** chapter  
- Highest **usability / hireability** for Awwwards-adjacent craft without D-tier risk  

### 2.3 Visual direction

| Attribute | Spec |
|-----------|------|
| Aesthetic | Dark editorial + product tech |
| Accent | **Locked:** electric teal `#2ee6a6` on near-black |
| Type | Display: **Syne** (fallback Cabinet Grotesk); body: **Geist** |
| Layout | Full-bleed chapters, 12-col grid, large margins |
| Signature move | Horizontal project rail + pinned BidStream agent diagram |
| Avoid | Particle spam, wave emoji, generic purple gradients |

### 2.4 Section-by-section UX

1. **Preloader** — monogram “SK” + thin progress; load fonts + hero LCP image/3D  
2. **Hero (100vh)**  
   - Left: headline “Building end-to-end GenAI systems for high-stakes bidding.”  
   - Sub: role + BidStreamAI  
   - Right/back: subtle R3F **agent-node graph** or abstract data ribbons (not a game)  
   - Scroll cue  
3. **Proof points strip** — non-sticky on mobile; on desktop may sit below hero without fighting pin (prefer **not** sticky if BidStream chapter pins — avoids z-index wars; use `--z-sticky` only for header)  
4. **Chapter: BidStreamAI** — pin **desktop only** (`min-width: 1024px`); vertical steps animate through modules `scoring → insights → cvGen → l2Validation`; screenshot parallax; persona-classifier callout inside scoring  
5. **Chapter: GrantFlow win** — split layout photo + story; “8 hours · team of 4 · red-team prompts”  
6. **Work index** — bento or horizontal snap cards (Health Sync, MealDash, Lucky Shrub); horizontal rail is keyboard-focusable (arrow keys, `role="region"`, `tabIndex` on cards); no exclusive hover info  
7. **Experience** — vertical timeline, updated GenAI role  
8. **About** — portrait + short bio  
9. **Contact** — high contrast band · open to GenAI / FDE roles  
10. **Footer** — socials + dynamic copyright year  

**Pin stacking (A):** Header `--z-header` always above pin content. Pinned chapter uses default flow stacking below header. No second sticky band during pin. Pin `start: "top top+=headerOffset"`, `end: "+=200%"` (tune), `pinSpacing: true`. Disable all pins ≤1023px.

### 2.5 Interaction design

- Lenis smooth scroll desktop; **native scroll on mobile by default** (Lenis optional if proven smooth)  
- ScrollTrigger: fade-up lines, pin BidStream (desktop), scrub SVG pipeline  
- Magnetic buttons desktop only  
- Case study: **route** `/work/bidstream-ai` with GSAP page enter (default for A)  
- Custom cursor optional (dot + ring); disable ≤1024px; never sole affordance  
- Media fail: `MediaFrame` shows muted placeholder + alt text  

**Rough estimate (A):** 2–3 weeks solo full-time (content freeze first 2 days)

### 2.6 3D scope (controlled)

| Item | Spec |
|------|------|
| Hero | Single canvas, ≤50k triangles equivalent / instanced nodes |
| Effect | Slow auto-rotate node graph; pointer parallax intensity low |
| Mobile | CSS gradient + static SVG pipeline illustration |
| Post | Optional mild bloom; off by default on mobile |

### 2.7 Component inventory

`AppShell`, `SmoothScrollProvider`, `SiteHeader`, `HeroCinematic`, `ImpactStrip`, `ChapterBidStream`, `AgentFlowDiagram`, `PersonaClassifierCallout`, `ChapterHackathon`, `WorkRail`, `ProjectCard`, `ExperienceTimeline`, `AboutBlock`, `ContactBand`, `Footer`, `ResumeButton`, `SectionHeading`, `Chip`, `MediaFrame`, `Preloader`, `ReducedMotionGate`

### 2.8 Technical architecture notes

- `gsap.context` + cleanup per section  
- Lenis ↔ ScrollTrigger scrollerProxy pattern  
- BidStream diagram: prefer **SVG + GSAP** for reliability; optional R3F upgrade  
- Content from `content/bidstream.ts`  

### 2.9 Performance budget (A)

- Initial JS (gz) target < 200KB without 3D; 3D chunk separate  
- Hero 3D starts after idle or after first paint  
- Images lazy below fold  

### 2.10 Build phases specific to A

1. Tokens + shell + content  
2. Hero layout + type (no 3D)  
3. Lenis + ScrollTrigger chapters  
4. BidStream pin + diagram  
5. Hackathon + work rail  
6. Experience/about/contact  
7. Lazy R3F hero  
8. Perf + a11y QA  

### 2.11 Risks & mitigations

| Risk | Mitigation |
|------|------------|
| ScrollTrigger + Lenis bugs | Official ticker integration; test resize |
| Too long page | Collapse secondary projects |
| Diagram complexity | Ship SVG v1 first |

### 2.12 Definition of done (A)

- [ ] Recruiter understands GenAI + BidStream in 5s  
- [ ] Persona classifier explained without jargon wall  
- [ ] Hackathon photos integrated tastefully  
- [ ] Mobile chapter flow works without pin jank  
- [ ] Resume CTA always visible in header  

---

## 3. Concept B — 3D Workspace / Desk / Room

### 3.1 Concept statement

A stylized **3D workspace** (desk / lab / war-room) the user explores. Clickable objects map to work: monitor → BidStream, trophy → hackathon, bookshelf → stack, phone → contact.

**Metaphor:** Forward-deployed engineer’s command desk.

### 3.2 Why it fits

- FDE / GenAI identity feels **operational**, not decorative  
- Strong memorability for creative roles  
- Higher build cost; great if targeting companies that value craft  

### 3.3 Visual direction

| Attribute | Spec |
|-----------|------|
| Aesthetic | Stylized low-poly / soft PBR hybrid (not uncanny realism) |
| Palette | Charcoal desk, cool monitor glow (BidStream UI baked texture), warm lamp |
| Type (DOM overlay) | Clean sans for readability over 3D |
| Signature | Monitor shows live CSS/iframe-like panel of scoring UI screenshot as texture |

### 3.4 UX flow

1. **Boot** — lights on desk, camera dolly in  
2. **Hotspots** with labels: BidStream · GrantFlow · Projects · Experience · Contact  
3. Click → **DOM panel** slides over (case study); 3D dims  
4. **Fallback map** list for mobile / reduced motion / WebGL fail  
5. Optional free orbit with constraints (no under-desk clipping)  

### 3.5 Hotspot content mapping

| Object | Opens |
|--------|--------|
| Main monitor | BidStreamAI case study §8 + screenshot |
| Secondary tablet | Persona classifier deep dive (part of scoring module) |
| Trophy / medal | GrantFlow / VibelySane §9 |
| Stack of docs | Full pipeline overview + L2 validation note |
| Projects tray / binder | Health Sync, MealDash, Lucky Shrub (P1/P2 list) |
| Laptop stickers | Tech stack (LlamaIndex, Vertex, FastAPI, React) |
| Resume folder | PDF download (hide control if PDF missing) |
| Phone / mail tray | Contact |

**Keyboard:** `HotspotList` DOM sibling — tabbable list opens same panels as 3D clicks (content parity). Focus trap inside `CaseStudyDrawer`.

### 3.6 Technical architecture

- R3F scene `WorkspaceScene.tsx`  
- Blender export glTF + Draco; bake lighting where possible  
- `Html` from drei for labels **or** pure DOM aligned via projection  
- Loading: progressive — room shell first, details later  
- **Mobile:** orthographic “dollhouse” still + hotspot list (no orbit)  

### 3.7 Component inventory

`WorkspaceCanvas`, `DeskModel`, `Hotspot`, `HotspotPanel`, `CaseStudyDrawer`, `WebGLFallback`, `CameraRig`, `LightingRig`, `LoaderRoom`, plus shared case study components  

### 3.8 Build phases (B)

1. Content + fallback 2D site fully usable **without** 3D  
2. Block-in graybox room  
3. Hotspots + panels  
4. Asset art pass (textures: BidStream screenshot on monitor)  
5. Polish lighting/AO  
6. Perf: instancing, texture size caps (monitor 1024)  
7. Mobile fallback QA  

### 3.9 Risks

| Risk | Mitigation |
|------|------------|
| Months of art | Use low-poly kit + custom props only for key items |
| Recruiter bounce | Always show DOM nav + “Skip to work” |
| WebGL fail | Auto fallback |
| Accessibility | Full keyboard list of hotspots |

### 3.10 Definition of done (B)

- [ ] All P0 content reachable via hotspots **and** DOM nav  
- [ ] Fallback equals content parity with §8/§9 + P1 projects  
- [ ] FPS ≥ 40 on M1-class integrated GPU at medium settings  
- [ ] Shared §0.8 success criteria met  

**Rough estimate (B):** 4–8 weeks after A/C content exists (art is the long pole)  
**Perf budget (B):** glTF Draco < 3MB first room load; monitor texture ≤ 1024; max ~100 draw calls graybox target  

---

## 4. Concept C — Interactive Product Showcase

### 4.1 Concept statement

The site is a **product showcase for BidStreamAI intelligence**, with Siddharth as the engineer behind it. Hero is an interactive **pipeline / scoring product visualization** (3D or advanced 2D), with case studies as product “modules.”

**Metaphor:** Stripe-quality product page × personal brand.

### 4.2 Why it fits (strong for GenAI / FDE)

- Forward Deployed Engineer story = **ship AI into real workflows**  
- Persona classifier is a **product feature** worth demoing visually  
- Recruiters in AI see systems thinking immediately  

### 4.3 Visual direction

| Attribute | Spec |
|-----------|------|
| Aesthetic | Premium SaaS dark + luminous data |
| Accent | Violet-indigo `#7c5cff` + cyan highlight |
| Type | **Geist** / **Inter Tight** for product UI feel |
| Signature | Interactive module switcher: Insights · Validation · CV Gen · Scoring |
| Grid | Bento feature grid under hero |

### 4.4 Section UX

1. **Hero** — Product visual (animated pipeline). Headline role-first. BidStreamAI full name.  
2. **Module tabs** — four modules from **§1.3 map** (`scoring` | `insights` | `cvGen` | `l2Validation`); each swaps visual + **exactly 3 bullets** from content  
3. **Deep dive: Persona classifier** — nested under `scoring` (not a fifth disconnected tab): flow animation section → DB lookup → cache write → scoring agent  
4. **Proof** — hackathon as “ship under pressure”  
5. **Other builds** — Health Sync, MealDash as engineering breadth  
6. **Experience**  
7. **Contact · open to GenAI / FDE roles**  

### 4.5 Interaction design

- Module switcher with keyboard arrows + roving tabindex; URL state `?module=scoring` (shareable)  
- Optional lightweight 3D: floating cards / hexagonal agents  
- Screenshot lightbox with captions (redaction-safe crops)  
- “Architecture” toggle: simple vs detailed (both must stay truthful)  
- Mobile: stacked accordion instead of side tabs if space tight  

**Rough estimate (C):** 2–3 weeks solo  
**Perf budget (C):** same as A if 3D optional; pure 2D target Lighthouse mobile ≥ 90

### 4.6 3D scope

- Medium: floating nodes for 6 agents; click focuses agent card  
- Or zero 3D: high-end SVG/Canvas — still award-level if motion is elite  

### 4.7 Component inventory

`ProductHero`, `ModuleSwitcher`, `AgentNodeGraph`, `PersonaFlow`, `FeatureBento`, `ProofHackathon`, `BreadthProjects`, shared chrome  

### 4.8 Build phases (C)

1. Product content model (modules array)  
2. Hero + module switcher 2D  
3. Persona flow animation  
4. Screenshot integration  
5. Optional R3F agents  
6. Secondary sections  
7. Perf / SEO  

### 4.9 Risks

- Looking like BidStream marketing site → always co-brand **personal** name/role in hero  
- Confidential UI → crop screenshot  

### 4.10 Definition of done (C)

- [ ] Non-technical recruiter can explain BidStream in one sentence after visit  
- [ ] Technical hiring manager sees agent design skill (persona + cache)  
- [ ] Personal brand ≠ company brand takeover  

---

## 5. Concept D — Game / Drive / Play World

### 5.1 Concept statement

Fully interactive **playable** portfolio (drive, walk, or top-down). Zones = career chapters. Maximum sensation; maximum risk.

**Metaphor:** Bruno Simon–class creative developer flex.

### 5.2 Why / why not for Siddharth

| Pros | Cons |
|------|------|
| Unforgettable | Weak fit if primary goal is **fast hiring** for GenAI/FDE |
| Shows elite frontend | Can obscure BidStream depth |
| Award creativity peak | 1–3+ months; mobile pain |

**Recommendation:** Only choose D if user explicitly wants creative-dev brand **or** as a secondary `/lab/world` experiment — not as sole portfolio.

### 5.3 If pursued — scoped “D-lite”

Not a full city. A **small map**:

- Hub spawn  
- Building “BidStream Tower” → interior panels  
- Pavilion “GrantFlow” with trophy  
- Path of prior projects as billboards  
- Exit gate → resume  

Controls: keyboard + on-screen mobile joystick **or** click-to-move  

### 5.4 Technical architecture

- R3F + rapier physics (careful) or simple grid movement without full physics  
- Mobile: disable world; force Concept A layout  
- Save progress in `localStorage` optional easter egg  

### 5.5 Content guarantees

Even in-world, **pause menu** must expose: Work list, Resume, LinkedIn, Email.

### 5.6 Build phases (D)

1. Ship Concept A content site first (non-negotiable)  
2. World graybox  
3. Collision + camera  
4. Zone triggers → case studies  
5. Art pass  
6. Audio optional mute-default  
7. Heavy QA  

### 5.7 Definition of done (D)

- [ ] Can hire without playing (pause menu + full DOM Work list)  
- [ ] World is progressive enhancement on top of **shipped A or C content DoD**  
- [ ] Content parity with shared §0.8 + §8/§9 (not circular “parity with incomplete A”)  
- [ ] Mobile ships **full A/C layout**, not a broken world  

**Rough estimate (D):** 8–12+ weeks including art; **requires A or C content complete first** (dual cost: two presentation layers)  
**Visual direction (D-lite):** dark gameboard, amber accent `#f5b942`, low-poly buildings, readable DOM UI always  

---

## 6. Concept E — Editorial Minimal + Micro-3D

### 6.1 Concept statement

Typography-first, Swiss/editorial layout, vast whitespace (or dark void), **one** micro-3D object (orb, abstract mark, or small agent atom). Maximum clarity, quiet confidence.

**Metaphor:** Stripe docs × personal essay × one jewel of 3D.

### 6.2 Why it fits

- GenAI senior narrative can be **text-precise**  
- Fastest path to polish + Lighthouse  
- Differentiators live in **writing and diagrams**, not effects  

### 6.3 Visual direction

| Attribute | Spec |
|-----------|------|
| Aesthetic | Minimal dark or warm paper-dark |
| Accent | Single ink red or acid green sparingly |
| Type | **Instrument Serif** + **Inter** OR **Newsreader** + **Geist** |
| Layout | Asymmetric columns, huge pull quotes |
| Signature | Pull quote: persona classifier insight |

### 6.4 Section UX

1. Hero: name + role only; micro-3D corner  
2. Longread “Selected work” with BidStream essay structure  
3. Hackathon as short figure + caption  
4. Grid of smaller projects  
5. CV-like experience  
6. Contact sparse  

### 6.5 Motion

- Subtle only: line reveals, image clip-path  
- No smooth-scroll library required (optional light Lenis)  
- Micro-3D idle animation only  

### 6.6 Build phases (E)

1. Type system + layout  
2. BidStream longread + diagram  
3. Media  
4. Micro-3D  
5. Perf perfection  

### 6.5.1 Component inventory (E)

`EditorialHero`, `PullQuote`, `LongreadSection`, `FigureWithCaption`, `WorkIndexList`, `ExperienceCV`, `MicroOrbCanvas`, `ContactSparse`, shared `SiteHeader` / `Footer` / `ResumeButton`

### 6.5.2 Risks (E)

| Risk | Mitigation |
|------|------------|
| Feels empty | Strong BidStream longread + figures |
| Low “wow” for some AI labs | Micro-3D + one signature pull-quote animation |
| Writing quality | User review gate before motion polish |

### 6.5.3 Micro-3D brief (E)

Single abstract **agent-atom** (icosahedron / soft orb with slow shader iridescence), max 1 material, no post stack, corner of hero only, pause offscreen.

### 6.7 Definition of done (E)

- [ ] Feels intentional, not empty  
- [ ] Writing quality reviewed by user  
- [ ] Perfect mobile reading measure (60–75 chars)  
- [ ] Recruiter path §0.8 + header Resume/LinkedIn/Email  

**Rough estimate (E):** 1–2 weeks solo  
**Longread outline:** map headings 1:1 to §8 BidStream wireframe + §9 hackathon  

---

## 7. Cross-concept comparison matrix

| Dimension | A Cinematic | B Room | C Product | D Game | E Editorial |
|-----------|-------------|--------|-----------|--------|-------------|
| Hireability (GenAI/FDE) | ★★★★★ | ★★★★ | ★★★★★ | ★★★ | ★★★★ |
| Award “wow” | ★★★★ | ★★★★★ | ★★★★ | ★★★★★ | ★★★ |
| Build time | Medium | High | Medium | Very high | Low–Med |
| Mobile quality | Excellent | Hard | Excellent | Poor unless fallback | Excellent |
| Shows BidStream depth | Excellent | Good | **Best** | Risky | Excellent |
| Shows frontend craft | High | Very high | High | Max | Medium–High |
| Content risk if writing weak | Medium | Low | Medium | Low | **High** |
| Recommended for job hunt | **Yes** | Yes + fallback | **Yes** | Only + A base | Yes |

### 7.1 Default recommendation

| Rank | Concept | When |
|------|---------|------|
| **1** | **A** or **C** | Primary job hunt — pick **C** if product storytelling is preferred; **A** if pure portfolio cinema |
| **2** | **E** | Fast ship / writing-led |
| **3** | **B** | After A/C content exists |
| **4** | **D** | Lab only or post-offer creative flex |

### 7.2 Hybrid A+C (optional path — only after choosing it explicitly)

**Not a sixth free-floating concept.** Hybrid is **Concept A shell + Concept C module chapter**.

| Layer | Spec |
|-------|------|
| Shell | A: Lenis (desktop), cinematic hero, teal accent, Syne display |
| Mid-page | C: BidStreamAI module switcher (`scoring/insights/cvGen/l2Validation`) as a **pinned or tall chapter** |
| Type | E-like measure for case-study body text (`--container-narrow`) |
| 3D | A hero node graph **or** C agent nodes — **not both** full-power |
| Build order | Content → A sections without pin → insert C module chapter → one 3D hero → perf |
| Estimate | 3–4 weeks |
| DoD | Union of A + C DoD + §0.8 |

**Rule:** Do not start hybrid until user says “hybrid A+C.” Default pick remains pure **A** or pure **C**.

---

## 8. BidStream case study — shared wireframe (all concepts)

### 8.1 Page outline

1. Title + role + stack chips  
2. Problem: RFP/proposal ops are slow, inconsistent, high-stakes  
3. System map: scrape → insights → validate → generate → score  
4. **Owned work** sections:  
   - Proposal Scoring (6 agents) — sequence diagram  
   - Persona classifier + DB cache — decision flowchart  
   - Long-context RFP insights  
   - Auto Proposal CV generation  
   - L2 validation vs medical product catalog + caching  
5. Media: `Bidstram proposal scoring screenshot.png`  
6. Engineering notes: LlamaIndex, Vertex AI, FastAPI, React, Gemini long context  
7. Outcome: qualitative (reliability, specialization, cache reuse) — no fake KPIs  
8. CTA: Contact for GenAI / FDE roles  

### 8.2 Persona classifier — explain like a hiring manager

> For each proposal section, a classifier agent chooses a specialised scoring persona (e.g. technical FastAPI/Python vs legal ISO-style). Personas are stored in a DB. On hit, reuse; on miss, generate, cache, then score. This keeps scoring specialised without rebuilding prompts every time.

### 8.3 Visuals to produce at implement time

- [ ] Agent pipeline SVG  
- [ ] Persona cache sequence (Mermaid → SVG)  
- [ ] Optional animated version in C/A  
- [ ] Cropped screenshot variants  

---

## 9. Hackathon case study — shared wireframe

1. Hero line: “Org hackathon win · VibelySane · GrantFlow · 8 hours”  
2. Constraint & brief  
3. Strategy: feature prioritization  
4. LLM craft: red-team scoring prompts + chatbot form-fill guardrails  
5. Photos: HACKATHON.jpeg, dinner  
6. Skills transferred to BidStream / FDE work  
7. CTA  

---

## 10. Experience section — content update note

**Must update** present role from legacy Career.js (RN chat POC / Spring Boot present-tense) to:

- Title: GenAI Engineer / Forward Deployed Engineer (confirm exact HR title if different)  
- Company: Argusoft  
- Product: BidStreamAI  
- Bullets: owned scoring workflow, insights, CV gen, L2 validation, stack  

Keep earlier timeline entries (intern → trainee → PA) as history.

Education: B.Tech IT, VGEC, 2021–2024, **9.11 CGPA**.

---

## 11. Header / conversion UX (all concepts)

```
[ SK monogram ]     Work   Experience   About        [ Resume ] [ Contact ]
```

**Mobile (locked):** sticky **top** header + compact hamburger; **Resume** remains a visible solid button in the top bar (not only inside the menu). No bottom-nav dual pattern.

Sticky; backdrop blur on scroll; `scroll-margin-top` on sections.  
Resume = primary button (solid accent). If `resume.pdf` missing → button becomes `mailto:` with label “Request resume” (never dead 404).  
Contact = ghost or text button.  
Recruiter social priority in footer: **Email · LinkedIn · GitHub · Resume** first; YouTube / X / LeetCode secondary.

---

## 12. Testing plan (all concepts)

### 12.1 Functional

- All anchors/routes  
- External links `rel="noopener noreferrer"`  
- Resume 200  
- Case study media loads  
- Forms if any  

### 12.2 Responsive breakpoints

320 · 375 · 768 · 1024 · 1280 · 1440  

### 12.3 A11y

- Tab order  
- Screen reader smoke (VoiceOver)  
- Reduced motion  
- Contrast  

### 12.4 Performance

- Lighthouse mobile/desktop  
- WebGL FPS overlay dev-only  
- Bundle analysis  

### 12.5 Content QA

- No freelance CTAs  
- No invented metrics  
- Spelling: **Ahmedabad**  
- BidStreamAI naming consistent (fix “Bidstram” in filenames only)  

---

## 13. Open items (need from user later, not blockers for planning)

| Item | Status |
|------|--------|
| Exact HR job title string | Partial (“GenAI / FDE”) |
| Resume PDF file | Missing → placeholder |
| Public metrics for BidStream | None — qualitative only |
| Client name | Keep generic medical-domain |
| Preferred accent color / logo | Not set — concept defaults |
| Whether YouTube/LeetCode stay in footer | Optional for GenAI target (can keep secondary) |
| GrantFlow live URL / GitHub | Unknown — omit if private |

---

## 14. Suggested decision path

1. User reads A–E (+ hybrid §7.2)  
2. **Content freeze:** approve BidStream/hackathon bullets + secondary project one-liners (before heavy motion/3D)  
3. Picks **primary concept:** **A** or **C** (or explicit **hybrid A+C**)  
4. Optional: rank B/D/E for later  
5. Implementation starts Shared P0 → concept phases  
6. No full B/D world build until A/C content DoD is green  

---

## 15. Appendix — legacy site debt to leave behind

| Legacy | Action |
|--------|--------|
| CRA | Replace with Vite |
| Chakra + Prime + Bootstrap together | Remove |
| tsparticles as main identity | Remove or extreme subtlety |
| Typewriter “MERN / YouTuber” primary | Replace with GenAI / FDE |
| Wave emoji hero | Remove |
| Preloader fixed 1s | Real loading |
| Outdated Career present role | Rewrite to GenAI / BidStreamAI |
| Contact section commented out | Restore job-focused contact |
| © 2022 | Dynamic year |
| Template PDF `Soumyajit_Behera-BIT_MESRA.pdf` | Delete |
| Stock `css/Assets/Projects/*` if unused | Delete |
| Particle.js / Particle2.js if unused | Delete |
| `public/index2.html` if unused | Delete |
| Dual UI theme CSS chaos | Replace with tokens |

---

## 16. Draft GenAI / FDE experience bullets (user-editable)

Use under current Argusoft role (qualitative only):

- Own end-to-end **Proposal Scoring** for BidStreamAI: multi-agent LLM workflow (visual asset extraction, gap analysis, evaluation-matrix extraction, specialised persona classification with DB-backed prompt cache, section scoring).  
- Built **RFP insights** generation with **long-document / context-window overflow** handling on Gemini long-context.  
- Shipped **automatic Proposal CV generation** mapping RFP resource needs to company knowledge-base experience.  
- Added **Level-2 AI validation** scoring RFPs against a medical-domain client product catalog with **explicit caching**.  
- Stack: **LlamaIndex, Vertex AI, FastAPI, React**.  
- Prior path: full-stack training (React, Spring Boot, React Native POCs) → GenAI product engineering.

---

## 17. QA report summary (subagent)

**Verdict:** PASS WITH GAPS (v1) → **P0/P1 amendments applied in v1.1**

### Fixed in v1.1
- Display strings vs keywords; BidStreamAI naming rule; allowed claims  
- Router default + IA resolution  
- Content TS contracts + module map for all four owned areas  
- Expanded design tokens, z-index, accents locked per concept  
- Lenis/GSAP/R3F engineering appendix  
- Hybrid A+C specified as optional explicit path  
- Header mobile locked; resume missing UX  
- Estimates + pin stacking + E components/risks + B hotspot parity  
- Legacy purge list expanded  

### Still open (need user, not plan bugs)
- Resume PDF file  
- Exact HR title if different from GenAI Engineer / FDE  
- Screenshot redaction sign-off  
- GrantFlow public links (case study works linkless)  
- Secondary project one-liner approval  
- Final concept pick: **A / C / hybrid A+C**  

### Remaining known thin spots if B or D chosen later
- Full art pipeline for B; full game systems for D — intentionally deferred until base content ships  

---

## 18. Document history

| Version | Date | Notes |
|---------|------|--------|
| v1 | 2026-07-11 | Initial A–E plans + locked requirements from user inputs + repo audit |
| v1.1 | 2026-07-11 | Strict QA subagent PASS WITH GAPS; P0/P1 plan amendments applied |

---

**End of plan document.**  
**Next step:** You pick **A**, **C**, or **hybrid A+C** → we freeze content → implement single path (still no multi-concept parallel 3D).
