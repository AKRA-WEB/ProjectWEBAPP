# Plan: AKRA W5.html Premium Minimal UI Overhaul

**Goal:** Transform `AKRA W5.html` to match the project's "Premium DNA" with the new **Minimal Typography** standard (Option 2: Normal, not bold, not italic). Implement a Sidebar (Desktop), Bottom Nav (Mobile), and a high-density professional UI.

---

### Task 1: Establish Global Styles & Variables (Minimal Typography)

- **Typography:**
    - Use `Prompt` for Thai and `Plus Jakarta Sans` for English/Numbers.
    - **Font Weights:** Use `font-medium` or `font-semibold` for headers (avoid `font-black` and `italic`).
    - Standardize sizes: Page titles at `text-lg` or `text-xl`, labels at `text-xs font-semibold uppercase`.
- **CSS Variables:** Define `--sidebar-width: 76px;`, `--header-height: 4rem;`, and fluid scaling.
- **Styling:** Use clean glass-morphism, subtle shadows, and white borders (`border-white/50`).

### Task 2: Implement Navigation Shell

- **Sidebar (Desktop):** Implement the `aside#main-sidebar` (76px width) with Lucide icons for Dashboard, Inventory, Picklist, and Manage.
- **Bottom Nav (Mobile):** Implement `nav.bottom-nav` for mobile devices.
- **Top Bar (Header):** Create the premium `header` with a breadcrumb/title, branch info, and user profile box.
- **Layout:** Wrap everything in a main container that adjusts based on the sidebar presence.

### Task 3: Refine Application Views (Vue.js Integration)

- **Dashboard / Stats:** Clean up the stats cards with better spacing and minimal icons.
- **Inventory View:** Use the "Premium Grid" for the inventory table. Ensure the search and filters are high-density.
- **Transaction Panel:** Integrate the transaction form into the sidebar or a dedicated high-density panel.
- **Picklist View:** Use modern cards for the picklist items, matching the PR/PO history style.

### Task 4: Standardize Icons & Logic

- **Icons:** Replace all FontAwesome icons with **Lucide Icons** for a consistent look.
- **AuthGuard:** Standardize the `AuthGuard` logic to match the unified SSO pattern used in other apps.
- **Modals:** Upgrade all Vue modals (Adjust Stock, Confirm Pick) to the premium glass-morphism standard.
- **TTS:** (Optional but recommended) Add TTS support for product names in the picklist view to match GR.html.

---

### Task 5: Mobile & Desktop Optimization

- Ensure the layout is fully responsive.
- Maximize information density on 1080p+ desktops.
- Use `clamp()` for fluid typography where appropriate.

---

### Verification:
1.  **Layout:** Sidebar correctly toggles and bottom nav appears on mobile.
2.  **Typography:** All text is straight (not italic) and uses the new font weights.
3.  **Functionality:** Test transactions (In/Out), Picklist processing, and stock adjustments.
4.  **Auth:** Verify SSO login and logout redirects.
