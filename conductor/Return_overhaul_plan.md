# Plan: Return&Claim.html Premium Minimal UI Overhaul

**Goal:** Transform `Return&Claim.html` to match the project's "Premium DNA" with the **Minimal Typography** standard (Option 2: Normal, not bold, not italic). This app handles Customer Returns, Claims, and Audits. It already has a sidebar layout, but its aesthetics need to be updated to match the new minimal style.

---

### Task 1: Establish Global Styles & Typography (Minimal Standard)

- **Typography:**
    - Font Family: `Prompt` (Thai) and `Plus Jakarta Sans` (English/Numbers).
    - **Font Weights:** Use `font-medium` or `font-semibold` for headers and important text. Remove `font-black` and `font-extrabold`.
    - **Remove Italics:** Search for and remove all instances of the `italic` class.
    - Remove tight tracking (`tracking-tighter`). Replace with normal or `tracking-wide` for small uppercase labels.
- **Glass-morphism & Shell:**
    - Ensure the layout uses the standard Sidebar (Desktop) and Bottom Nav (Mobile).
    - Ensure cards use subtle borders (`border-slate-200`) and shadows, avoiding overly aggressive colors or strokes.

### Task 2: Refine App Views (Remove Bold Italic)

- **Dashboard:** Update KPI cards to use normal typography.
- **Add Return (ADD_RET):** Update the form inputs and labels to the minimal style.
- **Audit Views (AUDIT_CREATE, AUDIT_TASK, AUDIT_REVIEW):** Ensure tables, input groups, and modals use the clean minimal typography. Remove aggressive font weights from quantities and SKUs.
- **Claim Views (ADD_CLM, WH_CLM, MANAGE_CLM, TRACK_CLM):** Update tables and cards to use the clean minimal typography. Ensure the "Export & ตัดรอบ" and "ส่งคืน Vendor" flows look professional and clean.

### Task 3: Logic & Consistency

- Verify that all complex flows (Audit row addition, SweeetAlert2 modals for Audit review/counting, Print Preview for Claims) remain intact after CSS class removals.
- Maintain the standardized `AuthGuard` configuration.
- Ensure `Lucide` icons are used correctly.

---

### Verification:
1.  **Typography Check:** No `italic` or `font-black` classes should remain (except where absolutely necessary for visual hierarchy, but strongly prefer `font-bold` or `font-semibold`).
2.  **Functionality:** Forms, dynamic audit rows, modals, and tab switching must continue to work perfectly.
