# Plan: PR.html Premium SaaS UI Overhaul

**Goal:** Transform `PR.html` to match the project's new "Premium DNA" (as seen in `KPI.html`), including a sidebar layout, mobile bottom navigation, fluid scaling, and high-density professional UI.

**Architecture:**
- **Layout:** Shift from centered container to Sidebar (Desktop) + Bottom Nav (Mobile).
- **Styling:** Standardize colors, typography (Prompt + Plus Jakarta Sans), and glass-morphism effects.
- **State:** Implement SPA-style tab switching (Submit Form vs. History).

---

### Task 1: Establish Global Styles & Variables

- Update `:root` with fluid scaling variables (`--sidebar-width`, `--header-height`, `--fluid-8xl`).
- Update `font-family` to `Prompt` for Thai and `Plus Jakarta Sans` for English/Numbers.
- Standardize `card`, `input-field`, and `btn` classes to match the high-density desktop standard.

### Task 2: Implement Navigation & Shell

- Add the `aside#main-sidebar` (Desktop) with "Submit" and "History" tabs.
- Add the `nav.bottom-nav` (Mobile) with matching links.
- Implement the optimized `header` (Top Bar) with user profile and branch display.
- Wrap the entire application logic in `div#app-content` to prevent FOUC during auth.

### Task 3: Refine Submit Form (Submit View)

- Move the PR form into `section#view-submit-pr`.
- Compact the layout: reduce paddings and margins.
- Optimize the "Item Row" grid for desktop density.
- Use `Plus Jakarta Sans` for SKU and Quantity inputs.
- Standardize the "Submit" button as a full-width `btn-action`.

### Task 4: Refine History View

- Move the history container into `section#view-history`.
- Use the premium card design for history entries.
- Implement status badges with consistent colors:
    - Pending: Amber (Clock icon)
    - Approved: Emerald (Check icon)
    - Rejected: Rose (X icon)
- Compact the item lists within history cards.

### Task 5: Script Alignment & SPA Logic

- Implement `switchTab(tab)` function to toggle views.
- Standardize `AuthGuard` to perfectly match the `KPI.html` pattern (SSO support, dual-key storage).
- Ensure `loadInitialData` correctly populates the views and handles the "Cache-First" strategy.
- Update `lucide` icon initialization for dynamic content.

---

### Verification:
1.  **Layout:** Check sidebar visibility on desktop (>1024px) and bottom nav on mobile (<1025px).
2.  **Auth:** Verify SSO login flow and redirect to portal on logout.
3.  **Functionality:** Submit a PR and ensure it appears in the History view immediately.
4.  **Density:** Confirm the form fits a standard 1080p screen without excessive empty space.
