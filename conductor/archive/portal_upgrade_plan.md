# Plan: Portal (index.html) Premium SaaS UI Refinement

**Goal:** Ensure `index.html` perfectly matches the '02.png' reference provided by the user, specifically focusing on the high-density desktop layout and responsive polish.

---

### Task 1: Refine Portal Shell & Header

- **Header:**
    - Increase border radius from `rounded-[2rem]` to `rounded-[3rem]`.
    - Refine padding to `p-6` or `p-8` to match the visual weight.
    - Standardize titles: "SYSTEM DESKTOP" (Large, Bold, Italic) and "AKRA-TRD OPERATIONAL NETWORK" (Small, Bold, Tracking).
    - Refine the user profile box on the right.

- **Background:**
    - Ensure the gradient/solid color matches the deep blue in `02.png`.

### Task 2: Refine App Grid & Cards

- **App Grid:**
    - Adjust `gap` to match the reference (looks like `gap-6` or `gap-8`).
    - Ensure cards are `h-full` to create the tall column effect seen in `02.png`.

- **Cards:**
    - Use `rounded-2xl` or `3xl`.
    - Refine the icon box (size, background, border).
    - Typography: "เบิกย้ายสินค้า W5" (Bold, Italic), "OPERATIONAL NODE" (Small, Tracking-widest).

### Task 3: Mobile Optimization

- Ensure the mobile view remains clean and high-density.
- Implement a responsive grid that shifts from 1 col (mobile) to 4 cols (large desktop).

---

### Verification:
1.  **Visual Check:** Compare the rendered `index.html` with `Error/02.png`.
2.  **Responsiveness:** Test on various viewport widths (320px to 2560px).
3.  **Functionality:** Verify that all app buttons still correctly launch their respective apps via SSO.
