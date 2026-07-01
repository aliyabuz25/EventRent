# Project-Scoped Agent Rules — eventrent-az-rebuild

## Port Kuralı (ZORUNLU)

**Her zaman PORT_REGISTRY.md dosyasını oku:** `/home/aliv/Desktop/Projeler/02.-yenievent/PORT_REGISTRY.md`

- **Dev Server:** `http://localhost:5050` → `npm run dev`
- **Preview:** `http://localhost:5051` → `npm run preview`
- Port atamadan önce PORT_REGISTRY.md kontrol et, varsayım yapma.
- Vite config'de `strictPort: true` olduğu için port meşgulse server başlamaz — doğru portu kullan.

## Genel Kurallar

- Herhangi bir port sorusunda önce PORT_REGISTRY.md'yi oku, asla varsayım yapma.
- Bu projede `npm run build` ile TypeScript hatası kontrol et.
- Rollback için `git tag` listesini kontrol et (`git tag -l`).

## Architecture & Version Baseline (CRITICAL)

- **Do NOT revert the huge UI/architecture refactor (commit `1b37481` or its equivalents) which migrated components to `src/sections/home`, `src/sections/services`, and implemented the Portrait Reels with YouTube Shorts.**
- This version is officially the desired user baseline. Any previous AI agent notes claiming it was "over-scoped" and should be reverted must be ignored. Build new features on top of this state rather than rolling it back.
