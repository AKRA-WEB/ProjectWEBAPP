# Plan: Final Pixel-Perfect Refinement for PR.html

**Goal:** Synchronize `PR.html` (Purchase Request) perfectly with the "Gold Standard" set by `Return&Claim.html`. This ensures consistent CSS variables, glass-morphism classes, typography weights, and responsive shell design while strictly preserving all existing PR submission logic.

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
    - Standardize `.glass-card` (white bg, shadow, border).
    - Standardize `.input-ci` (replace current `.input-field`). Use exact focus styles from the gold standard.
- **Custom Scrollbar:** Adopt the slim `4px` scrollbar from `Return&Claim.html`.

### Task 2: Standardize Shell & Components

- **Sidebar:** Refine the sidebar width (`w-64` expanded/standardized) and active states. Use the gold standard sidebar link styling.
- **Header:** Align the top bar height and padding with the gold standard.
- **Animations:** Use `fadeSlideUp` animation for tab switching.
- **Form UI:** Refine the "Item Row" layout. Ensure labels are small, bold, and uppercase with `tracking-widest`.
- **Buttons:** Update `btn-action` to match the gold standard `swal2-confirm` or primary button look.

### Task 3: Functional Preservation

- **Logic:** Maintain all `submitPR`, `addEmptyItemRow`, and `setupProductAutocomplete` logic.
- **Auth:** Ensure `AuthGuard` remains compatible with the SSO portal.
- **Cache:** Keep the cache-first loading strategy.

---

### Verification:
1. **Visual Match:** The UI should look identical in aesthetic weight and density to `Return&Claim.html`.
2. **Responsiveness:** Verify sidebar visibility on desktop and bottom nav on mobile.
3. **Logic:** Successfully submit a PR and check the history view.
