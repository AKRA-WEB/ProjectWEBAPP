# Persistence Layer — Supabase Database

Project: `deboelqdfpxayzqnrnjb` (AKRA-WEB's Project)

RLS is enabled on all tables with open `USING (true)` policies — internal use only.

Full schema: `_sql_migration/schema.sql`

## Tables

| Table | Primary Key | Notes |
|---|---|---|
| `users` | `id TEXT` | Employee ID; `roles TEXT[]` |
| `app_config` | `id TEXT` | Controls portal visibility per role |
| `products` | `sku TEXT` | 5600+ rows — always use `fetchAll` |
| `vendors` | `name TEXT` | Use `fetchAll` |
| `purchase_requests` | `pr_uid UUID` | ENUM: Pending/Approved/Rejected/Bought |
| `purchase_orders` | `po_uid UUID` | ENUM: Pending GR/Draft GR/Pending Review/GR Completed/PO Closed - Ready for APV |
| `goods_receipts` | `gr_uid UUID` | `ref_po_uid` nullable for extra/freebie items |
| `w5_inventory` | `id SERIAL` | Stock levels; never write directly — use `submitW5Transaction` |
| `w5_history` | `id BIGSERIAL` | `transaction_type`: 'in'/'out'/'adjust' |
| `w5_picklists` | `(pick_id, product_id)` | Composite PK |
| `w1_requests` | `id TEXT` | User-defined string; upsert with `onConflict: 'id'` |
| `audit_tasks` | `row_id TEXT` | No DEFAULT — caller must generate as `${taskId}-${index+1}` |
| `returns` | `id TEXT` | User-defined string ID |
| `claims` | `id TEXT` | Auto-claims use format `CLM-RET-<number>` |
| `daily_records` | `id SERIAL` | KPI root record |

## Critical Column Names (audit_tasks)

- `row_id` — TEXT PRIMARY KEY, no DEFAULT
- `created_date` — DATE (NOT `audit_date` — that column does not exist)
- `task_id` — groups rows in one audit session
- `trd_status` / `akra_status` / `overall_status` — initialized to `'รอนับ'`

## Computed vs Stored Status

- **"Overdue"** on POs is computed in the UI when `po_date` is > 7 days ago. Never stored in DB.
- `overall_status` on `audit_tasks` is set to `'ตรง'` or `'ไม่ตรง'` by `finalizeAudit`.
