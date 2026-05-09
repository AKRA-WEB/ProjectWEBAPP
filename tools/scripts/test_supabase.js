const SUPABASE_URL = "https://deboelqdfpxayzqnrnjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_CtQvPkC-3oRL7GSqrBFvAg_h4lA_pRq";

async function test() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/purchase_orders?select=*,goods_receipts(gr_qty)&status=eq.GR%20Completed`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    const data = await res.json();
    let emptyCount = 0;
    for(const d of data) {
        if(!d.goods_receipts || d.goods_receipts.length === 0) {
            emptyCount++;
        }
    }
    console.log(`Total GR Completed: ${data.length}, Empty Goods Receipts: ${emptyCount}`);
}
test();