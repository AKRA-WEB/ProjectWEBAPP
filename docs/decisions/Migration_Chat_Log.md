# บันทึกการดำเนินการย้ายระบบ (Migration Chat Log & Documentation)
**วันที่ดำเนินการ:** วันพุธที่ 6 พฤษภาคม 2569
**เป้าหมาย:** ย้ายระบบ Web Apps จาก Google Apps Script (GAS) / Google Sheets ไปยัง Supabase (PostgreSQL)

---

## 1. สรุปภาพรวมการเปลี่ยนแปลง (Summary)
- **Backend:** เปลี่ยนจาก Google Apps Script เป็น **Supabase** (URL: `deboelqdfpxayzqnrnjb`)
- **Database:** ใช้ **PostgreSQL** แทน Google Sheets โดยมีการออกแบบ Schema ใหม่ในไฟล์ `schema.sql`
- **Authentication:** ใช้ระบบ **Unified SSO** ผ่านฐานข้อมูลกลางตาราง `users`
- **Frontend:** รักษา UI/UX เดิมไว้ทั้งหมด แต่เปลี่ยนวิธีเรียกข้อมูลผ่าน **`AKRA_API`** ในไฟล์ `supabase-client.js`
- **Deployment:** อัปโหลดขึ้น **GitHub Repository** และซิงค์ข้อมูลกับ **OneDrive Desktop**

---

## 2. ลำดับเหตุการณ์และปัญหาที่พบ (Timeline & Troubleshooting)

### ระยะที่ 1: การเตรียมโครงสร้างพื้นฐาน
- ออกแบบตารางใน Supabase: `purchase_requests`, `purchase_orders`, `goods_receipts`, `w5_inventory`, `daily_records` ฯลฯ
- สร้างไฟล์ **`supabase-client.js`** เพื่อเป็นตัวกลางในการเชื่อมต่อ

### ระยะที่ 2: การสกัดข้อมูล (Data Extraction)
- **ปัญหาที่พบ:** การสกัดข้อมูลสินค้าจาก Excel ครั้งแรกเกิดปัญหาภาษาไทยเป็น `????`
- **การแก้ไข:** ทำการสกัดข้อมูลใหม่ด้วยการเข้ารหัส **UTF-8 (Plain)** และแบ่งไฟล์ SQL เป็น 5 ชุด (`products_insert_v2_chunk_*.sql`) เพื่อให้ง่ายต่อการ Run ใน SQL Editor

### ระยะที่ 3: การแก้ไข Bug และ Error สำคัญ
1.  **Conflict Identifier (supabase):**
    - *Error:* `Uncaught SyntaxError: Identifier 'supabase' has already been declared`
    - *Fix:* เปลี่ยนชื่อตัวแปรหลักในสคริปต์เป็น `akraSupabase` เพื่อไม่ให้ชนกับ Library ภายใน
2.  **ReferenceError (currentUser):**
    - *Error:* `currentUser is not defined` ในแอป W5
    - *Fix:* ประกาศตัวแปร Global ไว้ล่วงหน้าและปรับระบบ Vue ให้รอผลจาก AuthGuard ก่อนรัน
3.  **Missing Data (prList):**
    - *Error:* `Cannot read properties of undefined (reading 'length')` ในหน้า PO
    - *Fix:* อัปเดต `getInitialData` ให้ดึงข้อมูลคำขอซื้อ (PR) มาส่งให้หน้า Badge แจ้งเตือนด้วย
4.  **Field Mapping & UUID:**
    - *Error:* `v.toLowerCase is not a function` และ `400 Bad Request`
    - *Fix:* ปรับระบบ Mapping จาก `snake_case` (DB) เป็น `camelCase` (App) และเปลี่ยนการอ้างอิงจากลำดับแถว (Row Number) มาเป็น **UUID** (`po_uid`, `pr_uid`) เพื่อความแม่นยำ
5.  **Conflict 409 (GR App):**
    - *Error:* การบันทึกรายการพิเศษ (Extra Items) ล้มเหลวเนื่องจากส่งค่าว่างเข้าช่อง UUID
    - *Fix:* ปรับให้ระบบส่งค่า `null` แทนข้อความว่างสำหรับช่องรหัสเฉพาะต่างๆ

### ระยะที่ 4: การ Cleanup ครั้งสุดท้าย
- ลบ URL ของ Google Apps Script ออกจากโค้ด HTML ทุกไฟล์
- ย้าย Logic การบันทึก Logs ไปยังตาราง `system_logs` ใน Supabase
- ทดสอบการรันทุกแอปและซิงค์ไฟล์ล่าสุดลง OneDrive

---

## 3. วิธีใช้งานระบบ (User Manual)
1.  **URL การใช้งาน:** `https://akra-web.github.io/ProjectWEBAPP/`
2.  **การเข้าสู่ระบบ:** ใช้รหัสพนักงานเดิม (เช่น `172980` สำหรับ Admin)
3.  **การเพิ่มสินค้า/คู่ค้า:** นำเนื้อหาจากไฟล์ `.sql` ใน GitHub ไป Run ใน **Supabase SQL Editor**
4.  **การแก้ไขโค้ด:** หากต้องการเปลี่ยนรหัสผ่าน Supabase ให้แก้ไขที่ไฟล์ **`supabase-client.js`** เพียงที่เดียว

---

## 4. โครงสร้างไฟล์ปัจจุบัน (File Structure)
- `index.html`: หน้า Portal หลัก
- `supabase-client.js`: หัวใจหลักในการเชื่อมต่อ DB (สำคัญที่สุด)
- `schema.sql`: โครงสร้างฐานข้อมูลสำหรับสร้างตารางใหม่
- `vendors_insert_v2.sql`: ข้อมูลผู้จำหน่าย (ไทย)
- `products_insert_v2_chunk_*.sql`: ข้อมูลสินค้า (ไทย)
- `*.html`: แอปพลิเคชันแยกส่วนต่างๆ (PR, PO, GR, KPI, W5, Transfers, Return)

---
*บันทึกนี้จัดทำขึ้นเพื่อเป็นหลักฐานการแก้ไขและคู่มือการดูแลรักษาระบบในอนาคต*
