const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";
const { createClient } = require('@supabase/supabase-js');
const akraSupabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
    const payload = {
        items: [{
            product: 'Test Product',
            qty: "0",
            unit: 'ชิ้น',
            remark: 'test'
        }],
        requester: 'Test',
        warehouse: 'W1',
        prNumber: 'PR-TEST'
    };
    
    const records = payload.items.map(item => ({ 
        pr_number: payload.prNumber, 
        requester: payload.requester, 
        warehouse: payload.warehouse, 
        sku: item.sku && item.sku.trim() !== "" ? item.sku : null, 
        product: item.product, 
        request_qty: parseFloat(item.quantity || item.qty) || 0, 
        unit: item.unit || 'ชิ้น', 
        remark: item.remark || ''
    }));
    
    const { error } = await akraSupabase.from('purchase_requests').insert(records);
    console.log("Error:", error);
}
test();