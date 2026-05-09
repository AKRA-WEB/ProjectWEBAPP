# Code Review Skill — AKRA Web Apps

When reviewing code changes in this project, check:

## API Layer (`supabase-client.js`)
- [ ] All new DB operations go through `AKRA_API`, not direct `akraSupabase` calls in HTML files
- [ ] Tables with potential > 1000 rows use `AKRA_API.fetchAll()`, not a plain `.select()`
- [ ] `upsert` with `onConflict: 'id'` used wherever idempotency is needed (w1_requests, claims)
- [ ] Errors are captured and returned as `{ success: false, message: error.message }`

## Data Field Names
- [ ] `Return&Claim.html` rendering code uses snake_case column names (no camelCase mapping layer)
- [ ] Status strings match exact PostgreSQL ENUM values — no computed statuses written to DB

## Auth & Permissions
- [ ] New KPI users added to `USER_DB` with both Supabase `users.id` and name alias
- [ ] `IS_ADMIN` check covers all three cases: `'ADMIN'`, `'Admin'`, `'admin'`
- [ ] Sub-apps read `sessionStorage` on load and redirect if unauthorized

## Primary Keys
- [ ] `audit_tasks` inserts always provide `row_id` — no DEFAULT exists in schema
- [ ] `row_id` generated as `${taskId}-${index + 1}` starting from highest existing suffix
- [ ] Records referenced by UUID (`pr_uid`, `po_uid`, `gr_uid`), never by array index

## Speech Synthesis (GR app only)
- [ ] `speechSynthesis.cancel()` called before every `speechSynthesis.speak()`
- [ ] No async event listeners on speech events
