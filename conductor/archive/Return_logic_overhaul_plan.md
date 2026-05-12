# Return & Claim Logic & Workflow Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Return & Claim system into a robust logistics module with automated inventory reconciliation, sophisticated vendor claim batching, and professional QC workflows.

**Architecture:** Enhancing `Return&Claim.html` and `supabase-client.js`. Introducing cross-table transactions between `returns`, `claims`, `audit_tasks`, and `w5_inventory`.

**Tech Stack:** Vanilla JS, Supabase, Tailwind CSS, Lucide Icons.

---

### Task 1: Inventory Reconciliation (Audit & QC)

**Files:**
- Modify: `supabase-client.js`, `Return&Claim.html`

- [ ] **Step 1: Implement "Sync to Inventory" in `finalizeAudit`**
  - Update `AKRA_API.finalizeAudit` to include an optional loop that updates `w5_inventory` for every row with a `stock_diff`.
  - Ensure every adjustment is logged in `w5_history` with the `task_id` as reference.

- [ ] **Step 2: Automated "Return to Stock" (Grade A)**
  - Update `AKRA_API.updateReturnQC` to allow a `syncStock` flag.
  - If Grade A and `syncStock` is true, increment `w5_inventory` and log transaction.

- [ ] **Step 3: Commit**
  ```bash
  git add supabase-client.js Return&Claim.html
  git commit -m "feat(rc): implement automated inventory reconciliation for audits and Grade A returns"
  ```

---

### Task 2: Advanced Vendor Claim Batching (Manage Tab)

**Files:**
- Modify: `Return&Claim.html`

- [ ] **Step 1: Multi-select Claims for Vendor Batching**
  - Add checkboxes to the claim list in the "Manage Claim Vendor" tab.
  - Implement a "Selection State" for batch actions.

- [ ] **Step 2: "Print Claim Form" (Professional Print Template)**
  - Create a hidden printable area or a window-open logic that generates a clean, formatted HTML table for the selected vendor claims.
  - Include signature lines for "Sender" and "Vendor Receiver".

- [ ] **Step 3: Batch Status Update**
  - Allow marking multiple claims as "ส่งให้ Vendor แล้ว" in one click.

- [ ] **Step 4: Commit**
  ```bash
  git add Return&Claim.html
  git commit -m "feat(rc): add vendor claim batching and professional print template"
  ```

---

### Task 3: QC Workflow & UI Enhancements

**Files:**
- Modify: `Return&Claim.html`

- [ ] **Step 1: Standardize QC Status Feedback**
  - Ensure visual indicators for Grade A, B, and C are high-contrast and match the Gold Standard.
  - Add a "Summary Card" to the QC tab showing daily throughput (how many returns QC'd today).

- [ ] **Step 2: Defect Reason Presets**
  - Add more specific reasons to the `clm_reason` and `ret_main_reason` selects (e.g., "Molding Error", "Transit Crush", "Expiry < 3 months").

- [ ] **Step 3: Commit**
  ```bash
  git add Return&Claim.html
  git commit -m "style(rc): refine QC workflow visuals and defect reason presets"
  ```

---

### Task 4: Final Validation & Integration

**Files:**
- Test: `tools/scripts/test_return_claim_logic.js`
- Modify: `conductor/index.md`, `PROJECT_STATE.md`

- [ ] **Step 1: Update Test Script for Stock Sync**
  - Add a test case that marks a return as Grade A and verifies stock increase in `w5_inventory`.
  - Add a test case that completes an audit and verifies inventory reconciliation.

- [ ] **Step 2: Run End-to-End Audit**
  - Run: `node tools/scripts/test_return_claim_logic.js`
  - Verify 100% success.

- [ ] **Step 3: Archive & Update State**
  - Move `conductor/Return_overhaul_plan.md` to `archive/`.
  - Mark Return & Claim as 🟢 Done in `conductor/index.md`.

- [ ] **Step 4: Commit**
  ```bash
  git add .
  git commit -m "chore: complete Return & Claim overhaul and inventory integration"
  ```

---

## ✅ Verification Checklist
- [ ] Grade A returns can optionally increment W5 stock.
- [ ] Audit counts can automatically reconcile with physical inventory.
- [ ] Vendor claim forms are printable and formatted professionally.
- [ ] `PROJECT_STATE.md` reflects Return & Claim as 🟢 Done.
