# Migration Project Documentation & Chat Log
**Date:** Wednesday, May 6, 2026
**Project Goal:** Migrate Web Applications from Google Apps Script (GAS) / Google Sheets to Supabase (PostgreSQL).

---

## 1. Executive Summary
- **Backend:** Successfully transitioned from Google Apps Script to **Supabase** (Project ID: `deboelqdfpxayzqnrnjb`).
- **Database:** Replaced Google Sheets with **PostgreSQL**. A new unified schema was designed and implemented via `schema.sql`.
- **Authentication:** Implemented a **Unified SSO** system using a centralized `users` table in Supabase.
- **Frontend:** Preserved all original UI/UX components while refactoring the data layer to use the new **`AKRA_API`** in `supabase-client.js`.
- **Deployment:** The project is hosted on **GitHub Pages** and synchronized with the local **OneDrive Desktop** folder.

---

## 2. Technical Timeline & Troubleshooting

### Phase 1: Infrastructure & Schema Design
- Defined relational tables: `purchase_requests`, `purchase_orders`, `goods_receipts`, `w5_inventory`, `daily_records`, etc.
- Created `supabase-client.js` as the core bridge between the frontend and the database.

### Phase 2: Data Extraction & Thai Encoding Fix
- **Issue:** Initial product data extraction from Excel resulted in corrupted Thai characters (`????`).
- **Resolution:** Re-extracted data using strict **UTF-8** encoding. Split the product database into 5 SQL chunks (`products_insert_v2_chunk_*.sql`) to ensure stable importing via the Supabase SQL Editor.

### Phase 3: Major Bug Fixes
1.  **Identifier Conflict (supabase):**
    - *Error:* `Uncaught SyntaxError: Identifier 'supabase' has already been declared`.
    - *Fix:* Renamed the internal client instance to `akraSupabase` to avoid conflicts with the Supabase JS library.
2.  **Vue ReferenceError (currentUser):**
    - *Error:* `currentUser is not defined` in the W5 app.
    - *Fix:* Explicitly declared global variables and adjusted the Vue lifecycle to wait for the AuthGuard promise.
3.  **Missing Data Structure (prList):**
    - *Error:* `Cannot read properties of undefined (reading 'length')` in the PO app.
    - *Fix:* Enhanced `getInitialData` to include Purchase Requests (PR) required for frontend badge counters.
4.  **Field Mapping & Data Integrity:**
    - *Error:* `400 Bad Request` and `toLowerCase is not a function`.
    - *Fix:* Implemented a mapping layer in the client script to bridge `snake_case` (DB) and `camelCase` (App) naming conventions. Replaced legacy Row Numbers with **UUIDs** for precise data targeting.
5.  **Conflict 409 (GR App):**
    - *Error:* Failed to save "Extra Items" due to empty string violations in UUID/FK columns.
    - *Fix:* Implemented automatic conversion of empty strings to `null` for database compatibility.

### Phase 4: Final Cleanup & Hardening
- Removed all legacy `script.google.com` URLs from HTML files.
- Migrated system logs to the `system_logs` table in PostgreSQL.
- Verified all apps (PR, PO, GR, KPI, W5, Transfers, Returns) under the new architecture.

---

## 3. Operations Manual
1.  **Live URL:** `https://akra-web.github.io/ProjectWEBAPP/`
2.  **Login:** Use existing Employee IDs (e.g., `172980` for Admin).
3.  **Database Management:** To update Products or Vendors, copy the SQL content from GitHub and run it in the **Supabase SQL Editor**.
4.  **Configuration:** All API settings (Keys/URLs) are centralized in **`supabase-client.js`**.

---

## 4. Current File Structure
- `index.html`: Main Portal.
- `supabase-client.js`: Core API logic (Crucial file).
- `schema.sql`: Database table structures.
- `vendors_insert_v2.sql`: Thai Vendor data.
- `products_insert_v2_chunk_*.sql`: Thai Product data (5 parts).
- `*.html`: Modular applications for Procurement, Warehouse, and KPI.

---
*This document serves as the official migration record and technical guide for future maintenance.*
