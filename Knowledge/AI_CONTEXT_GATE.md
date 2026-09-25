# AI_CONTEXT_GATE

Claude Code üçün bu layihədə minimum-token işləmə qapısı.

## Read Order (strict)

1. `CLAUDE.md` (project rules)
2. `Knowledge/MEMORY_INDEX.md` (MOC)
3. Lazımdırsa yalnız bir runbook və ya bir ADR

## Stop Rules

- 3 fayldan çox oxumağa keçməzdən əvvəl səbəbi bir cümlə ilə yaz.
- Eyni məlumatı ikinci dəfə oxuma.
- Tarixçəli/archived qeydlərə yalnız cari task bloklanıbsa keç.

## Note Shape (for persistence)

- Fact: nə dəyişdi?
- Why: niyə vacibdir?
- Next: növbəti addım nədir?

## Hard Limits

- Aktiv mövzu sayı: maksimum 5
- Hər yeni qeyd: maksimum 8 sətir
- Həftəlik arxivləmə: passiv qeydlər `99-Archive`
