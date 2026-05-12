# AKRA Web Apps - Standard Development Workflow

This document outlines the engineering standards and workflows for maintaining and extending the AKRA Web Application suite.

---

## 🎨 1. The Gold Standard (UI/UX)
All applications must maintain visual parity. 
- **Reference File:** `Return&Claim.html` is the "Gold Standard" blueprint.
- **Typography:** Primary Thai font is `Prompt`. Secondary English/Number font is `Plus Jakarta Sans`.
- **CSS Variables:** Strictly use the `:root` variables defined in the gold standard (Brand Blue, Brand Orange, BG Main).
- **Component Classes:** Use `.glass-card` for containers and `.input-ci` for form fields.

---

## 🔐 2. Authentication Lifecycle
Every application must follow the standardized `AuthGuard` pattern to ensure SSO compatibility and security.

1.  **Initialization:** `AuthGuard.init()` at the bottom of the script.
2.  **App Start:** The `AuthGuard` will call `startApp(user)` upon successful validation.
3.  **App Logic:** All application-specific logic (loading data, event binding) must reside inside or be triggered by `startApp`.
4.  **Defensive Checks:** Always include a null check for `document.getElementById('app-content')` before revealing the UI.

---

## 🛠️ 3. Development Process (Plan -> Act -> Validate)

### Step 1: Research & Plan
- Create a new plan in `conductor/` using the `writing-plans` skill.
- Reference existing logic to ensure backward compatibility.

### Step 2: Implementation (Act)
- Perform surgical updates.
- Adhere to the Premium Minimal aesthetic.
- Use `AKRA_API` helpers for all Supabase interactions.

### Step 3: Verification (Validate)
- Test responsiveness (Desktop sidebar vs. Mobile bottom-nav).
- Verify SweetAlert2 feedback matches CI colors.
- Run a manual audit of the specific task.

---

## 📝 4. Documentation & Closure
A task is not "Done" until:
1.  **Technical Ledger:** Any bug fix or critical solution is recorded in `docs/applied_solutions.md`.
2.  **Project State:** `PROJECT_STATE.md` is updated with a concise checkmark or summary.
3.  **Index Update:** The status in `conductor/index.md` is set to 🟢 **Done**.
4.  **Archiving:** The plan file is moved to `conductor/archive/`.

---

## ⌨️ 5. Communication (The t2c Protocol)
When requested to perform "Deep Analysis" or generate a prompt for another session:
1.  Investigate source files thoroughly.
2.  Design a technically precise solution.
3.  Generate a professional English developer prompt.
4.  Copy to clipboard and confirm the rationale.
