# Siddharth Kalyani — Portfolio (Hybrid A+C)

Award-oriented personal portfolio for **GenAI Engineer / Forward Deployed Engineer** roles.

- **Concept:** Hybrid A (cinematic scroll SPA) + C (BidStreamAI product modules)
- **Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · GSAP · Lenis · React Three Fiber

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production → dist/
npm run preview
```

## Structure

- `src/content/` — locked facts (profile, BidStreamAI, GrantFlow, projects, experience)
- `src/sections/` — home page chapters
- `src/pages/` — home + case studies (`/work/:slug`)
- `src/three/` — lazy-loaded hero WebGL
- `public/media/` — screenshots & photos
- `docs/PORTFOLIO-REVAMP-PLANS-A-E.md` — full plan

## Resume

Place `public/resume.pdf` and set `resume.exists = true` in `src/content/socials.ts`.  
Until then the header shows **Request resume** (mailto).

## Notes

Legacy CRA sources live under `_legacy_cra/` (not used by Vite).
