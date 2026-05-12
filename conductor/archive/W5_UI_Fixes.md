# Plan: AKRA W5.html UI Error Fixes & Polish

**Goal:** Fix the UI errors identified from the screenshot and user feedback, strictly maintaining the current color scheme (dark blue sidebar, etc.) but improving the structural layout.

### Task 1: Sidebar Auto-Collapse (Hover Expand)
- **Target:** `aside#main-sidebar`
- **Current:** Fixed `w-64` (very wide).
- **New:** Use `group w-[76px] hover:w-64 overflow-hidden transition-all duration-300` on desktop.
- **Content:** Update the internal flex items so that when `w-[76px]`, the text (`span`) is hidden or clipped cleanly (e.g., `opacity-0 group-hover:opacity-100 whitespace-nowrap`), while the icons remain centered.
- **Color:** Keep `bg-[#171C8F]`.

### Task 2: Fix "Floating Tiny Card" Layouts
- **Target:** "Master Registry" (`manage` tab) and "Quick Terminal" (`transaction` tab) wrappers.
- **Current:** `max-w-2xl mx-auto` and `max-w-lg mx-auto`.
- **New:** Change to `max-w-full` or `max-w-5xl mx-auto` so they stretch properly and utilize the high-density space.
- **Header Color:** Keep the `bg-slate-800` (manage) and `bg-brand-blue` (transaction) headers, but ensure the card body looks premium.

### Task 3: Standardize Top Bar & Logout
- **Target:** `<header>` buttons area.
- **Current:** A red `Logout` pill button.
- **New:** Implement the standard `User Profile Box` (rounded-full, white bg, name on left, avatar circle on right). Make the whole box clickable to logout, or add a specific logout icon next to it.
- **Title:** Increase `text-lg` to `text-xl font-bold` for `{{ activeTabTitle }}`.

### Task 4: Fix Vue + Lucide Icons Re-rendering
- **Target:** Vue 3 instance options.
- **Fix:** Add the `updated()` lifecycle hook to the Vue instance and call `lucide.createIcons()` inside it. This guarantees icons render after any `v-for` or `v-if` DOM updates.

### Execution Notes:
- **DO NOT** change the core color tone (`#171C8F`).
- **DO NOT** break Vue logic (`@click`, `v-model`, etc.).
