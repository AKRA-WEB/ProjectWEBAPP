# Plan: Fix AKRA W5 Layout Alignment (Based on 01.png)

**Goal:** Correct the layout of `AKRA W5.html` so that the sidebar is full-height and the header is pinned to the top of the viewport, eliminating the white space and alignment issues shown in the user's annotated image (`Error/01.png`).

### Task 1: Fix Body and Root Container Layout
- **Target:** `body` and `#app`.
- **Change:** 
    - Add `h-screen overflow-hidden flex` to `body` to create a viewport-locked flex container.
    - Set `#app` to `flex-1 h-full flex overflow-hidden` to ensure it fills the entire viewport and allows its children (Sidebar and Content) to align correctly.

### Task 2: Ensure Sidebar occupies Full Height
- **Target:** `aside#main-sidebar`.
- **Change:** Ensure it has `h-full` and is a direct flex child of `#app`. Remove any absolute positioning on desktop that might be causing it to lift from the edges.

### Task 3: Pin Header to Top
- **Target:** `.main-content` and `header`.
- **Change:** Ensure `.main-content` is a `flex-1 flex flex-col h-full overflow-hidden`. The `header` will naturally sit at the top, and the `main` tag will take `flex-1 overflow-y-auto` to allow internal scrolling.

### Verification:
1. **Visual Match:** Compare with the user's "Should be" lines in `01.png`.
2. **PC View:** Sidebar should touch top and bottom. Header should be at the very top of the content area.
3. **Mobile View:** Verify that the mobile drawer and bottom nav still function correctly.
