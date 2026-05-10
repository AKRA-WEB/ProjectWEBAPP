# Plan: Fix "Strange" PC View in AKRA W5.html

**Goal:** Restore the stable, professional PC layout in `AKRA W5.html` while preserving the mobile optimization and minimal typography.

### Task 1: Revert to Stable Sidebar (No Collapse)
- **Target:** `aside#main-sidebar`
- **Change:** 
    - Remove the `group`, `w-[76px]`, `hover:w-64`, and `transition-all` classes that cause jitter.
    - Set a constant `w-64` (256px).
    - Remove all `opacity-0 group-hover:opacity-100` logic from the text and icons.
    - Keep the `bg-[#171C8F]` and existing styles.
- **Mobile:** Keep it as a drawer (`transform -translate-x-full` on mobile, `translate-x-0` on `mobile-open`).

### Task 2: Expand Content Boundaries
- **Target:** `<main>` container.
- **Change:** Change `max-w-5xl` to `max-w-[1600px]` or `max-w-full px-4 md:px-12` to fully utilize large PC screens. The user felt the previous "tiny cards" were strange.

### Task 3: Refine Card Spacing
- Ensure `glass-card` elements have healthy vertical spacing and are not too crammed.

### Task 4: Ensure Header-Sidebar Alignment
- The header title `text-xl font-bold` should align perfectly with the sidebar's edge.

### Verification:
1. **PC View:** Stable sidebar, no layout shifting on mouse hover.
2. **Mobile View:** Still looks "good" as per user feedback.
3. **Typography:** Still "Minimal" (Straight fonts).
