# 🔍 System-wide Audit & Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perform a comprehensive audit of all 7 sub-apps to verify Supabase connectivity, validate core business logic (PR-PO-GR, W5, Returns), and identify/document bugs for resolution.

**Architecture:** A "Top-Down" diagnostic approach. Starting from API health, moving to app-level connectivity, and finishing with functional stress testing of key workflows.

**Tech Stack:** Vanilla JS, Supabase, Node.js (for diagnostic scripts).

---

### Task 1: API & Infrastructure Health Check

**Files:**
- Create: `tools/scripts/audit_connectivity.js`
- Modify: `conductor/index.md`

- [ ] **Step 1: Create a Universal Connectivity Tester**
  - Write a Node.js script that attempts to reach all primary Supabase tables used across the suite.
  - Verify RLS policies are active but accessible via the current client key.

```javascript
// tools/scripts/audit_connectivity.js
const { createClient } = require('@supabase/supabase-client');
// Logic to test read/write on: products, vendors, purchase_requests, 
// purchase_orders, goods_receipts, w5_inventory, returns, claims, daily_records.
```

- [ ] **Step 2: Run Diagnostic & Document Results**
  - Run: `node tools/scripts/audit_connectivity.js`
  - Record any table timeouts or permission errors.

- [ ] **Step 3: Register Audit Track**
  - Add `🟡 System-wide Audit: [Plan: audit_system_plan.md](./audit_system_plan.md)` to `conductor/index.md`.

---

### Task 2: Sub-App Connectivity & Auth Handshake Audit

**Files:**
- Audit: `index.html`, `PR.html`, `PO.html`, `GR.html`, `AKRA W5.html`, `KPI.html`, `Tranfers W2-W1.html`, `Return&Claim.html`

- [ ] **Step 1: Verify AuthGuard Synchronization**
  - Check if every app correctly redirects to `index.html` when `sessionStorage` is empty.
  - Verify `akra_[app]_session_token` is being set correctly after SSO handshake.

- [ ] **Step 2: Audit Initial Data Fetching**
  - For each app, verify that `fetchAll` or relevant API calls succeed during `startApp`.
  - Check browser console for `404` or `401` errors during initialization.

---

### Task 3: Workflow Logic & Bug Hunting

**Files:**
- Test Workflows: PR -> PO -> GR, W5 Stock Adjustment, Return QC -> Claim.

- [ ] **Step 1: Procurement Lifecycle Audit**
  - Create a test PR -> Approve it -> Merge into PO -> Receive in GR.
  - **Check for:** UUID mismatch, status update failure, or `ref_po_uid` null errors in GR.

- [ ] **Step 2: Warehouse W5 Audit**
  - Perform a test "IN" and "OUT" transaction.
  - **Check for:** Does `w5_history` match the change in `w5_inventory`? Is the history log detailed enough?

- [ ] **Step 3: Return & Claim Audit**
  - Create a Grade C Return.
  - **Check for:** Does the Claim automatically appear? Does the Claim ID match the Return ID correctly?

---

### Task 4: Documentation & Bug Reporting

**Files:**
- Create: `docs/audit_report_20260512.md`
- Update: `applied_solutions.md`

- [ ] **Step 1: Consolidate Findings**
  - List all identified bugs, broken links, or UI inconsistencies found during Tasks 1-3.

- [ ] **Step 2: Propose Fixes**
  - For each bug, define a mini-strategy for resolution.

---

## ✅ Verification Checklist
- [ ] All 7 apps confirm successful Supabase connection.
- [ ] SSO Handshake works for all roles.
- [ ] PR -> PO -> GR flow completes without manual DB intervention.
- [ ] Audit report is generated and logged in the Technical Ledger.
