# KPI UI/UX Professional Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the UI/UX of `KPI.html` by reducing "oversized" elements, increasing information density, and implementing fluid scaling for desktop users.

**Architecture:** We will modify the internal `<style>` block and HTML structure of `KPI.html`. We'll introduce CSS variables for scaling, use Tailwind's arbitrary value support for precise adjustments, and replace hardcoded large classes with fluid `clamp()` values.

**Tech Stack:** HTML5, Tailwind CSS, FontAwesome, JavaScript (Vanilla).

---

### Task 1: Establish Global Scaling & Variables

**Files:**
- Modify: `KPI.html` (style block)

- [ ] **Step 1: Add CSS variables for fluid scaling**

Modify the `:root` block to include a base scale and fluid sizing.

```css
        :root {
            --brand-blue: #171C8F;
            --brand-blue-hover: #11146B;
            --brand-orange: #E35205;
            --sidebar-width: clamp(72px, 8vw, 76px); /* Reduced from 100px */
            --header-height: 4rem; /* Reduced from 5rem/h-20 */
            --bg-main: #f4f7fe;
            --safe-bottom: env(safe-area-inset-bottom, 0px);
            --card-radius: 1.5rem; /* Standardized from 2-3rem */
            --fluid-8xl: clamp(2.5rem, 6vw, 4.5rem);
            --fluid-xl: clamp(1rem, 2vw, 1.25rem);
        }
```

- [ ] **Step 2: Update base styles for desktop**

Apply the new variables to existing components.

```css
        .sidebar { width: var(--sidebar-width); ... }
        .card { border-radius: var(--card-radius); padding: 1.5rem; }
        @media (min-width: 768px) { .card { border-radius: 2rem; padding: 2rem; } }
        
        /* Adjust Nav Links */
        .nav-link { padding: 1rem 0; gap: 0.25rem; }
        .nav-link i { font-size: 1.2rem; }
        .nav-link span { font-size: 0.7rem; }
```

- [ ] **Step 3: Commit**

```bash
git add KPI.html
git commit -m "style: add fluid scaling variables and reduce sidebar/card base sizes"
```

---

### Task 2: Refine Header and Global Typography

**Files:**
- Modify: `KPI.html`

- [ ] **Step 1: Shrink Top Bar (Header)**

Replace `h-16 md:h-20` with `h-14 md:h-16`.

```html
<header class="h-14 md:h-16 flex items-center justify-between px-6 md:px-10 bg-[#F4F7FE]/80 backdrop-blur-xl sticky top-0 z-30">
```

- [ ] **Step 2: Standardize Labels and Titles**

Update labels from `text-[9px]/[10px]` to `text-xs` and reduce page title size.

```html
<!-- Example change -->
<p class="text-[11px] font-bold text-[#707EAE] uppercase tracking-wider mb-0.5">ระบบปฏิบัติงาน</p>
<h2 class="text-base md:text-lg font-bold text-[#2B3674] tracking-tight" id="page-title">บันทึกข้อมูล</h2>
```

- [ ] **Step 3: Commit**

```bash
git add KPI.html
git commit -m "style: reduce header height and standardize typography"
```

---

### Task 3: Compact the Record View (Form)

**Files:**
- Modify: `KPI.html`

- [ ] **Step 1: Reduce Card Padding and Radius in Record Section**

Target `p-6 md:p-8` and `p-6 md:p-10` classes and reduce them.

```html
<!-- Before -->
<div class="card p-6 md:p-10 border-t-[8px] border-t-rose-500">
<!-- After -->
<div class="card p-5 md:p-6 border-t-[6px] border-t-rose-500">
```

- [ ] **Step 2: Shrink the "Save All" Button**

Reduce from `h-16 md:h-20` to `h-12 md:h-14`.

```html
<button onclick="saveDailyRecord()" id="btn-save" class="btn-action w-full h-14 md:h-16 text-base md:text-lg ...">
```

- [ ] **Step 3: Tighten Quota Grid Items**

If generated via JS, update the JS string.

```javascript
// Inside initApp branch === 'AKRA'
volGrid.innerHTML = [...].map(([id, label, sub]) => `
    <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-50 ...">
        <div class="min-w-0 pr-2">
            <p class="text-xs font-bold text-[#171C8F] mb-0.5">${label}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">${sub}</p>
        </div>
        <div class="flex items-center gap-2 bg-[#F4F7FE] p-1 rounded-xl ...">
            <button onclick="adjVol('${id}', -1)" class="w-8 h-8 rounded-lg ...">
            <input type="number" id="${id}" value="0" class="w-10 text-center font-bold text-base ...">
            <button onclick="adjVol('${id}', 1)" class="w-8 h-8 rounded-lg ...">
        </div>
    </div>`).join('');
```

- [ ] **Step 4: Commit**

```bash
git add KPI.html
git commit -m "style: compact Record view elements and buttons"
```

---

### Task 4: Compact the Dashboard Metrics

**Files:**
- Modify: `KPI.html`

- [ ] **Step 1: Implement Fluid Sizes for Stats**

Replace `text-5xl md:text-6xl` with the `--fluid-8xl` variable or a custom clamp.

```html
<h4 id="dash-total-errors" class="text-[var(--fluid-8xl)] font-bold tracking-tighter">0</h4>
```

- [ ] **Step 2: Reduce Metric Card Height**

Reduce `min-h-[140px]` to `min-h-[110px]` and padding.

```html
<div class="stat-card-red p-4 md:p-5 flex flex-col justify-between min-h-[110px] group">
```

- [ ] **Step 3: Shrink Circle Progress**

Update JS that generates the Team Grade circle.

```javascript
// Inside loadDashboardData
dashKpi.innerHTML = `
<div class="stat-card-purple p-4 md:p-5 flex items-center gap-4 relative ...">
    <div class="circle-progress flex items-center justify-center relative z-10 shrink-0 w-[90px] h-[100px]">
        <svg width="90" height="90" viewBox="0 0 140 140">...
```

- [ ] **Step 4: Commit**

```bash
git add KPI.html
git commit -m "style: fluid scaling for dashboard metrics and smaller team grade circle"
```

---

### Task 5: Refine Admin and Log Views

**Files:**
- Modify: `KPI.html`

- [ ] **Step 1: Compact User List Items**

Reduce padding and font sizes in the employee list items.

```javascript
// Inside renderAdminPanel
c.innerHTML = GLOBAL_CONFIG_LIST.map((e, i) => `
    <div class="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 ...">
        <div class="min-w-0 pr-4">
            <p class="text-base md:text-xl font-bold ...">${e.name}</p>
            <p class="text-[10px] font-bold ...">UID: ${e.uid} — LINK: ${e.branches}</p>
        </div>
        ...
```

- [ ] **Step 2: Compact the Admin Stats**

Reduce `text-7xl md:text-8xl` to `text-5xl md:text-6xl` and `p-10 md:p-16` to `p-6 md:p-8`.

```html
<div class="card p-6 md:p-10 flex flex-col justify-center border-l-[12px] border-l-rose-500">
    <h4 class="text-5xl md:text-6xl font-bold ..." id="admin-stat-err">0</h4>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add KPI.html
git commit -m "style: compact admin panel and log views"
```
