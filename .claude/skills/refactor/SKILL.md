# Refactor Skill — AKRA Web Apps

## Constraints Before Refactoring

1. **No build step** — any import/module syntax breaks the app. All code stays as inline `<script>` or loaded via `<script src>` with CDN URLs.
2. **Shared globals** — `akraSupabase` and `AKRA_API` are global. Do not wrap in modules or change their names.
3. **snake_case data** — Supabase returns raw snake_case column names. Any new rendering code must use snake_case. Do not introduce a mapping layer unless refactoring ALL existing rendering code at the same time.
4. **SSO session** — Every sub-app depends on `sessionStorage` keys set by `index.html`. Do not rename these keys.

## Safe Refactoring Patterns

- Extract repeated render logic into named functions within the same `<script>` block
- Consolidate duplicate `AKRA_API` calls at the top of `fetchData()` rather than scattered across handlers
- Replace inline status string literals with a shared `const STATUS = { ... }` object (within same file)

## What NOT to Refactor

- Do not split HTML files into separate JS files without confirming the dev server can serve them
- Do not change `AKRA_API` method signatures without updating every caller
- Do not rename DB column references without cross-checking against `supabase-client.js` schema
