# Admin Panel — Nav Visibility Toggle

> **AUTO-TRIGGER:** Admin panel qurularkən bu runbook avtomatik işə düşməlidir.
> Admin paneldə "Səhifə Görünürlüyü" bölməsi əlavə edilərkən aşağıdakı spesifikasiyaya əməl et.

---

## Məqsəd

`/tv` səhifəsi navbarda `hiddenByDefault: true` ilə gizlədilib.
Admin panel bu səhifəni (və gələcəkdə digər gizli səhifələri) aktivləşdirə bilməlidir.

---

## Mövcud Mexanizm

**localStorage key:** `nav_page_visibility`

**Format:**
```json
{ "/tv": true }
```

**Navbar oxuma mexanizmi** (`src/components/Navbar.tsx`):
- `getNavVisibility()` → localStorage-dan oxuyur
- `navVisibility` state → `window` event `nav-visibility-changed` ilə yenilənir
- `visibleNavLinks` → `hiddenByDefault: true` olan linklər yalnız `navVisibility[path] === true` olduqda göstərilir

---

## Admin Panel-də Edilməsi Lazım Olan

Admin paneldə **"Səhifə İdarəetməsi"** bölməsi yarad:

### Toggle funksiyası:
```ts
export function setNavPageVisible(path: string, visible: boolean) {
  const current = JSON.parse(localStorage.getItem('nav_page_visibility') || '{}');
  if (visible) {
    current[path] = true;
  } else {
    delete current[path];
  }
  localStorage.setItem('nav_page_visibility', JSON.stringify(current));
  window.dispatchEvent(new Event('nav-visibility-changed'));
}
```

### UI komponent:
- Hər `hiddenByDefault: true` olan link üçün toggle switch göstər
- `/tv` — "TV & LED Səhifəsi" label-ı ilə
- Toggle-un cari vəziyyəti `nav_page_visibility` localStorage-dan oxunur
- Dəyişiklik dərhal navbara əks olunur (event dispatch vasitəsilə)

### Gizli səhifələrin tam siyahısı (hal-hazırda):
| Path  | Label         | Default |
|-------|---------------|---------|
| `/tv` | TV & LED      | gizli   |

---

## Qeydlər

- Səhifə özü (`/tv` route) hər zaman mövcuddur — yalnız navbar linki gizlənir
- Admin birbaşa URL-ə daxil ola bilər
- Gələcəkdə yeni səhifə gizlətmək istəsən `navLinks` array-ə `hiddenByDefault: true` əlavə et — admin panel avtomatik onu da göstərəcək