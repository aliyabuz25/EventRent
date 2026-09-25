# Eventrent.az

Vite + React + TypeScript + Tailwind CSS ile inşa edilmiş çok sayfalı premium etkinlik çözümleri sitesi.

## Teknoloji Yığını

- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS
- **Animasyon:** GSAP + ScrollTrigger
- **Backend/DB:** Express.js, SQLite (better-sqlite3)
- **Deployment:** Docker, Nginx, Portainer, Traefik

## Geliştirme Ortamı

```bash
npm install
npm run dev        # http://localhost:5050
```

## Build

```bash
npm run build
```

## Port

Bu proje Frontend tarafında **5050** portunda, Backend API tarafında ise **4320** portunda çalışır.

---

### 🔥 `fixed-branch` - Neler Düzeltildi?

Bu dal (branch) üzerinde uygulamanın sunucu tarafında (Docker ve Backend) çökmesine neden olan kritik hatalar ve uyumsuzluklar çözülmüştür:

1. **JSON Parse Hatasının Giderilmesi (Backend Çökme Sorunu)**
   - Express uygulamasında `app.use(express.json())` metoduna gönderilen hatalı veya boş payload'lar `SyntaxError: Expected property name or '}' in JSON` hatasına neden olup container'ın 139 koduyla kapanmasına ve sürekli restart atmasına (Crash loop) neden oluyordu.
   - Bu durum `try-catch` benzeri bir error middleware ile sarmalanarak yakalandı. Artık hatalı bir payload geldiğinde sistem çökmek yerine `400 Bad Request` yanıtı dönüyor.

2. **Node.js Sürüm Uyumsuzluğu ve `better-sqlite3` Build Hatası**
   - Eski Docker imajında kullanılan `node:20-alpine` (veya slim) sürümü, güncel `better-sqlite3` 13.x modülünün yüklenmesi sırasında Python ve node-gyp aracılığıyla native derleme hatalarına neden oluyordu.
   - Her iki `Dockerfile` (frontend ve backend) içerisindeki `node:20` tanımı `node:22-alpine` ile değiştirildi.
   - Gerekli olan `python3 make g++ sqlite-dev` bağımlılıkları build aşamasına eklenerek SQLite veritabanı sürücüsünün hatasız derlenmesi sağlandı.

3. **`dotenv` Çift Import (Warning) Hatası**
   - Express backend dosyasında (`server.js`) ES Modules formatında olan `dotenv` çağırma mantığı güncellenerek güvenli hale getirildi. 

4. **Traefik Network Bağlantıları (Docker Compose)**
   - Yeni Traefik altyapısına (Octoport / Portainer) uygun olacak şekilde `octobot-net` adındaki Edge Network bağlantı tanımları (Traefik labels) `docker-compose.yml` (ve ilgili runbook'lar) içerisine düzenlendi.
