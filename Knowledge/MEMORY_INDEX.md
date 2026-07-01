# MEMORY_INDEX

## MOC: Start Here (Token-Min)

1. [[Knowledge/AI_CONTEXT_GATE]]
2. [[Knowledge/RUNBOOK_INDEX]]
3. [[Knowledge/DECISION_LOG]]

## Active Themes (max 5)

- Build optimization (lazy routes, manualChunks)
- SPA navigation polish (Link migrations)
- Home page section completeness

## Session Log — 2026-07-01

- Fact: appRoutes JSX.Element → React.ReactElement TS fix; all routes lazy-loaded with Suspense
- Why: 0 TS errors, index.js split from 1.39MB to per-page chunks (Home ~200KB core)
- Next: Admin panel auth guard + Catalog/ProductDetail polish

- Fact: Hero local video + CTA Link migrations (Hero, FinalCTA, FeaturedSetups, EventTypes)
- Why: SPA navigation instead of full page reloads
- Next: Contact form submit verification, Cart flow E2E

- Fact: EventTypes marquee ribbon + parallax scroll redesign committed
- Why: Premium visual language consistency
- Next: FeaturedSetups ProjectCard → /portfolio/:id route when portfolio data is expanded

## Capture Rules

- 5-8 sətirdən uzun qeyd yazma.
- Hər qeyddə yalnız: fact, why, next action.
- Qərarları `03-Decisions` altına ADR kimi çıxar.
- 14 gündən köhnə passiv qeydləri `99-Archive`-a köçür.