# Portal & Admin Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `index.html` into a professional SaaS-style portal with integrated User/Role management, high-density UI matching the "Gold Standard", and robust SSO infrastructure.

**Architecture:** Enhancing the existing Vanilla JS portal. Introducing a dedicated Admin Section with dual-tab logic (Users vs App Matrix). Improving the responsive grid for app cards and standardizing the header/profile layout.

**Tech Stack:** Vanilla JS, Supabase (via `AKRA_API`), Tailwind CSS, Lucide Icons.

---

### Task 1: UI/UX Refinement (Gold Standard Alignment)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Upgrade Portal Shell & Header**
  - Increase header border radius to `rounded-[3rem]`.
  - Refine padding and visual weight of the profile box.
  - Standardize typography: "SYSTEM DESKTOP" (Large, Bold, Italic) and "AKRA-TRD OPERATIONAL NETWORK".

- [ ] **Step 2: Refine App Grid & Cards**
  - Adjust grid gap to `gap-6` or `gap-8`.
  - Ensure cards are high-density with clean icon boxes.
  - Add `fadeSlideUp` animation to app card rendering.

- [ ] **Step 3: Commit**
  ```bash
  git add index.html
  git commit -m "style(portal): align index.html with Gold Standard high-density UI"
  ```

---

### Task 2: User Management UX Overhaul

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Enhance User List logic**
  - Refine `renderUserList` to show user roles as colorful mini-badges.
  - Implement a cleaner "Active/Selected" state for the user list items.

- [ ] **Step 2: Upgrade Role Editor (Interactive Form)**
  - Improve the role selection grid with better visual feedback for toggled states.
  - Add clear validation feedback for Employee ID and Name.

- [ ] **Step 3: Implement "Add New User" flow**
  - Add a dedicated "Add Employee" button that clears the form and resets `editingUserId`.

- [ ] **Step 4: Commit**
  ```bash
  git add index.html
  git commit -m "feat(portal): upgrade user management UX with badge roles and better edit flow"
  ```

---

### Task 3: Centralized Permission Matrix

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Refine App Matrix UI**
  - Standardize the table layout with better padding and font sizing.
  - Ensure checkboxes in the matrix are CI-themed (Brand Blue).

- [ ] **Step 2: Sync Matrix with Supabase**
  - Ensure `saveAppConfig` correctly pushes the matrix state to the `app_config` table.
  - Add a loading indicator specifically for the matrix save action.

- [ ] **Step 3: Commit**
  ```bash
  git add index.html
  git commit -m "feat(portal): refine permission matrix UI and sync logic"
  ```

---

### Task 4: Final SSO Audit & Closure

**Files:**
- Test: Manual verification of `index.html` -> `PR.html` SSO flow.
- Modify: `conductor/index.md`, `PROJECT_STATE.md`

- [ ] **Step 1: Verify Token Pass-through**
  - Confirm that launching an app from the new portal correctly passes the `?sso=...` token.
  - Check for defensive null checks in the portal logout flow.

- [ ] **Step 2: Archive & Update State**
  - Move `conductor/portal_upgrade_plan.md` to `archive/`.
  - Mark Portal Upgrade as 🟢 Done in `conductor/index.md`.

- [ ] **Step 3: Commit**
  ```bash
  git add .
  git commit -m "chore: complete portal upgrade and SSO validation"
  ```

---

## ✅ Verification Checklist
- [ ] Portal UI matches the high-density SaaS reference.
- [ ] Admin section allows editing roles for all employees.
- [ ] App visibility changes in the matrix reflect immediately on next login.
- [ ] Mobile navigation works seamlessly (bottom-nav vs desktop header).
