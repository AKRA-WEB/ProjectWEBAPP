# UI/UX Gold Standard Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize the entire AKRA application suite with the "Premium Minimal Gold Standard" established in `Return&Claim.html`, ensuring perfect visual consistency and professional interaction across all sub-apps.

**Architecture:** Centralized CSS variable synchronization and component-level refactoring. The plan uses a "Foundation -> Shell -> Details" approach to ensure a solid visual base before refining interactive elements.

**Tech Stack:** Tailwind CSS, Lucide Icons, SweetAlert2, Vanilla JS / Vue.js.

---

### Task 1: Global CSS & Typography Synchronization

**Files:**
- Modify: `index.html`, `PR.html`, `PO.html`, `GR.html`, `AKRA W5.html`, `KPI.html`, `Tranfers W2-W1.html`

- [ ] **Step 1: Extract Gold Standard CSS**
  - Read `<style>` block from `Return&Claim.html` (lines 20-80).
  - Extract `:root`, `.glass-card`, `.input-ci`, and `fadeSlideUp` animations.

- [ ] **Step 2: Sync `:root` and Body Styles**
  - Update all apps to use identical `:root` variables and `body` CSS (font-family, bg-color, text-color).
  ```css
  :root {
      --brand-blue: #171C8F;
      --brand-blue-hover: #11146B;
      --brand-orange: #E35205;
      --bg-main: #F4F7FE;
      --card-radius: 1.25rem;
      --border-color: #E9EDF7;
  }
  ```

- [ ] **Step 3: Unify Core Component Classes**
  - Replace/Update `.glass-card` and `.input-ci` in all files to match the Gold Standard definition exactly.

- [ ] **Step 4: Commit Foundation Changes**
  ```bash
  git add .
  git commit -m "style: sync global css foundation and typography across all apps"
  ```

---

### Task 2: Standardizing the Layout Shell (Sidebar & Nav)

**Files:**
- Modify: `PR.html`, `PO.html`, `GR.html`, `AKRA W5.html`, `KPI.html`

- [ ] **Step 1: Refine Sidebar (Desktop)**
  - Ensure sidebar width is consistent (`w-64` or equivalent).
  - Update nav-link active state to use `background: rgba(255, 255, 255, 0.1); color: var(--brand-orange); font-weight: 700;`.

- [ ] **Step 2: Refine Bottom Nav (Mobile)**
  - Ensure icons are `w-5 h-5`.
  - Set active color to `#171C8F` or `#E35205` consistently.
  - Set font-size to `text-[10px]` with `uppercase tracking-widest`.

- [ ] **Step 3: Header Synchronization**
  - Update headers to use `backdrop-blur-md` and `bg-white/80` (where applicable) with a subtle bottom border.

- [ ] **Step 4: Commit Shell Changes**
  ```bash
  git add .
  git commit -m "style: standardize layout shells (sidebar, bottom-nav, header)"
  ```

---

### Task 3: Interactive Feedback & Details (SweetAlert2 & Transitions)

**Files:**
- Modify: All apps

- [ ] **Step 1: Apply Custom SweetAlert2 Theme**
  - Copy the `div:where(.swal2-container)` CSS block from `Return&Claim.html` to all apps.
  - Ensure buttons and radii match the CI.

- [ ] **Step 2: Sync Tab/View Animations**
  - Ensure all tab changes use the `fadeSlideUp` animation class.

- [ ] **Step 3: Final Pixel-Perfect Polish**
  - Fix specific app issues (e.g., PO.html table borders, PR.html dynamic icons).
  - Ensure all `lucide.createIcons()` calls are placed after DOM updates.

- [ ] **Step 4: Final Verification & Commit**
  - Run verification protocol (Check icons, responsiveness, and alert styling).
  ```bash
  git add .
  git commit -m "style: final UI polish and interactive consistency (SweetAlert2, animations)"
  ```

---

## ✅ Verification Checklist
- [ ] Font: `Prompt` is the primary font in all apps.
- [ ] Cards: All cards use `.glass-card` with identical radii and shadows.
- [ ] Inputs: All inputs use `.input-ci` with consistent focus states.
- [ ] Sidebar: Sidebar links match in active/hover states across the suite.
- [ ] Alerts: SweetAlert2 popups have rounded corners (1.5rem) and brand blue buttons.
- [ ] Icons: Lucide icons are used exclusively; no unicode/font-awesome artifacts.
