# Eventrent.az Rebuild Master Prompt for Claude CLI

> Bu dosya, Claude Code / Claude CLI ile Eventrent.az için sıfırdan yeni bir site sistemi üretmek üzere hazırlanmış kapsamlı bir proje brieﬁ, kurulum planı, çalışma talimatı ve kalite kontrol dökümanıdır. Claude Code, proje kökünde yer alan `CLAUDE.md` dosyasını her oturum başında okuyarak proje bağlamını ve kuralları uygular.

---

## Proje hedefi

Rebuild `eventrent.az` as a **multi-page premium event solutions website** inspired by the **3D visual flow, motion language, section transitions, and premium presentation style** of the Davies template, while preserving Eventrent's real business structure: services, categories, product listings, inquiry flow, and contact conversion paths.

The final site must **not** be a one-page personal portfolio clone. Davies is a one-page personal portfolio HTML template, so only its **presentation system** should be adapted, not its original information architecture. Eventrent.az already has a multi-page structure with product categories, category pages, contact pages, and cart-like/inquiry-oriented flows, so the redesign must remain multi-page.

---

## Site konumlandırması

The new site must position Eventrent.az as:
- a premium event solutions company
- a technical production and setup partner
- a reliable operator for corporate, wedding, outdoor, and branded activation events
- a brand that offers both presentation quality and practical rental inventory access

Do **not** position it as:
- a generic e-commerce shop
- a plain rental catalog
- a personal portfolio site
- a startup/SaaS template

---

## Ana strateji

Use a **three-layer site architecture**:

1. **Brand layer** — homepage, about, high-level services, visual storytelling
2. **Service and proof layer** — service detail pages, project/case study pages
3. **Catalog and conversion layer** — categories, products, contact, quote/inquiry, cart-like flow

The homepage should behave like a cinematic premium front door, while catalog and product pages should remain cleaner, faster, and more conversion-focused.

---

## Önerilen teknoloji yığını

Preferred stack:
- Vite + React
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Swiper for selected showcase sliders
- Lightweight Three.js only where it adds clear value
- ESLint + Prettier

---

## Mimari yaklaşım

Build the site as a **multi-page premium experience**, not a one-page clone.

### Required pages
- Home
- About
- Services overview
- Service detail pages
- Projects / Case studies
- Catalog hub
- Category pages
- Product detail pages
- Contact / Quote page
- Inquiry / cart-like flow

---

## Homepage sections
1. Hero intro
2. Core capabilities — GSAP ScrollTrigger ile snap geçiş efekti
3. Event types / industries served
4. Featured setups showcase
5. Process
6. Metrics / trust
7. Catalog gateway
8. Final CTA

---

## Tasarım dili

The site should feel:
- premium
- dark but not muddy
- crisp
- architectural
- cinematic
- minimal
- technically confident
- modern

---

## GSAP kuralları

Use GSAP ScrollTrigger selectively.

### Preferred trigger logic
- reveal sections → `trigger + start + toggleActions`
- storytelling sections → `trigger + start + end + pin + scrub`
- UI state sections → `onEnter + onLeave + onEnterBack + onLeaveBack`
- progress-driven visuals → `onUpdate`
- counters → `once + onEnter`

---

## Coding conventions

- TypeScript only
- Prefer functional components
- Use named exports where practical
- Keep GSAP logic isolated in hooks/utilities where possible
- Use data-driven section configs when useful
- Avoid giant monolithic files
- Keep component and animation naming readable
- Prefer composition over duplication

---

## Obsidian-style AI memory + token-min workflow

Claude Code bu layihədə aşağıdakı ardıcıllıqla işləməlidir:

1. `Knowledge/AI_CONTEXT_GATE.md`
2. `Knowledge/MEMORY_INDEX.md`
3. Yalnız task üçün lazım olan tək runbook və ya tək ADR

Qaydalar:

- Əsaslandırma olmadan 3-dən çox sənəd açma.
- Eyni məlumatı təkrar oxuma.
- Qeydləri qısa saxla: fact / why / next.
- Aktiv mövzu sayını `MEMORY_INDEX` daxilində maksimum 5 saxla.
- Passiv qeydləri periodik `Knowledge/99-Archive` altına köçür.
