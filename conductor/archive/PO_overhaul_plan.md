# Plan: PO.html Premium SaaS UI Overhaul

**Goal:** Transform `PO.html` to match the project's "Premium DNA" (as seen in `02.png`, `index.html`, and `PR.html`). This includes a sidebar layout, mobile bottom navigation, high-density professional UI, and correctly using **Bold Italic** fonts for headers as requested.

---

### Task 1: Establish Global Styles & Variables (Typography Focus)

- Update `:root` with fluid scaling variables and layout constants.
- **Typography:** 
    - Use `Prompt` for Thai and `Plus Jakarta Sans` for English/Numbers.
    - **Header Style:** Standardize page titles and card titles as `font-black italic uppercase tracking-tight` to match the "เอียง" (italic) requirement.
- **Glass-morphism:** Use white borders (`border-white/50`), soft shadows, and clean gradients.

### Task 2: Implement Sidebar & Navigation Shell

- Add `aside#main-sidebar` (Desktop) with tabs: "PR (Pending)", "PO (Active)", "Match", and "APV".
- Add `nav.bottom-nav` (Mobile) with matching links.
- Implement the premium Top Bar (`header`) with page titles and user profile.
- Wrap core logic in `div#app-content`.

### Task 3: Refine Purchasing Tabs (High-Density Desktop)

- **Tab 1 (Pending PR):** Compact the group cards. Use the tall-card design for desktop visibility.
- **Tab 2 (Active PO):** Implement the "Premium Grid" layout. Refine the status badges (Overdue, Draft).
- **Tab 3 (Matching):** Overhaul the 2-way matching view. Use clean blocks with a sidebar-like feel for inputs. Ensure comparison between ordered vs. received is visually striking.
- **Tab 4 (APV):** Standardize the "Accounting Ready" cards.

### Task 4: Standardize Modals & Notifications

- Upgrade the "Direct PO" modal to match the premium form standard.
- Ensure the `Custom Confirm Modal` uses the standard premium aesthetics.
- Standardize the `AuthGuard` logic to support SSO and match the unified pattern.

---

### Task 5: Italic Font Check ("ฟ้อนต์เอียง")

- Conduct a thorough sweep of the file to ensure:
    - Main headings: **Bold Italic**.
    - Unit labels and status badges: **Bold Italic**.
    - Button text: **Bold Italic**.
    - SKU/Quantity values: **Black Italic** (Plus Jakarta Sans).

---

### Verification:
1.  **Layout:** Check sidebar vs. bottom nav responsiveness.
2.  **Typography:** Confirm titles are bold italic.
3.  **Functionality:** Test PO creation, matching, and closing flows to ensure the backend logic remains intact.
