# Plan: UI/UX Refinement to "Gold Standard"

**Objective:** Synchronize all sub-apps with the "Premium Minimal Gold Standard" established in `Return&Claim.html`. Ensure 100% consistency in Typography, Component Styles, Layout Shells, and Interactive Feedback.

## 📋 Standard Specifications (The Gold Standard)
- **Typography:** `Prompt` (Thai) + `Plus Jakarta Sans` (Eng). Weight: 300/400/500/600/700. No Italics.
- **Glass Card:** `bg: white`, `radius: 1.25rem`, `border: #E9EDF7`, `shadow: 0 4px 20px rgba(0, 0, 0, 0.02)`.
- **Input CI:** `bg: #F4F7FE`, `radius: 0.875rem`, `focus-border: #171C8F`, `focus-shadow: 0 0 0 3px rgba(23, 28, 143, 0.08)`.
- **Sidebar:** `w-64` (Desktop Drawer), `bg: #171C8F`. Active: `color: #E35205`, `font-bold`.
- **SweetAlert2:** Custom theme (Rounded 1.5rem, Brand colors).

---

## 🛠️ Audit & Fix Checklist

### 1. CSS & Style Foundation
- [ ] Sync `:root` variables (`--brand-blue`, `--brand-orange`, `--bg-main`, `--card-radius`, `--border-color`).
- [ ] Standardize `@import` for fonts in `<style>` block.
- [ ] Unify `.glass-card` and `.input-ci` class definitions.
- [ ] Implement standardized `fadeSlideUp` animation for tab/view transitions.
- [ ] Copy and apply custom SweetAlert2 CSS to all apps.

### 2. Layout Shell Consistency
- [ ] **Sidebar (Desktop):** Ensure consistent padding (p-6), icon background (rounded-xl), and status indicators.
- [ ] **Bottom Nav (Mobile):** Match icon size (w-5 h-5), active color (`#171C8F` or `#E35205`), and text sizing (text-[10px]).
- [ ] **Header:** Sync height, backdrop-blur intensity, and shadow.

### 3. Application Specific Fixes
- [ ] **PR.html:** Add Lucide icons to dynamic rows, sync sidebar active shadow.
- [ ] **PO.html:** Standardize table matrix borders and hover states.
- [ ] **GR.html:** Refine receiving cards and status badges (Rounded-lg).
- [ ] **AKRA W5.html:** Update Vue-based components to use the same glass-card classes.
- [ ] **KPI.html:** Adjust density of stat cards to match the shadow/border quality of Gold Standard.
- [ ] **index.html (Portal):** Refine login card border-t-8 intensity and radii.

---

## 🔄 Execution Strategy

### Phase 1: The Core Styles (Batch Update)
Update CSS sections in all 6 files to ensure an identical visual foundation.

### Phase 2: Shell Refinement
Standardize Sidebar and Navigation components to ensure the "Shell" feels like one app.

### Phase 3: Content & Interaction
Apply custom SweetAlert2 themes and refine component-level details (buttons, badges).

---

## ✅ Verification Protocol (MANDATORY)
For each file, I will:
1. **Compare** the rendered CSS tokens against `Return&Claim.html`.
2. **Verify** mobile responsiveness (Sidebar vs Bottom Nav).
3. **Check** that all Lucide icons are rendering correctly (especially dynamic ones).
4. **Test** SweetAlert2 popups to ensure brand colors are applied.

*Target Completion: 100% Pixel-Perfect Synchronization.*
