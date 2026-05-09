# AKRA Web Apps - Session Context Summary
**Date:** วันพฤหัสบดีที่ 7 พฤษภาคม 2569
**Project Status:** Migration to Supabase (Phase 2 - Optimization & UI Refactor)

## 1. Key Achievements (สิ่งที่ดำเนินการสำเร็จ)

### 📦 Folder Organization (การจัดระเบียบไฟล์)
- จัดกลุ่มไฟล์ขยะและไฟล์ทางเทคนิคเข้าสู่โฟลเดอร์ย่อยเพื่อความสะอาดของโปรเจกต์:
    - `_docs/`: เอกสารคู่มือ, บันทึกการย้ายระบบ, และไฟล์ Excel
    - `_scripts/`: สคริปต์ JavaScript สำหรับทดสอบและแก้ไขข้อมูล
    - `_sql_migration/`: ไฟล์สำรอง SQL สำหรับสร้าง Schema และข้อมูลเริ่มต้น
- **GitHub Sync:** อัปโหลดโครงสร้างใหม่และโค้ดล่าสุดขึ้น GitHub เรียบร้อยแล้ว (สถานะ Git เคลียร์ Rebase ที่ค้างออกหมดแล้ว)

### 🏢 AKRA W5 App (ระบบคลัง W5)
- **UI/UX Refactor:** ปรับโฉมใหม่หมดจด รองรับการแสดงผลทั้ง PC (2 คอลัมน์) และ Mobile (Tab Navigation) ตามมาตรฐาน AKRA CI
- **Error Fix:** แก้ไขปัญหา "Message channel closed" และ JavaScript หลุดแสดงผลหน้าจอ
- **Database Integration:** เพิ่มฟังก์ชัน API ใน `supabase-client.js` สำหรับจัดการสต็อก, ประวัติการทำรายการ, และใบจัดสินค้า (Pick List)
- **Real-time Dashboard:** เพิ่มระบบสถิติสดและแจ้งเตือนสินค้าใกล้หมด (Low Stock)

### 🛒 PR App (ระบบขอซื้อ)
- **Login Optimization:** แก้ไขอาการค้างหน้าล็อคอินด้วยระบบ "Cache First" และเพิ่ม Timeout 15 วินาที ทำให้เข้าใช้งานได้รวดเร็วแม้เน็ตช้า

### 📥 GR App (ระบบรับสินค้า)
- **Draft Logic:** แก้ไขระบบ "พักบิล" (Draft GR) ให้บันทึกสถานะลงฐานข้อมูลได้จริงแม้ยังไม่มีจำนวนรับ
- **SpeechSynthesis Fix:** ปรับปรุงความเสถียรของระบบอ่านออกเสียงเพื่อลด Async Error

## 2. Technical Constraints & Rules (ข้อห้ามและกฎทางเทคนิค)

- **Identity:** ห้ามใช้ Row Number ในการอ้างอิงข้อมูลเด็ดขาด ให้ใช้ UUID (`po_uid`, `pr_uid`, etc.) เท่านั้น
- **SpeechSynthesis:** ต้องเรียก `cancel()` ก่อน `speak()` ทุกครั้ง และห้ามใช้ Listener ที่เป็น Async ค้างไว้
- **Bulk Updates:** การอัปเดตสถานะในเครือข่ายงาน Procurement ต้องทำทั้งกลุ่ม (Group Update) เพื่อป้องกันบิลแยกส่วน
- **Data Loading:** ใช้ฟังก์ชัน `fetchAll` ใน `AKRA_API` เพื่อเลี่ยงข้อจำกัด 1,000 แถวของ Supabase
- **GitHub Policy:** ห้าม Commit ไฟล์ที่มีความลับ (API Keys) แม้ในปัจจุบันจะใช้ Publishable Key ก็ตาม

## 3. Pending Tasks (สิ่งที่ค้างดำเนินการ)
- ตรวจสอบระบบ Overdue (7 วัน) ในหน้า GR ให้คำนวณจากวันที่ปัจจุบันจริงๆ
- ทดสอบความเสถียรของ Real-time อัปเดตในสภาวะที่มีผู้ใช้หลายคนพร้อมกัน

---
*บันทึกนี้จัดทำขึ้นเพื่อรักษาความต่อเนื่องในการพัฒนาในรอบถัดไป*
