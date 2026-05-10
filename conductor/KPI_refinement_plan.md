# Plan: Final Pixel-Perfect Refinement for KPI.html

**Goal:** Synchronize `KPI.html` perfectly with the "Gold Standard" set by `Return&Claim.html`. This ensures consistent CSS variables, glass-morphism classes, typography weights, and responsive shell design while strictly preserving all KPI tracking and analytics logic.

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
    - Standardize `.glass-card` (replace current `.card`).
    - Standardize `.input-ci`.
- **Custom Scrollbar:** Adopt the slim `4px` scrollbar from `Return&Claim.html`.

### Task 2: Standardize Shell & Components

- **Sidebar:** Refine the sidebar width (`w-64` style) and active states. Use the gold standard sidebar link styling.
- **Header:** Align the top bar height and padding with the gold standard.
- **Animations:** Use `fadeSlideUp` animation for view switching.
- **KPI Components:** 
    - Refine the stat cards (HP Progress, Errors, Volume). 
    - Update individual performance bars to use the high-density minimal aesthetic.
    - Standardize the "Smart Summary" and "Error History" list items.

### Task 3: Standardize Icons (Lucide Transition)

- **Icons:** Replace all FontAwesome icons (`<i class="fa-solid fa-...">`) with standard Lucide icons (`<i data-lucide="...">`).

### Task 4: Functional Preservation

- **Logic:** Maintain all `submitKPI`, `loadDashboardData`, and `renderAdminDashboard` logic.
- **Data:** Maintain all HP penalty calculations and team grade logic.
- **Auth:** Maintain the `AuthGuard` SSO compatibility.

---

### Verification:
1. **Visual Match:** The UI should look identical in aesthetic weight and density to `Return&Claim.html`.
2. **Responsiveness:** Verify sidebar visibility on desktop and bottom nav on mobile.
3. **Logic:** Test recording a daily KPI entry and verifying the dashboard metrics update.
