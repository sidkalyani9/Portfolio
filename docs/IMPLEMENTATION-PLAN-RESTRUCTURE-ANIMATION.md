# Implementation Plan — Content Restructure + Premium Motion (A+C+E)

**Document type:** Detailed implementation plan (no code in this pass)  
**Status:** Draft **v1.1** — QA **PASS WITH GAPS**; P0/P1 amendments applied  
**Scope:** Home IA restructure, new anonymous projects, remove company screenshots, de-emphasize BidStream brand, premium GSAP/Lenis motion, fix section smooth-scroll  
**Stack:** Existing Vite · React 19 · TS · Tailwind · GSAP · Lenis · R3F MicroOrb  
**Positioning (locked):** Job hunt — GenAI / FDE only · no freelance · no fake metrics · no client names · no confidential UI screenshots  
**QA:** Strict UI/UX + React QA subagent · 2026-07-11 · Verdict PASS WITH GAPS (see §13)

---

## 0. Locked requirements (do not drift)

Every implementer and QA agent must treat this section as **canonical**. Contradicting it is a defect.

### 0.1 User-stated product / content requirements

| ID | Requirement | Source |
|----|-------------|--------|
| **R1** | **Remove** the proof-points strip (4 cards: Proposal Scoring / Hackathon / Stack / Availability) | Screenshot 12.57.04 + user |
| **R2** | BidStream **module panel**: remove company **screenshot**; keep owned modules; **add** the two new anonymous work items into the switcher list | Screenshot 12.58.02 + user |
| **R3** | Module switcher: while user **scrolls through the section**, **auto-switch** modules with **fade** (scroll-driven), until end of section | User |
| **R4** | Hackathon section: fix **unutilized space**; bottom-right dinner photo must be **full / not cropped** | Screenshot 12.59.01 + user |
| **R5** | Selected Work: **MealDash full width** (like BidStream card); **add 2 anonymous projects** (no screenshots) | Screenshot 12.59.38 + user |
| **R6** | **Page order:** Hero → **About** → **Curriculum (Experience)** → Featured product work (BidStream modules) → Hackathon → Selected Work → Contact | User |
| **R7** | **New project A — client scraping platform (anonymous):** owned e2e **automatic login**; **AWS Secrets Manager** for username/email/password; **Gmail API** for **2FA OTP** | User |
| **R8** | **New project B — client messaging platform (anonymous):** e2e **speech-to-text → summarization** for video meeting feature; tech stack forgotten — plan must pick **best cost/quality** options and label them honestly | User |
| **R9** | **Reduce BidStream dependency** in overall narrative (hero CTA, density, naming balance) while keeping owned technical story | Prior discussion + user |
| **R10** | **No company UI screenshots** for confidential work (remove BidStream scoring UI image usage) | User |
| **R11** | **Smooth scroll** when clicking any button/link that targets a section (currently broken) | User |
| **R12** | Animations must be **premium** (clip/mask, scrub, pin, timeline) — **not** generic AI slop (`opacity + y` everywhere) | User |

### 0.2 New anonymous project content (locked facts)

#### Project A — Authenticated scraping automation

| Field | Value |
|-------|--------|
| **Safe public title** | `Authenticated Scraping Automation` |
| **Slug** | `authenticated-scraping-automation` |
| **Domain label** | Client scraping platform (no client name) |
| **Role** | Owned end-to-end automatic login solution |
| **Work** | Designed and shipped automated authenticated access; credentials via **AWS Secrets Manager**; **2FA OTP** retrieval/handling via **Gmail API** |
| **Stack (known)** | AWS Secrets Manager · Gmail API · (rest as already used in engagement if unknown — do not invent company product names) |
| **Media** | **None** — diagram optional (login → secrets → OTP → session) |
| **Links** | Private / internal only |

#### Project B — Meeting intelligence (messaging platform)

| Field | Value |
|-------|--------|
| **Safe public title** | `Meeting Intelligence Pipeline` |
| **Slug** | `meeting-intelligence-pipeline` |
| **Domain label** | Client messaging platform — video meeting feature (no client name) |
| **Role** | Owned end-to-end speech-to-text → summarization integration |
| **Work** | Pipeline from meeting audio/video speech to transcript to summary for messaging UX |
| **Stack (recommended — user forgot exact models; implementer must use this set and show as “representative production choices” in plan; UI may say “Speech-to-text + LLM summarization” without claiming a brand the user never used unless user confirms later)** | **STT:** OpenAI Whisper API *or* self-hosted `faster-whisper` / AWS Transcribe (prefer **Whisper API** or **faster-whisper** for cost/quality balance on meetings). **Summarization:** small efficient model — **GPT-4o-mini** or **Gemini 1.5 Flash / Flash-Lite** class for cost. **Orchestration:** Node/Python worker + queue optional. **Plan default for copy:** `Whisper (STT) · GPT-4o-mini or Gemini Flash (summary)` with footnote “stack representative; exact production models may vary.” |
| **Media** | **None** — optional abstract flow diagram (audio → STT → summary → message thread) |
| **Links** | Private / internal only |

### 0.3 Confidentiality & claims

- **Forbidden:** BidStream / client UI screenshots; inventing client names; fake % metrics; freelance CTAs.  
- **Allowed:** Architecture descriptions, owned modules, anonymous project titles, public GitHub projects with real names (Health Sync, MealDash, etc.).  
- **BidStreamAI:** May remain as product name **once** in featured section if desired, but **hero and overall site must not be BidStream-first**; prefer “Selected systems” language.  
- Medical-domain L2 validation: keep generic “medical-domain product catalog.”  

### 0.4 Non-goals (this plan)

- Concept B room / Concept D game  
- Full redesign away from A+C+E visual system (teal + editorial serif + ink accents stay)  
- Adding real resume PDF unless user provides file (keep Request resume mailto)  
- Restoring tsparticles / wave emoji / old CRA  

### 0.5 Success criteria

1. Proof strip **gone** from DOM and routes; `ProofSection` not mounted.  
2. Home section order matches **R6** exactly.  
3. **Dual placement always:** systems scrub has **6 panels** (4 BidStream owns + 2 anonymous) **and** Selected Work includes both anonymous projects.  
4. **Zero** code references to `bidstream-proposal-scoring.png` (content, sections, case studies, `public` consumer paths).  
5. Module section **desktop scroll-scrubs** index with **fade** crossfade; mobile progressive (see §3.4).  
6. Hackathon: dinner photo **`object-contain`**, full column width, **no `max-w-md`**.  
7. MealDash **full width** regardless of index; 2 anonymous **full-width text rows** (no screenshots).  
8. BidStream Selected Work card is **text-first full-width** (optional non-UI SVG only — never company UI).  
9. Every hash / `/#…` / `to="/#…"` path uses **`scrollToId`** (Lenis on desktop; smooth fallback mobile).  
10. **`useReveal` rewritten** — no global default `y + opacity` as the motion language.  
11. Build passes; reduced-motion respected.  

---

## 1. Locked architecture decisions

### 1.1 Home page order (final)

```
1. Hero
2. About                    (#about)
3. Curriculum / Experience  (#experience)
4. Featured systems         (#systems)  ← scrub theater (6 panels)
5. Hackathon                (#hackathon)
6. Selected work            (#work)
7. Contact                  (#contact)
```

**Remove:** `ProofSection` from `HomePage`; **delete** `ProofSection.tsx` + `proof.ts` in this PR (no orphan).

**Nav (locked):**

| Label | Target |
|-------|--------|
| Work | `#systems` (featured systems first) |
| About | `#about` |
| Experience | `#experience` |
| Contact | `#contact` |

In systems section footer link: **“All selected work”** → `#work`.  
Hero primary CTA → `#systems`.  
Hero “Scroll” cue → `#about` (never `#proof`).  
Legacy `/#bidstream` and `/#proof`: map to `#systems` / `#about` if encountered.

### 1.2 Where the 2 anonymous projects appear

**Locked dual placement (always both — not either/or):**

| Placement | Treatment |
|-----------|-----------|
| **Featured systems switcher** | Append **after** the 4 BidStream modules → **6 scrub panels** total. Text + stack + bullets — **no image**. |
| **Selected Work** | **Full-width text rows only** (not half-width). Same facts; link `/work/:slug`. |

BidStream owns stay panels 1–4; anonymous 5–6 so the site is not BidStream-only.

### 1.3 BidStream brand de-emphasis (R9 — concrete)

| Surface | Locked change |
|---------|----------------|
| Hero CTA | **View selected systems** → `#systems` |
| Hero body / oneLiner | Production GenAI systems (pipelines, auth automation, meeting intelligence) — **not bidding-only** |
| Hero aside | Title **Focus** (not “BidStreamAI”); bullets: multi-agent scoring · auth automation · meeting AI · hackathon |
| Systems eyebrow/title | **Featured systems** / **Systems I own end-to-end** |
| Work section blurb | “Selected systems & products” — not “P0 depth on BidStreamAI…” only |
| Case study display | Route stays `/work/bidstream-ai`; H1 can be **Multi-agent proposal scoring**; product line “BidStreamAI (internal)” once |
| Max BidStream name density | Avoid repeating BidStreamAI on every card eyebrow |

### 1.4 Smooth scroll architecture (R11 — Router-aware)

**Root cause:** Lenis instance not exposed; `HomePage` uses `scrollIntoView`; many CTAs use `to="/#id"` (React Router), not plain `#id`.

**Locked implementation:**

1. **`SmoothScrollProvider`** owns Lenis (desktop ≥1024, not reduced-motion); **do not** `ScrollTrigger.getAll().kill()` on teardown.  
2. Context: `{ lenis, scrollToId, headerOffset }`.  
3. **`scrollToId(id: string)`**  
   - Resolve `document.getElementById(id)`  
   - Desktop + lenis: `lenis.scrollTo(el, { offset: -headerOffset, duration: 1.15, easing: expo-out })`  
   - Else: `el.scrollIntoView({ behavior: 'smooth', block: 'start' })` (CSS `scroll-margin-top: 5.5rem` remains)  
4. **Header offset:** measure sticky header height once (`16` / `4.25rem`) or fixed `88`.  
5. **Hash navigation matrix (all must call `scrollToId`):**

| Entry | File | Action |
|-------|------|--------|
| Primary nav links | `SiteHeader.tsx` | click → preventDefault → if path `/` scrollToId; else navigate(`/#id`) |
| Mobile nav | `SiteHeader.tsx` | same |
| Hero CTA / Scroll | `HeroSection.tsx` | scrollToId |
| Home hash on load | `HomePage.tsx` | replace `scrollIntoView` with scrollToId after rAF |
| Case study Back | `CaseStudyPage.tsx` | navigate then scroll (`/#systems` or `/#work`) |
| “All selected work” | Systems section | scrollToId(`work`) |
| Any `ButtonLink to="/#…"` | `Button.tsx` + callers | treat hash targets via scroll helper, not raw browser jump |

6. Optional: Lenis `anchors: true` **plus** still centralize through `scrollToId` for offset consistency.  
7. **Skip-to-content** `#main`: native focus, no Lenis section offset required.

### 1.5 Motion principles (anti-slop) + global reveal rewrite (R12)

| Do | Don't |
|----|-------|
| Clip-path / mask reveals | Default `y: 40 + opacity` on every block |
| ScrollTrigger **scrub** for module index | Click-only tabs without scroll story (desktop) |
| One custom easing family | Bounce / elastic everywhere |
| Stagger **lines** in hero only | Stagger every card the same way |
| Reduced-motion → instant end state | Ignore `prefers-reduced-motion` |
| Max **1** pin on home (systems) | Parallax on all images |

**Mandatory:** Rewrite `useReveal.ts`:

- Default `.reveal` → **clip-path inset** or soft opacity **only** (no `y: 28` default).  
- Opt-in: `data-reveal="clip" | "mask" | "none" | "lines"`.  
- Systems pin stage: **`data-reveal="none"`** on scrubbing panels so enter fades don’t fight scrub.  
- Phase 6 is not “hero only” — **global** replacement is in scope.

---

## 2. Content model changes

### 2.1 Files to create / update

| File | Action |
|------|--------|
| `src/content/proof.ts` | **Delete** |
| `src/sections/ProofSection.tsx` | **Delete** |
| `src/content/systems.ts` **NEW** | 6 scrub panels schema + sample payloads for 5–6 |
| `src/content/bidstream.ts` | `media: []` or remove media field usage |
| `src/content/projects.ts` | Type + 2 anonymous + layout flags; BidStream `cover: null` |
| `src/content/profile.ts` | Broader oneLiner (R9) |
| `src/pages/HomePage.tsx` | Reorder; scrollToId hash |
| `src/sections/SystemsSection.tsx` | New/rename from BidStreamSection |
| `src/sections/WorkSection.tsx` | MediaCard vs TextProjectRow branches |
| `src/sections/HackathonSection.tsx` | Grid + dinner contain |
| `src/sections/HeroSection.tsx` | CTA, Focus card, scroll target |
| `src/components/SmoothScroll.tsx` | Provider |
| `src/hooks/useScrollTo.ts` | **NEW** |
| `src/hooks/useReveal.ts` | **Rewrite** anti-slop |
| `src/lib/motion.ts` | **NEW** easings |
| `src/pages/CaseStudyPage.tsx` | Extend for 2 slugs; null media; BidStream no figure |
| `public/media/bidstream-proposal-scoring.png` | Stop all refs; may leave orphan file or delete |

### 2.1.1 Project type (locked)

```ts
type Project = {
  slug: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  problem: string;
  role: string;
  tech: string[];
  outcome: string;
  links: { label: string; href: string }[];
  cover: string | null;           // null = no image
  layout: 'full' | 'half' | 'text'; // text = full-width text row
  confidential?: boolean;
  featured?: boolean;
};
```

- Anonymous projects: `cover: null`, `layout: 'text'`, `confidential: true`, `priority: 'P0'`, `featured: true`.  
- MealDash: `layout: 'full'`, keep public cover.  
- BidStream work card: `cover: null`, `layout: 'full'` or `'text'`.  
- Featured filter: include all `featured` / P0+P1 including anonymous.

### 2.2 Scrub panel order (locked)

1. Proposal Scoring (BidStream)  
2. RFP Insights  
3. Proposal CV Generation  
4. Level-2 AI Validation  
5. **Authenticated Scraping Automation** (anonymous)  
6. **Meeting Intelligence Pipeline** (anonymous)  

**URL query (locked):** keep **`?module=<id>`** (existing) for less churn; deep-link sets initial index + scrolls pin progress.

### 2.3 Selected Work order (locked — exact)

1. Multi-agent proposal scoring (BidStream product line) — **full-width text / no company UI**  
2. GrantFlow — half  
3. **MealDash — full width** (public screenshot OK)  
4. **Authenticated Scraping Automation — full-width text**  
5. **Meeting Intelligence Pipeline — full-width text**  
6. Health Sync — half  
7. Also: Lucky Shrub, Portfolio v1  

**Grid algorithm:**  
- `layout === 'full' | 'text'` → `md:col-span-2`  
- `layout === 'half'` → `md:col-span-1`  
- Never use “first P0 only” for full width (current bug).  

### 2.3.1 Sample stack chips (R7/R8)

| Project | Chips (only known / approved) |
|---------|-------------------------------|
| Scraping | AWS Secrets Manager · Gmail API · Automated auth |
| Meeting | Speech-to-text · LLM summarization · (optional subtitle: “e.g. Whisper-class STT + Flash/mini summary — representative”) |

UI default line for meeting: **“Speech-to-text → summary pipeline (cost-efficient STT + small LLM)”** — avoid asserting a brand the user never used unless confirmed.

### 2.4 Anonymous project case study longread outline

Shared template (E style):

1. Context (domain, no client name)  
2. Problem  
3. Role  
4. Approach / architecture  
5. Stack  
6. Outcome (qualitative)  
7. Confidentiality note  

---

## 3. UI restructuring — section-by-section

### 3.1 Hero

**Copy**

- H1: name (keep)  
- Role line: GenAI Engineer · Forward Deployed Engineer  
- Tagline: broader than BidStream — e.g. end-to-end GenAI systems for production workflows  
- CTAs: **View selected systems** (`#systems`) · Resume · LinkedIn  
- Aside card: multi-bullet — multi-agent scoring · auth automation · meeting intelligence · hackathon win  

**Motion (premium)**

- On load: clip-path wipe **up** on italic tagline; name lines split or mask (not y-fade only)  
- Aside card: border draw or opacity via timeline **after** text  
- MicroOrb: keep; optional subtle pointer parallax desktop only  

### 3.2 About (moved up)

- No structural content change required beyond order  
- Motion: portrait **clip-path inset** reveal; text staggered by paragraph delay only (2–3 steps max)  
- Ensure figure caption intact  

### 3.3 Curriculum / Experience (below About)

- Keep CV two-column layout  
- Motion: each row’s left hairline **scaleY** 0→1 on enter; no bounce  

### 3.4 Featured systems (ex-BidStream section) — `#systems`

**R3 scope:** Desktop = pin + scrub auto-switch + fade (required). Mobile = progressive exception (accordion / intersection).

**Layout**

- Eyebrow: Featured systems · Title: Systems I own end-to-end  
- Intro: GenAI + platform work (auth, meetings) — no screenshot  
- Pull quote: persona classifier · Pipeline chips only when `kind === 'bidstream'`  
- Left: 6 items (Owned / Confidential badges) · Right: panel body + CTA  
- Footer: “All selected work” → `#work`  

**Scroll (R3)**

1. Pin stage; `start: top top+=headerOffset`; `end: += N * segment`. Store ST as `st`.  
2. `i = min(N-1, floor(progress * N))`; on change kill prior tween → crossfade (opacity/clip only).  
3. Click **and** keyboard: `y = st.start + ((i+0.5)/N) * (st.end-st.start)` then `lenis.scrollTo(y)`.  
4. Mobile: no pin. Reduced motion: click-only.  

**Remove:** all BidStream UI screenshots. Optional SVG diagrams (not required v1).

### 3.5 Hackathon (R4)

- `lg:grid-cols-12`, text 5 / media 7, `items-start`  
- Dinner: **full column width**, **`object-contain` only**, **remove `max-w-md`**, letterbox OK  
- Top image may use cover; dinner must not crop  
- Mild parallax desktop; quote ink border draw  

### 3.6 Selected Work (R5)

Follow §2.3 order exactly. Render `MediaProjectCard` vs `TextProjectRow`.  
MealDash: `layout: 'full'` even when not index 0.  
Section blurb: not BidStream-only (R9).  

### 3.7 Contact

Sparse E; scroll-to via helper.

### 3.8 Case studies

Extend existing `/work/:slug` + `CaseStudyPage` (not new routers).  
BidStream: no company screenshot. New slugs: text + confidentiality note. Skip figure when `cover == null`.

---

## 4. Premium motion implementation plan

### 4.1 Infrastructure

| Piece | Spec |
|-------|------|
| `SmoothScrollProvider` | Owns Lenis (desktop), exposes `{ lenis, scrollToId }` |
| `useScrollTo()` | Wraps context; used by Header, Hero, Footer, buttons |
| `useReducedMotion()` | Existing — gate all |
| `motion.ts` | `EASE_OUT_EXPO`, `DUR_PAGE = 0.9`, `DUR_PANEL = 0.4`, clip presets |
| Global reveal | Replace pure y-fade: default **clip-path inset(100% 0 0 0) → inset(0)** for images; text **mask-image** or line reveal for headings only |

### 4.2 Per-surface motion matrix

| Surface | Trigger | Technique | Notes |
|---------|---------|-----------|--------|
| Nav / CTA section links | click | Lenis scrollTo | **P0 bugfix** |
| Hero text | mount | Timeline + clip/split | Once |
| Systems panels | scroll pin scrub | Index + crossfade | **P0 feature** |
| Systems list click | click | Index + scrollTo progress | Sync |
| Pull quote | enter | Border scaleY + text clip | Ink |
| About image | enter | clip-path reveal | |
| Experience rows | enter | rule scaleY | |
| Hackathon images | scrub | parallax + contain dinner | |
| Work cards | hover | overflow scale / border | Desktop |
| Route change | navigate | short mask wipe 300–500ms | Optional P1 |
| Preloader exit | done | clip SK into hero | Optional P2 |

### 4.3 Explicitly forbidden in this plan

- Applying `gsap.from(el, { y: 50, opacity: 0 })` as the **only** reveal for every `.reveal`  
- Autoplay sound  
- Scroll-jacking entire page beyond one pinned systems section  
- Magnetic cursor on mobile  

### 4.4 Performance budgets

- One pin max on home (systems)  
- Kill ScrollTriggers on unmount via `gsap.context`  
- Do not global-kill all ScrollTriggers on Lenis teardown (prior bug)  
- MicroOrb + no second WebGL hero  
- Diagrams as SVG/CSS not heavy Lottie unless necessary  

---

## 5. Component / file-level tasks

### Phase 0 — Motion plumbing + scroll fix (0.5–1 day)

1. Refactor `SmoothScroll.tsx` → provider + context.  
2. `useScrollTo.ts`.  
3. Wire `SiteHeader`, `HeroSection` CTAs, mobile nav, `HomePage` hash, any `ButtonLink` to `#…`.  
4. Verify desktop Lenis + mobile native.  
5. Manual QA: every nav item lands with offset under sticky header.  

### Phase 1 — IA reorder + remove proof (0.25 day)

1. `HomePage` order: Hero, About, Experience, Systems, Hackathon, Work, Contact.  
2. Remove `ProofSection`.  
3. Update header anchors.  
4. `scroll-margin-top` on all section ids.  

### Phase 2 — Content model (0.5 day)

1. Author `systems.ts` panels 1–6.  
2. Add anonymous projects to `projects.ts`.  
3. Strip BidStream image from content consumers.  
4. Case study routes for 2 new slugs.  
5. Hero / systems copy de-emphasize BidStream.  

### Phase 3 — Systems section rebuild (1–1.5 days)

1. Rename/refactor section component.  
2. 6-panel UI without screenshot.  
3. Pin + scrub + fade crossfade.  
4. Click sync.  
5. Mobile accordion.  
6. Optional SVGs for panels 1, 5, 6.  
7. A11y: tabs/listbox pattern compatible with scrub (aria-current on active).  

### Phase 4 — Hackathon layout (0.5 day)

1. 12-col grid fill.  
2. Dinner `object-contain` full frame.  
3. Parallax optional.  

### Phase 5 — Selected Work (0.5–1 day)

1. MealDash full width.  
2. Two anonymous full-width text projects.  
3. Card motion.  
4. Links to case studies.  

### Phase 6 — Premium motion + useReveal rewrite (0.5–1 day)

1. **Rewrite `useReveal` globally** (no default `y+opacity` slop).  
2. Hero clip/split, pull-quote border, about clip image, experience rules.  
3. Systems panels `data-reveal="none"`.  
4. Reduced-motion audit.  

### Phase 7 — QA / build / polish (0.5 day)

1. Hash matrix manual test (header, mobile, hero, back, all work).  
2. Screenshot grep: zero hits on bidstream-proposal-scoring.  
3. `npm run build`.  
4. Safari pin + Lenis smoke.  

**Total estimate:** ~4–6 focused days.

---

## 6. Detailed systems scrub algorithm

```
N = 6
segment = 0.55 * window.innerHeight  // tune 0.45–0.65
// Create ScrollTrigger once; keep reference `st`

onUpdate(self):
  t = clamp(self.progress, 0, 1)
  i = min(N - 1, floor(t * N + 1e-6))
  if i !== activeIndex:
    kill(crossfadeTween)
    activeIndex = i
    crossfadePanel(i)  // opacity/clip only; update aria-current; pipeline visibility

// Click OR keyboard:
scrollToPanel(i):
  p = (i + 0.5) / N
  y = st.start + p * (st.end - st.start)
  if lenis: lenis.scrollTo(y, { duration: 0.9 })
  else: window.scrollTo({ top: y, behavior: 'smooth' })

// Deep link ?module=slug:
  map slug → i; on load after ST ready → scrollToPanel(i)
```

Edge cases:

- Resize/orientation: `ScrollTrigger.refresh()`; re-clamp index  
- Rapid scrub: kill previous crossfade  
- `st` null (mobile): ignore pin API; accordion only  

---

## 7. Accessibility

- Desktop scrub must not trap focus.  
- Keyboard arrows **sync scroll** (same as click).  
- Do not move focus on scrub-driven changes.  
- Optional `aria-live="polite"` on panel title (sparingly).  
- Dinner `alt` descriptive; diagrams captioned.  
- Reduced motion: no pin/parallax; instant panels.  

---

## 8. Testing checklist

### Functional

- [ ] Proof gone (files deleted / not imported)  
- [ ] Order: Hero → About → Experience → Systems → Hackathon → Work → Contact  
- [ ] **No** `bidstream-proposal-scoring` in src  
- [ ] 6 scrub panels including scraping + meeting  
- [ ] Dual: anonymous also in Selected Work  
- [ ] MealDash full width (not only first card rule)  
- [ ] Hash matrix: header, mobile, hero, back link, all selected work  
- [ ] Case studies for 2 new slugs  
- [ ] Build green  

### Motion

- [ ] Desktop pin scrub + fade  
- [ ] Click **and** keyboard sync scroll position  
- [ ] Mobile usable without pin  
- [ ] No global y-fade-only reveals  
- [ ] Reduced motion OK  
- [ ] Safari pin + Lenis smoke test  

### Content

- [ ] Secrets Manager + Gmail OTP accurate  
- [ ] Meeting stack disclaimer / generic line  
- [ ] No client names / fake metrics  

---

## 9. Risk register

| Risk | Mitigation |
|------|------------|
| Pin + Lenis fight | Ticker pattern; Safari manual test |
| 6 panels too long | Tune segment; optional dots |
| BidStream dominance | R9 copy matrix |
| STT brand invention | Generic UI line locked |
| Dinner letterbox | Accept on dark bg |
| Dual placement repetition | Shorter work cards |
| Router hash miss | Hash matrix checklist |

---

## 10. Deliverables checklist (implementation PR)

1. SmoothScroll provider + hash matrix  
2. Home reorder + proof **deleted**  
3. Systems 6-panel scrub fade, no screenshot  
4. Anonymous content + case studies  
5. Hackathon layout + contain dinner  
6. Work: MealDash full + text rows + BidStream no UI shot  
7. Hero/profile R9 copy  
8. useReveal rewrite + premium hero/quote/about  
9. Build + a11y + reduced motion  
10. PR notes  

---

## 11. Out of scope follow-ups

- More projects beyond the two  
- Resume PDF binary  
- Full site bento redesign  
- Client logos  
- Visual regression CI  

---

## 12. Document history

| Version | Date | Notes |
|---------|------|--------|
| v1 | 2026-07-11 | Initial plan from restructure + animation requirements |
| v1.1 | 2026-07-11 | QA PASS WITH GAPS — Router hash matrix, screenshot purge, useReveal rewrite, Work grid lock, dinner contain, scrub click API, dual placement success criteria |

---

## 13. QA report summary

**Verdict:** PASS WITH GAPS → **v1.1 amendments applied**

| Severity | Themes fixed in v1.1 |
|----------|----------------------|
| P0 | Router-aware Lenis; exhaustive screenshot purge; BidStream work card without media; global useReveal; scrub click uses ST start/end |
| P1 | Full-width lock for anonymous; dinner object-contain only; R9 copy surfaces; `?module=` lock; mobile R3 exception; CaseStudyPage extend not new router |
| P2 | Tween kill, keyboard sync, header offset, orphan media |

**Coverage R1–R12 after v1.1:** all **Covered** (R3 mobile = documented progressive exception).

---

**End of plan v1.1.**  
**Next step:** your approval → implement.
