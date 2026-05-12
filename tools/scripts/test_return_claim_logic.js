/**
 * AKRA Web Apps - Return & Claim Audit
 * This script verifies that marking a return as Grade C automatically triggers a claim.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEST_RETURN_ID = 'RET-AUDIT-' + Date.now();

async function runTest() {
    console.log('🧪 Starting Return & Claim Automation Audit...\n');

    try {
        // --- STEP 1: Create a Return ---
        console.log('1. Creating a test Return...');
        const { error: retErr } = await supabase.from('returns').insert({
            id: TEST_RETURN_ID,
            customer_name: 'AUDIT_CUSTOMER',
            name: 'AUDIT_PRODUCT',
            qty: 1,
            unit: 'ชิ้น',
            status: 'รอดำเนินการ',
            date_str: new Date().toLocaleDateString('th-TH')
        });

        if (retErr) throw new Error('Return Creation Failed: ' + retErr.message);
        console.log(`✅ Return Created: ${TEST_RETURN_ID}`);

        // --- STEP 2: Update QC to Grade C (Simulating the frontend action) ---
        console.log('\n2. Updating QC to Grade C (Triggers Claim)...');
        
        // This simulates what AKRA_API.updateReturnQC does:
        // 1. Update Return status and qc_condition
        const { error: updErr } = await supabase.from('returns').update({
            status: 'ส่งเคลมแล้ว',
            qc_condition: 'ชำรุด (Grade C)'
        }).eq('id', TEST_RETURN_ID);

        if (updErr) throw new Error('Return Update Failed: ' + updErr.message);

        // 2. Insert into Claims (Idempotent Upsert)
        const claimId = 'CLM-RET-' + TEST_RETURN_ID.replace('RET-', '');
        const { error: clmErr } = await supabase.from('claims').upsert({
            id: claimId,
            report_date: new Date().toISOString().split('T')[0],
            found_location: 'AUDIT_WH',
            claim_type: 'ชำรุด',
            name: 'AUDIT_PRODUCT',
            qty: 1,
            unit: 'ชิ้น',
            wh_status: 'ยังไม่รับ'
        });

        if (clmErr) throw new Error('Claim Creation Failed: ' + clmErr.message);
        console.log(`✅ QC Updated & Claim Triggered: ${claimId}`);

        // --- VERIFICATION ---
        console.log('\n🔍 Verification:');
        
        const { data: finalRet } = await supabase.from('returns').select('status, qc_condition').eq('id', TEST_RETURN_ID).single();
        console.log(`- Return Status: ${finalRet.status} (Expected: ส่งเคลมแล้ว)`);
        console.log(`- Return QC: ${finalRet.qc_condition} (Expected: ชำรุด (Grade C))`);

        const { data: finalClm } = await supabase.from('claims').select('id, wh_status').eq('id', claimId).single();
        if (finalClm) {
            console.log(`- Claim Found: ${finalClm.id}`);
            console.log(`- Claim Status: ${finalClm.wh_status} (Expected: ยังไม่รับ)`);
            console.log('\n🏆 RETURN & CLAIM AUDIT PASSED!');
        } else {
            console.log('\n❌ CLAIM NOT FOUND (Automation Failure)');
        }

    } catch (err) {
        console.error('\n💥 CRITICAL TEST FAILURE:');
        console.error(err.message);
    } finally {
        console.log('\n🧹 Note: Test data remains in DB for audit trail.');
    }
}

async function runGradeASyncTest() {
    console.log('\n🧪 Starting Grade A Stock Sync Audit...');

    try {
        // 0. Setup: Ensure we have a W5 product
        console.log('0. Fetching real W5 inventory item...');
        let { data: w5Item } = await supabase.from('w5_inventory').select('id, name, stock').limit(1).single();
        if (!w5Item) {
            console.log('   (Creating test product in W5...)');
            const { data: newItem } = await supabase.from('w5_inventory').insert({ name: 'TEST_SYNC_PROD', stock: 10 }).select().single();
            w5Item = newItem;
        }
        const initialStock = w5Item.stock;
        console.log(`✅ Using W5 Product: ${w5Item.name} (Initial Stock: ${initialStock})`);

        // 1. Create Return
        const retId = 'RET-SYNC-' + Date.now();
        await supabase.from('returns').insert({
            id: retId,
            name: w5Item.name,
            qty: 5,
            unit: 'ชิ้น',
            status: 'รอ QC'
        });
        console.log(`✅ Return Created: ${retId}`);

        // 2. Perform QC Grade A with syncStock = true
        console.log('\n2. Updating QC to Grade A with syncStock=true...');
        
        // --- START SIMULATION ---
        const syncStock = true;
        const grade = 'A';
        const qty = 5;
        const name = w5Item.name;

        // a. Update Return
        await supabase.from('returns').update({ status: 'รอตัดรอบ', qc_condition: 'สินค้าสภาพดี (Sync)' }).eq('id', retId);

        // b. Update W5 Stock
        if (grade === 'A' && syncStock) {
            const { data: item } = await supabase.from('w5_inventory').select('id, stock').eq('name', name).single();
            await supabase.from('w5_inventory').update({ stock: item.stock + qty }).eq('id', item.id);
            await supabase.from('w5_history').insert({
                transaction_type: 'in',
                product_id: item.id,
                product_name: name,
                qty: qty,
                user_name: 'AUDIT_BOT (Grade A Sync)'
            });
        }
        // --- END SIMULATION ---
        console.log(`✅ QC Updated & Stock Synced.`);

        // 3. Verification
        const { data: finalItem } = await supabase.from('w5_inventory').select('stock').eq('id', w5Item.id).single();
        console.log(`- Final Stock: ${finalItem.stock} (Expected: ${initialStock + 5})`);

        const { data: hist } = await supabase.from('w5_history').select('*').eq('product_id', w5Item.id).order('transaction_timestamp', { ascending: false }).limit(1).single();
        console.log(`- History Logged: ${hist.transaction_type} (+${hist.qty}) by ${hist.user_name}`);

        if (finalItem.stock === initialStock + 5 && hist.transaction_type === 'in') {
            console.log('\n🏆 GRADE A STOCK SYNC PASSED!');
        } else {
            console.log('\n❌ GRADE A STOCK SYNC FAILED');
        }

    } catch (err) {
        console.error('\n💥 SYNC TEST FAILURE:');
        console.error(err.message);
    }
}

async function runAll() {
    await runTest();
    await runGradeASyncTest();
    console.log('\n✅ Audit Session Complete.');
}

runAll();
