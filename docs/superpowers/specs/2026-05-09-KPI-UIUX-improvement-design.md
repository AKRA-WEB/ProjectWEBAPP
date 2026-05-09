# Design Specification: KPI UI/UX Professional Density & Scaling

**Date:** 2026-05-09
**Topic:** Improving KPI Dashboard UI/UX for Windows Desktop (Fixing Oversized Elements)
**Status:** Approved / Ready for Implementation Plan

## 1. Vision & Goals
Transform the current KPI interface from a "zoomed-in" mobile-first look into a professional, data-dense dashboard. The goal is to reduce scrolling, increase information density, and implement fluid scaling so the UI feels "right" on standard Windows resolutions (1080p and 1440p).

## 2. Core Principles
*   **Professional Density:** Reduce excessive paddings and margins to show more data at once.
*   **Fluid Scaling:** Use CSS `clamp()` and relative units to ensure the UI adapts gracefully to different screen sizes.
*   **Modern Aesthetics:** Soften the "bubbly" look (extreme border-radii) into a sharper, cleaner business aesthetic.

## 3. Technical Specifications

### A. Scale & Typography
*   **Base Fluidity:** Implement a global CSS variable `--ui-scale` (default: 1) that can be adjusted via media queries for very large or very small screens.
*   **Giant Numbers:** Replace `text-7xl` and `text-8xl` with `clamp(2.5rem, 4vw, 4.5rem)`.
*   **Standard Labels:** Change `text-[9px]` and `text-[10px]` to `text-xs` (12px) with `tracking-wider` for better readability.
*   **Input Fields:** Reduce height from `h-14/16` to a standard `h-11/12`.

### B. Layout & Spacing
*   **Sidebar:** Slim down width from `100px` to `76px`. Reduce icon size to `1.2rem`.
*   **Header:** Reduce height from `h-20` to `h-16`.
*   **Card Padding:** Reduce `p-16` or `p-10` to `p-6` (24px) or `p-8` (32px).
*   **Border Radii:** Standardize `rounded-[3rem]` down to `rounded-2xl` (1rem) or `rounded-3xl` (1.5rem).
*   **Gaps:** Reduce `gap-10` to `gap-4` or `gap-6`.

### C. Specific Page Enhancements
*   **Record View:** Reduce the "Save All" button height from `h-20` to `h-14`. Tighten the employee selection grid to use less vertical space.
*   **Dashboard:** Compacity the "Team Grade" circle and stats so they sit higher on the page.
*   **Admin Panel:** Shrink the registration form cards and the user list items to fit more rows per screen.

## 4. Proposed Approaches (Reference)
*   **Selected Approach:** A hybrid of **Professional Density** (reducing paddings/radii) and **Auto-Scale** (fluid typography/relative units).

## 5. Success Criteria
1.  The "Record" view should require minimal to no scrolling on a standard 1080p laptop screen.
2.  The "Dashboard" stats should be visible at a glance without feeling like they are "shouting" (too large).
3.  The overall interface feels more like a desktop application than a scaled-up mobile app.
