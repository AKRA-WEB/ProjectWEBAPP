# API Layer — `supabase-client.js`

The single shared file loaded by every HTML page. Exposes two globals: `akraSupabase` (raw client) and `AKRA_API` (application methods).

## Key Methods

| Method | Purpose |
|---|---|
| `AKRA_API.login(employeeId)` | Authenticate against `users` table |
| `AKRA_API.fetchAll(table, select, orderCol, asc)` | Paginated fetch for tables > 1000 rows |
| `AKRA_API.getInitialData()` | Load PRs, POs, vendors for procurement apps |
| `AKRA_API.createPR(payload)` | Insert new purchase request |
| `AKRA_API.approvePR(prUid)` | Update PR status to Approved |
| `AKRA_API.createPO(payload)` | Create PO from one or more approved PRs |
| `AKRA_API.submitGR(payload)` | Submit goods receipt, close PO |
| `AKRA_API.submitW5Transaction(payload)` | W5 stock in/out/adjust (always via this method) |
| `AKRA_API.updateReturnQC(payload)` | QC a return; Grade C auto-creates a claim |
| `AKRA_API.createAudit(payload)` | Insert multi-row audit_tasks (provides row_id) |
| `AKRA_API.finalizeAudit(taskId, ...)` | Compute stock_diff, set overall_status |

## Error Convention

All methods return `{ success: boolean, message?: string }`. Always check `result.success` before proceeding.

## Critical Notes

- `fetchAll` is required for: `products` (5600+ rows), `vendors`, `returns`, `claims`, `audit_tasks`, `w5_inventory`, `w1_requests`
- `updateReturnQC` uses `upsert` (not `insert`) for the auto-claim to ensure idempotency on retry
- `submitW5Transaction` must always be used for stock changes — never write to `w5_inventory` directly
