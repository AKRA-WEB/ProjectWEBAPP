# Migration Project Documentation & Chat Log (Updated)
**Date:** Wednesday, May 6, 2026
**Project Goal:** Migrate Web Applications from Google Apps Script (GAS) / Google Sheets to Supabase (PostgreSQL) and refine Procurement Workflows.

---

## 1. Executive Summary
- **Backend:** Fully transitioned to **Supabase** (Project ID: `deboelqdfpxayzqnrnjb`).
- **Database:** PostgreSQL used for all data storage. Schema defined in `schema.sql`.
- **Authentication:** **Unified SSO** implemented across all apps using a central `users` table.
- **Frontend:** Preserved UI/UX while refactoring the data layer to use **`AKRA_API`** via `supabase-client.js`.
- **Deployment:** Live on **GitHub Pages** and synchronized with local **OneDrive Desktop**.

---

## 2. Advanced Workflow Refinements (Latest Updates)

### **A. Procurement (PR/PO/GR) Optimization**
- **PR Grouping by Vendor:** In the PO app, multiple Purchase Requests for the same vendor are now automatically grouped into a single card. Purchasing can approve the entire group into one Purchase Order with a single click.
- **Persistent Vendor Mapping:** The system now "learns" which product belongs to which vendor. When a PO is created, the vendor choice is saved to the `products` table, ensuring better grouping for future PRs.
- **Detailed PR History:** The PR app now displays a full list of items for each request in the history view, rather than just the first item.
- **Automatic ATA (Actual Time of Arrival):** In the GR app, the "Date Received" field is now automatically defaulted to the current local date for every receiving and confirmation step.

### **B. System Stability & Real-Time Performance**
- **Smart Refresh:** Removed the 15-second polling interval to prevent UI flickering. Instead, implemented "Action-Driven Refresh"—the UI updates immediately after any record is saved, approved, or deleted.
- **UUID Data Targeting:** Switched from legacy Row Numbers to **UUIDs** (`po_uid`, `pr_uid`). This ensures that splitting a bill (receiving only some items) does not affect other unrelated bills.
- **Database Limits Bypassed:** Implemented the `fetchAll` helper to overcome Supabase's 1,000-row limit, allowing users to search and use all 5,600+ products in the database.

---

## 3. Major Bug Fixes & Resolutions

1.  **Syntax Error (Illegal Return):** Fixed a bug where a function header was accidentally deleted. (Resolved via Hard Refresh/Ctrl+F5).
2.  **GR 409 Conflict:** Resolved issues with "Extra Items" and missing SKUs by properly handling `NULL` values in PostgreSQL UUID/Foreign Key columns.
3.  **W5 ReferenceError:** Fixed `currentUser is not defined` by declaring global variables and ensuring Vue waits for the AuthGuard.
4.  **Bad Request 400 (PR/GR):** Fixed data type mismatches by parsing string inputs into numbers and dates before sending them to Supabase.
5.  **Return & Claim Connectivity:** Restored connectivity by implementing missing backend handlers for QC results, Audit counts, and Batch processing.

---

## 4. Operational Instructions
1.  **URL:** `https://akra-web.github.io/ProjectWEBAPP/`
2.  **Updates:** To change Supabase keys or core logic, edit **`supabase-client.js`**.
3.  **Data Import:** Use the provided `vendors_insert_v2.sql` and `products_insert_v2_chunk_*.sql` files in the Supabase SQL Editor to populate the database.
4.  **Sync:** All changes are automatically pushed to GitHub and copied to the local OneDrive folder.

---
*This log serves as the final documentation for the migration and enhancement phase.*
