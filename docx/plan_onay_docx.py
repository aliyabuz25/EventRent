#!/usr/bin/env python3
"""
Müşteri onayı üçün Azerbaycanca .docx faylı yaradır (python-docx ilə).
İstifadə: python3 docx/plan_onay_docx.py
"""
import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement


def set_cell_border(cell, **kwargs):
    """Cədvəl xanasına sərhəd əlavə edir."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for edge in ('top', 'left', 'bottom', 'right'):
        if edge in kwargs:
            border = OxmlElement(f'w:{edge}')
            border.set(qn('w:val'), 'single')
            border.set(qn('w:sz'), '4')
            border.set(qn('w:color'), '000000')
            tcBorders.append(border)
    tcPr.append(tcBorders)


def add_heading_styled(doc, text, level=1):
    """Başlıq əlavə edir."""
    h = doc.add_heading(text, level=level)
    for run in h.runs:
        run.font.name = 'Times New Roman'
        if level == 1:
            run.font.size = Pt(14)
            run.font.color.rgb = RGBColor(0, 0, 0)
            run.bold = True
        elif level == 2:
            run.font.size = Pt(12)
            run.font.color.rgb = RGBColor(0, 0, 0)
            run.bold = True
    return h


def add_para(doc, text, bold=False, italic=False, size=12, bold_prefix=None):
    """Paraqraf əlavə edir. bold_prefix verilsə, əvvəlcə qalın prefiks, sonra normal mətn."""
    p = doc.add_paragraph()
    if bold_prefix:
        r0 = p.add_run(bold_prefix)
        r0.bold = True
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(size)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    return p


def add_bullet(doc, text, bold_prefix=None):
    """Bullet siyahı əlavə edir."""
    p = doc.add_paragraph(style='List Bullet')
    if bold_prefix:
        r1 = p.add_run(bold_prefix)
        r1.bold = True
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(12)
        r2 = p.add_run(text)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(12)
    else:
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
    return p


def add_number(doc, text, bold_prefix=None):
    """Nömrəli siyahı əlavə edir."""
    p = doc.add_paragraph(style='List Number')
    if bold_prefix:
        r1 = p.add_run(bold_prefix)
        r1.bold = True
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(12)
        r2 = p.add_run(text)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(12)
    else:
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
    return p


def add_signature_line(doc, label):
    """İmza xətti əlavə edir."""
    p = doc.add_paragraph()
    run = p.add_run(f'{label}: ___________________________')
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.bold = True
    return p


# ── Sənəd yaratma ──
doc = Document()

# Səhifə kənarları
for section in doc.sections:
    section.top_margin = Cm(2)
    section.bottom_margin = Cm(2)
    section.left_margin = Cm(2)
    section.right_margin = Cm(2)

# Normal stil
style = doc.styles['Normal']
style.font.name = 'Times New Roman'
style.font.size = Pt(12)

# ── Başlıq bloku ──
title = doc.add_heading('EVENTRENT.AZ — SAYT DƏYİŞİKLİK PLANI', level=0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
for run in title.runs:
    run.font.name = 'Times New Roman'
    run.font.size = Pt(18)
    run.font.color.rgb = RGBColor(0, 0, 0)

sub = add_para(doc, 'MÜŞTƏRİ ONAYI ÜÇÜN SƏNƏD', bold=True)
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
add_para(doc, 'Tarix: 2026').alignment = WD_ALIGN_PARAGRAPH.CENTER
add_para(doc, 'Hazırlayan: Eventrent.az komandası').alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph()

# ── 1. ÜMUMİ MƏLUMAT ──
add_heading_styled(doc, '1. ÜMUMİ MƏLUMAT', level=1)
add_para(doc, 'Bu sənəd, Eventrent.az saytında müştəri tərəfindən tələb olunan dəyişikliklərin tam siyahısını və hər bir dəyişikliyin necə həyata keçiriləcəyini izah edir.')
add_para(doc, 'Müştəri tərəfindən təqdim edilən iki sənəd əsasında hazırlanmışdır:')
add_bullet(doc, 'saytın məzmun strukturu', bold_prefix='KONTENT sənədi — ')
add_bullet(doc, 'dəyişiklik tələbləri', bold_prefix='Şərhlər sənədi — ')

# ── 2. ANA SƏHİFƏ DƏYİŞİKLİKLƏRİ ──
add_heading_styled(doc, '2. ANA SƏHİFƏ DƏYİŞİKLİKLƏRİ', level=1)

add_heading_styled(doc, '2.1. SƏHİFƏ SIRA DÜZÜLÜŞÜ', level=2)
add_para(doc, 'Ana səhifənin bölmələri aşağıdakı sıra ilə düzüləcək:')
add_number(doc, '(giriş ekranı — dəyişmir)', bold_prefix='Hero ')
add_number(doc, '(bir slaydda)', bold_prefix='Vizyon və Missiya ')
add_number(doc, '(yeni bölmə — 7 nəfər, sağdan sola slayd)', bold_prefix='Komanda ')
add_number(doc, '', bold_prefix='Xidmətlər / İmkanlar')
add_number(doc, '(güncəllənmiş siyahı)', bold_prefix='Müştərilər ')
add_number(doc, '(reels formatında)', bold_prefix='Portfolio ')
add_number(doc, '', bold_prefix='Sifariş / Əlaqə CTA')

add_heading_styled(doc, '2.2. "TƏDBİR NÖVLƏRİ" BÖLMƏSİ DEAKTİV EDİLİR', level=2)
add_para(doc, 'Korporativ, Konsert, Düğün növlərini göstərən bölmə ana səhifədən və Xidmətlər səhifəsindən silinir.')
add_para(doc, 'Müştəri bu bölməni lazımsız hesab edir.', bold_prefix='Səbəb: ')

add_heading_styled(doc, '2.3. KOMANDA BÖLMƏSİ (YENİ)', level=2)
add_para(doc, 'Ana səhifəyə komanda bölməsi əlavə olunur. 7 nəfərlik komanda:')

team = [
    ('Pərvin Qasımov — Həmtəsisçi / Direktor',
     'Tədbir idarəçiliyi və kreativ planlama sahəsində təcrübəli komanda lideridir. Böyükmiqyaslı layihələrin strategiyası, planlaşdırılması və icrasını idarə edir.'),
    ('Qalib Kazımlı — Həmtəsisçi / İcraçı Direktor',
     'Satış strategiyalarının idarə olunması və biznes əlaqələrinin inkişafına rəhbərlik edir. Müştəri münasibətləri və kommersiya yanaşmasını effektiv idarə edir.'),
    ('Malik Bağırov — Kreativ Direktor',
     'Brend ruhunu müasir trendlərlə birləşdirir. Yaradıcı baxış tərzi və innovativ yanaşması ilə layihələrin konseptual istiqamətini formalaşdırır.'),
    ('Aysel Şirinova — Satış şöbəsinin müdiri',
     'Satış proseslərini idarə edir. Komanda performansının artırılmasında effektiv liderlik edir.'),
    ('Yasin Əhmədov — Layihə meneceri',
     'Dinamik idarəetmə bacarığı və təşkilati yanaşması ilə müxtəlif tədbir və layihələri idarə edir.'),
    ('Nərmin Tarverdiyeva — Dizayner',
     'Vizual konsept və kreativ həllərə rəhbərlik edir. Müasir və estetik yanaşması ilə layihələrə fərqlilik qatar.'),
    ('Aysu Məmmədova — Ofis menecer',
     'Rəsmi sənədləşmə və qeydiyyat üzrə mütəxəssis. Layihələr zamanı araşdırma işlərini həyata keçirir.'),
]
for i, (name, desc) in enumerate(team, 1):
    p = doc.add_paragraph(style='List Number')
    r1 = p.add_run(name)
    r1.bold = True
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(12)
    r2 = p.add_run(' — ' + desc)
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(12)

add_para(doc, 'Sağdan sola yatay slayd animasiyası.', bold_prefix='Dizayn: ')
add_para(doc, 'Mövqəti olaraq placeholder istifadə olunur, sonra real fotoğraflar əvəz edilə bilər.', bold_prefix='Fotoğraflar: ')

add_heading_styled(doc, '2.4. MÜŞTƏRİ SİYAHISI GÜNCƏLLƏNMƏSİ', level=2)
add_para(doc, 'Müştərilər bölməsində aşağıdakı brendlər göstəriləcək:')
clients = [
    'Heydər Əliyev Fondu', 'Azərbaycan Turizm Agentliyi', 'Rusiya Səfirliyi',
    'İçərişəhər Qoruğu', 'Azərbaycan Güləş Federasiyası',
    'Azərbaycan Badminton Federasiyası', 'Azərbaycan Cüdo Federasiyası',
    'Abşeron Ticarət Mərkəzi', 'Mərkəzi Bank', 'Paşa Sığorta', 'Azal',
    'Tabaterra', 'Paşa Kapital', 'Azərsun', 'Bazarstore', 'Norm Sement',
    'Avropa İttifaqı', 'Q STP şirkəti', 'Bakı Dövlət Universiteti',
    'Odlar Yurdu Universiteti', 'Azərxalça', 'Paşa Mall', 'SOCAR',
]
for c in clients:
    add_bullet(doc, c)

# ── 3. HERO / COVER FOTOĞRAFLARIN SILINMƏSİ ──
add_heading_styled(doc, '3. HERO / COVER FOTOĞRAFLARIN SILINMƏSİ', level=1)

add_heading_styled(doc, '3.1. ÜMUMI DƏYİŞİKLİK', level=2)
add_para(doc, '"Bütün digər səhifələrdə cover foto hissəsini silək"', bold_prefix='Müştəri tələbi: ')
add_para(doc, 'Aşağıdakı səhifələrdə hero/cover fotoğrafları silinir və yerinə minimalist hero qoyulur:')
hero_pages = [
    'Haqqımızda səhifəsinin hero-su', 'Katerinq səhifəsinin hero-su',
    'Əlaqə səhifəsinin hero-su', 'Qalereya səhifəsinin hero-su',
    'Portfolio səhifəsinin hero-su', 'TV səhifəsinin hero-su',
    'Teambuilding səhifəsinin hero-su', 'Kataloq səhifəsinin hero-su',
    'Xidmət detalları səhifəsinin hero-su',
]
for h in hero_pages:
    add_bullet(doc, h)

add_heading_styled(doc, '3.2. YENİ HERO DİZAYNI', level=2)
add_para(doc, 'Minimalist hero aşağıdakı elementlərdən ibarət olacaq:')
add_bullet(doc, 'Nazik gradient arxa plan (tünd rəng keçidi)')
add_bullet(doc, 'Sol üst tərəfdə kiçik badge / etiket')
add_bullet(doc, 'Böyük tipografik başlıq')
add_bullet(doc, 'Qısa alt başlıq / açıqlama')
add_para(doc, 'Ana səhifənin hero-su (video arxa planlı) dəyişmir.', bold_prefix='İstisna: ')

add_heading_styled(doc, '3.3. HAQQIMIZDA SƏHİFƏSİNİN HERO-SU', level=2)
add_para(doc, 'Haqqımızda səhifəsinin hero-su aşağıdakı kimi olacaq:')
add_bullet(doc, '"Bizim Hekayəmiz"', bold_prefix='Badge: ')
add_bullet(doc, '"Keyfiyyət. Təcrübə."', bold_prefix='Başlıq: ')
add_bullet(doc, '"Tədbiriniz üçün hər şey — Operativlik və Bol çeşidin vəhdəti."', bold_prefix='Alt başlıq: ')
add_para(doc, 'Tünd gradient arxa plan, mərkəzləşdirilmiş mətn, cover fotoğraf yoxdur.', bold_prefix='Dizayn: ')

# ── 4. YAZI RƏNGLƏRİ ──
add_heading_styled(doc, '4. YAZI RƏNGLƏRİ KONTRAST DÜZELTMƏSİ', level=1)
add_para(doc, '"Yazı rəngləri oxunmur"', bold_prefix='Müştəri tələbi: ')
add_para(doc, 'Bir çox mətnlər çox açıq rəngdədir (ağ 30%, ağ 40%) və tünd arxa planda oxunmur.', bold_prefix='Problem: ')
add_para(doc, 'Bütün səhifələrdə mətn rəngləri gücləndirilir:', bold_prefix='Həll: ')
add_bullet(doc, 'daha aydın (ağ 60%)', bold_prefix='Çox açıq mətnlər (ağ 30%) → ')
add_bullet(doc, 'aydın (ağ 70%)', bold_prefix='Açıq mətnlər (ağ 40%) → ')
add_bullet(doc, 'görünən (ağ 50%)', bold_prefix='İtalik vurğular (ağ 20%) → ')
add_para(doc, 'Bu dəyişiklik bütün sayt boyunca tətbiq olunur.')

# ── 5. XİDMƏTLƏR ──
add_heading_styled(doc, '5. XİDMƏTLƏR BÖLMƏSİ — VİDEO ƏVƏZİ', level=1)
add_para(doc, '"Burda videonun əvəzinə köhnə versiyasına qaytaraq. Şəkillər və ya iconlar ilə yoxlayaq"', bold_prefix='Müştəri tələbi: ')
add_para(doc, 'Ana səhifədəki Xidmətlər bölməsində istifadə olunan video tamamilə silinir.', bold_prefix='Dəyişiklik: ')
add_para(doc, 'Hər xidmət üçün ayrı şəkil + ikon kart sistemi.', bold_prefix='Yeni sistem: ')
add_bullet(doc, 'Scroll zamanı video əvəzinə şəkillər bir-birini əvəz edir')
add_bullet(doc, 'Hər xidmət kartında: ikon, başlıq, açıqlama, tag-lər')
add_bullet(doc, 'Addım göstəriciləri və progress bar saxlanılır')

# ── 6. KATERİNG ──
add_heading_styled(doc, '6. KATERİNG SƏHİFƏSİ — SİFARİŞ FORMU', level=1)
add_para(doc, '"Ketring səhifəsində sifariş yarat buttonu əlavə edək"', bold_prefix='Müştəri tələbi: ')
add_para(doc, 'Katerinq səhifəsinə "Sifariş Yarat" formu əlavə olunur.')

add_heading_styled(doc, 'Form sahələri:', level=2)
form_fields = [
    ('Məkan', 'məcburi', 'mətn sahəsi'),
    ('Tarix', 'məcburi', 'tarix sahəsi'),
    ('Saat aralığı', 'məcburi', 'mətn sahəsi'),
    ('Tədbirin formatı haqqında məlumat', 'məcburi', 'mətn sahəsi'),
    ('Menyu tərkibi haqqında xüsusi istək', 'ixtiyari', 'mətn sahəsi'),
]
for i, (name, req, typ) in enumerate(form_fields, 1):
    p = doc.add_paragraph(style='List Number')
    r1 = p.add_run(name)
    r1.bold = True
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(12)
    r2 = p.add_run(f' ({req}) — {typ}')
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(12)

add_heading_styled(doc, 'Sifariş axını:', level=2)
add_bullet(doc, 'İstifadəçi formu doldurur')
add_bullet(doc, '"Sifariş Yarat" düyməsini sıxır')
add_bullet(doc, 'Məlumatlar səbətə əlavə olunur')
add_bullet(doc, 'İstifadəçi Səbət səhifəsində sifarişi tamamladıqdan sonra məlumatlar admin panelinə göndərilir')

# ── 7. PORTFOLIO ──
add_heading_styled(doc, '7. PORTFOLIO — REELS FORMATI', level=1)
add_para(doc, '"Portfolyo hissəsində hər tədbirin özünə aid videosunu yerləşdirəciyik. Videolar reels formatındadır"', bold_prefix='Müştəri tələbi: ')
add_para(doc, 'Portfolio səhifəsindəki videolar reels formatına (9:16 şaquli) çevrilir.', bold_prefix='Dəyişiklik: ')
add_bullet(doc, 'Hər tədbirin öz videosu olacaq')
add_bullet(doc, 'Videolar şaquli (reels) formatında göstəriləcək')
add_bullet(doc, 'Karta hover edildikdə video avtomatik oynayır')
add_bullet(doc, 'Karta kliklədikdə tam ekran reels görüntüləyici açılır')
add_para(doc, 'Müştəri hələ real videoları təqdim etməyib. Müvəqqəti placeholder videolar istifadə olunur, sonra əvəz edilə bilər.', bold_prefix='Qeyd: ')
add_para(doc, 'Portfolio və Qalereya səhifələri ayrı qalır:', bold_prefix='')
add_bullet(doc, 'etkinlik video vitrini (reels)', bold_prefix='Portfolio = ')
add_bullet(doc, 'statik foto arxiv', bold_prefix='Qalereya = ')

# ── 8. EVENTGARDEN ──
add_heading_styled(doc, '8. EVENTGARDEN SƏHİFƏSİ (YENİ)', level=1)
add_para(doc, '"TV&LED səhifəsini gizlədirik hələki, əvəzində Eventgarden səhifəsi açaq"', bold_prefix='Müştəri tələbi: ')

add_heading_styled(doc, '8.1. TV SƏHİFƏSİ', level=2)
add_bullet(doc, 'TV səhifəsi menyuda gizlədilir')
add_bullet(doc, 'Route (bağlantı) saxlanılır — birbaşa linklə açmaq mümkündür')

add_heading_styled(doc, '8.2. EVENTGARDEN SƏHİFƏSİ (YENİ)', level=2)
add_para(doc, 'Tamamilə yeni səhifə yaradılır:')
add_bullet(doc, '/eventgarden', bold_prefix='Yeni bağlantı: ')
add_bullet(doc, 'Menyuya əlavə olunur')
add_para(doc, 'Yeni bölmələr:')
add_bullet(doc, 'Eventgarden hero (minimalist)')
add_bullet(doc, 'Eventgarden məzmun (bağça/açıq hava etkinlik konsepti)')
add_bullet(doc, 'Eventgarden qalereya (açıq hava etkinlik fotoğrafları)')
add_para(doc, 'Bağça və açıq hava etkinlikləri üçün xüsusi bölüm. Çadır, dekor, işıqlandırma, səs sistemləri showcase.', bold_prefix='Konsept: ')

# ── 9. İÇERİK SİSTEMİ ──
add_heading_styled(doc, '9. İÇERİK SİSTEMİ GÜNCƏLLƏNMƏLƏRİ', level=1)
add_para(doc, 'Bütün məzmun dəyişiklikləri admin panelindən redaktə edilə bilən sistemə əlavə olunur:')
add_bullet(doc, 'Komanda məlumatları (7 nəfər) admin\'dən düzəldilə bilər')
add_bullet(doc, 'Müştəri siyahısı admin\'dən düzəldilə bilər')
add_bullet(doc, 'Bütün mətnlər 4 dildə saxlanılır (Azərbaycan, İngilis, Rus, Türk)')

# ── 10. XÜLASƏ ──
add_heading_styled(doc, '10. DƏYİŞİKLİK XÜLASƏSİ', level=1)
add_para(doc, 'Təxminən 50 fayl dəyişikliyi', bold_prefix='Sayı: ')

table_data = [
    ('Kateqoriya', 'Fayl sayı', 'Aksiya'),
    ('Ana səhifə', '4', 'Sıralama, komanda, müştərilər, deaktiv'),
    ('Hero/cover', '13', 'Cover silinməsi'),
    ('Kontrast', '~20', 'Yazı rəngləri'),
    ('Xidmətlər', '1', 'Video → şəkil'),
    ('Katerinq', '2', 'Form + səbət'),
    ('Portfolio', '1', 'Reels formatı'),
    ('Eventgarden', '3', 'Yeni səhifə'),
    ('Menyu/route', '2', 'Eventgarden əlavə, TV gizlət'),
    ('İçerik', '3', 'content.default.ts, site-content.json, types.ts'),
]
table = doc.add_table(rows=len(table_data), cols=3)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
for i, row_data in enumerate(table_data):
    row = table.rows[i]
    for j, cell_text in enumerate(row_data):
        cell = row.cells[j]
        cell.text = ''
        p = cell.paragraphs[0]
        run = p.add_run(cell_text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)
        if i == 0:
            run.bold = True
        set_cell_border(cell, top=True, left=True, bottom=True, right=True)

# ── 11. QEYDLƏR ──
add_heading_styled(doc, '11. QEYDLƏR VƏ RİSKLƏR', level=1)
notes = [
    ('Reels videoları:', 'Müştəri hələ videoları təqdim etməyib. Müvəqqəti placeholder videolar istifadə olunur.'),
    ('Komanda fotoğrafları:', 'Müvəqqəti placeholder istifadə olunur. Müştəri real fotoğrafları sonra admin panelindən yükləyə bilər.'),
    ('Müştəri logoları:', 'public/logos/ qovluğuna real logolar əlavə olunmalıdır. Hələlik mətn fallback istifadə olunur.'),
    ('Eventgarden məzmunu:', 'Müştəri detallı məzmun verməyib. Bağça/açıq hava etkinlik konsepti əsasında hazırlanır.'),
    ('"Deaktiv" şərhi:', 'Tədbir növləri bölməsi olaraq netləşdirildi, lakin müştəri ilə təsdiqlənməlidir.'),
]
for i, (prefix, text) in enumerate(notes, 1):
    p = doc.add_paragraph(style='List Number')
    r1 = p.add_run(prefix + ' ')
    r1.bold = True
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(12)
    r2 = p.add_run(text)
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(12)

# ── 12. ONAY ──
add_heading_styled(doc, '12. ONAY', level=1)
add_para(doc, 'Yuxarıdakı dəyişiklikləri oxudum və təsdiqləyirəm.')
doc.add_paragraph()
add_signature_line(doc, 'Müştəri adı')
add_signature_line(doc, 'İmza')
add_signature_line(doc, 'Tarix')

doc.add_paragraph()
p = doc.add_paragraph('— Sənəd sonu —')
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
for run in p.runs:
    run.italic = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)

# ── Saxla ──
out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Eventrent_Deyisiklik_Plani.docx')
doc.save(out_path)
print(f'Yaradıldı: {out_path}')
