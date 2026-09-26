# CHANGELOG — Eventrent.az

---

## [26.09.2026] — Production Hardening v2 (2-ci Sessiya)

### 🔒 Güvenlik
- `PUT /api/content` və `POST /api/content`: `authMiddleware + adminOnly` əlavə edildi. Əvvəllər hər kəs site məzmununu dəyişə bilirdi.

### 🐛 Bug Fixes
- **`PATCH /api/orders/:id/status`**: Status validasiyası və 404 yoxlaması UPDATE-dən əvvələ köçürüldü. Yalnız `['new','processing','contacted','won','lost','cancelled','confirmed']` qəbul edilir.
- **`PATCH /api/leads/:id/status`**: 404 yoxlaması UPDATE-dən əvvələ köçürüldü — mövcud olmayan lead-ə yazılma qarşısı alındı.
- **`PUT /api/tb/games/:id`**: 404 yoxlaması, boş `name` rədd, null-safe `?? existing.x` yeniləmə əlavə edildi.
- **`PUT /api/tb/concepts/:id`**: Eyni düzəltmələr tətbiq edildi.
- **`POST /api/support`** və **`POST /api/support/guest`**: Boşluqdan ibarət `subject`/`message` artıq keçmir.
- **`PUT /api/support/:id/reply`**: Boşluqdan ibarət `reply` rədd edilir.
- **`POST /api/orders`**: `name`/`phone` trim edilərək DB-yə yazılır.
- **`POST /api/leads`**: `name`/`phone` trim edilərək DB-yə yazılır.

### ⚙️ CI/CD
- `docker-publish.yml`: `redeploy` job-undakı `if: ${{ secrets.X != '' }}` sintaksisi düzəldildi. Secrets `env` vasitəsilə ötürülür, bash `if` ilə yoxlanılır — workflow artıq failure vermir.

Bütün əhəmiyyətli dəyişikliklər bu faylda qeyd edilir.
Format: [Tarix] · Fayl · Dəyişiklik · Səbəb

---

## [26.09.2026] — Tam Audit & Bug Fix Sessiyası

### 🔴 Kritik Düzəltmələr

**`server.js` — sətir 58**
- Əvvəl:  `if (!existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });`
- Sonra:  `if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });`
- Səbəb:  `fs` burada `node:fs/promises` (async) idi. `mkdirSync` isə
  `node:fs`-dən ayrıca import edilmişdi — düzgün funksiya işlədilmirdi,
  server işə düşəndə data qovluğu yaranmırdı.

**`server.js` — sətir 593 (`PUT /api/leads/:id/reply`)**
- Əvvəl:  `const noteVal = lead.note || lead.message || '';`
- Sonra:  `const noteVal = lead.note || '';`
- Səbəb:  `leads` cədvəlində `message` sütunu mövcud deyil. `lead.message`
  həmişə `undefined` qaytarırdı — gərəksiz və yanıltıcı kod idi.

**`src/types.ts` — `Lead` interfeysi**
- Əvvəl:  `eventDate: string` (required, yalnız camelCase)
- Sonra:  `eventDate?: string` və `event_date?: string` (hər ikisi optional)
- Səbəb:  Backend həmişə `event_date` (snake_case) göndərir. Frontend-də
  `eventDate` həmişə `undefined` idi, tarix heç vaxt göstərilmirdi.
  `user_id?: string` də əlavə edildi.

**`src/sections/admin/LeadsTab.tsx` — sətir 164 (cədvəl sütunu)**
- Əvvəl:  `lead.eventDate ? format(new Date(lead.eventDate), ...) : '—'`
- Sonra:  `(lead.event_date || lead.eventDate)` — hər ikisini yoxlayır,
  try/catch ilə crash qorunması əlavə edildi.
- Səbəb:  `lead.eventDate` həmişə undefined idi → cədvəldə tarix heç
  vaxt görünmürdü.

**`src/sections/admin/LeadsTab.tsx` — sətir 239 (modal içi tarix)**
- Eyni düzəltmə — modal içindəki tarix göstərimi üçün də tətbiq edildi.

---

### 🟡 Validation Düzəltmələri

**`server.js` — `POST /api/orders` (sətir 398-399)**
- Əvvəl:  `if (!name || !phone) return res.status(400)...`
- Sonra:  `!String(name).trim()` və `!String(phone).trim()` ilə ayrı yoxlama
- Səbəb:  Boşluqlardan ibarət string (`"   "`) keçə bilirdi. Ayrı
  xəta mesajları daha aydın istifadəçi cavabı verir.

**`server.js` — `POST /api/leads` (sətir 540-541)**
- Əvvəl:  Yalnız `name` yoxlanılırdı, `phone` yoxlanılmırdı.
- Sonra:  `name` VƏ `phone` hər ikisi `.trim()` ilə yoxlanılır.
- Səbəb:  Telefonsuz müraciət DB-yə girirdi, admin sonra müştəriyə
  çata bilmirdi.

**`src/sections/contact/ContactForm.tsx`**
- Əvvəl:  `!formData.name || !formData.phone || ...` (trim yox)
- Sonra:  Bütün sahələr `.trim()` ilə yoxlanılır.
- Əlavə:  Email format validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Səbəb:  Boşluqlarla dolu sahə göndərilə bilirdi. Yanlış email
  formatı backend-ə çatırdı.

**`src/pages/Cart.tsx`**
- Əlavə:  `name.trim()` və `phone.trim()` üçün frontend validation.
- Səbəb:  Cart formasında heç bir frontend yoxlaması yox idi,
  boş sifariş göndərmək mümkün idi.

---

## [26.09.2026] — Email Sistemi & Lead Reply (Əvvəlki Sessiya)

### ✅ Yeni Xüsusiyyətlər

**`server.js` — `POST /api/leads` — Admin Bildiriş Emaili**
- Yeni müraciət gəldikdə `smtp_config.notify_to` adresinə stilizə
  edilmiş HTML email göndərilir.
- Email müştəri adı, telefon, email, tarix, məkan, mesaj məlumatlarını
  ehtiva edir.
- SMTP konfigurasiya edilməmişsə sessiz keçir (server cavabı bloklamır).

**`server.js` — `PUT /api/leads/:id/reply` — Müştəriyə Cavab**
- Yeni endpoint: admin paneldən müştərinin emailinə birbaşa cavab göndərmək.
- Request body: `{ "reply": "Cavab mətni..." }`
- Leadin emaili yoxdursa `400` qaytarır.
- SMTP işləmirsə `500` qaytarır (açıq xəta mesajı ilə).
- Email template: müştərinin orijinal müraciəti + admin cavabı.

**`src/sections/admin/LeadsTab.tsx` — Reply UI**
- Modal içinə "Email ilə Cavab Yaz" bölməsi əlavə edildi.
- Müştərinin emaili yoxdursa textarea deaktiv olur, izahat göstərilir.
- Göndərmə zamanı "Göndərilir..." spinner göstərilir.
- Uğurlu göndərişdən sonra textarea avtomatik sıfırlanır.
- Toast notification ilə uğur/xəta məlumatı verilir.

---

## [Əvvəlki Sessiya] — ServicesShowcase UI Fix

**`src/sections/services/ServicesShowcase.tsx`**
- Progress bar digər UI elementlərlə üst-üstə düşürdü.
- Həll: Pagination container-ə `pb-8` padding əlavə edildi.
- Progress bar ayrıca DOM layerə (`z-40`) köçürüldü.
- Sadə CSS layering ilə həll edildi — böyük struktur dəyişikliyi olmadan.

---

## [Əvvəlki Sessiya] — Docker & Infrastructure Fixes

**`Dockerfile.backend` / `Dockerfile.frontend`**
- `node:20-alpine` → `node:22-alpine`
- `python3 make g++ sqlite-dev` bağımlılıqları əlavə edildi.
- Səbəb: `better-sqlite3` native build xətası.

**`server.js` — JSON Parse Error Middleware**
- `express.json()` xətalı payload-da container crash edirdi (exit 139).
- try/catch wrapper əlavə edildi → `400 Bad Request` qaytarır.

**`server.js` — dotenv**
- ES Modules formatında ikiqat import xəbərdarlığı aradan qaldırıldı.
- try/catch ilə təhlükəsiz import.

**`docker-compose.yml`**
- Traefik / Octoport / Portainer üçün `octobot-net` network tanımları əlavə edildi.

---

## Dəyişdirilmiş Faylların Tam Siyahısı

```
server.js
src/types.ts
src/pages/Cart.tsx
src/sections/contact/ContactForm.tsx
src/sections/admin/LeadsTab.tsx
src/sections/services/ServicesShowcase.tsx
Dockerfile.backend
Dockerfile.frontend
docker-compose.yml
README.md
CLAUDE.md
CHANGELOG.md             ← bu fayl
ADMIN_PANEL_REHBERI.txt  ← yeni
```