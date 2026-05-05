# Runbook: Deploy Checklist

## Scope
Frontend/backend stack yeniləməsi (Portainer + Traefik).

## Preconditions
- Stack file hazırdır: `stack.portainer.yml`
- Image build tamamlanıb
- Portainer auth məlumatı environment-dədir

## Steps
1. Frontend build et (`npm run build`).
2. Portainer stack update et (`pullImage=true`, `prune=true`).
3. Servislərin ayağa qalxmasını gözlə və health yoxla.

## Verification
- `https://eventrent.octotech.az` 200 qaytarmalıdır.
- `/api` route backend-ə doğru yönlənməlidir.

## Rollback
- Əvvəlki stack file/image tag ilə stack update et.
- Domen cavabını yenidən verify et.
