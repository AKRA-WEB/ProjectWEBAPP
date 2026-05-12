# 🚀 File Reorganization & Workflow Standardization Plan

**Goal:** Clean up the workspace after the successful completion of the "UI/UX Gold Standard" sprint. This involves archiving completed plans, establishing a clear Master Index, updating the Project State, and documenting the standard workflow for future tasks.

---

## 🗂️ 1. File Reorganization (`conductor/` cleanup)
Currently, the `conductor/` folder is cluttered with 19 plan files, most of which are completed.

- **Action:** Create an `archive/` folder inside `conductor/`.
- **Move to `archive/` (Completed):**
  - All `*_refinement_plan.md` files (UI/UX sprint is 100% done).
  - `GR_overhaul_plan.md`, `PR_overhaul_plan.md`, `Transfers_overhaul_plan.md`, `W5_overhaul_plan.md`.
  - Layout fix files: `W5_Layout_Fix.md`, `W5_PC_Fix.md`, `W5_UI_Fixes.md`.
  - `UI_UX_refinement_plan.md`.
- **Keep in `conductor/` (Active/Pending):**
  - `PO_overhaul_plan.md` (Pending Logic Updates).
  - `Return_overhaul_plan.md` (Pending).
  - `portal_upgrade_plan.md` (Pending).
  - `sync_github.md` (Recurring Task).

---

## 🧭 2. Master Project Index (`conductor/index.md`)
- **Action:** Create a centralized `index.md` to serve as the project's dashboard.
- **Content:**
  - Status legend (🟢 Done, 🟡 In Progress, ⚪ Pending).
  - Links to active plans.
  - Links to archived phases for historical reference.

---

## 📝 3. Project State Update (`PROJECT_STATE.md`)
- **Action:** Overhaul the `PROJECT_STATE.md` to reflect the new reality.
- **Content:**
  - Mark "Phase 2: System-wide UI Consolidation" as **Completed**.
  - Open "Phase 3: Core Logic Deep-Dives" (focusing on PO and Return & Claim).
  - Update the Technical Ledger with recent bug fixes and the Null Check standard.

---

## ⚙️ 4. Workflow Guidance Document (`docs/WORKFLOW.md`)
- **Action:** Create a dedicated workflow guide for AI agents and human developers.
- **Content:**
  - **The Gold Standard Rule:** All new UI must match `Return&Claim.html`.
  - **AuthGuard Lifecycle:** Strict adherence to `init` -> `startApp(user)`.
  - **The "t2c" Protocol:** How to handle deep analysis and prompt generation.
  - **Definition of Done:** 1. Feature works. 2. UI matches Gold Standard. 3. Logged in `applied_solutions.md`. 4. State updated in `PROJECT_STATE.md`.

---

## 🛠️ Execution Steps
1. Execute shell commands to create `archive` and move files.
2. Generate `conductor/index.md`.
3. Overhaul `PROJECT_STATE.md`.
4. Generate `docs/WORKFLOW.md`.
5. Run `git add` and `git commit` to finalize the reorganization.
