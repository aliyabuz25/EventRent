# Runbook: Verification Checklist

## UI
- Navbar sol anchor tam soldadır.
- Desktop nav hover/active state premium və stabil görünür.
- Mobile menu açılıb bağlanma ritmi düzgündür.

## Functional
- Cart count localStorage dəyişiklikləri ilə yenilənir.
- Auth state-ə görə profile/login ikonları doğru dəyişir.

## Accessibility
- `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed` yoxlanıb.
- Klaviatura ilə fokus görünürlüğü var.

## Production
- Canlı domen 200.
- Route fallback işləyir (`try_files ... /index.html`).
