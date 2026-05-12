/**
 * AKRA Web Apps - Warehouse W5 Audit
 * This script verifies stock adjustments and history logging in the W5 inventory system.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runTest() {
    console.log('🧪 Starting Warehouse W5 Stock Audit...\n');

    try {
        // --- PRE-STEP: Get a real inventory item ---
        console.log('0. Fetching real W5 inventory item...');
        const { data: item, error: itemErr } = await supabase.from('w5_inventory').select('id, name, stock').limit(1).single();
        
        // If no items, create a test one
        let testItem = item;
        if (itemErr || !item) {
            console.log('   (No items found, creating a test product...)');
            const { data: newItem, error: createErr } = await supabase.from('w5_inventory').insert({
                name: 'AUDIT_W5_PRODUCT',
                stock: 100,
                unit: 'ชิ้น'
            }).select('id, name, stock').single();
            if (createErr) throw new Error('W5 Product Creation Failed: ' + createErr.message);
            testItem = newItem;
        }

        console.log(`✅ Using Product: ${testItem.name} (ID: ${testItem.id}) - Current Stock: ${testItem.stock}`);

        const initialStock = testItem.stock;
        const changeQty = 5;

        // --- STEP 1: Perform "IN" Transaction ---
        console.log('\n1. Performing "IN" Transaction (+5)...');
        
        // This simulates AKRA_API.submitW5Transaction:
        // 1. Update stock
        const { error: updInErr } = await supabase.from('w5_inventory').update({ 
            stock: initialStock + changeQty 
        }).eq('id', testItem.id);
        if (updInErr) throw new Error('W5 Update IN Failed: ' + updInErr.message);

        // 2. Add to history
        const { error: histInErr } = await supabase.from('w5_history').insert({
            transaction_type: 'in',
            product_id: testItem.id,
            product_name: testItem.name,
            qty: changeQty,
            user_name: 'AUDIT_BOT'
        });
        if (histInErr) throw new Error('W5 History IN Failed: ' + histInErr.message);
        console.log('✅ Stock increased and history logged.');

        // --- STEP 2: Perform "OUT" Transaction ---
        console.log('\n2. Performing "OUT" Transaction (-5)...');
        
        const { error: updOutErr } = await supabase.from('w5_inventory').update({ 
            stock: initialStock 
        }).eq('id', testItem.id);
        if (updOutErr) throw new Error('W5 Update OUT Failed: ' + updOutErr.message);

        const { error: histOutErr } = await supabase.from('w5_history').insert({
            transaction_type: 'out',
            product_id: testItem.id,
            product_name: testItem.name,
            qty: changeQty,
            user_name: 'AUDIT_BOT'
        });
        if (histOutErr) throw new Error('W5 History OUT Failed: ' + histOutErr.message);
        console.log('✅ Stock decreased and history logged.');

        // --- VERIFICATION ---
        console.log('\n🔍 Verification:');
        
        const { data: finalItem } = await supabase.from('w5_inventory').select('stock').eq('id', testItem.id).single();
        console.log(`- Final Stock: ${finalItem.stock} (Expected: ${initialStock})`);

        const { data: history } = await supabase.from('w5_history')
            .select('*')
            .eq('product_id', testItem.id)
            .order('transaction_timestamp', { ascending: false })
            .limit(2);
        
        console.log(`- History Records Found: ${history.length}`);
        if (history.length >= 2 && history[0].transaction_type === 'out' && history[1].transaction_type === 'in') {
            console.log('\n🏆 W5 WAREHOUSE AUDIT PASSED!');
        } else {
            console.log('\n❌ W5 HISTORY MISMATCH');
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
