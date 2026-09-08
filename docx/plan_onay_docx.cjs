/**
 * Müşteri onayı üçün Azerbaycanca .docx faylı yaradır.
 * Word-un açıb oxuya biləcəyi HTML əsaslı .doc formatı.
 * İstifadə: node docx/plan_onay_docx.cjs
 */
const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Eventrent.az — Sayt Dəyişiklik Planı</title>
<!--[if gte mso 9]><xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml><![endif]-->
<style>
@page { size: A4; margin: 2cm; }
body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #000; }
h1 { font-size: 18pt; font-weight: bold; text-align: center; margin: 0 0 6pt; }
h2 { font-size: 14pt; font-weight: bold; margin: 18pt 0 6pt; border-bottom: 1pt solid #000; padding-bottom: 3pt; }
h3 { font-size: 12pt; font-weight: bold; margin: 12pt 0 4pt; }
p { margin: 0 0 6pt; }
ul, ol { margin: 0 0 6pt 18pt; }
li { margin-bottom: 3pt; }
hr { border: none; border-top: 1pt solid #000; margin: 12pt 0; }
.title-block { text-align: center; margin-bottom: 18pt; }
.subtitle { font-size: 11pt; color: #444; text-align: center; }
</style>
</head>
<body>

<div class="title-block">
<h1>EVENTRENT.AZ — SAYT DƏYİŞİKLİK PLANI</h1>
<p class="subtitle">MÜŞTƏRİ ONAYI ÜÇÜN SƏNƏD</p>
<p class="subtitle">Tarix: 2026</p>
<p class="subtitle">Hazırlayan: Eventrent.az komandası</p>
</div>

<h2>1. ÜMUMİ MƏLUMAT</h2>
<p>Bu sənəd, Eventrent.az saytında müştəri tərəfindən tələb olunan dəyişikliklərin tam siyahısını və hər bir dəyişikliyin necə həyata keçiriləcəyini izah edir.</p>
<p>Müştəri tərəfindən təqdim edilən iki sənəd əsasında hazırlanmışdır:</p>
<ul>
<li><b>KONTENT sənədi</b> — saytın məzmun strukturu</li>
<li><b>Şərhlər sənədi</b> — dəyişiklik tələbləri</li>
</ul>

<h2>2. ANA SƏHİFƏ DƏYİŞİKLİKLƏRİ</h2>

<h3>2.1. SƏHİFƏ SIRA DÜZÜLÜŞÜ</h3>
<p>Ana səhifənin bölmələri aşağıdakı sıra ilə düzüləcək:</p>
<ol>
<li><b>Hero</b> (giriş ekranı — dəyişmir)</li>
<li><b>Vizyon və Missiya</b> (bir slaydda)</li>
<li><b>Komanda</b> (yeni bölmə — 7 nəfər, sağdan sola slayd)</li>
<li><b>Xidmətlər / İmkanlar</b></li>
<li><b>Müştərilər</b> (güncəllənmiş siyahı)</li>
<li><b>Portfolio</b> (reels formatında)</li>
<li><b>Sifariş / Əlaqə CTA</b></li>
</ol>

<h3>2.2. "TƏDBİR NÖVLƏRİ" BÖLMƏSİ DEAKTİV EDİLİR</h3>
<p>Korporativ, Konsert, Düğün növlərini göstərən bölmə ana səhifədən və Xidmətlər səhifəsindən silinir.</p>
<p><b>Səbəb:</b> Müştəri bu bölməni lazımsız hesab edir.</p>

<h3>2.3. KOMANDA BÖLMƏSİ (YENİ)</h3>
<p>Ana səhifəyə komanda bölməsi əlavə olunur. 7 nəfərlik komanda:</p>
<ol>
<li><b>Pərvin Qasımov — Həmtəsisçi / Direktor</b><br/>Tədbir idarəçiliyi və kreativ planlama sahəsində təcrübəli komanda lideridir. Böyükmiqyaslı layihələrin strategiyası, planlaşdırılması və icrasını idarə edir.</li>
<li><b>Qalib Kazımlı — Həmtəsisçi / İcraçı Direktor</b><br/>Satış strategiyalarının idarə olunması və biznes əlaqələrinin inkişafına rəhbərlik edir. Müştəri münasibətləri və kommersiya yanaşmasını effektiv idarə edir.</li>
<li><b>Malik Bağırov — Kreativ Direktor</b><br/>Brend ruhunu müasir trendlərlə birləşdirir. Yaradıcı baxış tərzi və innovativ yanaşması ilə layihələrin konseptual istiqamətini formalaşdırır.</li>
<li><b>Aysel Şirinova — Satış şöbəsinin müdiri</b><br/>Satış proseslərini idarə edir. Komanda performansının artırılmasında effektiv liderlik edir.</li>
<li><b>Yasin Əhmədov — Layihə meneceri</b><br/>Dinamik idarəetmə bacarığı və təşkilati yanaşması ilə müxtəlif tədbir və layihələri idarə edir.</li>
<li><b>Nərmin Tarverdiyeva — Dizayner</b><br/>Vizual konsept və kreativ həllərə rəhbərlik edir. Müasir və estetik yanaşması ilə layihələrə fərqlilik qatar.</li>
<li><b>Aysu Məmmədova — Ofis menecer</b><br/>Rəsmi sənədləşmə və qeydiyyat üzrə mütəxəssis. Layihələr zamanı araşdırma işlərini həyata keçirir.</li>
</ol>
<p><b>Dizayn:</b> Sağdan sola yatay slayd animasiyası.</p>
<p><b>Fotoğraflar:</b> Müvəqqəti olaraq placeholder istifadə olunur, sonra real fotoğraflar əvəz edilə bilər.</p>

<h3>2.4. MÜŞTƏRİ SİYAHISI GÜNCƏLLƏNMƏSİ</h3>
<p>Müştərilər bölməsində aşağıdakı brendlər göstəriləcək:</p>
<ul>
<li>Heydər Əliyev Fondu</li>
<li>Azərbaycan Turizm Agentliyi</li>
<li>Rusiya Səfirliyi</li>
<li>İçərişəhər Qoruğu</li>
<li>Azərbaycan Güləş Federasiyası</li>
<li>Azərbaycan Badminton Federasiyası</li>
<li>Azərbaycan Cüdo Federasiyası</li>
<li>Abşeron Ticarət Mərkəzi</li>
<li>Mərkəzi Bank</li>
<li>Paşa Sığorta</li>
<li>Azal</li>
<li>Tabaterra</li>
<li>Paşa Kapital</li>
<li>Azərsun</li>
<li>Bazarstore</li>
<li>Norm Sement</li>
<li>Avropa İttifaqı</li>
<li>Q STP şirkəti</li>
<li>Bakı Dövlət Universiteti</li>
<li>Odlar Yurdu Universiteti</li>
<li>Azərxalça</li>
<li>Paşa Mall</li>
<li>SOCAR</li>
</ul>

<h2>3. HERO / COVER FOTOĞRAFLARIN SILINMƏSİ</h2>

<h3>3.1. ÜMUMI DƏYİŞİKLİK</h3>
<p><b>Müştəri tələbi:</b> "Bütün digər səhifələrdə cover foto hissəsini silək"</p>
<p>Aşağıdakı səhifələrdə hero/cover fotoğrafları silinir və yerinə minimalist hero qoyulur:</p>
<ul>
<li>Haqqımızda səhifəsinin hero-su</li>
<li>Katerinq səhifəsinin hero-su</li>
<li>Əlaqə səhifəsinin hero-su</li>
<li>Qalereya səhifəsinin hero-su</li>
<li>Portfolio səhifəsinin hero-su</li>
<li>TV səhifəsinin hero-su</li>
<li>Teambuilding səhifəsinin hero-su</li>
<li>Kataloq səhifəsinin hero-su</li>
<li>Xidmət detalları səhifəsinin hero-su</li>
</ul>

<h3>3.2. YENİ HERO DİZAYNI</h3>
<p>Minimalist hero aşağıdakı elementlərdən ibarət olacaq:</p>
<ul>
<li>Nazik gradient arxa plan (tünd rəng keçidi)</li>
<li>Sol üst tərəfdə kiçik badge / etiket</li>
<li>Böyük tipografik başlıq</li>
<li>Qısa alt başlıq / açıqlama</li>
</ul>
<p><b>İstisna:</b> Ana səhifənin hero-su (video arxa planlı) dəyişmir.</p>

<h3>3.3. HAQQIMIZDA SƏHİFƏSİNİN HERO-SU</h3>
<p>Haqqımızda səhifəsinin hero-su aşağıdakı kimi olacaq:</p>
<ul>
<li><b>Badge:</b> "Bizim Hekayəmiz"</li>
<li><b>Başlıq:</b> "Keyfiyyət. Təcrübə."</li>
<li><b>Alt başlıq:</b> "Tədbiriniz üçün hər şey — Operativlik və Bol çeşidin vəhdəti."</li>
</ul>
<p><b>Dizayn:</b> Tünd gradient arxa plan, mərkəzləşdirilmiş mətn, cover fotoğraf yoxdur.</p>

<h2>4. YAZI RƏNGLƏRİ KONTRAST DÜZELTMƏSİ</h2>
<p><b>Müştəri tələbi:</b> "Yazı rəngləri oxunmur"</p>
<p><b>Problem:</b> Bir çox mətnlər çox açıq rəngdədir (ağ 30%, ağ 40%) və tünd arxa planda oxunmur.</p>
<p><b>Həll:</b> Bütün səhifələrdə mətn rəngləri gücləndirilir:</p>
<ul>
<li>Çox açıq mətnlər (ağ 30%) → daha aydın (ağ 60%)</li>
<li>Açıq mətnlər (ağ 40%) → aydın (ağ 70%)</li>
<li>İtalik vurğular (ağ 20%) → görünən (ağ 50%)</li>
</ul>
<p>Bu dəyişiklik bütün sayt boyunca tətbiq olunur.</p>

<h2>5. XİDMƏTLƏR BÖLMƏSİ — VİDEO ƏVƏZİ</h2>
<p><b>Müştəri tələbi:</b> "Burda videonun əvəzinə köhnə versiyasına qaytaraq. Şəkillər və ya iconlar ilə yoxlayaq"</p>
<p><b>Dəyişiklik:</b> Ana səhifədəki Xidmətlər bölməsində istifadə olunan video tamamilə silinir.</p>
<p><b>Yeni sistem:</b> Hər xidmət üçün ayrı şəkil + ikon kart sistemi.</p>
<ul>
<li>Scroll zamanı video əvəzinə şəkillər bir-birini əvəz edir</li>
<li>Hər xidmət kartında: ikon, başlıq, açıqlama, tag-lər</li>
<li>Addım göstəriciləri və progress bar saxlanılır</li>
</ul>

<h2>6. KATERİNG SƏHİFƏSİ — SİFARİŞ FORMU</h2>
<p><b>Müştəri tələbi:</b> "Ketring səhifəsində sifariş yarat buttonu əlavə edək"</p>
<p>Katerinq səhifəsinə <b>"Sifariş Yarat"</b> formu əlavə olunur.</p>

<h3>Form sahələri:</h3>
<ol>
<li><b>Məkan</b> (məcburi) — mətn sahəsi</li>
<li><b>Tarix</b> (məcburi) — tarix sahəsi</li>
<li><b>Saat aralığı</b> (məcburi) — mətn sahəsi</li>
<li><b>Tədbirin formatı haqqında məlumat</b> (məcburi) — mətn sahəsi</li>
<li><b>Menyu tərkibi haqqında xüsusi istək</b> (ixtiyari) — mətn sahəsi</li>
</ol>

<h3>Sifariş axını:</h3>
<ul>
<li>İstifadəçi formu doldurur</li>
<li>"Sifariş Yarat" düyməsini sıxır</li>
<li>Məlumatlar səbətə əlavə olunur</li>
<li>İstifadəçi Səbət səhifəsində sifarişi tamamladıqdan sonra məlumatlar admin panelinə göndərilir</li>
</ul>

<h2>7. PORTFOLIO — REELS FORMATI</h2>
<p><b>Müştəri tələbi:</b> "Portfolyo hissəsində hər tədbirin özünə aid videosunu yerləşdirəciyik. Videolar reels formatındadır"</p>
<p><b>Dəyişiklik:</b> Portfolio səhifəsindəki videolar reels formatına (9:16 şaquli) çevrilir.</p>
<ul>
<li>Hər tədbirin öz videosu olacaq</li>
<li>Videolar şaquli (reels) formatında göstəriləcək</li>
<li>Karta hover edildikdə video avtomatik oynayır</li>
<li>Karta kliklədikdə tam ekran reels görüntüləyici açılır</li>
</ul>
<p><b>Qeyd:</b> Müştəri hələ real videoları təqdim etməyib. Müvəqqəti placeholder videolar istifadə olunur, sonra əvəz edilə bilər.</p>
<p><b>Portfolio və Qalereya səhifələri ayrı qalır:</b></p>
<ul>
<li>Portfolio = etkinlik video vitrini (reels)</li>
<li>Qalereya = statik foto arxiv</li>
</ul>

<h2>8. EVENTGARDEN SƏHİFƏSİ (YENİ)</h2>
<p><b>Müştəri tələbi:</b> "TV&amp;LED səhifəsini gizlədirik hələki, əvəzində Eventgarden səhifəsi açaq"</p>

<h3>8.1. TV SƏHİFƏSİ</h3>
<ul>
<li>TV səhifəsi menyuda gizlədilir</li>
<li>Route (bağlantı) saxlanılır — birbaşa linklə açmaq mümkündür</li>
</ul>

<h3>8.2. EVENTGARDEN SƏHİFƏSİ (YENİ)</h3>
<p>Tamamilə yeni səhifə yaradılır:</p>
<ul>
<li>Yeni bağlantı: /eventgarden</li>
<li>Menyuya əlavə olunur</li>
<li>Yeni bölmələr:
  <ul>
  <li>Eventgarden hero (minimalist)</li>
  <li>Eventgarden məzmun (bağça/açıq hava etkinlik konsepti)</li>
  <li>Eventgarden qalereya (açıq hava etkinlik fotoğrafları)</li>
  </ul>
</li>
</ul>
<p><b>Konsept:</b> Bağça və açıq hava etkinlikləri üçün xüsusi bölüm. Çadır, dekor, işıqlandırma, səs sistemləri showcase.</p>

<h2>9. İÇERİK SİSTEMİ GÜNCƏLLƏNMƏLƏRİ</h2>
<p>Bütün məzmun dəyişiklikləri admin panelindən redaktə edilə bilən sistemə əlavə olunur:</p>
<ul>
<li>Komanda məlumatları (7 nəfər) admin'dən düzəldilə bilər</li>
<li>Müştəri siyahısı admin'dən düzəldilə bilər</li>
<li>Bütün mətnlər 4 dildə saxlanılır (Azərbaycan, İngilis, Rus, Türk)</li>
</ul>

<h2>10. DƏYİŞİKLİK XÜLASƏSİ</h2>
<p><b>Sayı:</b> Təxminən 50 fayl dəyişikliyi</p>
<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
<tr><th><b>Kateqoriya</b></th><th><b>Fayl sayı</b></th><th><b>Aksiya</b></th></tr>
<tr><td>Ana səhifə</td><td>4</td><td>Sıralama, komanda, müştərilər, deaktiv</td></tr>
<tr><td>Hero/cover</td><td>13</td><td>Cover silinməsi</td></tr>
<tr><td>Kontrast</td><td>~20</td><td>Yazı rəngləri</td></tr>
<tr><td>Xidmətlər</td><td>1</td><td>Video → şəkil</td></tr>
<tr><td>Katerinq</td><td>2</td><td>Form + səbət</td></tr>
<tr><td>Portfolio</td><td>1</td><td>Reels formatı</td></tr>
<tr><td>Eventgarden</td><td>3</td><td>Yeni səhifə</td></tr>
<tr><td>Menyu/route</td><td>2</td><td>Eventgarden əlavə, TV gizlət</td></tr>
<tr><td>İçerik</td><td>3</td><td>content.default.ts, site-content.json, types.ts</td></tr>
</table>

<h2>11. QEYDLƏR VƏ RİSKLƏR</h2>
<ol>
<li><b>Reels videoları:</b> Müştəri hələ videoları təqdim etməyib. Müvəqqəti placeholder videolar istifadə olunur.</li>
<li><b>Komanda fotoğrafları:</b> Müvəqqəti placeholder istifadə olunur. Müştəri real fotoğrafları sonra admin panelindən yükləyə bilər.</li>
<li><b>Müştəri logoları:</b> public/logos/ qovluğuna real logolar əlavə olunmalıdır. Hələlik mətn fallback istifadə olunur.</li>
<li><b>Eventgarden məzmunu:</b> Müştəri detallı məzmun verməyib. Bağça/açıq hava etkinlik konsepti əsasında hazırlanır.</li>
<li><b>"Deaktiv" şərhi:</b> Tədbir növləri bölməsi olaraq netləşdirildi, lakin müştəri ilə təsdiqlənməlidir.</li>
</ol>

<h2>12. ONAY</h2>
<p>Yuxarıdakı dəyişiklikləri oxudum və təsdiqləyirəm.</p>
<p><b>Müştəri adı:</b> ___________________________</p>
<p><b>İmza:</b> ___________________________</p>
<p><b>Tarix:</b> ___________________________</p>

<hr/>
<p style="text-align:center; font-style:italic;">— Sənəd sonu —</p>

</body>
</html>`;

const outPath = path.join(__dirname, 'Eventrent_Deyisiklik_Plani.doc');
fs.writeFileSync(outPath, htmlContent, 'utf8');
console.log('Yaradıldı:', outPath);
