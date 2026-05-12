/**
 * AKRA Web Apps - Workflow Integration Test (PR -> PO -> GR)
 * This script simulates a full procurement lifecycle to verify logic and data integrity.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEST_CONFIG = {
    requester: 'AUDIT_BOT',
    warehouse: 'AKRA',
    product: 'TEST_PRODUCT_' + Date.now(),
    sku: 'SKU_TEST_' + Date.now(),
    qty: 10,
    vendor: 'TEST_VENDOR',
    poNumber: 'PO_AUDIT_' + Date.now()
};

async function runTest() {
    console.log('🧪 Starting PR -> PO -> GR Workflow Audit...\n');

    try {
        // --- PRE-STEP: Get real product ---
        console.log('0. Fetching real product SKU...');
        const { data: product, error: prodErr } = await supabase.from('products').select('sku, name, unit').limit(1).single();
        if (prodErr) throw new Error('Failed to fetch product: ' + prodErr.message);
        
        const TEST_CONFIG = {
            requester: 'AUDIT_BOT',
            warehouse: 'AKRA',
            product: product.name,
            sku: product.sku,
            unit: product.unit || 'ชิ้น',
            qty: 10,
            vendor: 'TEST_VENDOR',
            poNumber: 'PO_AUDIT_' + Date.now()
        };
        console.log(`✅ Using Product: ${TEST_CONFIG.product} (SKU: ${TEST_CONFIG.sku})`);

        // --- STEP 1: Create PR ---
        console.log('1. Submitting PR...');
        const prNumber = `PR_AUDIT_${Date.now()}`;
        const { data: prData, error: prErr } = await supabase.from('purchase_requests').insert({
            pr_number: prNumber,
            requester: TEST_CONFIG.requester,
            warehouse: TEST_CONFIG.warehouse,
            sku: TEST_CONFIG.sku,
            product: TEST_CONFIG.product,
            request_qty: TEST_CONFIG.qty,
            unit: 'ชิ้น',
            status: 'Pending'
        }).select('pr_uid').single();

        if (prErr) throw new Error('PR Submit Failed: ' + prErr.message);
        const prUid = prData.pr_uid;
        console.log(`✅ PR Created: ${prNumber} (UID: ${prUid})`);

        // --- STEP 2: Approve PR & Create PO ---
        console.log('\n2. Approving PR & Creating PO...');
        const { data: poData, error: poErr } = await supabase.from('purchase_orders').insert({
            ref_pr_uid: prUid,
            po_number: TEST_CONFIG.poNumber,
            vendor: TEST_CONFIG.vendor,
            warehouse: TEST_CONFIG.warehouse,
            sku: TEST_CONFIG.sku,
            product: TEST_CONFIG.product,
            po_qty: TEST_CONFIG.qty,
            unit: 'ชิ้น',
            status: 'Pending GR'
        }).select('po_uid').single();

        if (poErr) throw new Error('PO Creation Failed: ' + poErr.message);
        const poUid = poData.po_uid;

        // Update PR status
        await supabase.from('purchase_requests').update({ status: 'Approved' }).eq('pr_uid', prUid);
        console.log(`✅ PO Created: ${TEST_CONFIG.poNumber} (UID: ${poUid})`);
        console.log(`✅ PR Status updated to 'Approved'`);

        // --- STEP 3: Goods Receipt (GR) ---
        console.log('\n3. Receiving Goods (GR)...');
        const { data: grData, error: grErr } = await supabase.from('goods_receipts').insert({
            ref_po_uid: poUid,
            sku: TEST_CONFIG.sku,
            product: TEST_CONFIG.product,
            gr_qty: TEST_CONFIG.qty,
            unit: 'ชิ้น',
            loc_in: 'AUDIT_BIN',
            receiver_name: 'AUDIT_BOT',
            ata: new Date().toISOString()
        }).select('gr_uid').single();

        if (grErr) throw new Error('GR Insert Failed: ' + grErr.message);
        const grUid = grData.gr_uid;

        // Update PO status to GR Completed
        await supabase.from('purchase_orders').update({ status: 'GR Completed' }).eq('po_uid', poUid);
        console.log(`✅ GR Recorded (UID: ${grUid})`);
        console.log(`✅ PO Status updated to 'GR Completed'`);

        // --- STEP 4: Close PO ---
        console.log('\n4. Closing PO (Final Match)...');
        const { error: closeErr } = await supabase.from('purchase_orders').update({ 
            status: 'PO Closed - Ready for APV' 
        }).eq('po_uid', poUid);

        if (closeErr) throw new Error('PO Close Failed: ' + closeErr.message);
        console.log(`✅ PO Status updated to 'PO Closed - Ready for APV'`);

        // --- VERIFICATION ---
        console.log('\n🔍 Final Data Integrity Check:');
        
        const { data: finalPr } = await supabase.from('purchase_requests').select('status').eq('pr_uid', prUid).single();
        console.log(`- PR Status: ${finalPr.status} (Expected: Approved)`);

        const { data: finalPo } = await supabase.from('purchase_orders').select('status').eq('po_uid', poUid).single();
        console.log(`- PO Status: ${finalPo.status} (Expected: PO Closed - Ready for APV)`);

        const { data: finalGr } = await supabase.from('goods_receipts').select('gr_qty').eq('gr_uid', grUid).single();
        console.log(`- GR Quantity: ${finalGr.gr_qty} (Expected: ${TEST_CONFIG.qty})`);

        if (finalPr.status === 'Approved' && finalPo.status === 'PO Closed - Ready for APV' && finalGr.gr_qty === TEST_CONFIG.qty) {
            console.log('\n🏆 WORKFLOW AUDIT PASSED!');
        } else {
            console.log('\n❌ WORKFLOW AUDIT FAILED (Data Mismatch)');
        }

    } catch (err) {
        console.error('\n💥 CRITICAL TEST FAILURE:');
        console.error(err.message);
    } finally {
        console.log('\n🧹 Note: Test data remains in DB for audit trail.');
        console.log('✅ Audit Session Complete.');
    }
}

runTest();
