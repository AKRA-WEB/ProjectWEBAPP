const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";
const { createClient } = require('@supabase/supabase-js');
const akraSupabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testJoin() {
    const { data: po } = await akraSupabase.from('purchase_orders').select('po_uid').limit(1).single();
    if (!po) return console.log("No PO found");
    
    console.log("Testing with PO:", po.po_uid);
    
    // Insert dummy GR
    const { error: insertErr } = await akraSupabase.from('goods_receipts').insert({
        ref_po_uid: po.po_uid,
        ata: '2026-05-06',
        receiver_name: 'TEST',
        product: 'TEST PRODUCT',
        gr_qty: 99,
        unit: 'ชิ้น'
    });
    if (insertErr) return console.log("Insert err:", insertErr);
    
    // Fetch
    const { data: fetched } = await akraSupabase.from('purchase_orders').select('*, goods_receipts(*)').eq('po_uid', po.po_uid).single();
    console.log("Fetched PO with GRs:", JSON.stringify(fetched.goods_receipts, null, 2));
    
    // Clean up
    await akraSupabase.from('goods_receipts').delete().eq('receiver_name', 'TEST');
}
testJoin();