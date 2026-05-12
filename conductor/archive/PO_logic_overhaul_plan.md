# PO Logic & Workflow Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the core business logic of `PO.html` to support robust procurement workflows, including multi-PR merging, advanced matching reconciliation, and standardized Direct PO creation.

**Architecture:** Enhancing the existing Vanilla JS state management. Introducing a multi-select state for PRs and refining the `approvePR` and `closePO` API calls to handle complex payloads while maintaining data integrity via Supabase.

**Tech Stack:** Vanilla JS, Supabase, Tailwind CSS.

---

### Task 1: Multi-PR Merge Logic (Tab 1)

**Files:**
- Modify: `PO.html`

- [ ] **Step 1: Implement Multi-Select UI for PR Cards**
  - Add a checkbox to each PR card in Tab 1.
  - Track selected PR UIDs in a new global array `state.selectedPrs = []`.

- [ ] **Step 2: Update "Create PO" to "Merge & Create PO"**
  - Change the action button to handle multiple selections.
  - If multiple PRs are selected, verify they belong to the same **Vendor** (or allow the user to select a vendor for the group).

- [ ] **Step 3: Update `approvePR` handler**
  - Modify the logic to aggregate items from all selected PRs before calling the API.
  - Ensure `ref_pr_uid` mapping handles multiple IDs correctly (as a comma-separated string or multiple rows).

- [ ] **Step 4: Commit**
  ```bash
  git add PO.html
  git commit -m "feat(po): implement multi-PR selection and merge logic UI"
  ```

---

### Task 2: Advanced Matching Reconciliation (Tab 3)

**Files:**
- Modify: `PO.html`, `supabase-client.js`

- [ ] **Step 1: Refine `groupGRData` for Partial Receiving**
  - Improve the grouping logic to handle items that have been partially received in multiple GR batches.
  - Ensure the "Expected" vs "Actual" comparison accounts for previous receipts.

- [ ] **Step 2: Implement "Partial Close" logic**
  - Add a feature to close a PO row-by-row rather than the whole batch, supporting split shipments.

- [ ] **Step 3: Commit**
  ```bash
  git add PO.html supabase-client.js
  git commit -m "feat(po): enhance matching logic for partial receipts and split shipments"
  ```

---

### Task 3: Direct PO & Manual Entry Upgrade

**Files:**
- Modify: `PO.html`

- [ ] **Step 1: Standardize Direct PO Modal**
  - Upgrade the "Manual PO" entry form to use the same dynamic row logic as `PR.html`.
  - Add product autocomplete to the manual entry rows.

- [ ] **Step 2: Implement Vendor Suggestion**
  - Use `AKRA_API.findVendorBySku` to auto-fill the vendor field when the first product is selected.

- [ ] **Step 3: Commit**
  ```bash
  git add PO.html
  git commit -m "feat(po): upgrade Direct PO modal with autocomplete and vendor suggestions"
  ```

---

### Task 4: Final Validation & Integration

**Files:**
- Test: `tools/scripts/test_workflow_PR_PO_GR.js`

- [ ] **Step 1: Update Test Script for Multi-PR**
  - Add a test case that creates 2 PRs and merges them into 1 PO.
  - Verify both PR statuses update to 'Approved'.

- [ ] **Step 2: Run End-to-End Audit**
  - Run: `node tools/scripts/test_workflow_PR_PO_GR.js`
  - Verify status code 200/Success on all operations.

- [ ] **Step 3: Commit & Archive**
  ```bash
  git add .
  git commit -m "test: verify multi-PR merge workflow and logic overhaul"
  mv conductor/PO_overhaul_plan.md conductor/archive/
  ```

---

## ✅ Verification Checklist
- [ ] PRs can be merged into a single PO based on vendor grouping.
- [ ] Matching reconciliation correctly displays diffs for partial receipts.
- [ ] Direct PO creation has product autocomplete.
- [ ] `PROJECT_STATE.md` reflects PO Logic as 🟢 Done.
