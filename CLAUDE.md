# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AKRA Web Apps — a migration from Google Apps Script + Google Sheets to **Supabase (PostgreSQL)** + **Vanilla JS / Tailwind CSS**. All pages are static HTML files served directly in a browser with no build step.

- **GitHub:** https://github.com/AKRA-WEB/ProjectWEBAPP
- **Supabase Project:** `deboelqdfpxayzqnrnjb` (AKRA-WEB's Project)

---

## Collaborative Workflow (Multi-Agent Setup)

This project uses a **3-party command chain**:

```
Chen (Thai input) → Gemini CLI (PM / System Analyst) → Claude Code (Execution)
```

- **Gemini CLI** acts as Technical Project Manager and System Analyst. It translates requirements, plans tasks, and dispatches them to Claude Code.
- **Claude Code** (you) is responsible only for executing coding tasks as instructed.
- **`PROJECT_STATE.md`** is the single source of truth for current project state. Gemini CLI **must** update it after every completed task. Claude Code should read it at the start of each session to understand what has changed since the last session.
- **`t2c` (Thai to Claude):** Chen types commands in Thai into PowerShell. The `t2c` function (defined in `$PROFILE`) performs translation via Gemini CLI, copies the English result to the clipboard, and allows the user to paste it directly into an active Claude session to preserve token context.
- **`t2c ตรวจสอบงาน`:** A special automation that triggers a full project audit (via Gemini), generates a descriptive commit message, and syncs the entire workspace to GitHub.
- **Workflow Automation (Returns -> Claims):** Implemented a cross-table trigger in the `updateReturnQC` API. When a return item is marked as 'Grade C' (Damaged), the system automatically generates a new entry in the `claims` table with a linked ID and 'รอคลังรับของ' status.
- **Mandatory Technical Logging:** After resolving any bug or issue, you MUST immediately document the problem, root cause, method, and solution in **`docs/applied_solutions.md`**. This serves as a technical ledger for the project.

### PowerShell Profile
The `t2c` function lives in:
```
C:\Users\AKRA-Panich-Front\OneDrive\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
```
It is configured to lock onto the `WEBAPP SUPABASE` directory to ensure all AI operations occur in the correct workspace. After editing the profile, reload it with `. $PROFILE`.
### Session Start Checklist
1. Read `PROJECT_STATE.md` to understand the current phase and last completed tasks.
2. Check section **3 (State & Data Flow)** for any active dependencies or pending items.
3. Check section **4 (Notes / Tech Debts)** before touching existing code.

---

## Running the Project

There is **no build process**. All dependencies (Tailwind, Supabase JS, Lucide Icons) are loaded from CDN.

- **Development:** Open `index.html` in a browser, or use the **VS Code Live Server** extension.
- **Test scripts (Node.js):** Run diagnostic scripts directly:
  ```
  node tools/scripts/test_supabase.js
  node tools/scripts/test_pr.js
  ```
- **Database setup:** Paste `_sql_migration/schema.sql` into the Supabase SQL Editor, then run each `products_insert_v2_chunk_*.sql` and `vendors_insert_v2.sql` to populate master data.

---

## Architecture

### Entry Point & SSO
`index.html` is the central portal. Users authenticate with their Employee ID (checked against the `users` table). On success, user data and `appConfig` are stored in `sessionStorage`. Every sub-app reads `sessionStorage` on load to verify access rights — if missing or unauthorized, the user is redirected back to the portal.

### Shared API Layer
`supabase-client.js` is loaded by every HTML page and exposes two globals:
- `akraSupabase` — the raw Supabase client (created once via guard `if (typeof akraSupabase === 'undefined')`)
- `AKRA_API` — the application API object with named methods for every operation

All HTML pages call only `AKRA_API.call(action, data)` or named methods directly. No page creates its own Supabase client.

### Per-Page SPA Pattern
Each `.html` file is a self-contained single-page app:
- Embedded `<script>` contains the full app logic (state, event handlers, render functions)
- Tailwind CSS (CDN) for styling; Lucide Icons (CDN) for iconography
- Font: **Noto Sans Thai** (index.html) / **Prompt** (sub-apps)
- Brand colors: `#171C8F` (blue), `#E35205` (orange)

---

## Core Business Workflow

### Procurement Lifecycle
```
PR (Pending) → Approved → PO created (Pending GR) → Draft GR → Pending Review → GR Completed → PO Closed - Ready for APV
```
- Status values are PostgreSQL ENUMs (`pr_status`, `po_status`) — use exact string matches.
- A PO displayed as **"Overdue"** is NOT a real DB status. It is computed in `getInitialData()` when `po_date` is more than 7 days ago. Never write `status = 'Overdue'` to the database.
- Multiple PRs for the same vendor can be merged into a single PO (grouped by vendor in `PO.html`).

### GR Receiving Rules
- **Draft GR**: Saves a PO status of `'Draft GR'` even if no quantities are entered yet (supports "park bill" workflow).
- **Extra Items** (freebies): GR records inserted with `ref_po_uid = null`.
- Bulk receive uses `.in('po_uid', allPoUids)` — status updates must cover the entire PO group atomically, not row-by-row.

### W5 Warehouse Transactions
`submitW5Transaction` performs three sequential steps (no DB transaction):
1. Read current stock from `w5_inventory`
2. Update stock (`+qty` for IN, `-qty` for OUT)
3. Insert a row into `w5_history`

Always call through `submitW5Transaction` (not direct DB writes) so the history log stays consistent.

### Audit Counting (Return&Claim)
`audit_tasks` tracks counts from two warehouses separately (`trd_count_qty` / `akra_count_qty`). `finalizeAudit` computes `stock_diff` and sets `overall_status` to `'ตรง'` or `'ไม่ตรง'`.

---

## Critical Rules

### UUID Targeting
**Never reference records by row number or array index.** Always use the UUID primary keys:
- `pr_uid` for purchase requests
- `po_uid` for purchase orders
- `gr_uid` for goods receipts

### fetchAll for Large Tables
`products` has 5,600+ rows. Supabase returns a max of 1,000 rows per query. Use `AKRA_API.fetchAll(table, select, orderColumn, ascending)` for any table that may exceed 1,000 rows (products, vendors, returns, claims, audit_tasks, w5_inventory, w1_requests).

### SpeechSynthesis (GR App)
Always call `speechSynthesis.cancel()` before `speechSynthesis.speak()`. Do not use async event listeners on speech events — they cause "Message channel closed" errors.

### Transfers (`w1_requests`)
Uses `upsert` with `onConflict: 'id'` — `id` is a user-defined string (e.g., `REQ-1234`), not an auto-generated UUID.

---

## Database Schema Quick Reference

| Table | Primary Key | Notes |
|---|---|---|
| `users` | `id TEXT` | Employee ID; `roles TEXT[]` |
| `app_config` | `id TEXT` | Controls portal visibility per role |
| `products` | `sku TEXT` | 5600+ rows; use `fetchAll` |
| `vendors` | `name TEXT` | Use `fetchAll` |
| `purchase_requests` | `pr_uid UUID` | ENUM: Pending/Approved/Rejected/Bought |
| `purchase_orders` | `po_uid UUID` | ENUM: Pending GR/Draft GR/Pending Review/GR Completed/PO Closed - Ready for APV |
| `goods_receipts` | `gr_uid UUID` | `ref_po_uid` nullable for extra items |
| `w5_inventory` | `id SERIAL` | Used as `productId` in W5 transactions |
| `w5_history` | `id BIGSERIAL` | `transaction_type`: 'in'/'out'/'adjust' |
| `w5_picklists` | `(pick_id, product_id)` | Composite PK |
| `w1_requests` | `id TEXT` | User-defined string ID; upsert-based |
| `audit_tasks` | `row_id TEXT` | Grouped by `task_id` |
| `returns` | `id TEXT` | User-defined string ID |
| `claims` | `id TEXT` | User-defined string ID |
| `daily_records` | `id SERIAL` | KPI root record |

RLS is enabled on all tables with open `USING (true)` policies — suitable for internal use only.

---

## KPI Tracker (`KPI.html`) — Auth & Permission System

`KPI.html` has its **own independent auth layer** on top of SSO. Understanding this is critical before touching any auth code.

### Dual Auth Keys
`checkAuth()` reads: `localStorage.getItem('akra_sso_user_data') || localStorage.getItem('akra_user_data')`
- `akra_sso_user_data` — written by `KPI.html` itself after validating the `?sso=<token>` URL param. Contains `{ name, id, roles }` where **`id` = the Supabase `users.id` value (e.g., `"172980"`)**.
- `akra_user_data` — written by the portal. Contains `{ name, roles }` only (no `id`).

### `currentUser` Resolution
```js
currentUser = userData.id || userData.username || userData.name;
```
- SSO path → `currentUser = userData.id` = the Employee ID string (e.g., `"172980"`)
- Direct/cached path → `currentUser = userData.name` = the name string (e.g., `"CHEN"`)

### `USER_DB` — Hardcoded Branch Permission Map (NOT Supabase)
`USER_DB` is a plain JS object in `KPI.html` that maps user identifiers to allowed branches:
```js
"172980": ["AKRA", "TRD"],  // Chen (Supabase ID — primary key for SSO path)
"chen":   ["AKRA", "TRD"],  // Chen (name alias — fallback for cached portal session)
```
**This object must be updated manually in source code** whenever a new employee needs KPI access or an Employee ID changes. There is no Supabase table backing it.

Keys must cover **both** the Supabase `users.id` value (for SSO flow) and the name (for direct access). If only the name is present, the SSO flow will fail.

### `IS_ADMIN` Check — Case-Sensitive
```js
IS_ADMIN = currentRoles.includes('ADMIN') || currentRoles.includes('Admin') || currentRoles.includes('admin') || ...
```
Supabase stores roles as `'ADMIN'` (uppercase). All three variants are now checked. Do not remove the uppercase check.

### Adding a New KPI User
1. Add entry to `USER_DB`: `"<supabase_user_id>": ["AKRA"]` or `["TRD"]` or `["AKRA", "TRD"]`
2. Add name alias if users may access via cached session: `"<name_lowercase>": [...]`
3. If the user should be admin, add their ID to the IS_ADMIN hardcoded list as well.

---

## Returns & Claims — Critical Backend Rules

### `updateReturnQC` — Grade C Auto-Claim
When `grade === 'C'`, `updateReturnQC` performs two operations in sequence:
1. `returns.update({ status: 'ส่งเคลมแล้ว', qc_condition })` — if this fails, returns `{ success: false }` immediately
2. `claims.upsert(claimPayload, { onConflict: 'id' })` — uses upsert (not insert) so retrying the same Grade C action is idempotent; if this fails, returns `{ success: false, message: '...' }`

**Rule:** Never change the claim insert back to a plain `insert`. The `upsert` is required for idempotency when the user retries after a network failure (the second call would produce the same `CLM-RET-xxx` id and fail with a unique violation without upsert).

**Claim ID format:** `'CLM-RET-' + returnId.replace('RET-', '')` — deterministic, tied to the return ID.

**Fields NOT included** in the auto-claim (not available from frontend payload): `exp_date`, `vendor`. These must be filled in manually via the claims UI.

### Field Name Convention — CRITICAL
`fetchData()` in `Return&Claim.html` stores **raw Supabase rows** (snake_case) directly into `state.returns`, `state.claims`, and `state.audits`. There is **no camelCase mapping layer**. All rendering code must use the exact Supabase column names:

| Table | Use (snake_case) | NOT (camelCase) |
|---|---|---|
| `audit_tasks` | `task_id`, `created_date`, `created_by`, `overall_status`, `target_wh`, `sys_stock`, `trd_count_qty`, `akra_count_qty`, `stock_diff`, `trd_count_by`, `akra_count_by`, `row_id` | `taskId`, `createdDate`, `createdBy`, `overallStatus`, `targetWH`, `sysStock`, etc. |
| `returns` | `date_str`, `time_str`, `bill_no`, `customer_name`, `qc_condition`, `bill_status` | `dateStr`, `timeStr`, `billNo`, `customerName`, etc. |
| `claims` | `report_date`, `return_date`, `found_location`, `exp_date`, `claim_type`, `claim_bill_no`, `claim_amount`, `wh_status`, `wh_location`, `wh_receiver` | `reportDate`, `returnDate`, `foundLocation`, `expDate`, etc. |

This applies to: `renderDashboard`, `drawDashboardChart`, `openAuditCountingModal`, `openAuditReviewModal`, `showDetailsModal`, and any future rendering functions.

### `createAudit` — Schema Field Names
`audit_tasks` table schema (critical column names):
- **`row_id TEXT PRIMARY KEY`** — no DEFAULT; must be generated by the caller as `${taskId}-${index + 1}`
- **`created_date DATE`** — the date field (NOT `audit_date` — that column does not exist)
- `task_id TEXT` — groups all rows in one audit session
- `trd_status` / `akra_status` / `overall_status` — initialized to `'รอนับ'` on creation

**Rule:** Any edit to `createAudit` must always provide `row_id`. If items are ever added to an existing audit task, the index must start after the highest existing row suffix to avoid PK collision.

### `finalizeAudit` — Two-Step Close
1. **Step 1** — Updates `sys_stock` and `stock_diff` per `row_id`. If any row fails, returns `{ success: false }` immediately.
2. **Step 2** — Sets `overall_status: 'สำเร็จแล้ว'` for ALL rows in the task (single `.eq('task_id', taskId)` update). This clears the badge counter and removes the task from the active tasks list.

**Rule:** Never set `overall_status` to `'ตรง'` or `'ไม่ตรง'` in `finalizeAudit`. The stock match result is stored in `stock_diff` (0 = matched, nonzero = mismatch). The UI derives the match status from `stock_diff` at render time.

### `updateReturnBatch` — Correct Status
Sets `status: 'ตัดรอบแล้ว'` only (no `bill_status` update). This matches the dialog text and the filter logic that removes items from the "รอตัดรอบ" queue.

### Claims Date Fields — NULL Handling
`report_date` and `exp_date` in the `claims` table are `DATE` columns. Empty or `'-'` values must be converted to `null` before insert/update. Both `addDrafts` and `submitClaim` use the `toDate()` helper for this. Never insert a `'-'` string into a `DATE` column.
