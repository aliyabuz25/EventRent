import urllib.request, json, time

BASE = 'https://erent.octotech.az'
TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBldmVudHJlbnQuYXoiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3OTA0MTU4OTgsImV4cCI6MTc5MTAyMDY5OH0.3uX4fuZCZgk9_b8DtP3piNZIrtD3BRdQklFVi09_V_M'

def post(path, data, auth=False):
    body = json.dumps(data).encode()
    headers = {'Content-Type': 'application/json'}
    if auth:
        headers['Authorization'] = f'Bearer {TOKEN}'
    req = urllib.request.Request(f'{BASE}{path}', data=body, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {'error': f'HTTP {e.code}: {e.read().decode()}'}
    except Exception as e:
        return {'error': str(e)}

orders = [
    {'name':'Eli Hesenov','phone':'0501234501','email':'ali.h@gmail.com','event_date':'2026-11-15','location':'Baki, Neftciler pr.','note':'Toy merasimi - tam sifaris','items':[{'productId':'masa-sandalye','quantity':20}],'source':'website'},
    {'name':'Gunel Memmedova','phone':'0551234502','email':'gunel.m@mail.ru','event_date':'2026-12-01','location':'Sumqayit','note':'Sirket yubileyi ucun','items':[{'productId':'sahne-sistem','quantity':1}],'source':'website'},
    {'name':'Rauf Eliyev','phone':'0701234503','email':'rauf.a@hotmail.com','event_date':'2026-11-20','location':'Baki, 20 Yanvar','note':'Nishan merasimi dekoru','items':[{'productId':'dekor-set','quantity':2}],'source':'website'},
    {'name':'Leyla Quliyeva','phone':'0101234504','email':'leyla.q@gmail.com','event_date':'2026-10-30','location':'Baki, Nizami','note':'Usaq ad gunu - 5 yas','items':[{'productId':'bouncy-castle','quantity':1}],'source':'website'},
    {'name':'Mushfiq Babayev','phone':'0501234505','email':'mushfiq.b@gmail.com','event_date':'2026-11-05','location':'Gence','note':'Korporativ ekipman sifarisi','items':[{'productId':'sound-sistem','quantity':1}],'source':'website'},
    {'name':'Sevinc Ismayilova','phone':'0551234506','email':'sevinc.i@yahoo.com','event_date':'2026-12-10','location':'Baki, Ehmedli','note':'Qirmizi-qizil tema dekor','items':[{'productId':'dekor-set','quantity':1}],'source':'website'},
    {'name':'Kamran Nasirov','phone':'0701234507','email':'kamran.n@gmail.com','event_date':'2027-01-15','location':'Lankaran','note':'Toy paket - 100 nefer','items':[{'productId':'masa-sandalye','quantity':15}],'source':'website'},
    {'name':'Aynur Cafarova','phone':'0101234508','email':'aynur.c@mail.ru','event_date':'2026-11-25','location':'Baki, Binaqadi','note':'Mezuniyyet gecesi ucun sehne','items':[{'productId':'sahne-sistem','quantity':1}],'source':'website'},
    {'name':'Orxan Huseynov','phone':'0501234509','email':'orxan.h@gmail.com','event_date':'2026-10-28','location':'Baki, Sabuncu','note':'Teambuilding oyun destleri','items':[{'productId':'sound-sistem','quantity':1}],'source':'website'},
    {'name':'Nermin Rzayeva','phone':'0551234510','email':'nermin.r@gmail.com','event_date':'2026-12-20','location':'Baki, Xetai','note':'Yeni il korporativi dekoru','items':[{'productId':'dekor-set','quantity':1}],'source':'website'},
    {'name':'Tural Agayev','phone':'0701234511','email':'tural.a@gmail.com','event_date':'2026-11-12','location':'Mingecevir','note':'Sirket gecesi ses sistemi','items':[{'productId':'sound-sistem','quantity':2}],'source':'website'},
    {'name':'Zehra Sultanova','phone':'0101234512','email':'zehra.s@gmail.com','event_date':'2026-12-05','location':'Baki, Yasamal','note':'Xina gecesi enanevi dekor','items':[{'productId':'dekor-set','quantity':1}],'source':'website'},
    {'name':'Elsen Kerimov','phone':'0501234513','email':'elsen.k@outlook.com','event_date':'2027-02-14','location':'Baki, Nerimanov','note':'Sevgililer gunu romantik dekor','items':[{'productId':'dekor-set','quantity':1}],'source':'website'},
]