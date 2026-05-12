# Plan: GR.html Premium SaaS UI Overhaul

**Goal:** Transform `GR.html` (Receiving App) to match the "Premium DNA" (Sidebar/Bottom Nav layout, high-density professional UI, and **Bold Italic** headers). This app is critical for warehouse operations and includes specialized features like Text-to-Speech (TTS) and Forklift fee handling.

---

### Task 1: Establish Global Styles & Variables

- Update `:root` with fluid scaling variables and layout constants.
- **Typography:**
    - Use `Prompt` for Thai and `Plus Jakarta Sans` for English/Numbers.
    - **Header Style:** Standardize page titles and card titles as `font-black italic uppercase tracking-tight` (Thai: "เอียง").
- **Glass-morphism:** Use white borders (`border-white/50`), soft shadows, and clean gradients.
- **Color Palette:** Maintain the `brand-orange` focus for GR (Receiving) but refine the secondary colors.

### Task 2: Implement Sidebar & Navigation Shell

- Add `aside#main-sidebar` (Desktop) with tabs: "Manifest (List)" and "Processing (Detail)".
- Add `nav.bottom-nav` (Mobile) with matching links.
- Implement the premium Top Bar (`header`) with page titles and user profile.
- Wrap core logic in `div#app-content`.

### Task 3: Refine Receiving Views (High-Density Desktop)

- **Manifest View (List):**
    - Compact the PO cards. Use the tall-card design for desktop visibility.
    - Standardize status badges (Overdue, Draft, Pending Review).
- **Receiving Detail View (Form):**
    - Overhaul the header with glass-morphism.
    - **Item Rows:** Compact the product rows. Ensure the "Speak" button and "Quantity" inputs are visually optimized.
    - **Extra Items:** Refine the "Bonus/Extra" section with a clean dashed border and clear typography.
    - **Forklift Section:** Standardize the W2 Hub exclusive "Lift Fee" UI with premium toggle buttons.

### Task 4: Functional Polish (TTS & State)

- Ensure `speechSynthesis` (TTS) is integrated into the new icon set.
- Standardize the `AuthGuard` logic to support SSO and match the unified pattern.
- Refine the bottom action bar (Draft, Review, Confirm) to be sticky and responsive.

---

### Task 5: Italic Font Check ("ฟ้อนต์เอียง")

- Conduct a thorough sweep to ensure:
    - Main headings: **Bold Italic**.
    - Status badges & Warehouse Hubs: **Bold Italic**.
    - Button text: **Bold Italic**.
    - Numeric values (Qty): **Black Italic** (Plus Jakarta Sans).

---

### Verification:
1.  **Layout:** Check sidebar vs. bottom nav responsiveness.
2.  **Typography:** Confirm titles are bold italic.
3.  **Functionality:** Test PO manifest loading, receiving entry (Qty/EXP/Loc), and TTS playback.
