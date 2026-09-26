# Eventrent.az

Vite + React + TypeScript + Tailwind CSS ilə inşa edilmiş çoxsəhifəli premium tədbir həlləri saytı.

## Texnologiya Yığını

- **Frontend:** Vite 5, React 18, TypeScript, Tailwind CSS
- **Animasiya:** GSAP + ScrollTrigger
- **Backend/DB:** Express.js, SQLite (better-sqlite3), JWT auth
- **Email:** Nodemailer (SMTP)
- **Deployment:** Docker, Nginx, Portainer, Traefik

## Portlar

| Servis | Port |
|--------|------|
| Frontend (Vite dev) | 5050 |
| Backend API | 4320 |

## İnkişaf Mühiti

```bash
npm install
npm run dev        # http://localhost:5050
```

## Build

```bash
npm run build      # dist/ qovluğuna yazılır
```

## API Endpointləri

### Auth
| Method | URL | Auth | Açıqlama |
|--------|-----|------|----------|
| POST | `/api/auth/login` | — | Email + password ilə giriş |
| GET | `/api/auth/me` | Bearer | Cari istifadəçi |

### Leads
| Method | URL | Auth | Açıqlama |
|--------|-----|------|----------|
| GET | `/api/leads` | Bearer | Siyahı |
| POST | `/api/leads` | — | Yeni müraciət (Contact Form) |
| PUT | `/api/leads/:id/reply` | Bearer | Müştəriyə email cavab |
| PATCH | `/api/leads/:id/status` | Bearer | Status dəyiş |
| DELETE | `/api/leads/:id` | Bearer+Admin | Sil |

### Orders
| Method | URL | Auth | Açıqlama |
|--------|-----|------|----------|
| GET | `/api/orders` | Bearer | Siyahı |
| POST | `/api/orders` | — | Yeni sifariş (Cart) |
| PUT | `/api/orders/:id` | Bearer | Yenilə |
| PATCH | `/api/orders/:id/status` | Bearer | Status + email |
| DELETE | `/api/orders/:id` | Bearer | Sil |
| POST | `/api/orders/:id/send-email` | Bearer | Email yenidən göndər |

### SMTP
| Method | URL | Auth | Açıqlama |
|--------|-----|------|----------|
| GET | `/api/smtp` | Bearer+Admin | Konfiqurasiya |
| PUT | `/api/smtp` | Bearer+Admin | Saxla və test et |
| POST | `/api/smtp/test` | Bearer+Admin | Test email |

### Products, Users, Teambuilding, Media
Tam siyahı üçün `CHANGELOG.md` → "API Referansı" bölməsinə baxın.

## Verilənlər Bazası Cədvəlləri

```
users · leads · orders · products · smtp_config · support_tickets · tb_games · tb_concepts
```

## Email Axını

```
Müştəri → Contact Form → POST /api/leads → Admin-ə bildiriş (notify_to)
Admin   → Leads Tab    → PUT /api/leads/:id/reply → Müştəriyə cavab (lead.email)
Müştəri → Cart         → POST /api/orders → Admin-ə bildiriş (notify_to)
```

## Deployment

```bash
docker-compose up -d
# və ya Portainer üzərindən stack.portainer.yml
```

---

Bütün dəyişikliklərin tam tarixçəsi üçün → `CHANGELOG.md`
