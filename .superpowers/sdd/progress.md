# SDD Progress Ledger — Eventrent.az Phase 1 Refactor

Branch: main
Started: 2026-06-26
Base commit: 85d3787

## Tasks
- [x] Task 1: App.tsx route registry + auth bootstrap extraction
- [x] Task 2: Layout.tsx decomposition (shell, footer separation)
- [x] Task 3: Navbar.tsx decomposition (config, hooks, presentational split)
- [x] Task 4: services content selectors + ServicesGrid.tsx migration
- [x] Task 5: ServiceDetail.tsx canonical content migration (completed, revert undone by user request)
- [x] Task 6: content.default.ts vs site-content.json role clarification + dead code cleanup (completed)

**NOTE (2026-07-01):** The huge UI/architecture refactor in commit `1b37481` (which included YouTube Shorts in the Portfolio, moved files to `home/` and `services/`, etc.) was previously reverted in `ee5d499` because an agent marked it as "over-scoped". The user explicitly requested to **BRING THIS VERSION BACK**. The revert has been successfully undone and this is now the permanent baseline architecture. DO NOT revert it again.
