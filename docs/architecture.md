# AKRA Web Apps — Architecture

## Overview

Static HTML SPAs served directly in a browser. No build process. All dependencies (Tailwind CSS, Supabase JS v2, Lucide Icons) loaded from CDN.

## Entry Point & SSO

`index.html` is the central portal. Users authenticate with their Employee ID against the `users` table. On success, `sessionStorage` stores user data and `appConfig`. Every sub-app reads `sessionStorage` on load to verify access — unauthorized users are redirected to the portal.

## Shared API Layer (`supabase-client.js`)

Loaded by every HTML page. Exposes two globals:
- `akraSupabase` — the raw Supabase client (created once via guard)
- `AKRA_API` — named methods for every DB operation

No HTML page creates its own Supabase client. All DB calls go through `AKRA_API`.

## Per-Page SPA Pattern

Each `.html` file is self-contained:
- Embedded `<script>` with full app logic (state, event handlers, render functions)
- Tailwind CSS (CDN) for styling
- Lucide Icons (CDN) for iconography
- Font: Noto Sans Thai (portal) / Prompt (sub-apps)
- Brand: `#171C8F` (Imperial Blue), `#E35205` (Burnt Orange)

## Procurement Lifecycle

```
PR (Pending) → Approved → PO created (Pending GR)
  → Draft GR → Pending Review → GR Completed → PO Closed - Ready for APV
```

## Key Design Constraints

- Supabase returns max 1,000 rows per query — use `AKRA_API.fetchAll()` for large tables
- Status values are PostgreSQL ENUMs — use exact string matches, never write computed values (e.g., "Overdue") to DB
- All records identified by UUID primary keys (`pr_uid`, `po_uid`, `gr_uid`) — never use row index
- `w1_requests` uses user-defined string IDs with upsert (`onConflict: 'id'`)
- `Return&Claim.html` stores raw Supabase snake_case rows directly — no camelCase mapping layer
