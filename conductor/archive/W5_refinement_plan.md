# Plan: Final Pixel-Perfect Refinement for AKRA W5.html

**Goal:** Synchronize `AKRA W5.html` (Warehouse W5) perfectly with the "Gold Standard" set by `Return&Claim.html`. This ensures consistent CSS variables, glass-morphism classes, typography weights, and responsive shell design while strictly preserving all Vue.js 3 logic for Inventory and Picklists.

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
    - Standardize `.glass-card` (replace current `.akra-card`).
    - Standardize `.input-ci` (replace current `.akra-input`).
- **Custom Scrollbar:** Adopt the slim `4px` scrollbar from `Return&Claim.html`.

### Task 2: Standardize Shell & Components

- **Sidebar:** Refine the sidebar width (`w-64` style) and active states. Use the gold standard sidebar link styling. Ensure compatibility with Vue's `@click` handlers.
- **Header:** Align the top bar height and padding with the gold standard.
- **Animations:** Use `fadeSlideUp` animation for Vue's `v-show` views.
- **Form UI:** Refine the "Quick Terminal" and "Master Registry" sections.
- **Picklist Cards:** Update the picklist cards to match the high-density, minimal aesthetic.
- **Modals:** Update Vue transition-based modals to match the gold standard SweetAlert2/Modal look.

### Task 3: Functional Preservation

- **Vue Logic:** Maintain all `data()`, `computed`, and `methods`.
- **Logic:** Maintain `loadData`, `verifyTransaction`, `addProduct`, and `processPickList`.
- **Auth:** Maintain the `AuthGuard` SSO compatibility.

---

### Verification:
1. **Visual Match:** The UI should look identical in aesthetic weight and density to `Return&Claim.html`.
2. **Responsiveness:** Verify sidebar visibility on desktop and bottom nav on mobile.
3. **Logic:** Test stock withdrawal and picklist processing in Vue.
