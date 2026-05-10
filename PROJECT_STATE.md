**Last Updated:** 2026-05-09 (ICT)
**Current Phase:** System-wide UI Consolidation & Mobile Optimization

## 🧠 Context Compaction (Session Summary - 2026-05-09)

### Core Achievements
- **Return&Claim UI Recovery**: Fixed a critical syntax error in the `AuthGuard` initialization object that was causing the entire app logic to fail. Restored button responsiveness and ensured proper SSO sequence.
- **PO Vendor Traceability**: Added `vendor` column to the `products` table schema and implemented an auto-sync mechanism that maps vendors to products upon PO creation/approval.
- **Procurement Status Sync**: Enhanced `AKRA_API.closePO` to automatically update linked `purchase_requests` to 'Approved' status, preventing data leakage between app states.
- **KPI Premium Overhaul**: Completely re-engineered `KPI.html` with a high-density, professional UI using fluid scaling and condensed layouts for desktop usage.
- **Mobile UI/UX Optimization**: Implemented responsive bottom navigation, enlarged touch targets, and iOS safe-area support for the KPI app.
- **Thai Localization**: Achieved 100% Thai language parity across all KPI app interfaces.
- **Technical Integrity**: Resolved a critical "Access Denied" TypeError and standardized the `AuthGuard` handshake across the entire app suite.
- **Engineering Standards**: Established a mandatory Technical Ledger (`docs/applied_solutions.md`) for instant bug-to-solution documentation.

### Core Context & Architecture
- **Project:** Migrating 8+ WMS WebApps from GAS/Google Sheets to Supabase (PostgreSQL) + Plain HTML/JS/Tailwind.
- **Root Directory:** `C:\Users\AKRA-Panich-Front\OneDrive\Desktop\WEBAPP SUPABASE` (Locked).
- **Core Files:** `index.html` (Portal), `supabase-client.js` (AKRA_API), `Return&Claim.html`, `KPI.html`, `PR.html`, `PO.html`, `GR.html`.
- **Database Rules:** Use `snake_case` only (Supabase parity). Mandatory `upsert` for idempotency. Bypass 1000-row limit using `AKRA_API.fetchAll`.

### Automation & Workflow (t2c)
- **t2c Rule:** User input in Thai -> Gemini performs **Deep Analysis** (reads files) -> Gemini designs solution -> Gemini generates professional English Prompt -> Copied to Clipboard for manual paste into Claude Interactive.
- **PowerShell Integration:** `t2c` function in `$PROFILE` locked to project directory; includes "ตรวจสอบงาน" for auto-sync.
- **CLI Sync:** Saying "ตรวจสอบงาน" triggers Gemini-led Git Audit (analyze diff -> generate commit msg -> push to `origin master`).

### Key Technical Decisions
- **Returns -> Claims Link:** Logic in `updateReturnQC` automatically generates a `claims` record when `grade === 'C'` using a deterministic ID (`CLM-RET-ID`).
- **Audit Finalization:** 2-step atomic close. Step 1: Write `stock_diff`. Step 2: Set `overall_status = 'สำเร็จแล้ว'` to clear UI badges.
- **Data Integrity:** `DATE` columns must receive `null` instead of `'-'`. Helper `toDate()` implemented in backend API.
- **Permissions:** Case-insensitive role matching (e.g., `ADMIN`, `Admin`, `admin`). `TRD` role granted `ADD_CLM` and `TRACK_CLM` access.

### File Reorganization (Latest)
- `docs/`: Architecture, decisions, and runbooks.
- `tools/scripts/`: Diagnostic and data-fixing Node.js scripts.
- `src/`: Prepared for `api/` and `persistence/` documentation layers.
- `_sql_migration/`: Canonical database schema and seed scripts.

### User Preferences
- **Role:** Gemini acts as **System Analyst / PM**. Analyzing code is mandatory before prompting. No direct code editing unless explicitly commanded.
- **Consistency:** Always update `PROJECT_STATE.md` (progress) and `CLAUDE.md` (knowledge/roles) after tasks.

---

## ✅ Completed Tasks (2026-05-08)

### 🔐 Claim & Stock Count Bug Fixes
- [x] **Bug 1: แจ้งเคลมแล้วไม่แสดงในรายการ (Claim not visible after submit)**
  - แก้ไขโดยเพิ่ม `wh_status: 'ยังไม่รับ'` ใน `addDrafts` และ `updateReturnQC` auto-claim payload
- [x] **Bug 2: Audit Counting — กด "พักไว้ก่อน" แล้วยอดนับหาย**
  - แก้ไขใน `openAuditCountingModal` ให้ pre-fill `count_qty` เสมอ และเพิ่ม `savePartialAuditCount` เมื่อกด Cancel (พักไว้ก่อน)
- [x] **Bug 3: Audit Counting — กด Save แล้ว status ไม่เปลี่ยนเป็น "Count Completed"**
  - แก้ไขใน `submitAuditCount` ให้ตรวจสอบและอัปเดต `overall_status: 'ตรวจสอบอยู่'` เมื่อนับครบทุกคลังที่กำหนด

### 🔐 Returns & Claims Dashboard Crash Fix
- [x] **แก้ TypeError: Dashboard ไม่โหลด**
  - เปลี่ยน field access ทั้งหมดเป็น snake_case (`task_id`, `date_str`, ฯลฯ) เพื่อให้ตรงกับข้อมูลจาก Supabase

### 🔐 Returns & Claims Backend Integrity Fix
- [x] **แก้ `updateReturnQC` — Claim insert Silent Failure**
  - ใช้ `upsert` และ capture error กลับมาแสดงผล
- [x] **แก้ `createAudit` — Bug row_id และ audit_date mismatch**
  - เพิ่ม `row_id` generation และเปลี่ยน field name เป็น `created_date`
- [x] **แก้ `finalizeAudit` — Property mismatch bug**
  - แก้ไข `item.diff` เป็น `item.stockDiff` เพื่อให้ตรงกับ payload จาก frontend ทำให้ยอด `stock_diff` บันทึกลง database ได้ถูกต้อง
- [x] **แก้ `findVendorBySku` — Schema mismatch bug**
  - แก้ไข column name จาก `vendor_name` เป็น `vendor` และเปลี่ยนจาก `.contains()` เป็น `.eq()` เพื่อให้ค้นหา Vendor จากประวัติ PO ได้ถูกต้องตาม Schema
- [x] **แก้ `lockAuditWH` — Multi-row update bug**
  - แก้ไขให้การ Lock งานมีผลกับทุก row ใน Task ID เดียวกัน และเพิ่ม Error handling

### 🔍 Audit System Functional Improvements (2026-05-09)
- [x] **Universal Status Handling**: แก้ไข Dashboard ให้รองรับทั้ง `'รอนับ'` (Thai) และ `'Pending'` (Eng) ป้องกัน Badge แสดงผลผิดพลาด
- [x] **Audit Review UI Fix**: เพิ่มปุ่ม "คำนวณ Diff & ปิดจ๊อบ" ใน Modal ตรวจสอบผลนับ เพื่อให้สามารถจบงานได้จริงจากหน้า UI
- [x] **Warehouse Receive Action Fix**: แก้ไข `data-action` จาก `'wh-receive'` เป็น `'wh-in'` ให้ตรงกับ Dispatcher ใน `handleGlobalClicks`
- [x] **Audit Workflow Fix (Critical)**:
  - แก้ไข **Bug กดพักแล้วยอดหาย**: เปลี่ยนการส่งค่าจาก `id` เป็น `row_id` ใน Modal การนับ และปรับ Backend ให้รองรับการบันทึกยอดเป็น 0
  - แก้ไข **Bug บันทึกแล้วสถานะไม่เปลี่ยน**: ปรับ Logic `countingComplete` ให้ย้ายใบงานไปหน้า "Review" ทันทีที่คลังใดคลังหนึ่ง (หรือทั้งคู่) นับเสร็จตามเงื่อนไข "either one or both"
- [x] **Missing Print Preview**: เพิ่มฟังก์ชัน `executePrintPreview` ให้รองรับการพิมพ์ใบส่งคืนสินค้าชำรุด (Damage Goods Return) พร้อม Template มาตรฐาน
- [x] **Dynamic Multiplier Support**: เพิ่มความสามารถในการแก้ไข "จำนวนชิ้นต่อลัง" (Multiplier) ได้ทันทีในหน้า Review เพื่อความยืดหยุ่นกรณีสินค้ามีการเปลี่ยนหน่วยบรรจุ

### 🔍 KPI App Audit & Optimization (2026-05-09)
- [x] **Premium UI Overhaul**: Strictly matched UI/UX with the provided SaaS dashboard reference (Commit: `4578ed3`)
- [x] **Desktop UI/UX Optimization**: Fixed \"oversized\" elements on desktop. Implemented fluid scaling (`clamp`), professional density (reduced paddings/radii), and compacted all views (Record, Dashboard, Admin).
- [x] **Mobile-First Optimization**: 
  - Implemented responsive Bottom Navigation Bar for mobile viewports.
  - Enlarged touch targets (inputs/buttons) for accessible field entry on touchscreens.
  - Added support for iOS Safe Areas and viewport-fit=cover.
- [x] **Bug Fix: Critical Auth Failure**: Resolved `TypeError: classList of null` by restoring the `app-content` wrapper and implementing defensive null checks (Commit: `33ec320`)
- [x] **Full Thai Localization**: Completed 100% translation of the KPI app interface, including technical analytics terms.
- [x] **Typography Refinement**: Optimized Prompt font weights and letter-spacing for premium readability.

### 🔐 Authentication System Standardization (2026-05-09)
- [x] **Standardized AuthGuard Pattern** across all apps (`PO`, `PR`, `GR`, `W5`, `KPI`, `Return&Claim`, `Transfers`)
- [x] **Consistent Session Storage**: Standardized `STORAGE_KEY` naming to `akra_[app]_session_token` for all sub-apps
- [x] **SSO Parity**: All apps now correctly handle `?sso=` tokens and sync with the main portal's identity

### 🔐 Portal (index.html) Final Refinement (2026-05-09)
- [x] **Pixel-Perfect Sync**: Synchronized `:root` variables, glass-morphism classes (`.glass-card`), and input styles (`.input-ci`) with the `Return&Claim.html` gold standard.
- [x] **Typography Overhaul**: Standardized body font to `'Prompt' + 'Plus Jakarta Sans'`. Globally removed `italic`, `font-black`, and `font-extrabold` classes, replacing them with professional `font-bold` and `font-semibold`.
- [x] **Theme Harmonization**: Removed dark gradient background from `<body>` to align with the light "Premium Minimal" theme family.
- [x] **Layout Clean-up**:
    - **Login**: Refined the login card to use standardized radii and borders.
    - **Dashboard**: Updated the portal header and navigation to match the height and spacing of sub-apps.
    - **App Grid**: Updated app cards to use the `glass-card` style with subtle hover transitions.
    - **Admin**: Standardized admin tabs, sidebar, and table matrix layout.
- [x] **Logic Preservance**: All SSO handling, login sequence, and admin data fetching remain 100% functional.

### 🗂️ Documentation & Logging (Requirement: Applied Solutions)
- [x] **Technical Ledger Created**: Established `docs/applied_solutions.md` to log all technical methods, troubleshooting steps, and engineering solutions immediately after resolution.
- [x] **Knowledge Capture**: Updated `CLAUDE.md` to prioritize the new Technical Ledger for session continuity.

### 🎨 UI/UX Consolidation (2026-05-09)
- [x] **Premium Minimal Gold Standard:** ปรับโฉมแอปทั้งระบบ (Portal, KPI, PR, PO, GR, W5, Return&Claim, Transfers) ให้ตรงตามมาตรฐานสูงสุด (Gold Standard) โดยอ้างอิงจาก `Return&Claim.html` 100%
- [x] **Pixel-Perfect Alignment:** ซิงค์ CSS Variables, Component Classes (.glass-card, .input-ci), และ Layout Shell ให้เป็นพิมพ์เขียวเดียวกันทุกไฟล์
- [x] **No Italic / No Black Weight:** เคลียร์สไตล์ตัวเอียงและฟ้อนต์หนาพิเศษออกทั้งหมด ใช้ความหนาแบบพอดี (font-bold/semibold) เพื่อความสะอาดตาและเป็นมืออาชีพ
- [x] **Standardized Shell:** ทุกแอปใช้ระบบ Sidebar (w-64 Drawer) สำหรับ Desktop และ Bottom Nav สำหรับ Mobile เหมือนกันเป๊ะ
- [x] **Lucide Icon Standard:** เปลี่ยนมาใช้ Lucide Icons ทั้งระบบ 100% (รวมถึงใน JavaScript dynamic rows)
- [x] **Unified AuthGuard:** ระบบตรวจสอบสิทธิ์ SSO Handshake เป็นมาตรฐานเดียวกัน มั่นใจเรื่องความปลอดภัยและการเชื่อมต่อ


### 🔐 Infrastructure & SSO (2026-05-09)
- [x] **Full SSO Sync:** ทุกแอปใช้ `akra_session_token` ซิงค์กับ `akra_user_data` อย่างสมบูรณ์
- [x] **API Layer Standard:** ลบ `apiCall` wrapper ใน PR/GR และใช้ `AKRA_API.call` ตรงจากไฟล์กลาง
- [x] **AuthGuard Parity:** ทุกแอปมี Logic ตรวจสอบสิทธิ์แบบเดียวกัน มั่นใจเรื่องความปลอดภัย

### 📦 Inter-Warehouse Transfers Final Refinement (2026-05-09)
- [x] **Pixel-Perfect Sync:** Synchronized `:root` variables, glass-morphism classes (`.glass-card`), and input styles (`.input-ci`) with the `Return&Claim.html` gold standard.
- [x] **Typography Overhaul:** Standardized body font to `'Prompt' + 'Plus Jakarta Sans'`. Globally removed `italic`, `font-black`, and `font-extrabold` classes, replacing them with professional `font-bold` and `font-semibold`.
- [x] **UI Shell Standardization:** Implemented the mobile drawer sidebar (`w-64` style), backdrop-blur header, and responsive layout shell.
- [x] **Component Alignment:** Refined the W1 Request form, W2 Task cards, and Dashboard Insight cards to match the high-density minimal look.
- [x] **UX Enhancement:** Integrated global loader for data fetching and submission actions, replacing simple toasts with professional progress indicators.
- [x] **Logic Preservation:** All transfer logic, data fetching, and AuthGuard handshake remain 100% functional.
