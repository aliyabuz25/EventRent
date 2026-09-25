# EVENTRENT.AZ — DETALLI TEXNİKİ PLAN

> **Status:** Müştəri onayı gözlənilir
> **Tarix:** 2026-09-08
> **Branch:** `musteri-deyisiklikleri`
> **Tag:** `v1-musteri-onayi-oncesi`

Bu sənəd, müştəri onayından sonra həyata keçiriləcək texniki dəyişikliklərin fayl-səviyyəli detallı planıdır. Müştəri onayı üçün sadələşdirilmiş versiya `docx/Eventrent_Deyisiklik_Plani.docx` faylındadır.

---

## 📊 ÜMUMİ STATİSTİKA

- **Dəyişiklik maddələri:** 12
- **Təsir olunan fayllar:** ~50
- **Yeni fayllar:** ~6
- **Texnologiya:** Vite + React 19 + TypeScript + Tailwind CSS v4 + GSAP + Firebase + Motion

---

## 1️⃣ ANA SƏHİFƏ YENİDEN YAPILANDIRMA

### 1.1 Home.tsx — Section Sıralaması

**Fayl:** `src/pages/Home.tsx`

**Mevcut sıralama:**
```
HomeHero → HomeVisionMissionCompact → HomeCapabilities → ServicesShowcase → HomeClients → HomeFeaturedSetups → HomeFinalCTA
```

**Yeni sıralama:**
```
HomeHero → HomeVisionMissionCompact → HomeTeam (YENİ) → HomeCapabilities → ServicesShowcase (resim) → HomeClients → HomeFeaturedSetups → HomeFinalCTA
```

**Aksiyonlar:**
- `HomeEventTypes` import və render-i tamamen kaldırılacak
- Yeni `HomeTeam` section'ı import və render'e eklenecek (Vision/Missiya'dan sonra)
- `ServicesShowcase` korunacak ama içeriği değişecek (bölüm 7)

### 1.2 HomeEventTypes Deaktivasyonu

**Fayllar:**
- `src/pages/Home.tsx` — `<HomeEventTypes />` kaldır
- `src/pages/Services.tsx` — `<HomeEventTypes />` kaldır

**Qeyd:** `src/sections/home/HomeEventTypes.tsx` dosyası silinmeyecek, sadece render'dan kaldırılacak. Route ve component korunacak (geri alma ihtimali için).

### 1.3 Yeni: HomeTeam.tsx (Komanda Bölümü)

**Yeni fayl:** `src/sections/home/HomeTeam.tsx`

**İçerik:**
- 7 komanda üzvü (KONTENT'ten)
- Sağdan sola yatay slayt animasyonu (GSAP ScrollTrigger + pin)
- Her kart: fotoğraf (Unsplash portre placeholder), ad, rol, açıqlama

**Veri kaynağı:** `content.default.ts` → `home.team.members` (yeni field)

**GSAP animasyonu:**
```ts
// Mevcut HomeCapabilities.tsx'teki pin+scrub pattern referans alınacak
gsap.to(sectionRef.current, {
  x: () => `-${(totalSlides - 1) * 100}vw`,
  scrollTrigger: { trigger: triggerRef, pin: true, scrub: 1, snap: ... }
});
```

**Komanda üzvləri:**
1. Pərvin Qasımov — Həmtəsisçi / Direktor
2. Qalib Kazımlı — Həmtəsisçi / İcraçı Direktor
3. Malik Bağırov — Kreativ Direktor
4. Aysel Şirinova — Satış şöbəsinin müdiri
5. Yasin Əhmədov — Layihə meneceri
6. Nərmin Tarverdiyeva — Dizayner
7. Aysu Məmmədova — Ofis menecer

**Fotoğraflar:** Unsplash portre placeholder (her kişi için ayrı seed)

### 1.4 HomeClients.tsx — Müştəri Siyahısı Güncelleme

**Fayl:** `src/sections/home/HomeClients.tsx`

**Mevcut `LOGOS` array:** 9 marka (ABB, SOCAR, Kapital, AzərGold, Bakcell, Nar, Silk Way, Atlas, İpoteka)

**Yeni `LOGOS` array:** 23 marka (KONTENT'ten)
- Heydər Əliyev Fondu, Azərbaycan Turizm Agentliyi, Rusiya Səfirliyi, İçərişəhər Qoruğu, Güləş/Badminton/Cüdo Federasiyaları, Abşeron Ticarət Mərkəzi, Mərkəzi Bank, Paşa Sığorta, Azal, Tabaterra, Paşa Kapital, Azərsun, Bazarstore, Norm Sement, Avropa İttifaqı, Q STP, BDU, Odlar Yurdu, Azərxalça, Paşa Mall, SOCAR

**Aksiyon:**
- `LOGOS` array'i güncellenecek
- `public/logos/` klasörüne gerçek logolar eklenecek (şimdilik text fallback)
- Devamı: `content.default.ts`'e `home.clients` field eklenecek (admin'den düzenlenebilir)

---

## 2️⃣ HERO/COVER FOTOĞRAF KALDIRMA

### 2.1 Etkilenen Hero Dosyaları (13 fayl)

Tüm hero'lar cover fotoğrafı kaldırılıp minimalist hero'ya çevrilecek:

| # | Dosya | Mevcut | Yeni |
|---|-------|--------|------|
| 1 | `src/sections/about/AboutHero.tsx` | Cover foto + parallax | Gradient + badge + başlık |
| 2 | `src/sections/catering/CateringHero.tsx` | Cover foto | Gradient + badge + başlık |
| 3 | `src/sections/contact/ContactHero.tsx` | Cover foto | Gradient + badge + başlık |
| 4 | `src/sections/gallery/GalleryHero.tsx` | Cover foto | Gradient + badge + başlık |
| 5 | `src/sections/portfolio/PortfolioHero.tsx` | Cover foto | Gradient + badge + başlık |
| 6 | `src/sections/tv/TVHero.tsx` | Cover foto | Gradient + badge + başlık |
| 7 | `src/sections/teambuilding/TeambuildingHero.tsx` | Cover foto | Gradient + badge + başlık |
| 8 | `src/sections/catalog/CatalogHero.tsx` | Cover foto + rounded | Gradient + badge + başlık |
| 9 | `src/pages/Catering.tsx` | Inline hero | Minimalist hero |
| 10 | `src/pages/Portfolio.tsx` | Inline hero | Minimalist hero |
| 11 | `src/pages/Catalog.tsx` | Inline hero | Minimalist hero |
| 12 | `src/pages/Teambuilding.tsx` | Inline hero | Minimalist hero |
| 13 | `src/pages/ServiceDetail.tsx` | Hero section | Minimalist hero |

### 2.2 Minimalist Hero Pattern

**Yeni hero tasarımı (tüm sayfalarda ortak):**
```tsx
<section className="relative pt-32 pb-16 bg-gradient-to-b from-brand-bg via-brand-bg to-brand-card overflow-hidden">
  {/* Nazik ambient glow */}
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
    <div className="absolute top-0 left-1/4 w-[40vw] h-[50%]"
      style={{ background: 'radial-gradient(ellipse, rgba(227,6,19,0.06) 0%, transparent 70%)' }} />
  </div>

  <div className="relative max-w-7xl mx-auto px-6 md:px-12">
    {/* Badge */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-5 h-px bg-premium-orange" />
      <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">
        {badge}
      </span>
    </div>

    {/* Başlıq */}
    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
      {titleLine1}<br />
      <span className="text-white/50 italic">{titleLine2}</span>
    </h1>

    {/* Alt başlıq */}
    <p className="text-lg text-white/70 max-w-2xl mt-6 font-light">
      {subtitle}
    </p>
  </div>
</section>
```

### 2.3 İstisna: HomeHero.tsx

**Fayl:** `src/sections/home/HomeHero.tsx`

- Video arka plan **korunacak** (sadece ana sayfa hero'su özel)
- Sadece yazı renkleri kontrast düzeltmesi yapılacak

### 2.4 Haqqımızda Hero-su (Özel)

**Fayl:** `src/sections/about/AboutHero.tsx`

- Badge: "Bizim Hekayəmiz"
- Başlıq: "Keyfiyyət. Təcrübə."
- Alt başlıq: "Tədbiriniz üçün hər şey — Operativlik və Bol çeşidin vəhdəti."
- Cover fotoğraf ve parallax tamamen kaldırılacak
- Tünd gradient arka plan

---

## 3️⃣ YAZI RƏNGLƏRİ KONTRAST DÜZELTMƏSİ

### 3.1 Global Renk Eşlemesi

| Mevcut | Yeni | Kullanım |
|--------|------|----------|
| `text-white/30` | `text-white/60` | Metadata, eyebrow, küçük etiketler |
| `text-white/40` | `text-white/70` | Açıklama metinleri, alt başlıklar |
| `text-white/20` | `text-white/50` | İtalik vurgular, dekoratif |
| `text-white/25` | `text-white/55` | Az kullanılan, ara değer |
| `text-white/35` | `text-white/65` | Az kullanılan, ara değer |
| `text-white/15` | `text-white/45` | Çok dekoratif |
| `text-white/10` | `text-white/40` | Çok dekoratif |

### 3.2 Etkilenen Dosyalar (~20 fayl)

Tüm section dosyaları taranacak. Öncelikli dosyalar:

**Home sections:**
- `HomeVisionMissionCompact.tsx` — `text-white/50` → `text-white/75`, `text-white/30` → `text-white/60`
- `HomeCapabilities.tsx` — `text-white/30/90` (hatalı class), `text-white/30` → düzelt
- `HomeClients.tsx` — `text-white/20`, `text-white/30` → düzelt
- `HomeFeaturedSetups.tsx` — `text-white/30/85`, `text-white/30/90` (hatalı class)
- `HomeFinalCTA.tsx` — `text-white/40` → `text-white/70`
- `HomeEventTypes.tsx` — `text-white/30/85`, `text-white/30/90` (hatalı class)
- `HomeMetrics.tsx` — `text-white/40` → `text-white/70`

**About sections:**
- `AboutPartnerIntro.tsx` — `text-white/30` → `text-white/60`
- `AboutApproach.tsx` — `text-white/30` → `text-white/60`
- `AboutVisionMission.tsx` — `text-white/50` → `text-white/75`, `text-white/35` → `text-white/65`
- `AboutBento.tsx` — `text-white/30` → `text-white/60`
- `AboutTeam.tsx` — `text-white/30` → `text-white/60`
- `AboutValues.tsx` — `text-white/30` → `text-white/60`

**Services sections:**
- `ServicesShowcase.tsx` — `text-white/30`, `text-white/50` → düzelt
- `ServicesGrid.tsx` — `text-white/30` → `text-white/60`
- `ServicesProcess.tsx` — `text-white/30/90` (hatalı), `text-white/40` → düzelt
- `ServicesCatalogGateway.tsx` — `text-white/40` → `text-white/70`

**Diğer:**
- `CateringContent.tsx` — `text-white/40`, `text-white/50` → düzelt
- `ContactCTA.tsx` — `text-white/20`, `text-white/30` → düzelt
- `PortfolioGrid.tsx` — `text-white/40`, `text-white/70` → düzelt
- `GalleryGrid.tsx` — `text-white/40` → düzelt

### 3.3 Hatalı Class Düzeltmeleri

Mevcut kodda hatalı Tailwind class'ları var (Tailwind v4'te desteklenmiyor):
- `text-white/30/90` → `text-white/70` (iki kez opacity verilemez)
- `text-white/30/85` → `text-white/65`

Bunlar da düzeltilecek.

---

## 4️⃣ SERVICES SHOWCASE — VİDEO → RESİM/İKON

### 4.1 ServicesShowcase.tsx Yeniden Yazım

**Fayl:** `src/sections/services/ServicesShowcase.tsx`

**Mevcut:** Scroll-driven video (`/videos/services-bg.mp4`) + sticky text panel + scroll pozisyonuna göre video currentTime kontrolü

**Yeni:** Scroll-driven resim geçişleri + ikon kart sistemi

**Değişiklikler:**
- `<video>` elementi tamamen kaldırılacak
- Yerine her servis için ayrı resim (zaten `content.default.ts` → `home.capabilities.items`'ta resim var)
- Scroll pozisyonuna göre resim crossfade/geçiş
- İkon + başlık + açıklama + tag'ler korunacak
- Step dots ve progress bar korunacak

**Yeni yapı (konsept):**
```tsx
// Video əvəzinə resim stack
<div className="hidden md:block relative flex-1">
  {SERVICES.map((svc, i) => (
    <div
      key={svc.num}
      className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity: i === activeIdx ? 1 : 0 }}
    >
      <img src={svc.image} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/40 to-transparent" />
    </div>
  ))}
</div>
```

**Veri kaynağı:** `content.default.ts` → `home.capabilities.items` (zaten 4 item: led, sound, stage, lighting)

**Qeyd:** `public/videos/services-bg.mp4` dosyası silinmeyecek (geri alma ihtimali için).

---

## 5️⃣ CATERING SİPARİŞ FORMU

### 5.1 CateringContent.tsx'e Form Ekleme

**Fayl:** `src/sections/catering/CateringContent.tsx`

**Mevcut:** 2 sütun (sol: badge + açıqlama + menu kartları, sağ: başlıq + şəkillər)

**Yeni:** 3 sütun veya alt bölüm olarak form eklenecek

**Form alanları (KONTENT'ten):**
```tsx
const [formData, setFormData] = useState({
  location: '',        // Məkan* (məcburi)
  date: '',            // Tarix* (məcburi)
  timeRange: '',       // Saat aralığı* (məcburi)
  eventFormat: '',     // Tədbirin formatı* (məcburi)
  menuRequest: '',     // Menyu tərkibi (ixtiyari)
});
```

**Form JSX:**
- Məkan: `<input type="text" required>`
- Tarix: `<input type="date" required>`
- Saat aralığı: `<input type="text" placeholder="məs: 18:00 - 23:00" required>`
- Tədbirin formatı: `<textarea required>`
- Menyu tərkibi: `<textarea>` (ixtiyari)
- "Sifariş Yarat" düyməsi

### 5.2 Sepete Ekleme Akışı

**Fayl:** `src/sections/catering/CateringContent.tsx`

**handleOrder fonksiyonu:**
```tsx
const handleOrder = () => {
  // Validasyon
  if (!formData.location || !formData.date || !formData.timeRange || !formData.eventFormat) {
    setError('Məcburi sahələri doldurun');
    return;
  }

  // Sepete ekle (teambuilding akışına benzer)
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push({
    id: `catering-${Date.now()}`,
    name: 'Ketrinq Sifarişi',
    price: 0,
    quantity: 1,
    type: 'catering',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600',
    technicalAnswers: {
      'Məkan': formData.location,
      'Tarix': formData.date,
      'Saat aralığı': formData.timeRange,
      'Tədbirin formatı': formData.eventFormat,
      'Menyu tərkibi': formData.menuRequest || '—',
    }
  });
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('storage'));

  // Səbət səhifəsinə yönləndir
  navigate('/cart');
};
```

### 5.3 Cart.tsx — Catering Handling

**Fayl:** `src/pages/Cart.tsx`

**Mevcut `cartItems` useMemo'da `type === 'teambuilding'` handling var.**

**Yeni:** `type === 'catering'` handling eklenecek (teambuilding'e benzer):
```tsx
if (item.type === 'catering') {
  return {
    ...item,
    product: {
      id: item.id,
      name: item.name,
      category: 'Ketrinq',
      images: [item.image],
      description: ''
    }
  };
}
```

---

## 6️⃣ PORTFOLIO — REELS FORMATI

### 6.1 PortfolioGrid.tsx Yeniden Yazım

**Fayl:** `src/sections/portfolio/PortfolioGrid.tsx`

**Mevcut:** YouTube iframe + 9:16 kartlar (6 proje)

**Yeni:** Reels formatı (9:16 dikey video kartları)

**Değişiklikler:**
- `videoId` (YouTube ID) yerine `videoUrl` (mp4 dosya yolu)
- Her etkinlik için kendi videosu
- Hover'da video autoplay (muted, loop, playsInline)
- Tıklayınca tam ekran reels görüntüleyici (modal)

**Yeni `PROJECTS` array:**
```tsx
const PROJECTS: Project[] = [
  {
    title: 'Beynəlxalq Enerji Forumu',
    client: 'Energetika Nazirliyi',
    date: 'İyun 2023',
    location: 'Bakı Konqres Mərkəzi',
    videoUrl: '/videos/portfolio/forum.mp4',  // Yeni: mp4 yolu
    category: 'Konfrans',
  },
  // ... diğer projeler
];
```

**Kart yapısı:**
```tsx
<div className="relative aspect-[9/16] rounded-[40px] overflow-hidden">
  <video
    src={project.videoUrl}
    muted
    loop
    playsInline
    autoPlay={isHovered}  // hover'da oynar
    className="w-full h-full object-cover"
  />
  {/* Overlay bilgiler */}
</div>
```

### 6.2 Reels Görüntüleyici (Modal)

**Yeni:** PortfolioGrid.tsx içinde modal eklenecek
- Tıklayınca tam ekran video görüntüleyici
- Sol/sağ navigasyon (önceki/sonraki proje)
- Kapat düymesi

### 6.3 Video Dosyaları

**Klasör:** `public/videos/portfolio/`

Müştəri henüz videoları vermedi. Şimdilik placeholder:
- Mevcut `public/videos/service1.mp4`, `service2.mp4`, `service3.mp4` geçici olarak kullanılabilir
- Sonra gerçek reels videoları eklenecek

### 6.4 Portfolio ve Galeri Ayrı Kalır

- **Portfolio** = etkinlik video vitrini (reels) — `src/pages/Portfolio.tsx`
- **Galeri** = statik foto arşiv — `src/pages/Gallery.tsx`

İkisi de nav'da görünür (mevcut haliyle).

---

## 7️⃣ EVENTGARDEN SAYFASI (YENİ)

### 7.1 Yeni Dosyalar

**Yeni sayfa:**
- `src/pages/Eventgarden.tsx`

**Yeni section'lar:**
- `src/sections/eventgarden/EventgardenHero.tsx` (minimalist hero)
- `src/sections/eventgarden/EventgardenContent.tsx` (bahçe/açık hava konsepti)
- `src/sections/eventgarden/EventgardenGallery.tsx` (açık hava fotoğrafları)

### 7.2 Eventgarden.tsx Yapısı

```tsx
import EventgardenHero from '../sections/eventgarden/EventgardenHero';
import EventgardenContent from '../sections/eventgarden/EventgardenContent';
import EventgardenGallery from '../sections/eventgarden/EventgardenGallery';

export default function Eventgarden() {
  return (
    <div className="pb-20">
      <EventgardenHero />
      <EventgardenContent />
      <EventgardenGallery />
    </div>
  );
}
```

### 7.3 EventgardenContent.tsx Konsepti

- Bahçe/açık hava etkinlikleri için özel bölüm
- Çadır, dekor, işıqlandırma, səs sistemleri showcase
- Mevcut `CateringContent.tsx` pattern'ine benzer 2 sütunlu yapı
- CTA → `/catering` veya `/contact`'a yönlendirme

### 7.4 Route Ekleme

**Fayl:** `src/routes/appRoutes.tsx`

**Eklenecek:**
```tsx
const Eventgarden = lazy(() => import('../pages/Eventgarden'));
// ...
{ path: '/eventgarden', element: <Eventgarden /> },
```

### 7.5 Nav'a Ekleme

**Fayl:** `src/config/navConfig.ts`

**Eklenecek:**
```tsx
{ path: '/eventgarden', name: { az: 'Eventgarden', en: 'Eventgarden', ru: 'Eventgarden', tr: 'Eventgarden' } },
```

### 7.6 TV Sayfasını Gizleme

**Fayl:** `src/config/navConfig.ts`

**Mevcut:** `{ path: '/tv', ..., hiddenByDefault: true }` ✅ (zaten gizli)

**Aksiyon:** Değişiklik yok — TV zaten `hiddenByDefault: true`. Route korunuyor (`/tv` hala çalışıyor).

---

## 8️⃣ İÇERİK SİSTEMİ GÜNCELLEMELERİ

### 8.1 types.ts — Yeni Interface'ler

**Fayl:** `src/types.ts`

**Eklenecek:**
```ts
export interface HomeTeamMember {
  name: LocalizedText;
  role: LocalizedText;
  description: LocalizedText;
  image: string;
}

export interface HomeTeamSection {
  badge: LocalizedText;
  title: LocalizedText;
  titleAccent: LocalizedText;
  members: HomeTeamMember[];
}

export interface HomeClientsSection {
  badge: LocalizedText;
  title: LocalizedText;
  clients: { name: string; logo: string | null; url: string }[];
}

// SiteContent.home'a eklenecek:
// team: HomeTeamSection;
// clients: HomeClientsSection;
```

### 8.2 content.default.ts — Yeni İçerik

**Fayl:** `src/content.default.ts`

**Eklenecek:**
- `home.team` section'ı (7 üye, 4 dilde)
- `home.clients` section'ı (23 marka)

**Komanda məlumatları (az/en/ru/tr):**
Her üye için: name, role, description, image (Unsplash portre)

**Müştəri siyahısı:**
23 marka, her biri için: name, logo (null = text fallback), url

### 8.3 data/site-content.json — Senkronizasyon

**Fayl:** `data/site-content.json`

- `content.default.ts`'teki değişiklikler JSON'a yansıtılacak
- Admin panelinden düzenlenebilir kalacak
- `ContentStudio.tsx` zaten `home` section'larını düzenleyebiliyor — yeni `team` ve `clients` field'ları için tab eklenebilir (opsiyonel)

---

## 📂 DOSYA DEĞİŞİKLİK ÖZETİ

### Yeni Dosyalar (6)
1. `src/sections/home/HomeTeam.tsx`
2. `src/pages/Eventgarden.tsx`
3. `src/sections/eventgarden/EventgardenHero.tsx`
4. `src/sections/eventgarden/EventgardenContent.tsx`
5. `src/sections/eventgarden/EventgardenGallery.tsx`
6. `public/videos/portfolio/` (klasör + placeholder videolar)

### Düzenlenecek Dosyalar (~44)

**Ana sayfa (4):**
- `src/pages/Home.tsx`
- `src/pages/Services.tsx`
- `src/sections/home/HomeClients.tsx`
- `src/sections/home/HomeTeam.tsx` (yeni)

**Hero'lar (13):**
- `src/sections/about/AboutHero.tsx`
- `src/sections/catering/CateringHero.tsx`
- `src/sections/contact/ContactHero.tsx`
- `src/sections/gallery/GalleryHero.tsx`
- `src/sections/portfolio/PortfolioHero.tsx`
- `src/sections/tv/TVHero.tsx`
- `src/sections/teambuilding/TeambuildingHero.tsx`
- `src/sections/catalog/CatalogHero.tsx`
- `src/pages/Catering.tsx`
- `src/pages/Portfolio.tsx`
- `src/pages/Catalog.tsx`
- `src/pages/Teambuilding.tsx`
- `src/pages/ServiceDetail.tsx`

**Kontrast (~20):**
- Tüm home/*, about/*, services/*, catering/*, contact/*, portfolio/*, gallery/* section'ları

**Services (1):**
- `src/sections/services/ServicesShowcase.tsx`

**Catering (2):**
- `src/sections/catering/CateringContent.tsx`
- `src/pages/Cart.tsx`

**Portfolio (1):**
- `src/sections/portfolio/PortfolioGrid.tsx`

**Eventgarden (3 yeni):**
- `src/pages/Eventgarden.tsx`
- `src/sections/eventgarden/*.tsx` (3 dosya)

**Nav/Routes (2):**
- `src/routes/appRoutes.tsx`
- `src/config/navConfig.ts`

**İçerik (3):**
- `src/types.ts`
- `src/content.default.ts`
- `data/site-content.json`

---

## ⚠️ RİSKLER VE NOTLAR

1. **Reels videoları:** Müştəri hələ videoları təqdim etməyib. Müvəqqəti placeholder videolar (`public/videos/service*.mp4`) istifadə olunur.

2. **Komanda fotoğrafları:** Unsplash portre placeholder istifadə olunur. Müştəri real fotoğrafları sonra admin panelindən yükləyə bilər.

3. **Müştəri logoları:** `public/logos/` qovluğuna real logolar əlavə olunmalıdır. Hələlik mətn fallback istifadə olunur.

4. **Eventgarden məzmunu:** Müştəri detallı məzmun verməyib. Bağça/açıq hava etkinlik konsepti əsasında hazırlanır.

5. **"Deaktiv" şərhi:** Tədbir növləri bölməsi olaraq netləşdirildi (HomeEventTypes), lakin müştəri ilə təsdiqlənməlidir.

6. **Hatalı Tailwind class'ları:** `text-white/30/90` gibi iki kez opacity veren class'lar Tailwind v4'te çalışmıyor — bunlar da düzeltilecek.

7. **HomeEventTypes silinmiyor:** Sadece render'dan kaldırılıyor. Geri alma ihtimali için dosya korunuyor.

8. **services-bg.mp4 silinmiyor:** Sadece ServicesShowcase'ten kaldırılıyor. Geri alma ihtimali için dosya korunuyor.

---

## 🎯 UYGULAMA SIRASI (ÖNERİLEN)

Müştəri onayından sonra şu sırada yapılması önerilir:

1. **İçerik altyapısı** — `types.ts`, `content.default.ts`, `data/site-content.json` (önce veri, sonra UI)
2. **Kontrast düzeltmesi** — Global renk düzeltmeleri (hızlı kazanım)
3. **Hero kaldırma** — 13 hero dosyası (pattern oturunca hızlı)
4. **Ana sayfa yeniden yapılandırma** — Home.tsx, HomeTeam, HomeClients
5. **ServicesShowcase** — Video → resim
6. **Catering formu** — Form + Cart handling
7. **Portfolio reels** — Video formatı değişimi
8. **Eventgarden** — Yeni sayfa + route + nav
9. **Test ve kontrol** — Tüm sayfaları gez, kontrast kontrol et, responsive kontrol

---

*— Texniki plan sonu —*
