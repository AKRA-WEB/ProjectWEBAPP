# Plan: Final Pixel-Perfect Refinement for PO.html

**Goal:** Synchronize `PO.html` (Purchase Order) perfectly with the "Gold Standard" set by `Return&Claim.html`. This ensures consistent CSS variables, glass-morphism classes, typography weights, and responsive shell design while strictly preserving all Purchasing, Matching, and APV logic.

---

### Task 1: Synchronize Global Styles & Variables

- **Root Variables:** Update `:root` to match `Return&Claim.html`:
    - `--brand-blue: #171C8F;`
    - `--brand-blue-hover: #11146B;`
    - `--brand-orange: #E35205;`
    - `--bg-main: #F4F7FE;`
    - `--card-radius: 1.25rem;`
    - `--border-color: #E9EDF7;`
- **Typography:**
    - Font-family: `'Prompt', 'Plus Jakarta Sans', sans-serif;`
    - Weights: Remove all `italic`, `font-black`, and `font-extrabold`. Use `font-bold` and `font-semibold`.
    - Apply `letter-spacing: -0.01em;` and `color: #2B3674;`.
- **Component Classes:**
    - Standardize `.glass-card`.
    - Standardize `.input-ci` (replace current `.input-field`).
- **Custom Scrollbar:** Adopt the slim `4px` scrollbar from `Return&Claim.html`.

### Task 2: Standardize Shell & Components

- **Sidebar:** Refine the sidebar width (`w-64` expanded/standardized) and active states. Use the gold standard sidebar link styling.
- **Header:** Align the top bar height and padding with the gold standard.
- **Animations:** Use `fadeSlideUp` animation for tab switching.
- **Form UI:** Refine the "Matching" and "APV" cards. Ensure labels use the gold standard tracking and weight.
- **Modals:** Update the "Direct PO" and "Confirm" modals to match the gold standard SweetAlert2/Modal look.

### Task 3: Functional Preservation

- **Logic:** Maintain all `submitDirectPO`, `deletePO`, `confirmClosePO`, and `applyQuickFillPO` functions.
- **Data:** Ensure grouped data processing (`groupPOData`, `groupGRData`, `groupAPVData`) remains robust.
- **Auth:** Maintain the `AuthGuard` SSO compatibility.

---

### Verification:
1. **Visual Match:** The UI should look identical in aesthetic weight and density to `Return&Claim.html`.
2. **Responsiveness:** Verify sidebar visibility on desktop and bottom nav on mobile.
3. **Logic:** Test PO creation and matching flow.
