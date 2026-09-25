# GLOBAL PORT REGISTRY

**DIQQƏT BÜTÜN AJANLARA (ATTENTION ALL AGENTS):** 
Hər hansı bir tətbiqi, testi və ya servisi işə salmazdan və ona port təyin etməzdən əvvəl bu faylı oxumaq **ZƏRURİDİR**.

## Ajanlar üçün İş Axını (Agent Workflow)
1. Yeni bir servisə port lazımdırsa, bu siyahıda olmayan və ya "AVAILABLE" olan bir port seçin.
2. Seçdiyiniz portu istifadə etməyə başladıqda dərhal bu faylı güncəlləyin və statusunu "IN_USE" olaraq qeyd edin.
3. Əsas layihə KƏSİNLİKLƏ **5050** portunda işləməlidir.

## Port Siyahısı (Port List)

| Port | Servis / Uygulama | Status | Qeyd |
| :--- | :--- | :--- | :--- |
| **5050** | `eventrent-az-rebuild` (Main Vite Server) | **IN_USE** | Əsas dev server. Mütləq bu portda çalışmalıdır. |
| 5051 | `vite preview` | RESERVED | Preview üçün ehtiyatda saxlanılıb. |
| 5173 | Vite (Default) | RESERVED / AVOID | Çaqışma ehtimalına qarşı istifadə etməyin. |
| 6333 | Playwright Test Server | AVAILABLE | Testlər üçün istifadə oluna bilər. |
| 8080 | Generic Server | AVAILABLE | Ehtiyac olduqda istifadə oluna bilər. |
| 3000 | Generic Server | AVAILABLE | Ehtiyac olduqda istifadə oluna bilər. |