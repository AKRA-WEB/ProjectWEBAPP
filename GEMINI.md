# AKRA Web Apps Migration - Project Workflow

This project is a migration of the AKRA Web Applications from Google Apps Script (GAS) and Google Sheets to a modern stack using **Supabase (PostgreSQL)** for the backend and **Vue.js/Tailwind CSS** for the frontend.

## 📂 Project Structure

- `index.html`: The central portal (SSO) for all AKRA applications.
- `supabase-client.js`: The core API layer (`AKRA_API`) that communicates with Supabase.
- `PR.html`: Purchase Request application.
- `PO.html`: Purchase Order tracking application.
- `GR.html`: Goods Receipt (Receiving) application.
- `AKRA W5.html`: Warehouse W5 inventory management.
- `Return&Claim.html`: Returns, Claims, and Audit management.
- `KPI.html`: Daily performance tracker.
- `Tranfers W2-W1.html`: Inter-warehouse transfer system.
- `_sql_migration/`: Contains the database schema and initial data scripts.
- `docs/`: Architecture docs, decisions, runbooks, and reference assets.
- `tools/scripts/`: Diagnostic and maintenance Node.js scripts.
- `src/api/CLAUDE.md`: API layer documentation for Claude.
- `src/persistence/CLAUDE.md`: Database schema documentation for Claude.
- `.claude/skills/`: Reusable AI workflows (code-review, refactor, release).
- `.claude/hooks/`: Automation hooks (currently empty).

## ⚠️ File Reorganization Notice (2026-05-08)

The following directories were renamed/moved. Update any paths you have cached:

| Old Path | New Path |
|---|---|
| `_scripts/fix_data.js` | `tools/scripts/fix_data.js` |
| `_scripts/fix_po.js` | `tools/scripts/fix_po.js` |
| `_scripts/test_join.js` | `tools/scripts/test_join.js` |
| `_scripts/test_pr.js` | `tools/scripts/test_pr.js` |
| `_scripts/test_products.js` | `tools/scripts/test_products.js` |
| `_scripts/test_supabase.js` | `tools/scripts/test_supabase.js` |
| `_docs/Migration_Chat_Log.md` | `docs/decisions/Migration_Chat_Log.md` |
| `_docs/Migration_Documentation_EN.md` | `docs/decisions/Migration_Documentation_EN.md` |
| `_docs/Migration_Final_Documentation.md` | `docs/decisions/Migration_Final_Documentation.md` |
| `_docs/Session_Context_Summary.md` | `docs/Session_Context_Summary.md` |
| `_docs/github.txt` | `docs/github.txt` |
| `_docs/Product&Vendor.xlsx` | `docs/Product&Vendor.xlsx` |
| `_docs/notes/AKRA.txt` | `docs/runbooks/AKRA.txt` |
| `_docs/notes/KPI.txt` | `docs/runbooks/KPI.txt` |
| `_docs/notes/Return item.txt` | `docs/runbooks/Return item.txt` |
| `_docs/notes/Supabase.txt` | `docs/runbooks/Supabase.txt` |
| `_docs/notes/Transfer W2-W1.txt` | `docs/runbooks/Transfer W2-W1.txt` |
| `_docs/notes/User.txt` | `docs/runbooks/User.txt` |
| `_docs/notes/Workflow PR-GR-PO.txt` | `docs/runbooks/Workflow PR-GR-PO.txt` |
| `CI/messageImage_1776850337861.jpg` | `docs/brand_colors.jpg` |
| `135228.jpg` | `docs/claude_code_structure.jpg` |
| `Migration_Final_Documentation.md` (root) | Deleted (duplicate — canonical copy is in `docs/decisions/`) |

**Directories removed:** `_scripts/`, `_docs/`, `_docs/notes/`, `CI/`

**New directories added:** `docs/`, `docs/decisions/`, `docs/runbooks/`, `tools/`, `tools/scripts/`, `tools/prompts/`, `src/`, `src/api/`, `src/persistence/`, `.claude/`, `.claude/hooks/`, `.claude/skills/`

**Files that did NOT move:** All `.html` app files, `supabase-client.js`, `CLAUDE.md`, `GEMINI.md`, `PROJECT_STATE.md`, `_sql_migration/` (entire directory unchanged), `Error/` (unchanged).

## 🌐 Localization Standards
- **Language:** All application interfaces (labels, buttons, placeholders, system messages, and notifications) MUST be in **Thai**. 
- **Typography:** Use 'Prompt' as the primary font for Thai text to maintain the Premium Minimal DNA.

## 🔄 Core Workflow

### 1. Unified Authentication (SSO)
- Users log in via `index.html` using their **Employee ID**.
- The portal checks the `users` table for roles and permissions.
- Access to specific apps is controlled via the `app_config` table and user roles.

### 2. Procurement Lifecycle (PR -> PO -> GR)
1.  **Purchase Request (PR):**
    - Staff members submit PRs via `PR.html`.
    - PRs are stored in the `purchase_requests` table with a status of `Pending`.
2.  **Purchase Order (PO):**
    - Purchasing reviews pending PRs in `PO.html`.
    - Approved PRs are grouped by vendor and converted into POs in the `purchase_orders` table.
    - Multiple PRs for the same vendor can be merged into a single PO.
3.  **Goods Receipt (GR):**
    - Warehouse staff receive items against POs in `GR.html`.
    - The system identifies "Overdue" POs (older than 7 days) to prioritize receiving.
    - Items are received into specific locations (`loc_in`) and tracked in the `goods_receipts` table.
    - Supports partial receiving (Draft GR) and "Extra Items" (freebies/unplanned items).

### 3. Warehouse Management (W5)
- **Inventory:** Real-time stock tracking in `w5_inventory`.
- **Transactions:** Every stock change (IN/OUT/ADJUST) is logged in `w5_history`.
- **Picklists:** Warehouse staff can process picklists, which automatically deduct stock upon completion.

### 4. Returns & Claims
- **Customer Returns:** Logged in the `returns` table.
- **Vendor Claims:** Claims for damaged or expired goods are tracked in the `claims` table.
- **Stock Audit:** Periodic audits are created as tasks. Staff verify physical stock against system stock in `audit_tasks`.

### 5. KPI & Performance
- Daily operational metrics are recorded in `daily_records`.
- Any errors or specific tasks are linked to the daily record for comprehensive reporting.

## 🛠️ Key Technical Features

- **Pagination & Fetch All:** The `AKRA_API.fetchAll` helper bypasses Supabase's 1,000-row limit to handle large datasets (e.g., 5,600+ products).
- **UUID Targeting:** Every record uses UUIDs (`pr_uid`, `po_uid`, `gr_uid`) to ensure data integrity during updates and deletions.
- **Real-time Feedback:** Action-driven refreshes ensure the UI stays updated without constant polling.
- **Speech Synthesis (TTS):** Integrated in the GR app to help warehouse staff verify product names and quantities audibly.

## ⌨️ Custom Automation (t2c within CLI)

- **Deep Analysis t2c:** When the user provides a `t2c` instruction, the agent MUST NOT just translate. The agent MUST:
    1. **Investigate:** Read the relevant source files using `read_file` or `grep_search` to understand the current implementation and confirm the issue/context.
    2. **Design:** Formulate a technically precise solution based on the actual code found.
    3. **Generate & Copy:** Translate the optimized solution into a professional English developer prompt and copy it to the user's clipboard.
    4. **Confirm:** State which files were analyzed and why the generated prompt is the best approach for Claude to execute.
- **Project Sync:** If the user says "ตรวจสอบงาน", the agent must perform a full git sync (add, commit with Gemini-generated message, and push to origin master).

## 📝 Maintenance & Documentation Rules

- **Status Updates:** Every time a significant task or implementation is finished, the agent MUST update `PROJECT_STATE.md` with a concise summary of the changes and current progress.
- **Knowledge Capture:** Any new skills, technical patterns, or specific project responsibilities identified during the session MUST be documented in `CLAUDE.md` to ensure continuity across sessions.

## 🚀 Getting Started

1.  **Database Setup:** Run `_sql_migration/schema.sql` in your Supabase SQL Editor.
2.  **Data Import:** Use the `products_insert_v2_chunk_*.sql` and `vendors_insert_v2.sql` scripts to populate master data.
3.  **Local Development:** Open `index.html` in a local browser or serve via Live Server. Ensure `supabase-client.js` has the correct `SUPABASE_URL` and `SUPABASE_KEY`.
