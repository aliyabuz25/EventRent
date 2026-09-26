# Eventrent.az Rebuild Master Prompt for Claude CLI

> Bu dosya, Claude Code / Claude CLI ile Eventrent.az için sıfırdan yeni bir site sistemi üretmek üzere hazırlanmış kapsamlı bir proje brieﬁ, kurulum planı, çalışma talimatı ve kalite kontrol dökümanıdır. Claude Code, proje kökünde yer alan `CLAUDE.md` dosyasını her oturum başında okuyarak proje bağlamını ve kuralları uygular.

## ⚠️ BÜTÜN AJANLAR ÜÇÜN ZƏRURİ QAYDALAR (MANDATORY RULES FOR ALL AGENTS) ⚠️

1. **PORT İDARƏETMƏSİ (PORT MANAGEMENT):**
   - Bu layihə **KƏSİNLİKLƏ 5050 portunda** çalışmalıdır (`vite --port=5050`).
   - Hər hansı bir test, mock server, backend və ya başqa bir tətbiq üçün port ayırmazdan **ƏVVƏL** `/home/aliv/Desktop/Projeler/GLOBAL_PORT_REGISTRY.md` faylını oxuyun.
   - `/home/aliv/Desktop/Projeler/GLOBAL_PORT_REGISTRY.md` kompüterinizdəki **bütün ajanlar və layihələr üçün ortaq** IP/Port siyahısıdır. Hansı portların "busy/used", hansıların isə "available" olduğunu göstərir.
   - Yeni bir port istifadə etdiyinizdə (busy/used), dərhal gedib həmin qlobal faylda (`GLOBAL_PORT_REGISTRY.md`) portun statusunu "IN_USE" olaraq yeniləyin ki, digər layihələrdəki ajanlar xəbərdar olsun.

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
---

## Sistem Arxitekturası & Kod Qaydaları

### Backend — `server.js`

Tək fayl Express.js server. ES Modules (`import/export`) formatındadır.

**Kritik qaydalar:**
- `fs` → `node:fs/promises` (async). Sync əməliyyatlar üçün `{ existsSync, mkdirSync }` ayrıca `node:fs`-dən import edilir.
- DB əməliyyatları `better-sqlite3` ilə **sinxron** işləyir — `await` yoxdur.
- JWT `7d` müddətlidir. `authMiddleware` → `adminOnly` zənciri istifadə et.
- `transporter` qlobal dəyişəndir — SMTP konfiqurasiya dəyişdikdə `transporter = null` edilir, növbəti `sendMail` çağırışı yenidən qurur.
- Bütün route-lar aşağıdakı sırada olmalıdır (Express-də daha spesifik route-lar əvvəl gəlməlidir):
  1. `/api/leads/:id/reply` (PUT)
  2. `/api/leads/:id/status` (PATCH)
  3. `/api/leads/:id` (DELETE)

### Validation Qaydaları

**Hər endpoint-də:**
- `name` → `!name || !String(name).trim()` ilə yoxla
- `phone` → `!phone || !String(phone).trim()` ilə yoxla
- Email → boş ola bilər, amma göndərilmişsə format yoxlanmalıdır
- `items` → `JSON.stringify(items || [])` ilə saxla

**Frontend-də (ContactForm, Cart):**
- `.trim()` ilə boşluq yoxla
- Email üçün `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` regex istifadə et

### Tip Sistemi — `src/types.ts`

`Lead` interfeysi həm `event_date` (backend snake_case) həm `eventDate` (camelCase) saxlayır — ikisi də optional-dır. Backend həmişə `event_date` göndərir.

Frontend-də tarixin göstərilməsi:
```tsx
const dateStr = lead.event_date || lead.eventDate;
const display = dateStr
  ? (() => { try { return format(new Date(dateStr), 'dd MMM yyyy'); } catch { return dateStr; } })()
  : '—';
```

### Email Sistemi

`sendMail({ to, subject, html })` — `to` boşdursa `notify_to` istifadə edir.

**Admin bildiriş emaili** → `POST /api/leads` içindəki try/catch bloku (catch edilir, server cavabını bloklamaz).

**Müştəri cavab emaili** → `PUT /api/leads/:id/reply` — `sent === false` olduqda `500` qaytarır.

### Frontend Komponentlər

| Komponent | Fayl | Məqsəd |
|-----------|------|--------|
| `ContactForm` | `src/sections/contact/ContactForm.tsx` | Public müraciət formu → `POST /api/leads` |
| `LeadsTab` | `src/sections/admin/LeadsTab.tsx` | Admin leads idarəsi + reply UI |
| `OrdersTab` | `src/sections/admin/OrdersTab.tsx` | Admin sifarişlər idarəsi |
| `SmtpTab` | `src/sections/admin/SmtpTab.tsx` | SMTP konfiqurasiya + test |
| `Cart` | `src/pages/Cart.tsx` | Müştəri səbəti → `POST /api/orders` |

---

## Tez-tez Edilən Səhvlər (Pitfalls)

1. **`fs.mkdirSync` YANLIŞDIR** — `fs` burada `promises`-dir. Sync üçün `mkdirSync` (node:fs-dən import edilmiş) istifadə et.
2. **`lead.message` sütunu yoxdur** — DB-də yalnız `note` var. `lead.note || ''` istifadə et.
3. **`lead.eventDate` həmişə undefined-dır** — backend `event_date` göndərir. Həmişə `lead.event_date || lead.eventDate` yoxla.
4. **Route sırası** — Express-də `/api/leads/:id/reply` route-u `/api/leads/:id` -dən əvvəl gəlməlidir.
5. **SMTP transporter** — konfiqurasiya dəyişdikdə `transporter = null` et, əks halda köhnə connection istifadə olunur.
