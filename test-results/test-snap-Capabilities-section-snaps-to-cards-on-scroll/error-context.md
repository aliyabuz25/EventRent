# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-snap.spec.ts >> Capabilities section snaps to cards on scroll
- Location: test-snap.spec.ts:3:1

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 10
Received:    245
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - navigation [ref=e5]:
    - generic [ref=e6]:
      - link "Ana səhifəyə keç" [ref=e7] [cursor=pointer]:
        - /url: /
        - generic [ref=e9]: E
        - generic [ref=e10]:
          - generic [ref=e11]: Eventrent
          - generic [ref=e12]: Azerbaijan
      - generic [ref=e13]:
        - link "Ana səhifə" [ref=e14] [cursor=pointer]:
          - /url: /
          - text: Ana səhifə
        - link "Xidmətlər" [ref=e16] [cursor=pointer]:
          - /url: /services
          - text: Xidmətlər
        - link "Kataloq" [ref=e17] [cursor=pointer]:
          - /url: /catalog
          - text: Kataloq
        - link "Portfolio" [ref=e18] [cursor=pointer]:
          - /url: /portfolio
          - text: Portfolio
        - link "Haqqımızda" [ref=e19] [cursor=pointer]:
          - /url: /about
          - text: Haqqımızda
        - link "Əlaqə" [ref=e20] [cursor=pointer]:
          - /url: /contact
          - text: Əlaqə
      - generic [ref=e21]:
        - generic [ref=e22]:
          - 'button "Dili dəyiş: AZ" [pressed] [ref=e23]': az
          - 'button "Dili dəyiş: EN" [ref=e24]': en
          - 'button "Dili dəyiş: RU" [ref=e25]': ru
          - 'button "Dili dəyiş: TR" [ref=e26]': tr
        - link "Səbətə keç" [ref=e27] [cursor=pointer]:
          - /url: /cart
          - img [ref=e28]
        - link "Giriş səhifəsini aç" [ref=e32] [cursor=pointer]:
          - /url: /login
          - img [ref=e33]
        - link "Admin" [ref=e36] [cursor=pointer]:
          - /url: /admin
          - img [ref=e37]
          - generic [ref=e40]: Admin
  - main [ref=e41]:
    - generic [ref=e42]:
      - generic [ref=e44]:
        - generic "Concert atmosphere background" [ref=e46]
        - generic [ref=e50]:
          - heading "Səhnələri Yüksəldirik Eventrent.az" [level=1] [ref=e52]:
            - generic [ref=e54]: Səhnələri
            - generic [ref=e56]: Yüksəldirik
            - generic [ref=e58]: Eventrent.az
          - generic [ref=e61]:
            - paragraph [ref=e64]: Premium event engineering və texniki prodakşn həlləri
            - generic [ref=e65]:
              - generic [ref=e66]:
                - generic [ref=e67]:
                  - paragraph [ref=e68]: Excellence
                  - paragraph [ref=e69]: Technical
                - generic [ref=e70]:
                  - paragraph [ref=e71]: Market
                  - paragraph [ref=e72]: High-End
                - generic [ref=e73]:
                  - paragraph [ref=e74]: Focus
                  - paragraph [ref=e75]: Cinematic
              - generic [ref=e76]:
                - button "Layihəyə başla" [ref=e77]:
                  - generic [ref=e78]:
                    - text: Layihəyə başla
                    - img [ref=e79]
                - button "Showreel izlə" [ref=e81]:
                  - img [ref=e82]
                  - text: Showreel izlə
        - generic:
          - paragraph: Scroll
        - paragraph [ref=e85]: Est. 2016 — Premium Production
      - generic [ref=e89]:
        - generic [ref=e90]:
          - img "LED Ekranlar" [ref=e92]
          - generic [ref=e94]:
            - generic [ref=e95]:
              - generic [ref=e96]:
                - img [ref=e98]
                - generic [ref=e100]: İmkanlarımız 01
              - heading "LED Ekranlar" [level=2] [ref=e101]:
                - generic [ref=e102]: LED
                - generic [ref=e103]: Ekranlar
              - paragraph [ref=e104]: Qapalı və açıq məkanlar üçün yüksək parlaqlıq və dəqiqlikdə LED həlləri.
              - button "Xidməti araşdır" [ref=e105]: Xidməti araşdır
            - img "LED Ekranlar" [ref=e110]
          - generic [ref=e111]:
            - generic [ref=e112]: "01"
            - generic [ref=e115]: "04"
        - generic [ref=e116]:
          - img "Səs Sistemləri" [ref=e118]
          - generic [ref=e120]:
            - generic [ref=e121]:
              - generic [ref=e122]:
                - img [ref=e124]
                - generic [ref=e128]: İmkanlarımız 02
              - heading "Səs Sistemləri" [level=2] [ref=e129]:
                - generic [ref=e130]: Səs
                - generic [ref=e131]: Sistemləri
              - paragraph [ref=e132]: Konsert və korporativ tədbirlər üçün peşəkar audio mühəndisliyi.
              - button "Xidməti araşdır" [ref=e133]: Xidməti araşdır
            - img "Səs Sistemləri" [ref=e138]
          - generic [ref=e139]:
            - generic [ref=e140]: "02"
            - generic [ref=e143]: "04"
        - generic [ref=e144]:
          - img "Səhnə və Ferma" [ref=e146]
          - generic [ref=e148]:
            - generic [ref=e149]:
              - generic [ref=e150]:
                - img [ref=e152]
                - generic [ref=e156]: İmkanlarımız 03
              - heading "Səhnə və Ferma" [level=2] [ref=e157]:
                - generic [ref=e158]: Səhnə
                - generic [ref=e159]: və
                - generic [ref=e160]: Ferma
              - paragraph [ref=e161]: Təhlükəsiz, modul və vizual olaraq güclü səhnə konstruksiyaları.
              - button "Xidməti araşdır" [ref=e162]: Xidməti araşdır
            - img "Səhnə və Ferma" [ref=e167]
          - generic [ref=e168]:
            - generic [ref=e169]: "03"
            - generic [ref=e172]: "04"
        - generic [ref=e173]:
          - img "İşıqlandırma" [ref=e175]
          - generic [ref=e177]:
            - generic [ref=e178]:
              - generic [ref=e179]:
                - img [ref=e181]
                - generic [ref=e183]: İmkanlarımız 04
              - heading "İşıqlandırma" [level=2] [ref=e184]:
                - generic [ref=e185]: İşıqlandırma
              - paragraph [ref=e186]: Məkanı atmosferə çevirən dinamik və ssenariyə uyğun işıq dizaynı.
              - button "Xidməti araşdır" [ref=e187]: Xidməti araşdır
            - img "İşıqlandırma" [ref=e192]
          - generic [ref=e193]:
            - generic [ref=e194]: "04"
            - generic [ref=e197]: "04"
      - generic [ref=e199]:
        - generic [ref=e201]:
          - generic [ref=e202]:
            - text: Sahələr
            - heading "Yüksəltdiyimiz Tədbirlər" [level=2] [ref=e203]:
              - text: Yüksəltdiyimiz
              - text: Tədbirlər
          - paragraph [ref=e204]: Korporativ sammitlərdən festival səhnələrinə qədər texniki dayağı təmin edirik.
        - generic [ref=e205]:
          - generic [ref=e206]:
            - img "Korporativ Tədbirlər" [ref=e208]
            - generic [ref=e211]:
              - generic [ref=e212]:
                - img [ref=e214]
                - generic [ref=e218]: Konfranslar və sammitlər
              - heading "Korporativ Tədbirlər" [level=3] [ref=e219]
              - paragraph [ref=e220]: Etibarlılığın kritik olduğu korporativ tədbirlər üçün texniki prodakşn.
              - button "Case study-lərə bax" [ref=e221]
            - generic [ref=e223]: "01"
          - generic [ref=e224]:
            - img "Canlı Konsertlər" [ref=e226]
            - generic [ref=e229]:
              - generic [ref=e230]:
                - img [ref=e232]
                - generic [ref=e236]: Arena və festival miqyası
              - heading "Canlı Konsertlər" [level=3] [ref=e237]
              - paragraph [ref=e238]: Maksimum tamaşaçı təcrübəsi üçün immersiv səs və işıq sistemləri.
              - button "Case study-lərə bax" [ref=e239]
            - generic [ref=e241]: "02"
          - generic [ref=e242]:
            - img "Premium Toylar" [ref=e244]
            - generic [ref=e247]:
              - generic [ref=e248]:
                - img [ref=e250]
                - generic [ref=e252]: Kinematik atmosfer
              - heading "Premium Toylar" [level=3] [ref=e253]
              - paragraph [ref=e254]: Xüsusi gününüzü vizual şah əsərə çevirən fərdi işıq və görüntü konsepti.
              - button "Case study-lərə bax" [ref=e255]
            - generic [ref=e257]: "03"
      - generic [ref=e260]:
        - generic [ref=e262]:
          - generic [ref=e263]: Portfolio
          - heading "Seçilmiş Səhnələr" [level=2] [ref=e264]
        - generic [ref=e265]:
          - generic [ref=e266]:
            - generic:
              - img "Formula 1 Azərbaycan Qran Prisi"
            - generic:
              - generic:
                - generic:
                  - generic: Texniki Prodakşn
                  - generic: "2025"
                - heading "Formula 1 Azərbaycan Qran Prisi" [level=3]
                - paragraph: Bakı şəhər halqası
              - button [ref=e267]:
                - img [ref=e268]
          - generic [ref=e270]:
            - generic:
              - img "COP29 Dünya Sammiti"
            - generic:
              - generic:
                - generic:
                  - generic: Tam Audio-Visual
                  - generic: "2024"
                - heading "COP29 Dünya Sammiti" [level=3]
                - paragraph: Bakı Olimpiya Stadionu
              - button [ref=e271]:
                - img [ref=e272]
          - generic [ref=e274]:
            - generic:
              - img "Bakı Jazz Festivalı"
            - generic:
              - generic:
                - generic:
                  - generic: İşıq dizaynı
                  - generic: "2024"
                - heading "Bakı Jazz Festivalı" [level=3]
                - paragraph: Heydər Əliyev Mərkəzi
              - button [ref=e275]:
                - img [ref=e276]
          - generic [ref=e278]:
            - generic:
              - img "Milli Gün mərasimi"
            - generic:
              - generic:
                - generic:
                  - generic: LED sistemlər
                  - generic: "2025"
                - heading "Milli Gün mərasimi" [level=3]
                - paragraph: Milli Bulvar
              - button [ref=e279]:
                - img [ref=e280]
          - generic [ref=e282] [cursor=pointer]:
            - img [ref=e284]
            - paragraph [ref=e286]: Bütün layihələr
      - generic [ref=e291]:
        - generic [ref=e292]:
          - generic [ref=e293]:
            - text: Proses
            - heading "Necə İcra edirik" [level=2] [ref=e294]
          - paragraph [ref=e297]: İlk brifdən canlı yayına qədər strukturlaşdırılmış iş axını ilə texniki dəqiqlik təmin edirik.
        - generic [ref=e298]:
          - generic [ref=e299]:
            - generic [ref=e300]:
              - generic [ref=e301]: Mərhələ
              - generic [ref=e302]: "01"
            - generic [ref=e305]:
              - generic [ref=e306]:
                - img [ref=e308]
                - heading "Ekspert konsultasiya" [level=3] [ref=e310]
              - paragraph [ref=e311]: Məkan, büdcə və məqsədlərə əsasən texniki strategiyanı formalaşdırırıq.
              - generic [ref=e312]:
                - generic [ref=e313]: Mərhələ 1 of 4
                - generic [ref=e315]: Bakı Event Engineering
            - img "Ekspert konsultasiya" [ref=e317]
          - generic [ref=e319]:
            - generic [ref=e320]:
              - generic [ref=e321]: Mərhələ
              - generic [ref=e322]: "02"
            - generic [ref=e325]:
              - generic [ref=e326]:
                - img [ref=e328]
                - heading "Dəqiq mühəndislik" [level=3] [ref=e331]
              - paragraph [ref=e332]: 3D vizuallaşdırma və texniki çertyojlarla bütün riskləri öncədən bağlayırıq.
              - generic [ref=e333]:
                - generic [ref=e334]: Mərhələ 2 of 4
                - generic [ref=e336]: Bakı Event Engineering
            - img "Dəqiq mühəndislik" [ref=e338]
          - generic [ref=e340]:
            - generic [ref=e341]:
              - generic [ref=e342]: Mərhələ
              - generic [ref=e343]: "03"
            - generic [ref=e346]:
              - generic [ref=e347]:
                - img [ref=e349]
                - heading "Quraşdırma" [level=3] [ref=e352]
              - paragraph [ref=e353]: Sertifikatlı komandamız avadanlıq və səhnə qurulumunu standartlara uyğun icra edir.
              - generic [ref=e354]:
                - generic [ref=e355]: Mərhələ 3 of 4
                - generic [ref=e357]: Bakı Event Engineering
            - img "Quraşdırma" [ref=e359]
          - generic [ref=e361]:
            - generic [ref=e362]:
              - generic [ref=e363]: Mərhələ
              - generic [ref=e364]: "04"
            - generic [ref=e367]:
              - generic [ref=e368]:
                - img [ref=e370]
                - heading "Canlı icra" [level=3] [ref=e375]
              - paragraph [ref=e376]: Canlı mərhələdə işıq, səs və vizual keçidləri real vaxtda idarə edirik.
              - generic [ref=e377]:
                - generic [ref=e378]: Mərhələ 4 of 4
                - generic [ref=e380]: Bakı Event Engineering
            - img "Canlı icra" [ref=e382]
      - generic [ref=e387]:
        - generic [ref=e388]:
          - paragraph [ref=e389]: 10+
          - paragraph [ref=e392]: Təcrübə ili
        - generic [ref=e393]:
          - paragraph [ref=e394]: 1,200+
          - paragraph [ref=e397]: Tamamlanmış tədbir
        - generic [ref=e398]:
          - paragraph [ref=e399]: 5,000+
          - paragraph [ref=e402]: Avadanlıq vahidi
        - generic [ref=e403]:
          - paragraph [ref=e404]: 450+
          - paragraph [ref=e407]: Məmnun müştəri
      - generic [ref=e412]:
        - generic [ref=e413]:
          - generic [ref=e414]:
            - img [ref=e415]
            - text: Avadanlıq İcarəsi
          - heading "Kataloqumuza Keçin" [level=2] [ref=e419]:
            - text: Kataloqumuza
            - text: Keçin
          - paragraph [ref=e420]: Peşəkar event texnologiyaları üçün geniş avadanlıq inventarına birbaşa çıxış əldə edin.
          - link "Kataloqa keç" [ref=e421] [cursor=pointer]:
            - /url: /catalog
            - text: Kataloqa keç
            - img [ref=e422]
        - generic [ref=e424]:
          - img "Keçin" [ref=e426]
          - generic [ref=e427]:
            - paragraph [ref=e428]: 500+
            - paragraph [ref=e429]: Məhsul
          - generic [ref=e430]:
            - paragraph [ref=e431]: 24/7
            - paragraph [ref=e432]: Dəstək
      - generic [ref=e436]:
        - heading "Birlikdə Quraq?" [level=2] [ref=e437]:
          - text: Birlikdə
          - text: Quraq?
        - paragraph [ref=e438]: Növbəti tədbirinizin texniki konseptini birlikdə planlayaq və reallaşdıraq.
        - generic [ref=e439]:
          - button "Konsultasiya rezerv et" [ref=e440]:
            - text: Konsultasiya rezerv et
            - img [ref=e441]
          - button "Satış komandası" [ref=e443]
  - contentinfo [ref=e444]:
    - generic [ref=e445]:
      - generic [ref=e446]:
        - generic [ref=e447]:
          - generic [ref=e448]:
            - link "E Eventrent Azerbaijan" [ref=e449] [cursor=pointer]:
              - /url: /
              - generic [ref=e451]: E
              - generic [ref=e452]:
                - generic [ref=e453]: Eventrent
                - generic [ref=e454]: Azerbaijan
            - paragraph [ref=e455]: Azerbaijan's leading technical production partner for premium event solutions.
          - generic [ref=e456]:
            - generic [ref=e457]:
              - link "Instagram" [ref=e458] [cursor=pointer]:
                - /url: "#"
                - img [ref=e459]
              - link "LinkedIn" [ref=e462] [cursor=pointer]:
                - /url: "#"
                - img [ref=e463]
            - link "Contact us on WhatsApp" [ref=e467] [cursor=pointer]:
              - /url: https://wa.me/994502251515
              - generic [ref=e468]:
                - img [ref=e469]
                - generic [ref=e471]:
                  - paragraph [ref=e472]: Direct Line
                  - paragraph [ref=e473]: Contact us on WhatsApp
                - generic [ref=e474]: Now
        - generic [ref=e475]:
          - heading "Navigation" [level=4] [ref=e476]
          - list [ref=e477]:
            - listitem [ref=e478]:
              - link "Home" [ref=e479] [cursor=pointer]:
                - /url: /
            - listitem [ref=e480]:
              - link "Services" [ref=e481] [cursor=pointer]:
                - /url: /services
            - listitem [ref=e482]:
              - link "Catalog" [ref=e483] [cursor=pointer]:
                - /url: /catalog
            - listitem [ref=e484]:
              - link "Portfolio" [ref=e485] [cursor=pointer]:
                - /url: /portfolio
            - listitem [ref=e486]:
              - link "About" [ref=e487] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e488]:
              - link "Contact" [ref=e489] [cursor=pointer]:
                - /url: /contact
        - generic [ref=e490]:
          - heading "Contact" [level=4] [ref=e491]
          - generic [ref=e492]:
            - generic [ref=e493]:
              - img [ref=e494]
              - paragraph [ref=e497]:
                - text: Baku, Azerbaijan
                - text: Ahmed Rajabli 156
            - generic [ref=e498]:
              - img [ref=e499]
              - paragraph [ref=e502]: office@eventrent.az
            - generic [ref=e503]:
              - img [ref=e504]
              - paragraph [ref=e506]: +994 50 225 15 15
      - generic [ref=e507]:
        - paragraph [ref=e508]: © 2026 EVENTRENT.AZ. ALL RIGHTS RESERVED.
        - generic [ref=e509]:
          - link "Privacy Policy" [ref=e510] [cursor=pointer]:
            - /url: "#"
          - link "Terms of Service" [ref=e511] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Capabilities section snaps to cards on scroll', async ({ page }) => {
  4  |   // Navigate to homepage
  5  |   await page.goto('http://localhost:6333', { waitUntil: 'domcontentloaded' });
  6  |   await page.waitForTimeout(3000);
  7  | 
  8  |   // Scroll down to find the Capabilities section
  9  |   // The Capabilities section is pinned, so we need to trigger the scroll
  10 |   const capabilitiesSection = page.locator('[class*="overflow-hidden bg-black"]').first();
  11 | 
  12 |   // Wait for the section to be visible
  13 |   await expect(capabilitiesSection).toBeVisible({ timeout: 10000 });
  14 | 
  15 |   // Get initial position of the section
  16 |   const initialBox = await capabilitiesSection.boundingBox();
  17 | 
  18 |   // Scroll down to trigger the horizontal scroll
  19 |   await page.mouse.wheel(0, 500);
  20 |   await page.waitForTimeout(500);
  21 | 
  22 |   // Check if the section is still visible (pinned)
  23 |   const afterScrollBox = await capabilitiesSection.boundingBox();
  24 | 
  25 |   // The pinned section should stay in view
  26 |   console.log('Before scroll Y:', initialBox?.y);
  27 |   console.log('After scroll Y:', afterScrollBox?.y);
  28 | 
  29 |   // Try scrolling more to test snap
  30 |   await page.mouse.wheel(0, 800);
  31 |   await page.waitForTimeout(800);
  32 | 
  33 |   const afterMoreScroll = await capabilitiesSection.boundingBox();
  34 |   console.log('After more scroll Y:', afterMoreScroll?.y);
  35 | 
  36 |   // Verify the section is pinned (position shouldn't change much)
> 37 |   expect(afterScrollBox?.y).toBeLessThanOrEqual(10); // Should be near top (pinned)
     |                             ^ Error: expect(received).toBeLessThanOrEqual(expected)
  38 | });
```