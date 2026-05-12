# Plan: Final Pixel-Perfect Refinement for index.html

**Goal:** Synchronize `index.html` (Portal) perfectly with the "Gold Standard" set by `Return&Claim.html`. This ensures consistent CSS variables, glass-morphism classes, typography weights, and responsive shell design while maintaining all SSO/Login logic.

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
    - Standardize `body` font-family: `'Prompt', 'Plus Jakarta Sans', sans-serif;`
    - Apply `letter-spacing: -0.01em;` and `color: #2B3674;`.
- **Component Classes:**
    - Standardize `.glass-card` (white bg, shadow, border).
    - Standardize `.input-ci` (bg main, rounded-xl, 14px font).
- **Custom Scrollbar:** Adopt the slim `4px` scrollbar from `Return&Claim.html`.

### Task 2: Standardize Animations & Components

- **Animations:** Implement `.fade-in` (fadeSlideUp) using the exact timing from the gold standard.
- **Login Section:** Refine the login card to use `.glass-card` or equivalent premium styling. Remove legacy borders and bubbles.
- **Admin Section:** Update the admin dashboard tabs and cards to use the standardized minimal typography (font-bold/semibold, no italics).

### Task 3: Refine Responsive Layout

- **Header/Nav:** Update the Portal header to match the height and spacing of the sub-app headers.
- **App Grid:** Ensure the grid cards align with the premium SaaS standard (clean borders, high-impact icons).
- **Mobile Optimization:** Check touch targets and paddings for the mobile view.

---

### Task 4: Functional Verification (SSO/Login)

- Ensure `AKRA_API` calls remain unchanged.
- Verify `App.handleLogin` and `AKRA_SSO.openApp` correctly pass the session token.
- Verify `AdminInteractive` still correctly fetches and saves user/app data.

---

### Verification:
1. **Visual Match:** The UI should look identical in aesthetic weight and density to `Return&Claim.html`.
2. **Responsiveness:** Test on various screen sizes.
3. **Logic:** Login, App Launch, and Admin tasks must function perfectly.
