# Plan: Tranfers W2-W1.html Premium Minimal UI Overhaul

**Goal:** Transform `Tranfers W2-W1.html` (Inter-warehouse transfer system) to match the project's "Premium DNA" with the **Minimal Typography** standard (Option 2: Normal, not bold, not italic). This app uses an older UI pattern that needs to be updated to match the high-density desktop and mobile-responsive layouts (Sidebar + Bottom Nav) established in the other apps.

---

### Task 1: Establish Global Styles & Typography (Minimal Standard)

- **Typography:**
    - Font Family: `Prompt` (Thai) and `Plus Jakarta Sans` (English/Numbers).
    - **Font Weights:** Use `font-medium` or `font-semibold` for headers and important text. Remove `font-black` and `font-extrabold`.
    - **Remove Italics:** Ensure no `italic` classes are used for headers or data points.
- **Glass-morphism & Theme:**
    - Use clean borders (`border-slate-200`) and soft shadows (`shadow-sm`).
    - Maintain the color coding (Blue for W1, Orange for W2) but in a clean, modern way.

### Task 2: Implement Navigation Shell

- Replace the current "Home/Menu" screen with a unified layout.
- **Sidebar (Desktop):** Implement `aside#main-sidebar` (76px width) with tabs for W1 (Request), W2 (Dispatch), and Analytics.
- **Bottom Nav (Mobile):** Implement `nav.bottom-nav` for mobile devices.
- **Top Bar (Header):** Create the premium `header` with a breadcrumb/title, branch info, and user profile box.
- Wrap the core views into `div#app-content`.

### Task 3: Refine Application Views

- **W1 View (Request & Pending):** 
    - Update the request form to be high-density.
    - Make pending cards clean and minimal.
- **W2 View (Tasks & Dispatch):** 
    - Update the task list cards. 
    - The "Dispatch Form" (where they enter actual sent qty and new expiry) should use the minimal inputs (`input-ci`).
- **Analytics View:**
    - Refine the insights cards. The current "AI Insights" are good but need to shed the `font-black` and overly round `rounded-[2rem]` borders. Use standard `rounded-2xl` or `rounded-xl`.

### Task 4: Standardize Icons & Logic

- **Icons:** Ensure all icons are **Lucide Icons** (`data-lucide`). The current file uses a mix of Lucide and Material Icons (`material-icons-round`). Replace all Material Icons with Lucide equivalents.
- **AuthGuard:** The file currently uses a slightly different `AuthGuard` implementation (`AKRA SSO v2`). Standardize it to exactly match the pattern used in `KPI.html` and `PR.html`.

---

### Verification:
1.  **Typography Check:** No `italic` or `font-black` classes should be present.
2.  **Icon Check:** No `<span class="material-icons-round">` should remain.
3.  **Functionality:** Test creating a transfer request (W1) and dispatching it (W2).
