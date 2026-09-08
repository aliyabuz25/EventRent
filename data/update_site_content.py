#!/usr/bin/env python3
"""
data/site-content.json'a home.team ve home.clients bölümlerini ekler.
content.default.ts ile aynı veriyi kullanır.
"""
import json

TEAM_MEMBERS = [
    {
        "name": {"az": "Pərvin Qasımov", "en": "Parvin Gasimov", "ru": "Парвин Касумов", "tr": "Parvin Kasımov"},
        "role": {"az": "Həmtəsisçi / Direktor", "en": "Co-founder / Director", "ru": "Соучредитель / Директор", "tr": "Kurucu / Direktör"},
        "description": {"az": "Tədbir idarəçiliyi və kreativ planlama sahəsində təcrübəli komanda lideridir. Böyükmiqyaslı layihələrin strategiyası, planlaşdırılması və icrasını idarə edir.", "en": "An experienced team leader in event management and creative planning. Manages strategy, planning and execution of large-scale projects.", "ru": "Опытный руководитель команды в сфере управления мероприятиями и креативного планирования. Управляет стратегией, планированием и реализацией масштабных проектов.", "tr": "Etkinlik yönetimi ve yaratıcı planlama alanında deneyimli bir ekip lideridir. Büyük ölçekli projelerin stratejisini, planlamasını ve uygulanmasını yönetir."},
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
        "name": {"az": "Qalib Kazımlı", "en": "Galib Kazimli", "ru": "Галиб Казымлы", "tr": "Galib Kazımlı"},
        "role": {"az": "Həmtəsisçi / İcraçı Direktor", "en": "Co-founder / Executive Director", "ru": "Соучредитель / Исполнительный директор", "tr": "Kurucu / İcra Direktörü"},
        "description": {"az": "Satış strategiyalarının idarə olunması və biznes əlaqələrinin inkişafına rəhbərlik edir. Müştəri münasibətləri və kommersiya yanaşmasını effektiv idarə edir.", "en": "Leads sales strategy management and business relationship development. Effectively manages client relations and commercial approach.", "ru": "Руководит управлением стратегий продаж и развитием деловых связей. Эффективно управляет клиентскими отношениями и коммерческим подходом.", "tr": "Satış stratejilerinin yönetimine ve iş ilişkilerinin gelişimine öncülük eder. Müşteri ilişkilerini ve ticari yaklaşımı etkili bir şekilde yönetir."},
        "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
    {
        "name": {"az": "Malik Bağırov", "en": "Malik Bagirov", "ru": "Малик Багиров", "tr": "Malik Bağırov"},
        "role": {"az": "Kreativ Direktor", "en": "Creative Director", "ru": "Креативный директор", "tr": "Kreatif Direktör"},
        "description": {"az": "Brend ruhunu müasir trendlərlə birləşdirir. Yaradıcı baxış tərzi və innovativ yanaşması ilə layihələrin konseptual istiqamətini formalaşdırır.", "en": "Combines brand spirit with modern trends. Shapes the conceptual direction of projects with a creative vision and innovative approach.", "ru": "Объединяет дух бренда с современными тенденциями. Формирует концептуальное направление проектов с помощью творческого видения и инновационного подхода.", "tr": "Marka ruhunu modern trendlerle birleştirir. Yaratıcı bakış açısı ve yenilikçi yaklaşımıyla projelerin kavramsal yönünü şekillendirir."},
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    },
    {
        "name": {"az": "Aysel Şirinova", "en": "Aysel Shirinova", "ru": "Айсель Ширинова", "tr": "Aysel Şirinova"},
        "role": {"az": "Satış şöbəsinin müdiri", "en": "Head of Sales", "ru": "Руководитель отдела продаж", "tr": "Satış Bölümü Müdürü"},
        "description": {"az": "Satış proseslərini idarə edir. Komanda performansının artırılmasında effektiv liderlik edir.", "en": "Manages sales processes. Provides effective leadership in improving team performance.", "ru": "Управляет процессами продаж. Обеспечивает эффективное руководство в повышении производительности команды.", "tr": "Satış süreçlerini yönetir. Ekip performansının artırılmasında etkili liderlik sağlar."},
        "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    },
    {
        "name": {"az": "Yasin Əhmədov", "en": "Yasin Ahmadov", "ru": "Ясин Ахмедов", "tr": "Yasin Ahmedov"},
        "role": {"az": "Layihə meneceri", "en": "Project Manager", "ru": "Менеджер проектов", "tr": "Proje Yöneticisi"},
        "description": {"az": "Dinamik idarəetmə bacarığı və təşkilati yanaşması ilə müxtəlif tədbir və layihələri idarə edir.", "en": "Manages various events and projects with dynamic management skills and an organizational approach.", "ru": "Управляет различными мероприятиями и проектами с помощью динамичных управленческих навыков и организационного подхода.", "tr": "Dinamik yönetim becerileri ve örgütsel yaklaşımıyla çeşitli etkinlik ve projeleri yönetir."},
        "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    },
    {
        "name": {"az": "Nərmin Tarverdiyeva", "en": "Narmin Tarverdiyeva", "ru": "Нармин Тарвердиева", "tr": "Nermin Tarverdiyeva"},
        "role": {"az": "Dizayner", "en": "Designer", "ru": "Дизайнер", "tr": "Tasarımcı"},
        "description": {"az": "Vizual konsept və kreativ həllərə rəhbərlik edir. Müasir və estetik yanaşması ilə layihələrə fərqlilik qatar.", "en": "Leads visual concepts and creative solutions. Adds distinction to projects with a modern and aesthetic approach.", "ru": "Руководит визуальными концепциями и креативными решениями. Придаёт проектам уникальность современным и эстетическим подходом.", "tr": "Görsel konsept ve yaratıcı çözümlere öncülük eder. Modern ve estetik yaklaşımıyla projelere farklılık katar."},
        "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    },
    {
        "name": {"az": "Aysu Məmmədova", "en": "Aysu Mammadova", "ru": "Айсу Мамедова", "tr": "Aysu Memmedova"},
        "role": {"az": "Ofis menecer", "en": "Office Manager", "ru": "Офис-менеджер", "tr": "Ofis Müdürü"},
        "description": {"az": "Rəsmi sənədləşmə və qeydiyyat üzrə mütəxəssis. Layihələr zamanı araşdırma işlərini həyata keçirir.", "en": "Specialist in official documentation and registration. Conducts research during projects.", "ru": "Специалист по официальной документации и регистрации. Проводит исследования во время проектов.", "tr": "Resmi belgeleme ve kayıt uzmanı. Projeler sırasında araştırma çalışmalarını yürütür."},
        "image": "https://images.unsplash.com/photo-1580489944761-9a91e4d51ab7?q=80&w=400&auto=format&fit=crop",
    },
]

CLIENTS_LIST = [
    {"name": "Heydər Əliyev Fondu", "logo": None, "url": "https://heydaraliyevfoundation.az"},
    {"name": "Azərbaycan Turizm Agentliyi", "logo": None, "url": "https://tourism.gov.az"},
    {"name": "Rusiya Səfirliyi", "logo": None, "url": "https://azerbaijan.mid.ru"},
    {"name": "İçərişəhər Qoruğu", "logo": None, "url": "https://icherisheher.gov.az"},
    {"name": "Azərbaycan Güləş Federasiyası", "logo": None, "url": "https://wrestling.az"},
    {"name": "Azərbaycan Badminton Federasiyası", "logo": None, "url": "https://badminton.az"},
    {"name": "Azərbaycan Cüdo Federasiyası", "logo": None, "url": "https://judo.az"},
    {"name": "Abşeron Ticarət Mərkəzi", "logo": None, "url": "https://absheron.az"},
    {"name": "Mərkəzi Bank", "logo": None, "url": "https://cba.az"},
    {"name": "Paşa Sığorta", "logo": None, "url": "https://pashainsurance.az"},
    {"name": "Azal", "logo": None, "url": "https://azal.az"},
    {"name": "Tabaterra", "logo": None, "url": "https://tabaterra.az"},
    {"name": "Paşa Kapital", "logo": None, "url": "https://pashacapital.az"},
    {"name": "Azərsun", "logo": None, "url": "https://azersun.com"},
    {"name": "Bazarstore", "logo": None, "url": "https://bazarstore.az"},
    {"name": "Norm Sement", "logo": None, "url": "https://norm.az"},
    {"name": "Avropa İttifaqı", "logo": None, "url": "https://europa.eu"},
    {"name": "Q STP", "logo": None, "url": "https://qstp.az"},
    {"name": "Bakı Dövlət Universiteti", "logo": None, "url": "https://bsu.edu.az"},
    {"name": "Odlar Yurdu Universiteti", "logo": None, "url": "https://oyu.edu.az"},
    {"name": "Azərxalça", "logo": None, "url": "https://azerkhalcha.az"},
    {"name": "Paşa Mall", "logo": None, "url": "https://pashamall.az"},
    {"name": "SOCAR", "logo": "/logos/socar.svg", "url": "https://socar.az"},
]

TEAM_SECTION = {
    "badge": {"az": "Komanda", "en": "Team", "ru": "Команда", "tr": "Ekip"},
    "title": {"az": "Arxanızda", "en": "Behind You", "ru": "За вами", "tr": "Arkanızda"},
    "titleAccent": {"az": "Peşəkarlar", "en": "Professionals", "ru": "Профессионалы", "tr": "Profesyoneller"},
    "members": TEAM_MEMBERS,
}

CLIENTS_SECTION = {
    "badge": {"az": "Etibar Edənlər", "en": "Trusted By", "ru": "Нам доверяют", "tr": "Güvenenler"},
    "title": {"az": "Müştərilərimiz", "en": "Our Clients", "ru": "Наши клиенты", "tr": "Müşterilerimiz"},
    "subtitle": {"az": "50+ brend bizə etibar edir", "en": "50+ brands trust us", "ru": "50+ брендов доверяют нам", "tr": "50+ marka bize güveniyor"},
    "clients": CLIENTS_LIST,
}

# JSON'u oku
with open('data/site-content.json', 'r', encoding='utf-8') as f:
    content = json.load(f)

# team ve clients ekle
content['home']['team'] = TEAM_SECTION
content['home']['clients'] = CLIENTS_SECTION

# JSON'u yaz (indent=2, ensure_ascii=False)
with open('data/site-content.json', 'w', encoding='utf-8') as f:
    json.dump(content, f, indent=2, ensure_ascii=False)
    f.write('\n')

print('site-content.json güncellendi')
print('home keys:', list(content['home'].keys()))
print(f'team members: {len(TEAM_MEMBERS)}')
print(f'clients: {len(CLIENTS_LIST)}')
